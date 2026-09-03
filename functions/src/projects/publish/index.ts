import { onRequest } from "firebase-functions/v2/https";
import { logger } from "firebase-functions/v2";
import { randomUUID } from "crypto";
import { FieldValue } from "firebase-admin/firestore";
import { getAuth } from "firebase-admin/auth";
import { db } from "../../lib/firebaseAdmin";
import { migrateProjectMedia, deletePrivateProjectMedia } from "./migrate";
import { commitPublish, logPublishedProject, preparePublishInput, PublishValidationError } from "./publish";
import { TransactionEngineError } from "../../transactions/engine";
import { VALID_MODES, type ProjectMode } from "../projectInterface";
import type { PublishInput, PublishOutput } from "./types";
import { ALLOWED_ORIGINS } from "../../lib/cors";
import { recordIubendaConsent } from "../../lib/iubendaConsent";
import { generateAndStoreOgImageBounded } from "../ogImage";

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
	QUOTE_INVALID:            "QUOTE_INVALID",
	QUOTE_EXPIRED:            "QUOTE_EXPIRED",
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
	const attemptId = randomUUID();
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
			publishLockId: attemptId,
			publishLockExpiresAtMillis: Date.now() + PUBLISH_JOB_LEASE_MS,
			updatedAt: FieldValue.serverTimestamp(),
		});

		return { projectData, attemptId };
	});
}

async function releasePublishLock(projectId: string, attemptId: string) {
	const projectRef = db.collection("projects").doc(projectId);
	await db.runTransaction(async (tx) => {
		const projectSnap = await tx.get(projectRef);
		if (!projectSnap.exists) {
			return;
		}

		const projectData = projectSnap.data() ?? {};
		if (projectData.publishLockId !== attemptId) {
			return;
		}

		tx.update(projectRef, {
			publishLockId: FieldValue.delete(),
			publishLockExpiresAtMillis: FieldValue.delete(),
			updatedAt: FieldValue.serverTimestamp(),
		});
	});
}

// ─── Quote validation ─────────────────────────────────────────────────────────

interface QuoteData {
	projectId: string;
	uid: string;
	slug: string;
	creditCost: number;
	photoCount: number;
	expiresAt: FirebaseFirestore.Timestamp;
}

class QuoteError extends Error {
	constructor(
		public readonly code: "QUOTE_INVALID" | "QUOTE_EXPIRED",
		message: string,
	) {
		super(message);
	}
}

/**
 * Validates that the quote exists, belongs to this uid+projectId+slug, and
 * has not expired. Returns the quote data so the caller can use creditCost.
 *
 * The quote document is deleted AFTER a successful publish commit — not here —
 * to avoid leaving the project in an unpublishable state if the commit fails.
 */
async function validateQuote(quoteId: string, uid: string, projectId: string, slug: string): Promise<QuoteData> {
	const quoteRef = db.collection("publish_quotes").doc(quoteId);
	const quoteSnap = await quoteRef.get();

	if (!quoteSnap.exists) {
		throw new QuoteError("QUOTE_INVALID", "Publish quote not found. Please go back and start again.");
	}

	const data = quoteSnap.data() as QuoteData;

	if (data.uid !== uid || data.projectId !== projectId) {
		throw new QuoteError("QUOTE_INVALID", "Publish quote does not match this project or user.");
	}

	if (data.slug !== slug) {
		throw new QuoteError("QUOTE_INVALID", "Publish quote was issued for a different slug. Please go back and start again.");
	}

	const expiresAtMs = data.expiresAt.toMillis();
	if (Date.now() > expiresAtMs) {
		throw new QuoteError("QUOTE_EXPIRED", "Publish quote has expired. Please go back and start again.");
	}

	return data;
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

	const { projectId, slug, accessToken, quoteId } = b;

	if (typeof projectId !== "string" || !projectId.trim())
		throw new ValidationError("'projectId' must be a non-empty string.");

	if (typeof slug !== "string" || !slug.trim())
		throw new ValidationError("'slug' must be a non-empty string.");

	if (accessToken !== undefined && typeof accessToken !== "string")
		throw new ValidationError("'accessToken' must be a string when provided.");

	if (typeof quoteId !== "string" || !quoteId.trim())
		throw new ValidationError("'quoteId' must be a non-empty string. Call analyzeProject first.");

	return {
		projectId: projectId.trim(),
		slug: slug.trim(),
		accessToken: typeof accessToken === "string" ? accessToken : undefined,
		quoteId: quoteId.trim(),
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
		cors: ALLOWED_ORIGINS,
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
		let userEmail: string | null;
		try {
			const decoded = await getAuth().verifyIdToken(authHeader.split("Bearer ")[1]);
			uid = decoded.uid;
			userEmail = decoded.email ?? null;
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
		let publishAttemptId: string | undefined;
		let publishCommitted = false;
		try {
			const claim = await claimPublishJob(projectId, uid);
			projectData = claim.projectData;
			publishAttemptId = claim.attemptId;
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
		// creditCost comes from the validated quote — no need to read config here.

		try {
			// ── Validate quote (must happen before expensive migration) ─────────
			let quoteData: Awaited<ReturnType<typeof validateQuote>>;
			try {
				quoteData = await validateQuote(payload.quoteId, uid, projectId, payload.slug);
			} catch (err) {
				if (err instanceof QuoteError) {
					res.status(err.code === "QUOTE_EXPIRED" ? 410 : 400).json({
						error: ERROR[err.code],
						message: err.message,
					});
					return;
				}
				throw err;
			}

			// Use creditCost from the quote (authoritative — set by analyzeProject).
			// The transaction engine performs the definitive balance check atomically.
			const quotedCreditCost = quoteData.creditCost;

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

			const { urlMapping, freedBytes, usedImageIds } = await migrateProjectMedia(uid, projectId, contentJson);

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
				creditCost: quotedCreditCost,
				photoCount: quoteData.photoCount ?? 0,
				freedBytes,
				previewHeroUrl: projectData.preview?.heroImageUrl
					? (urlMapping.get(projectData.preview.heroImageUrl) ?? projectData.preview.heroImageUrl)
					: undefined,
			});
			publishCommitted = true;

			// Quote is single-use — delete it after a successful commit.
			try {
				await db.collection("publish_quotes").doc(payload.quoteId).delete();
			} catch (err) {
				logger.warn(`[publishProject] Failed to delete quote ${payload.quoteId}:`, err);
			}

			// ── Fix #1: rewrite projects/{id}/data/content with public URLs ────
			// The Firestore content doc still holds private users/ URLs.
			// After deletePrivateProjectMedia those links go dead, so overwrite
			// the doc with the already-migrated content before deleting originals.
			try {
				const contentRef = db
					.collection("projects")
					.doc(projectId)
					.collection("data")
					.doc("content");
				await contentRef.set({
					theme: migratedData.theme,
					content: migratedData.content,
				});
			} catch (err) {
				logger.warn(`[publishProject] Failed to rewrite content doc with public URLs for ${projectId}:`, err);
			}

			// ── Fix #2: rewrite images/{imageId}.urls with public URLs ──────────
			// The images/ collection is the editor's media library source of truth.
			// Without this, reopening the editor after unpublish shows broken images.
			// Also deletes docs for images that were NOT placed in the content
			// (unused uploads) — their private Storage files are about to be deleted.
			//
			// The keep/delete decision uses `usedImageIds` from migrateProjectMedia,
			// which is derived by checking each doc's own known `urls` values against
			// the content JSON directly — NOT by re-deriving "was anything migrated"
			// from urlMapping. This avoids false-negative deletions if a variant's URL
			// mapping ever fails to line up exactly (encoding, token, timing, etc.).
			try {
				const imagesSnap = await db
					.collection("images")
					.where("projectId", "==", projectId)
					.get();
				if (!imagesSnap.empty) {
					const imagesBatch = db.batch();
					let patchCount = 0;
					let deleteCount = 0;
					for (const imageDoc of imagesSnap.docs) {
						const data = imageDoc.data() as { urls?: Record<string, string> };
						if (!data.urls || !usedImageIds.has(imageDoc.id)) {
							// Not referenced in the editor content — unused upload, or never
							// processed. Delete the doc; its Storage files are removed below.
							imagesBatch.delete(imageDoc.ref);
							deleteCount++;
							continue;
						}
						const newUrls: Record<string, string> = {};
						for (const [variant, url] of Object.entries(data.urls)) {
							newUrls[variant] = urlMapping.get(url) ?? url;
						}
						imagesBatch.update(imageDoc.ref, { urls: newUrls });
						patchCount++;
					}
					if (patchCount > 0 || deleteCount > 0) {
						await imagesBatch.commit();
						logger.info(`[publishProject] Rewrote ${patchCount} and removed ${deleteCount} image doc(s) for ${projectId}.`);
					}
				}
			} catch (err) {
				logger.warn(`[publishProject] Failed to rewrite images collection for ${projectId}:`, err);
			}

			try {
				await deletePrivateProjectMedia(uid, projectId);
			} catch (err) {
				logger.warn(`[publishProject] Private media cleanup failed for ${projectId}:`, err);
			}

			// Generate OG image — awaited with a bounded timeout so ogImageUrl is
			// ready by the time the caller can share the link, but never blocks
			// the response indefinitely.
			await generateAndStoreOgImageBounded(projectId, mode, migratedData.content).catch((err) => {
				logger.warn(`[publishProject] OG image generation failed for ${projectId}:`, err);
			});

			logPublishedProject(projectId, result.publishedSlug);
			logger.info(`[publishProject] Project ${projectId} published by ${uid} with slug "${result.publishedSlug}".`, {
				mode,
				creditCost: quotedCreditCost,
				freedBytes,
				transactionId: result.transactionId,
			});

			// Record publish consent in iubenda — fire-and-forget, must not block the response (currently a no-op, see iubendaConsent.ts)
			recordIubendaConsent(
				{ id: uid, email: userEmail },
				["terms_and_conditions", "privacy_policy"],
				`User accepted Terms and Privacy Policy when publishing project "${projectData.name}" on milestis.com`,
			).catch(() => {});

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
					message: "Insufficient credits. Your balance is no longer sufficient to publish.",
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
			if (!publishCommitted && publishAttemptId) {
				try {
					await releasePublishLock(projectId, publishAttemptId);
				} catch (lockErr) {
					logger.warn(`[publishProject] Failed to release publish lock for ${projectId}:`, lockErr);
				}
			}
		}
	},
);
