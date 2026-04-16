import { onRequest } from "firebase-functions/v2/https";
import { logger } from "firebase-functions/v2";
import { FieldValue } from "firebase-admin/firestore";
import { getAuth } from "firebase-admin/auth";
import { db } from "../../lib/firebaseAdmin";
import { migrateProjectMedia, deletePrivateProjectMedia } from "./migrate";
import { applyPublish, preparePublishInput, PublishValidationError } from "./publish";
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
	PUBLISH_IN_PROGRESS:      "PUBLISH_IN_PROGRESS",
	PUBLISH_FAILED:           "PUBLISH_FAILED",
	INTERNAL_SERVER_ERROR:    "INTERNAL_SERVER_ERROR",
} as const;

const PUBLISH_JOB_LEASE_MS = 15 * 60 * 1000;
const EMPTY_BALANCE = { total: 0, purchased: 0, subscription: 0, bonus: 0 };

class PublishFlowError extends Error {
	constructor(
		public readonly code: typeof ERROR[keyof typeof ERROR],
		public readonly status: number,
		message: string,
	) {
		super(message);
	}
}

async function claimPublishJob(projectId: string, uid: string) {
	const projectRef = db.collection("projects").doc(projectId);
	return db.runTransaction(async (tx) => {
		const projectSnap = await tx.get(projectRef);
		if (!projectSnap.exists) {
			throw new PublishFlowError(ERROR.NOT_FOUND, 404, "Project not found.");
		}

		const projectData = projectSnap.data()!;
		if (projectData.ownerId !== uid) {
			throw new PublishFlowError(ERROR.FORBIDDEN, 403, "You do not own this project.");
		}
		if (projectData.status !== "active") {
			throw new PublishFlowError(ERROR.NOT_ACTIVE, 400, "Only active projects can be published.");
		}
		if (projectData.isPublished === true) {
			throw new PublishFlowError(ERROR.ALREADY_PUBLISHED, 409, "Project is already published. Unpublish first to change the slug.");
		}

		const currentLease =
			typeof projectData.publishJobLeaseExpiresAtMillis === "number"
				? projectData.publishJobLeaseExpiresAtMillis
				: 0;
		if (projectData.publishJobState === "processing" && currentLease > Date.now()) {
			throw new PublishFlowError(
				ERROR.PUBLISH_IN_PROGRESS,
				409,
				"A publish is already in progress for this project. Please wait a moment and try again.",
			);
		}

		tx.update(projectRef, {
			publishJobState: "processing",
			publishJobLeaseExpiresAtMillis: Date.now() + PUBLISH_JOB_LEASE_MS,
			publishLastErrorCode: FieldValue.delete(),
			publishLastErrorMessage: FieldValue.delete(),
			updatedAt: FieldValue.serverTimestamp(),
		});

		return projectData;
	});
}

async function markPublishJobFailed(
	projectId: string,
	errorCode: string,
	message: string,
) {
	await db.collection("projects").doc(projectId).update({
		publishJobState: "failed",
		publishJobLeaseExpiresAtMillis: FieldValue.delete(),
		publishLastErrorCode: errorCode,
		publishLastErrorMessage: message,
		updatedAt: FieldValue.serverTimestamp(),
	});
}

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

		const initialProjectData = projectSnap.data()!;

		if (initialProjectData.ownerId !== uid) {
			res.status(403).json({ error: ERROR.FORBIDDEN });
			return;
		}

		if (initialProjectData.status !== "active") {
			res.status(400).json({
				error: ERROR.NOT_ACTIVE,
				message: "Only active projects can be published.",
			});
			return;
		}

		if (initialProjectData.isPublished === true) {
			res.status(409).json({
				error: ERROR.ALREADY_PUBLISHED,
				message: "Project is already published. Unpublish first to change the slug.",
			});
			return;
		}

		const mode = initialProjectData.mode as ProjectMode;
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

		let preparedInput;
		try {
			preparedInput = await preparePublishInput(db, projectId, mode, { slug, accessToken });
		} catch (err) {
			if (err instanceof PublishValidationError) {
				const errorCode =
					err.code === "SLUG_TAKEN" ? ERROR.SLUG_TAKEN :
					err.code === "INVALID_SLUG" ? ERROR.INVALID_SLUG :
					ERROR.INVALID_PAYLOAD;
				res.status(409).json({ error: errorCode, message: err.message });
				return;
			}
			logger.error(`[publishProject] preparePublishInput failed for ${projectId}:`, err);
			res.status(500).json({ error: ERROR.INTERNAL_SERVER_ERROR });
			return;
		}

		let projectData: FirebaseFirestore.DocumentData;
		try {
			projectData = await claimPublishJob(projectId, uid);
		} catch (err) {
			if (err instanceof PublishFlowError) {
				res.status(err.status).json({ error: err.code, message: err.message });
				return;
			}
			logger.error(`[publishProject] Failed to claim publish job for ${projectId}:`, err);
			res.status(500).json({ error: ERROR.INTERNAL_SERVER_ERROR });
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
			await markPublishJobFailed(projectId, ERROR.PUBLISH_FAILED, "Failed to migrate project media.");
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

		// ── Debit credits before the project goes live ──────────────────────
		let balanceSnapshot: PublishOutput["balance"];
		let transactionId: string;
		try {
			const result = await processTransaction({
				uid,
				idempotencyKey: `publish:${projectId}`,
				category: "credit",
				direction: "out",
				credit: {
					type: "spend",
					amount: config.creditCost,
					meta: { projectId, mode, slug: preparedInput.slug },
				},
			});
			balanceSnapshot = result.balanceSnapshot;
			transactionId = result.tid;
		} catch (err) {
			const message =
				err instanceof TransactionEngineError && err.code === "insufficient_funds"
					? `Publishing costs ${config.creditCost} credits. Your balance is no longer sufficient.`
					: "Credit debit failed before the project could be published.";
			await markPublishJobFailed(
				projectId,
				err instanceof TransactionEngineError ? err.code : ERROR.PUBLISH_FAILED,
				message,
			);
			logger.error(`[publishProject] Credit debit failed for ${projectId}:`, err);
			res.status(err instanceof TransactionEngineError && err.code === "insufficient_funds" ? 402 : 500).json({
				error: err instanceof TransactionEngineError && err.code === "insufficient_funds"
					? ERROR.INSUFFICIENT_FUNDS
					: ERROR.INTERNAL_SERVER_ERROR,
				message,
			});
			return;
		}

		// ── Publish (update published_projects + projects isPublished/slug) ──
		try {
			await applyPublish(db, projectId, uid, mode, preparedInput, contentSnapshot, projectData.name);
		} catch (err) {
			const errorCode =
				err instanceof PublishValidationError
					? err.code === "SLUG_TAKEN"
						? ERROR.SLUG_TAKEN
						: err.code === "INVALID_SLUG"
							? ERROR.INVALID_SLUG
							: ERROR.INVALID_PAYLOAD
					: ERROR.PUBLISH_FAILED;
			const message =
				err instanceof PublishValidationError
					? `${err.message} Credits were already reserved for this project. Retry publish to resume the same attempt.`
					: "Project debit succeeded, but final publish activation failed. Retry publish to resume safely without a second charge.";
			await markPublishJobFailed(projectId, errorCode, message);
			logger.error(`[publishProject] applyPublish failed for ${projectId}:`, err);
			res.status(err instanceof PublishValidationError ? 409 : 500).json({ error: errorCode, message });
			return;
		}

		// ── Archive project + update user stats ───────────────────────────
		const previewHeroUrl: string | undefined = projectData.preview?.heroImageUrl;
		const newPreviewUrl = previewHeroUrl ? (urlMapping.get(previewHeroUrl) ?? previewHeroUrl) : undefined;

		const projectUpdate: Record<string, unknown> = {
			status: "archived",
			publishedAt: FieldValue.serverTimestamp(),
			publishJobState: FieldValue.delete(),
			publishJobLeaseExpiresAtMillis: FieldValue.delete(),
			publishLastErrorCode: FieldValue.delete(),
			publishLastErrorMessage: FieldValue.delete(),
			publishTransactionId: transactionId,
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
		try {
			await archiveBatch.commit();
		} catch (err) {
			await markPublishJobFailed(
				projectId,
				ERROR.PUBLISH_FAILED,
				"The project was charged, but final archive state could not be committed. Retry publish to resume safely without a second charge.",
			);
			logger.error(`[publishProject] Archive commit failed for ${projectId}:`, err);
			res.status(500).json({
				error: ERROR.INTERNAL_SERVER_ERROR,
				message: "The project charge succeeded, but final publish state could not be committed. Retry publish to resume the same attempt.",
			});
			return;
		}

		// ── Delete private media after durable success ────────────────────
		await deletePrivateProjectMedia(uid, projectId);

		logger.info(`[publishProject] Project ${projectId} published by ${uid} with slug "${preparedInput.slug}".`, {
			mode,
			creditCost: config.creditCost,
			freedBytes,
			transactionId,
		});

		res.status(200).json({
			ok: true,
			publishedSlug: preparedInput.slug,
			balance: balanceSnapshot ?? userData.balance ?? EMPTY_BALANCE,
			transactionId,
		} satisfies PublishOutput);
	},
);
