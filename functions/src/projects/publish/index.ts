import { onRequest } from "firebase-functions/v2/https";
import { logger } from "firebase-functions/v2";
import { FieldValue } from "firebase-admin/firestore";
import { getAuth } from "firebase-admin/auth";
import { db } from "../../lib/firebaseAdmin";
import { migrateProjectMedia, deletePrivateProjectMedia } from "./migrate";
import { applyPublish, PublishValidationError } from "./publish";
import { processTransaction, TransactionEngineError } from "../../transactions/engine";
import { getPublishConfig } from "./config";
import type { ProjectMode } from "../projectInterface";
import type { PublishInput, PublishOutput } from "./types";

// ─── Error codes ──────────────────────────────────────────────────────────────

const ERROR = {
	METHOD_NOT_ALLOWED:       "METHOD_NOT_ALLOWED",
	UNAUTHORIZED:             "UNAUTHORIZED",
	INVALID_OR_EXPIRED_TOKEN: "INVALID_OR_EXPIRED_TOKEN",
	INVALID_PAYLOAD:          "INVALID_PAYLOAD",
	NOT_FOUND:                "NOT_FOUND",
	FORBIDDEN:                "FORBIDDEN",
	ALREADY_PUBLISHED:        "ALREADY_PUBLISHED",
	NOT_ACTIVE:               "NOT_ACTIVE",
	INVALID_SLUG:             "INVALID_SLUG",
	SLUG_TAKEN:               "SLUG_TAKEN",
	INSUFFICIENT_FUNDS:       "INSUFFICIENT_FUNDS",
	INTERNAL_SERVER_ERROR:    "INTERNAL_SERVER_ERROR",
} as const;

// ─── Payload validation ───────────────────────────────────────────────────────

class ValidationError extends Error {}

function validatePayload(body: unknown): PublishInput {
	const b = body as Record<string, unknown> | null | undefined;

	if (!b || typeof b !== "object") throw new ValidationError("Request body must be a JSON object.");

	const { projectId, slug, accessToken } = b;

	if (typeof projectId !== "string" || !projectId.trim())
		throw new ValidationError("'projectId' must be a non-empty string.");

	if (typeof slug !== "string" || !slug.trim())
		throw new ValidationError("'slug' must be a non-empty string.");

	if (accessToken !== undefined && typeof accessToken !== "string")
		throw new ValidationError("'accessToken' must be a string when provided.");

	return {
		projectId: projectId.trim(),
		slug: slug.trim(),
		accessToken: typeof accessToken === "string" ? accessToken : undefined,
	};
}

// ─── Cloud Function ───────────────────────────────────────────────────────────

/**
 * Publishes a project:
 *   1. Validates auth + payload
 *   2. Checks project status (must be active) and ownership
 *   3. Checks user has enough credits
 *   4. Migrates all media from private (users/) to public storage
 *   5. writes/updates published_projects with migrated content
 *   6. Archives the project, frees the active slot
 *   7. Deletes private originals (freeing storage quota)
 *   8. Debits credits via the transaction engine
 *
 * POST /publishProject
 * Body: { projectId, slug, accessToken? }
 * Auth: Bearer <idToken>
 */
export const publishProject = onRequest(
	{
		concurrency: 10,
		timeoutSeconds: 300,
		memory: "1GiB",
		maxInstances: 20,
		cors: [/localhost/, /milestis\.com$/, /milestis\.app$/, /milestis\.site$/, /\.hosted\.app$/],
	},
	async (req, res) => {
		// ── Method guard ──────────────────────────────────────────────────
		if (req.method !== "POST") {
			res.status(405).json({ error: ERROR.METHOD_NOT_ALLOWED });
			return;
		}

		// ── Auth ──────────────────────────────────────────────────────────
		const authHeader = req.headers.authorization;
		if (!authHeader?.startsWith("Bearer ")) {
			res.status(401).json({ error: ERROR.UNAUTHORIZED });
			return;
		}

		let uid: string;
		try {
			const decoded = await getAuth().verifyIdToken(authHeader.split("Bearer ")[1]);
			uid = decoded.uid;
		} catch {
			res.status(401).json({ error: ERROR.INVALID_OR_EXPIRED_TOKEN });
			return;
		}

		// ── Payload ───────────────────────────────────────────────────────
		let payload: PublishInput;
		try {
			payload = validatePayload(req.body);
		} catch (err) {
			const message = err instanceof ValidationError ? err.message : "Invalid payload.";
			res.status(400).json({ error: ERROR.INVALID_PAYLOAD, message });
			return;
		}

		const { projectId, slug, accessToken } = payload;

		// ── Load project ──────────────────────────────────────────────────
		const projectRef = db.collection("projects").doc(projectId);
		const projectSnap = await projectRef.get();

		if (!projectSnap.exists) {
			res.status(404).json({ error: ERROR.NOT_FOUND });
			return;
		}

		const projectData = projectSnap.data()!;

		if (projectData.ownerId !== uid) {
			res.status(403).json({ error: ERROR.FORBIDDEN });
			return;
		}

		// ── Status guards ─────────────────────────────────────────────────
		if (projectData.status !== "active") {
			res.status(400).json({
				error: ERROR.NOT_ACTIVE,
				message: "Only active projects can be published.",
			});
			return;
		}

		if (projectData.isPublished === true) {
			res.status(409).json({
				error: ERROR.ALREADY_PUBLISHED,
				message: "Project is already published. Unpublish first to change the slug.",
			});
			return;
		}

		const mode = projectData.mode as ProjectMode;
		const config = getPublishConfig(mode);

		// ── Access token guard ────────────────────────────────────────────
		if (config.requiresAccessToken && !accessToken) {
			res.status(400).json({
				error: ERROR.INVALID_PAYLOAD,
				message: "accessToken is required for photobook projects.",
			});
			return;
		}

		// ── Balance check ─────────────────────────────────────────────────
		const userRef = db.collection("users").doc(uid);
		const userSnap = await userRef.get();
		const userData = userSnap.data() ?? {};
		const currentBalance = userData.balance?.total ?? 0;

		if (currentBalance < config.creditCost) {
			res.status(402).json({
				error: ERROR.INSUFFICIENT_FUNDS,
				message: `Publishing costs ${config.creditCost} credits. Your balance: ${currentBalance}.`,
			});
			return;
		}

		// ── Load editor content ───────────────────────────────────────────
		const contentSnap = await db
			.collection("projects")
			.doc(projectId)
			.collection("data")
			.doc("content")
			.get();

		const editorData = contentSnap.exists ? contentSnap.data()! : {};
		const rawTheme = editorData.theme ?? null;
		const rawContent = editorData.content ?? null;

		// Serialize to JSON for URL extraction / rewriting in migrate step.
		const contentJson = JSON.stringify({ theme: rawTheme, content: rawContent });

		// ── Media migration ───────────────────────────────────────────────
		let freedBytes: number;
		let urlMapping: Map<string, string>;

		try {
			({ urlMapping, freedBytes } = await migrateProjectMedia(uid, projectId, contentJson));
		} catch (err) {
			logger.error(`[publishProject] Media migration failed for ${projectId}:`, err);
			res.status(500).json({ error: ERROR.INTERNAL_SERVER_ERROR });
			return;
		}

		// Rewrite all private URLs in content to their new public equivalents.
		const migratedJson = contentJson.replace(
			/"(https:\/\/firebasestorage\.googleapis\.com\/v0\/b\/[^"\\]+)"/g,
			(_match, url: string) => {
				const mapped = urlMapping.get(url);
				return mapped ? `"${mapped}"` : `"${url}"`;
			},
		);
		const migratedData = JSON.parse(migratedJson) as {
			theme: Record<string, unknown> | null;
			content: Record<string, unknown> | null;
		};

		const contentSnapshot = {
			theme: migratedData.theme,
			content: migratedData.content,
		};

		// ── Publish (update published_projects + projects isPublished/slug) ──
		try {
			await applyPublish(db, projectId, uid, mode, { slug, accessToken }, contentSnapshot, projectData.name);
		} catch (err) {
			if (err instanceof PublishValidationError) {
				const errorCode =
					err.code === "SLUG_TAKEN"     ? ERROR.SLUG_TAKEN :
					err.code === "INVALID_SLUG"   ? ERROR.INVALID_SLUG :
					ERROR.INVALID_PAYLOAD;
				res.status(409).json({ error: errorCode, message: err.message });
				return;
			}
			logger.error(`[publishProject] applyPublish failed for ${projectId}:`, err);
			res.status(500).json({ error: ERROR.INTERNAL_SERVER_ERROR });
			return;
		}

		// ── Delete private media (storage quota freed) ────────────────────
		await deletePrivateProjectMedia(uid, projectId);

		// ── Archive project + update user stats ───────────────────────────
		const previewHeroUrl: string | undefined = projectData.preview?.heroImageUrl;
		const newPreviewUrl = previewHeroUrl ? (urlMapping.get(previewHeroUrl) ?? previewHeroUrl) : undefined;

		const projectUpdate: Record<string, unknown> = {
			status: "archived",
			publishedAt: FieldValue.serverTimestamp(),
			updatedAt: FieldValue.serverTimestamp(),
		};
		if (newPreviewUrl && newPreviewUrl !== previewHeroUrl) {
			projectUpdate["preview.heroImageUrl"] = newPreviewUrl;
		}

		const userStatUpdates: Record<string, unknown> = {
			"stats.projectsInProgress": FieldValue.increment(-1),
			"stats.projectsPublished": FieldValue.increment(1),
		};
		if (freedBytes > 0) {
			userStatUpdates["stats.storageUsedBytes"] = FieldValue.increment(-freedBytes);
		}

		const archiveBatch = db.batch();
		archiveBatch.update(projectRef, projectUpdate);
		archiveBatch.update(userRef, userStatUpdates);

		// ── Write export record (feeds the archive page) ──────────────────
		const exportsRef = projectRef.collection("exports").doc();
		const exportRecord: Record<string, unknown> = {
			exportId: exportsRef.id,
			projectId,
			projectName: projectData.name,
			ownerId: uid,
			versionNumber: 1,
			mode,
			creditCost: config.creditCost,
			publishedSlug: slug,
			createdAt: FieldValue.serverTimestamp(),
		};
		archiveBatch.set(exportsRef, exportRecord);

		await archiveBatch.commit();

		// ── Debit credits ─────────────────────────────────────────────────
		let balanceSnapshot: PublishOutput["balance"];
		try {
			const result = await processTransaction({
				uid,
				idempotencyKey: `publish:${projectId}`,
				category: "credit",
				direction: "out",
				credit: {
					type: "spend",
					amount: config.creditCost,
					meta: { projectId, mode, slug },
				},
			});
			balanceSnapshot = result.balanceSnapshot;
		} catch (err) {
			if (err instanceof TransactionEngineError && err.code === "idempotency_conflict") {
				// Already debited — idempotent replay, safe to continue.
				logger.warn(`[publishProject] Idempotent credit debit for ${projectId}.`);
				balanceSnapshot = userData.balance ?? { total: 0, purchased: 0, subscription: 0, bonus: 0 };
			} else {
				// Real failure (index missing, Firestore error, etc.) — project is already
				// published at this point, so log and return success with stale balance
				// rather than leaving the user confused.
				logger.error(`[publishProject] Credit debit failed for ${projectId} (project is already live):`, err);
				balanceSnapshot = userData.balance ?? { total: 0, purchased: 0, subscription: 0, bonus: 0 };
			}
		}

		logger.info(`[publishProject] Project ${projectId} published by ${uid} with slug "${slug}".`, {
			mode,
			creditCost: config.creditCost,
			freedBytes,
		});

		res.status(200).json({ ok: true, publishedSlug: slug, balance: balanceSnapshot } satisfies PublishOutput);
	},
);
