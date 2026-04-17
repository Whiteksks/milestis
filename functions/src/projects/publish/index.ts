import { onRequest } from "firebase-functions/v2/https";
import { logger } from "firebase-functions/v2";
import { FieldValue } from "firebase-admin/firestore";
import { getAuth } from "firebase-admin/auth";
import { db } from "../../lib/firebaseAdmin";
import { migrateProjectMedia, deletePrivateProjectMedia } from "./migrate";
import { commitPublish, logPublishedProject, preparePublishInput, PublishValidationError } from "./publish";
import { TransactionEngineError } from "../../transactions/engine";
import { getPublishConfig } from "./config";
import { VALID_MODES, type ProjectMode } from "../projectInterface";
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
	NOT_PUBLISHABLE:          "NOT_PUBLISHABLE",
	INVALID_SLUG:             "INVALID_SLUG",
	SLUG_TAKEN:               "SLUG_TAKEN",
	INSUFFICIENT_FUNDS:       "INSUFFICIENT_FUNDS",
	PUBLISH_IN_PROGRESS:      "PUBLISH_IN_PROGRESS",
	INTERNAL_SERVER_ERROR:    "INTERNAL_SERVER_ERROR",
} as const;

const PUBLISH_JOB_LEASE_MS = 15 * 60 * 1000;
const BODY_SIZE_LIMIT_BYTES = 4096;

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
			typeof projectData.publishLockExpiresAtMillis === "number"
				? projectData.publishLockExpiresAtMillis
				: 0;
		if (currentLease > Date.now()) {
			throw new PublishFlowError(
				ERROR.PUBLISH_IN_PROGRESS,
				409,
				"A publish is already in progress for this project. Please wait a moment and try again.",
			);
		}

		tx.update(projectRef, {
			publishLockExpiresAtMillis: Date.now() + PUBLISH_JOB_LEASE_MS,
			updatedAt: FieldValue.serverTimestamp(),
		});

		return projectData;
	});
}

async function releasePublishLock(projectId: string) {
	await db.collection("projects").doc(projectId).update({
		publishLockExpiresAtMillis: FieldValue.delete(),
		updatedAt: FieldValue.serverTimestamp(),
	});
}

// ─── Payload validation ───────────────────────────────────────────────────────

class ValidationError extends Error {}

function getHttpStatusForValidationError(code: PublishValidationError["code"]): number {
	switch (code) {
		case "SLUG_TAKEN":
			return 409;
		case "FORBIDDEN":
			return 403;
		case "NOT_PUBLISHABLE":
			return 409;
		default:
			return 400;
	}
}

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

		// ── Body size guard ──────────────────────────────────────────────
		const contentLength = parseInt(req.headers["content-length"] ?? "0", 10);
		if (contentLength > BODY_SIZE_LIMIT_BYTES) {
			res.status(413).json({ error: ERROR.INVALID_PAYLOAD, message: "Request body too large." });
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

		let preparedInput: ReturnType<typeof preparePublishInput>;
		try {
			preparedInput = preparePublishInput({ slug, accessToken });
		} catch (err) {
			if (err instanceof PublishValidationError) {
				const errorCode =
					err.code === "SLUG_TAKEN" ? ERROR.SLUG_TAKEN :
					err.code === "INVALID_SLUG" ? ERROR.INVALID_SLUG :
					ERROR.INVALID_PAYLOAD;
				res.status(getHttpStatusForValidationError(err.code)).json({ error: errorCode, message: err.message });
				return;
			}
			logger.error(`[publishProject] preparePublishInput failed for ${projectId}:`, err);
			res.status(500).json({ error: ERROR.INTERNAL_SERVER_ERROR });
			return;
		}

		let projectData: FirebaseFirestore.DocumentData;
		let publishCommitted = false;
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

		const rawMode = projectData.mode;
		if (!VALID_MODES.includes(rawMode as ProjectMode)) {
			logger.error(`[publishProject] Invalid project mode "${rawMode}" for ${projectId}`);
			res.status(500).json({ error: ERROR.INTERNAL_SERVER_ERROR });
			return;
		}
		const mode = rawMode as ProjectMode;
		const config = getPublishConfig(mode);

		try {
			const userSnap = await db.collection("users").doc(uid).get();
			const userData = userSnap.data() ?? {};
			const currentBalance = userData.balance?.total ?? 0;
			if (currentBalance < config.creditCost) {
				res.status(402).json({
					error: ERROR.INSUFFICIENT_FUNDS,
					message: `Publishing costs ${config.creditCost} credits. Your balance: ${currentBalance}.`,
				});
				return;
			}

			// ── Mode-specific validation (before expensive migration) ─────────
			if (mode === "photobook" && !preparedInput.accessToken) {
				res.status(400).json({
					error: ERROR.INVALID_PAYLOAD,
					message: "accessToken is required for photobook projects.",
				});
				return;
			}

			const contentSnap = await db
				.collection("projects")
				.doc(projectId)
				.collection("data")
				.doc("content")
				.get();

			const editorData = contentSnap.exists ? contentSnap.data()! : {};
			const rawTheme = editorData.theme ?? null;
			const rawContent = editorData.content ?? null;
			const contentJson = JSON.stringify({ theme: rawTheme, content: rawContent });

			const { urlMapping, freedBytes } = await migrateProjectMedia(uid, projectId, contentJson);

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

			const result = await commitPublish(db, {
				projectId,
				uid,
				mode,
				projectName: projectData.name,
				prepared: preparedInput,
				contentSnapshot: {
					theme: migratedData.theme,
					content: migratedData.content,
				},
				creditCost: config.creditCost,
				freedBytes,
				previewHeroUrl: projectData.preview?.heroImageUrl
					? (urlMapping.get(projectData.preview.heroImageUrl) ?? projectData.preview.heroImageUrl)
					: undefined,
			});
			publishCommitted = true;

			try {
				await deletePrivateProjectMedia(uid, projectId);
			} catch (err) {
				logger.warn(`[publishProject] Private media cleanup failed for ${projectId}:`, err);
			}

			logPublishedProject(projectId, result.publishedSlug);
			logger.info(`[publishProject] Project ${projectId} published by ${uid} with slug "${result.publishedSlug}".`, {
				mode,
				creditCost: config.creditCost,
				freedBytes,
				transactionId: result.transactionId,
			});

			res.status(200).json({
				ok: true,
				publishedSlug: result.publishedSlug,
				balance: result.balanceSnapshot,
			} satisfies PublishOutput);
		} catch (err) {
			logger.error(`[publishProject] Publish failed for ${projectId}:`, err);
			if (err instanceof TransactionEngineError && err.code === "insufficient_funds") {
				res.status(402).json({
					error: ERROR.INSUFFICIENT_FUNDS,
					message: `Publishing costs ${config.creditCost} credits. Your balance is no longer sufficient.`,
				});
				return;
			}
			if (err instanceof PublishValidationError) {
				const errorCode =
					err.code === "SLUG_TAKEN" ? ERROR.SLUG_TAKEN :
					err.code === "INVALID_SLUG" ? ERROR.INVALID_SLUG :
					err.code === "FORBIDDEN" ? ERROR.FORBIDDEN :
					err.code === "NOT_PUBLISHABLE" ? ERROR.NOT_PUBLISHABLE :
					err.code === "MISSING_ACCESS_TOKEN" ? ERROR.INVALID_PAYLOAD :
					ERROR.INVALID_PAYLOAD;
				res.status(getHttpStatusForValidationError(err.code)).json({ error: errorCode, message: err.message });
				return;
			}
			res.status(500).json({ error: ERROR.INTERNAL_SERVER_ERROR });
			return;
		} finally {
			if (!publishCommitted) {
				try {
					await releasePublishLock(projectId);
				} catch (lockErr) {
					logger.warn(`[publishProject] Failed to release publish lock for ${projectId}:`, lockErr);
				}
			}
		}
	},
);
