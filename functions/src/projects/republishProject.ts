import { createHash } from "crypto";
import { onRequest } from "firebase-functions/v2/https";
import { logger } from "firebase-functions/v2";
import { FieldValue } from "firebase-admin/firestore";
import { getAuth } from "firebase-admin/auth";
import { db } from "../lib/firebaseAdmin";
import { getSlugReservationDocId, PUBLISHED_PROJECT_SLUGS_COLLECTION } from "./publish/slug";
import { getPublishConfig } from "./publish/config";
import { processTransactionInFirestoreTransaction } from "../transactions/engine";
import { TransactionEngineError } from "../transactions/engine";
import { VALID_MODES, type ProjectMode } from "./projectInterface";
import { ALLOWED_ORIGINS } from "../lib/cors";

// ─── Error codes ──────────────────────────────────────────────────────────────

const ERROR = {
	METHOD_NOT_ALLOWED:    "METHOD_NOT_ALLOWED",
	UNAUTHORIZED:          "UNAUTHORIZED",
	INVALID_OR_EXPIRED_TOKEN: "INVALID_OR_EXPIRED_TOKEN",
	INVALID_PAYLOAD:       "INVALID_PAYLOAD",
	NOT_FOUND:             "NOT_FOUND",
	FORBIDDEN:             "FORBIDDEN",
	NOT_REPUBLISHABLE:     "NOT_REPUBLISHABLE",
	SLUG_TAKEN:            "SLUG_TAKEN",
	INSUFFICIENT_FUNDS:    "INSUFFICIENT_FUNDS",
	INTERNAL_SERVER_ERROR: "INTERNAL_SERVER_ERROR",
} as const;

class FlowError extends Error {
	constructor(
		public readonly status: number,
		public readonly code: typeof ERROR[keyof typeof ERROR],
		message?: string,
	) {
		super(message);
	}
}

/**
 * Re-publishes a previously unpublished (hidden) project.
 *
 * Requirements:
 *   - project.status === "archived"
 *   - project.isPublished === false
 *   - project.publishedSlug still exists (set during original publish)
 *
 * Currently free (republishCreditCost === 0 for all modes).
 * When republishCreditCost > 0 in config, credits are deducted automatically —
 * this is the hook for future per-photo or per-update repricing.
 *
 * POST /republishProject
 * Body: { projectId: string }
 * Auth: Bearer <idToken>
 */
export const republishProject = onRequest(
	{
		concurrency: 10,
		timeoutSeconds: 60,
		maxInstances: 10,
		cors: ALLOWED_ORIGINS,
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
		const { projectId } = req.body as Record<string, unknown>;
		if (typeof projectId !== "string" || !projectId.trim()) {
			res.status(400).json({ error: ERROR.INVALID_PAYLOAD, message: "projectId must be a non-empty string." });
			return;
		}

		try {
			await db.runTransaction(async (tx) => {
				const projectRef = db.collection("projects").doc(projectId.trim());
				const projectSnap = await tx.get(projectRef);

				if (!projectSnap.exists) {
					throw new FlowError(404, ERROR.NOT_FOUND);
				}

				const projectData = projectSnap.data()!;

				if (projectData.ownerId !== uid) {
					throw new FlowError(403, ERROR.FORBIDDEN);
				}

				// Must be archived (was published at least once) and currently hidden.
				if (projectData.status !== "archived" || projectData.isPublished !== false) {
					throw new FlowError(409, ERROR.NOT_REPUBLISHABLE, "Project must be archived and currently unpublished to re-publish.");
				}

				const rawMode = projectData.mode;
				if (!VALID_MODES.includes(rawMode as ProjectMode)) {
					throw new FlowError(500, ERROR.INTERNAL_SERVER_ERROR);
				}
				const mode = rawMode as ProjectMode;
				const config = getPublishConfig(mode);

				const publishedSlug = projectData.publishedSlug;
				if (typeof publishedSlug !== "string" || !publishedSlug) {
					throw new FlowError(409, ERROR.NOT_REPUBLISHABLE, "No published slug found. Please publish the project fresh.");
				}

				// ── Slug reservation ───────────────────────────────────────────
				const slugRef = db.collection(PUBLISHED_PROJECT_SLUGS_COLLECTION).doc(
					getSlugReservationDocId(mode, publishedSlug),
				);
				const slugSnap = await tx.get(slugRef);

				if (slugSnap.exists && slugSnap.data()?.projectId !== projectId.trim()) {
					// Another project claimed this slug while it was hidden.
					throw new FlowError(409, ERROR.SLUG_TAKEN, "Your previous slug has been taken. Please publish with a new slug.");
				}

				const publishedAccessToken =
					typeof projectData.publishedAccessToken === "string" && projectData.publishedAccessToken
						? projectData.publishedAccessToken
						: undefined;
				if (config.requiresAccessToken && !publishedAccessToken) {
					throw new FlowError(409, ERROR.NOT_REPUBLISHABLE, "Photobook access token is missing. Please publish the project fresh.");
				}

				// ── Optional credit deduction (future repricing hook) ──────────
				// When config.republishCreditCost > 0 this block activates automatically.
				// To add dynamic pricing (e.g. per-photo): compute the cost here and
				// replace config.republishCreditCost with the calculated value before
				// calling processTransactionInFirestoreTransaction.
				const publishVersion = typeof projectData.publishVersion === "number" ? projectData.publishVersion : 0;
				if (config.republishCreditCost > 0) {
					await processTransactionInFirestoreTransaction(tx, {
						uid,
						idempotencyKey: `republish:${projectId.trim()}:v${publishVersion + 1}`,
						category: "credit",
						direction: "out",
						credit: {
							type: "spend",
							amount: config.republishCreditCost,
							meta: { projectId: projectId.trim(), mode, slug: publishedSlug, action: "republish" },
						},
					});
				}

				// ── Re-reserve slug ────────────────────────────────────────────
				tx.set(slugRef, {
					projectId: projectId.trim(),
					ownerId: uid,
					mode,
					slug: publishedSlug,
					updatedAt: FieldValue.serverTimestamp(),
				});

				// ── Restore published_projects doc ────────────────────────────
				const publishedRef = db.collection("published_projects").doc(projectId.trim());
				tx.set(publishedRef, {
					isPublished: true,
					slug: publishedSlug,
					...(publishedAccessToken
						? { accessToken: createHash("sha256").update(publishedAccessToken).digest("hex") }
						: {}),
					republishedAt: FieldValue.serverTimestamp(),
				}, { merge: true });

				// ── Update project doc ─────────────────────────────────────────
				tx.update(projectRef, {
					isPublished: true,
					publishVersion: FieldValue.increment(1),
					updatedAt: FieldValue.serverTimestamp(),
				});
			});

			logger.info(`[republishProject] Project ${projectId} re-published by user ${uid}.`);
			res.status(200).json({ ok: true });
		} catch (err: unknown) {
			if (err instanceof FlowError) {
				res.status(err.status).json({ error: err.code, ...(err.message ? { message: err.message } : {}) });
				return;
			}
			if (err instanceof TransactionEngineError && err.code === "insufficient_funds") {
				res.status(402).json({ error: ERROR.INSUFFICIENT_FUNDS });
				return;
			}
			logger.error(`[republishProject] Error re-publishing project ${projectId}:`, err);
			res.status(500).json({ error: ERROR.INTERNAL_SERVER_ERROR });
		}
	},
);
