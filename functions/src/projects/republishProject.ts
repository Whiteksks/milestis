import { createHash, randomUUID } from "crypto";
import { onRequest } from "firebase-functions/v2/https";
import { logger } from "firebase-functions/v2";
import { FieldValue } from "firebase-admin/firestore";
import { getAuth } from "firebase-admin/auth";
import { db } from "../lib/firebaseAdmin";
import { getSlugReservationDocId, PUBLISHED_PROJECT_SLUGS_COLLECTION } from "./publish/slug/index";
import { migrateProjectMedia, deletePrivateProjectMedia } from "./publish/migrate";
import { processTransactionInFirestoreTransaction, TransactionEngineError } from "../transactions/engine";
import { VALID_MODES, type ProjectMode } from "./projectInterface";
import { ALLOWED_ORIGINS } from "../lib/cors";
import { recordIubendaConsent } from "../lib/iubendaConsent";
import type { BalanceSnapshot } from "../transactions/types";
import { generateAndStoreOgImage } from "./ogImage";

// ─── Constants ────────────────────────────────────────────────────────────────

const REPUBLISH_JOB_LEASE_MS = 15 * 60 * 1000;
const BODY_SIZE_LIMIT_BYTES = 1024;

// ─── Error codes ──────────────────────────────────────────────────────────────

const ERROR = {
	METHOD_NOT_ALLOWED:       "METHOD_NOT_ALLOWED",
	UNAUTHORIZED:             "UNAUTHORIZED",
	INVALID_OR_EXPIRED_TOKEN: "INVALID_OR_EXPIRED_TOKEN",
	INVALID_PAYLOAD:          "INVALID_PAYLOAD",
	NOT_FOUND:                "NOT_FOUND",
	FORBIDDEN:                "FORBIDDEN",
	NOT_REPUBLISHABLE:        "NOT_REPUBLISHABLE",
	SLUG_TAKEN:               "SLUG_TAKEN",
	INSUFFICIENT_FUNDS:       "INSUFFICIENT_FUNDS",
	QUOTE_INVALID:            "QUOTE_INVALID",
	QUOTE_EXPIRED:            "QUOTE_EXPIRED",
	INTERNAL_SERVER_ERROR:    "INTERNAL_SERVER_ERROR",
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

class QuoteError extends Error {
	constructor(
		public readonly code: "QUOTE_INVALID" | "QUOTE_EXPIRED",
		message: string,
	) {
		super(message);
	}
}

// ─── Types ────────────────────────────────────────────────────────────────────

interface RepublishQuoteData {
	quoteId: string;
	projectId: string;
	uid: string;
	slug: string;
	creditCost: number;
	newCreditCost: number;
	photoCount: number;
	type: "republish";
	expiresAt: FirebaseFirestore.Timestamp;
}

interface RepublishOutput {
	ok: true;
	publishedSlug: string;
	publishedAccessToken?: string;
	balance: BalanceSnapshot;
}

// ─── Quote validation ─────────────────────────────────────────────────────────

async function validateRepublishQuote(
	quoteId: string,
	uid: string,
	projectId: string,
): Promise<RepublishQuoteData> {
	const quoteSnap = await db.collection("publish_quotes").doc(quoteId).get();
	if (!quoteSnap.exists) {
		throw new QuoteError("QUOTE_INVALID", "Republish quote not found. Please go back and try again.");
	}
	const data = quoteSnap.data() as RepublishQuoteData;
	if (data.type !== "republish") {
		throw new QuoteError("QUOTE_INVALID", "Quote type mismatch. Please go back and try again.");
	}
	if (data.uid !== uid || data.projectId !== projectId) {
		throw new QuoteError("QUOTE_INVALID", "Republish quote does not match this project or user.");
	}
	if (Date.now() > data.expiresAt.toMillis()) {
		throw new QuoteError("QUOTE_EXPIRED", "Republish quote has expired. Please go back and start again.");
	}
	return data;
}

// ─── Republish lock ───────────────────────────────────────────────────────────

async function claimRepublishJob(
	projectId: string,
	uid: string,
): Promise<{ projectData: FirebaseFirestore.DocumentData; attemptId: string }> {
	const projectRef = db.collection("projects").doc(projectId);
	const attemptId = randomUUID();
	return db.runTransaction(async (tx) => {
		const snap = await tx.get(projectRef);
		if (!snap.exists) throw new FlowError(404, ERROR.NOT_FOUND, "Project not found.");
		const data = snap.data()!;
		if (data.ownerId !== uid) throw new FlowError(403, ERROR.FORBIDDEN, "You do not own this project.");
		if (data.status !== "archived" || data.isPublished !== false) {
			throw new FlowError(409, ERROR.NOT_REPUBLISHABLE, "Project must be unpublished (archived) to republish.");
		}
		const currentLease =
			typeof data.republishLockExpiresAtMillis === "number" ? data.republishLockExpiresAtMillis : 0;
		if (currentLease > Date.now()) {
			throw new FlowError(409, ERROR.NOT_REPUBLISHABLE, "A republish is already in progress. Please wait a moment.");
		}
		tx.update(projectRef, {
			republishLockId: attemptId,
			republishLockExpiresAtMillis: Date.now() + REPUBLISH_JOB_LEASE_MS,
			updatedAt: FieldValue.serverTimestamp(),
		});
		return { projectData: data, attemptId };
	});
}

async function releaseRepublishLock(projectId: string, attemptId: string): Promise<void> {
	const projectRef = db.collection("projects").doc(projectId);
	await db.runTransaction(async (tx) => {
		const snap = await tx.get(projectRef);
		if (!snap.exists) return;
		const data = snap.data() ?? {};
		if (data.republishLockId !== attemptId) return;
		tx.update(projectRef, {
			republishLockId: FieldValue.delete(),
			republishLockExpiresAtMillis: FieldValue.delete(),
			updatedAt: FieldValue.serverTimestamp(),
		});
	});
}

// ─── Cloud Function ───────────────────────────────────────────────────────────

/**
 * Re-publishes a previously unpublished project with FRESH content.
 *
 * Full pipeline (mirrors publishProject):
 *   1. Validates auth + quote (type=republish, not expired)
 *   2. Claims a republish lock (prevents double-submit)
 *   3. Reads current editor content and migrates any new private media → public
 *   4. Firestore transaction:
 *      a. Re-checks project state (archived + isPublished=false)
 *      b. Checks slug reservation still belongs to this project
 *      c. Debits delta credits if newCost > previousCost (0 = free)
 *      d. Fully overwrites published_projects with fresh content (no merge)
 *      e. Re-stamps slug reservation
 *      f. Updates project.isPublished, publishedCreditCost, publishVersion
 *      g. Writes export record
 *   5. Rewrites editor content doc + images collection with public URLs
 *   6. Deletes any newly uploaded private originals
 *
 * POST /republishProject
 * Body: { projectId: string, quoteId: string }
 * Auth: Bearer <idToken>
 */
export const republishProject = onRequest(
	{
		concurrency: 10,
		timeoutSeconds: 300,
		memory: "1GiB",
		maxInstances: 20,
		cors: ALLOWED_ORIGINS,
	},
	async (req, res) => {
		if (req.method !== "POST") {
			res.status(405).json({ error: ERROR.METHOD_NOT_ALLOWED });
			return;
		}

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
		const { projectId, quoteId } = req.body as Record<string, unknown>;
		if (typeof projectId !== "string" || !projectId.trim()) {
			res.status(400).json({ error: ERROR.INVALID_PAYLOAD, message: "projectId must be a non-empty string." });
			return;
		}
		if (typeof quoteId !== "string" || !quoteId.trim()) {
			res.status(400).json({ error: ERROR.INVALID_PAYLOAD, message: "quoteId must be a non-empty string. Call analyzeRepublish first." });
			return;
		}

		const pid = projectId.trim();
		const qid = quoteId.trim();

		// ── Validate quote ────────────────────────────────────────────────
		let quoteData: RepublishQuoteData;
		try {
			quoteData = await validateRepublishQuote(qid, uid, pid);
		} catch (err) {
			if (err instanceof QuoteError) {
				res.status(err.code === "QUOTE_EXPIRED" ? 410 : 400).json({ error: ERROR[err.code], message: err.message });
				return;
			}
			throw err;
		}

		// ── Claim republish lock ──────────────────────────────────────────
		let projectData: FirebaseFirestore.DocumentData;
		let attemptId: string | undefined;
		let committed = false;

		try {
			const claim = await claimRepublishJob(pid, uid);
			projectData = claim.projectData;
			attemptId = claim.attemptId;
		} catch (err) {
			if (err instanceof FlowError) {
				res.status(err.status).json({ error: err.code, message: err.message });
				return;
			}
			throw err;
		}

		const rawMode = projectData.mode;
		if (!VALID_MODES.includes(rawMode as ProjectMode)) {
			await releaseRepublishLock(pid, attemptId!).catch(() => {});
			res.status(500).json({ error: ERROR.INTERNAL_SERVER_ERROR });
			return;
		}
		const mode = rawMode as ProjectMode;

		const publishedSlug = typeof projectData.publishedSlug === "string" ? projectData.publishedSlug : null;
		if (!publishedSlug) {
			await releaseRepublishLock(pid, attemptId!).catch(() => {});
			res.status(409).json({ error: ERROR.NOT_REPUBLISHABLE, message: "No published slug found. Please publish the project fresh." });
			return;
		}

		const publishedAccessToken =
			typeof projectData.publishedAccessToken === "string" && projectData.publishedAccessToken
				? projectData.publishedAccessToken
				: undefined;

		const hashedToken = publishedAccessToken
			? createHash("sha256").update(publishedAccessToken).digest("hex")
			: undefined;

		try {
			// ── Read current editor content ───────────────────────────────
			const contentSnap = await db.collection("projects").doc(pid).collection("data").doc("content").get();
			const editorData = contentSnap.exists ? contentSnap.data()! : {};
			const contentJson = JSON.stringify({ theme: editorData.theme ?? null, content: editorData.content ?? null });

			// ── Migrate media (no-op for already-public URLs, handles new private uploads) ──
			const { urlMapping, freedBytes } = await migrateProjectMedia(uid, pid, contentJson);
			const migratedJson = contentJson.replace(
				/"(https:\/\/firebasestorage\.googleapis\.com\/v0\/b\/[^"\\]+)"/g,
				(_match, url: string) => { const m = urlMapping.get(url); return m ? `"${m}"` : `"${url}"`; },
			);
			const migratedData = JSON.parse(migratedJson) as {
				theme: Record<string, unknown> | null;
				content: Record<string, unknown> | null;
			};

			const deltaCost = quoteData.creditCost;
			const newCreditCost = quoteData.newCreditCost;

			// ── Firestore transaction ─────────────────────────────────────
			let balanceSnapshot: BalanceSnapshot | null = null;

			await db.runTransaction(async (tx) => {
				const projectRef = db.collection("projects").doc(pid);
				const publishedRef = db.collection("published_projects").doc(pid);
				const slugRef = db.collection(PUBLISHED_PROJECT_SLUGS_COLLECTION).doc(
					getSlugReservationDocId(mode, publishedSlug, hashedToken),
				);
				const exportRef = projectRef.collection("exports").doc();

				const [projectSnap, slugSnap] = await Promise.all([tx.get(projectRef), tx.get(slugRef)]);
				if (!projectSnap.exists) throw new FlowError(404, ERROR.NOT_FOUND, "Project not found.");

				const pData = projectSnap.data()!;
				if (pData.ownerId !== uid) throw new FlowError(403, ERROR.FORBIDDEN);
				if (pData.status !== "archived" || pData.isPublished !== false) {
					throw new FlowError(409, ERROR.NOT_REPUBLISHABLE, "Project state changed. Please try again.");
				}
				if (slugSnap.exists && slugSnap.data()?.projectId !== pid) {
					throw new FlowError(409, ERROR.SLUG_TAKEN, "Your previous slug has been taken. Please publish with a new slug.");
				}

				const publishVersion = typeof pData.publishVersion === "number" ? pData.publishVersion : 0;
				const previousCreditCost = typeof pData.publishedCreditCost === "number" ? pData.publishedCreditCost : 0;
				const newStoredCreditCost = Math.max(previousCreditCost, newCreditCost);

				// Debit delta credits only if required
				if (deltaCost > 0) {
					const debit = await processTransactionInFirestoreTransaction(tx, {
						uid,
						idempotencyKey: `republish:${pid}:v${publishVersion + 1}`,
						category: "credit",
						direction: "out",
						credit: {
							type: "spend",
							amount: deltaCost,
							meta: { projectId: pid, projectName: typeof pData.name === "string" ? pData.name : undefined, mode, slug: publishedSlug, action: "republish" },
						},
					});
					balanceSnapshot = debit.balanceSnapshot;
				}

				// Full overwrite — not merge — so stale content is replaced
				const publishedDoc: Record<string, unknown> = {
					ownerId: uid,
					slug: publishedSlug,
					name: typeof pData.name === "string" ? pData.name : pid,
					mode,
					isPublished: true,
					theme: migratedData.theme,
					content: migratedData.content,
					republishedAt: FieldValue.serverTimestamp(),
					publishedAt: pData.publishedAt ?? FieldValue.serverTimestamp(),
				};
				if (hashedToken) publishedDoc.accessToken = hashedToken;
				tx.set(publishedRef, publishedDoc);

				tx.set(slugRef, {
					projectId: pid,
					ownerId: uid,
					mode,
					slug: publishedSlug,
					updatedAt: FieldValue.serverTimestamp(),
				});

				const projectUpdate: Record<string, unknown> = {
					isPublished: true,
					publishedCreditCost: newStoredCreditCost,
					publishedPhotoCount: quoteData.photoCount,
					republishLockId: FieldValue.delete(),
					republishLockExpiresAtMillis: FieldValue.delete(),
					publishVersion: FieldValue.increment(1),
					updatedAt: FieldValue.serverTimestamp(),
				};
				if (pData.preview?.heroImageUrl) {
					projectUpdate["preview.heroImageUrl"] =
						urlMapping.get(pData.preview.heroImageUrl) ?? pData.preview.heroImageUrl;
				}
				tx.update(projectRef, projectUpdate);

				tx.set(exportRef, {
					exportId: exportRef.id,
					projectId: pid,
					projectName: typeof pData.name === "string" ? pData.name : pid,
					ownerId: uid,
					mode,
					creditCost: deltaCost,
					publishedSlug,
					action: "republish",
					publishVersion: publishVersion + 1,
					createdAt: FieldValue.serverTimestamp(),
				});
			});

			committed = true;

			// Free republish: read fresh balance from user doc
			if (!balanceSnapshot) {
				const userSnap = await db.collection("users").doc(uid).get();
				const ud = userSnap.data() ?? {};
				balanceSnapshot = {
					total:        typeof ud.balance?.total        === "number" ? ud.balance.total        : 0,
					purchased:    typeof ud.balance?.purchased    === "number" ? ud.balance.purchased    : 0,
					subscription: typeof ud.balance?.subscription === "number" ? ud.balance.subscription : 0,
					bonus:        typeof ud.balance?.bonus        === "number" ? ud.balance.bonus        : 0,
				};
			}

			// Delete quote (single-use)
			try { await db.collection("publish_quotes").doc(qid).delete(); }
			catch (err) { logger.warn(`[republishProject] Failed to delete quote ${qid}:`, err); }

			// Rewrite editor content doc with public URLs
			try {
				await db.collection("projects").doc(pid).collection("data").doc("content")
					.set({ theme: migratedData.theme, content: migratedData.content });
			} catch (err) { logger.warn(`[republishProject] Failed to rewrite content doc for ${pid}:`, err); }

			// Rewrite images collection with public URLs
			if (urlMapping.size > 0) {
				try {
					const imagesSnap = await db.collection("images").where("projectId", "==", pid).get();
					if (!imagesSnap.empty) {
						const batch = db.batch();
						let patchCount = 0;
						for (const imageDoc of imagesSnap.docs) {
							const imgData = imageDoc.data() as { urls?: Record<string, string> };
							if (!imgData.urls) continue;
							const newUrls: Record<string, string> = {};
							let changed = false;
							for (const [variant, url] of Object.entries(imgData.urls)) {
								const mapped = urlMapping.get(url);
								if (mapped) { newUrls[variant] = mapped; changed = true; } else newUrls[variant] = url;
							}
							if (changed) { batch.update(imageDoc.ref, { urls: newUrls }); patchCount++; }
						}
						if (patchCount > 0) await batch.commit();
					}
				} catch (err) { logger.warn(`[republishProject] Failed to rewrite images for ${pid}:`, err); }
			}

			// Delete newly uploaded private originals
			if (freedBytes > 0) {
				try { await deletePrivateProjectMedia(uid, pid); }
				catch (err) { logger.warn(`[republishProject] Private media cleanup failed for ${pid}:`, err); }
			}

			// Generate OG image — fire-and-forget, never blocks the response
			generateAndStoreOgImage(pid, mode, migratedData.content).catch((err) => {
				logger.warn(`[republishProject] OG image generation failed for ${pid}:`, err);
			});

			// Consent recording for paid republish (currently a no-op, see iubendaConsent.ts)
			if (deltaCost > 0) {
				recordIubendaConsent(
					{ id: uid, email: userEmail },
					["terms_and_conditions", "privacy_policy"],
					`User accepted Terms and Privacy Policy when re-publishing project "${projectData.name}" on milestis.com`,
				).catch(() => {});
			}

			logger.info(`[republishProject] Project ${pid} re-published by ${uid}, slug="${publishedSlug}", deltaCost=${deltaCost}.`);
			res.status(200).json({
				ok: true,
				publishedSlug,
				...(publishedAccessToken ? { publishedAccessToken } : {}),
				balance: balanceSnapshot,
			} satisfies RepublishOutput);
		} catch (err) {
			if (!committed && attemptId) await releaseRepublishLock(pid, attemptId).catch(() => {});
			if (err instanceof FlowError) {
				res.status(err.status).json({ error: err.code, ...(err.message ? { message: err.message } : {}) });
				return;
			}
			if (err instanceof TransactionEngineError && err.code === "insufficient_funds") {
				res.status(402).json({ error: ERROR.INSUFFICIENT_FUNDS, message: "Insufficient credits." });
				return;
			}
			logger.error(`[republishProject] Error re-publishing ${pid}:`, err);
			res.status(500).json({ error: ERROR.INTERNAL_SERVER_ERROR });
		}
	},
);
