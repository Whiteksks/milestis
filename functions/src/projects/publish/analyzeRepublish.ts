import { onRequest } from "firebase-functions/v2/https";
import { logger } from "firebase-functions/v2";
import { FieldValue, Timestamp } from "firebase-admin/firestore";
import { getAuth } from "firebase-admin/auth";
import { randomUUID, createHash } from "crypto";
import { db } from "../../lib/firebaseAdmin";
import { ALLOWED_ORIGINS } from "../../lib/cors";
import { calculateCreditCost } from "./config";
import { VALID_MODES, type ProjectMode } from "../projectInterface";
import { getSlugReservationDocId, PUBLISHED_PROJECT_SLUGS_COLLECTION } from "./slug/index";
import { getSlugModePolicy } from "./slug/policy";
import { runSafeSearchCheck, extractImageIds } from "../../lib/safeSearchCheck";

// ─── Constants ────────────────────────────────────────────────────────────────

const PUBLIC_SITE_DOMAIN = "milestis.site";
const QUOTE_TTL_MS = 10 * 60 * 1000; // 10 minutes
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
	SLUG_TAKEN:                   "SLUG_TAKEN",
	CONTENT_POLICY_VIOLATION:     "CONTENT_POLICY_VIOLATION",
	INTERNAL_SERVER_ERROR:        "INTERNAL_SERVER_ERROR",
} as const;

class ValidationError extends Error {}

// ─── Types ────────────────────────────────────────────────────────────────────

interface AnalyzeRepublishInput {
	projectId: string;
}

export interface AnalyzeRepublishOutput {
	ok: true;
	quoteId: string;
	projectName: string;
	/** Full canonical URL the project is published at. */
	domain: string;
	photoCount: number;
	/** Delta credits to charge (0 = free republish). */
	creditCost: number;
	/** Full new credit cost for display. */
	newCreditCost: number;
	/** Credit cost paid during the last publish/republish. */
	previousCreditCost: number;
	userBalance: number;
	expiresAt: number;
	publishedSlug: string;
	/** Only present for photobook mode. */
	publishedAccessToken?: string;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function validatePayload(body: unknown): AnalyzeRepublishInput {
	const b = body as Record<string, unknown> | null | undefined;
	if (!b || typeof b !== "object")
		throw new ValidationError("Request body must be a JSON object.");
	const { projectId } = b;
	if (typeof projectId !== "string" || !projectId.trim())
		throw new ValidationError("'projectId' must be a non-empty string.");
	return { projectId: projectId.trim() };
}

function countUniquePhotos(content: unknown): number {
	const json = JSON.stringify(content);
	const unique = new Set<string>();
	const re = /"https:\/\/firebasestorage\.googleapis\.com\/v0\/b\/[^"]+(?:\/|%2F)images%2F([^%"]+)%2F[^"]+"/g;
	let m: RegExpExecArray | null;
	while ((m = re.exec(json)) !== null) {
		unique.add(m[1]);
	}
	if (unique.size === 0) {
		const urls = json.match(/"https:\/\/firebasestorage\.googleapis\.com\/v0\/b\/[^"]+"/g);
		return urls ? new Set(urls).size : 0;
	}
	return unique.size;
}

function buildDomain(mode: ProjectMode, slug: string): string {
	const policy = getSlugModePolicy(mode);
	return policy.routeKind === "subdomain"
		? `https://${slug}.${PUBLIC_SITE_DOMAIN}`
		: `https://${PUBLIC_SITE_DOMAIN}/${slug}`;
}

// ─── Cloud Function ───────────────────────────────────────────────────────────

/**
 * Analyzes a project before republish and returns a short-lived quote.
 * Computes the delta credit cost: max(0, newCost - previouslyPaidCost).
 *
 * POST /analyzeRepublish
 * Body: { projectId: string }
 * Auth: Bearer <idToken>
 *
 * Returns: AnalyzeRepublishOutput — project info, delta cost, user balance,
 *          new/previous photo counts, published slug, quote ID (valid 10 min).
 */
export const analyzeRepublish = onRequest(
	{
		concurrency: 50,
		timeoutSeconds: 60,
		memory: "256MiB",
		maxInstances: 20,
		cors: ALLOWED_ORIGINS,
	},
	async (req, res) => {
		// ── Method guard ──────────────────────────────────────────────────
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
		try {
			const decoded = await getAuth().verifyIdToken(authHeader.split("Bearer ")[1]);
			uid = decoded.uid;
		} catch {
			res.status(401).json({ error: ERROR.INVALID_OR_EXPIRED_TOKEN });
			return;
		}

		// ── Payload ───────────────────────────────────────────────────────
		let payload: AnalyzeRepublishInput;
		try {
			payload = validatePayload(req.body);
		} catch (err) {
			const message = err instanceof ValidationError ? err.message : "Invalid payload.";
			res.status(400).json({ error: ERROR.INVALID_PAYLOAD, message });
			return;
		}

		const { projectId } = payload;

		try {
			// ── Load project + user in parallel ───────────────────────────
			const [projectSnap, userSnap] = await Promise.all([
				db.collection("projects").doc(projectId).get(),
				db.collection("users").doc(uid).get(),
			]);

			if (!projectSnap.exists) {
				res.status(404).json({ error: ERROR.NOT_FOUND, message: "Project not found." });
				return;
			}

			const projectData = projectSnap.data()!;

			if (projectData.ownerId !== uid) {
				res.status(403).json({ error: ERROR.FORBIDDEN, message: "You do not own this project." });
				return;
			}

			// Must be archived (published before) and currently unpublished
			if (projectData.status !== "archived" || projectData.isPublished !== false) {
				res.status(409).json({
					error: ERROR.NOT_REPUBLISHABLE,
					message: "Project must be unpublished (archived) to re-analyze.",
				});
				return;
			}

			const publishedSlug = typeof projectData.publishedSlug === "string" ? projectData.publishedSlug : null;
			if (!publishedSlug) {
				res.status(409).json({
					error: ERROR.NOT_REPUBLISHABLE,
					message: "No published slug found. Please publish the project fresh.",
				});
				return;
			}

			const rawMode = projectData.mode;
			if (!VALID_MODES.includes(rawMode as ProjectMode)) {
				res.status(500).json({ error: ERROR.INTERNAL_SERVER_ERROR });
				return;
			}
			const mode = rawMode as ProjectMode;

			const publishedAccessToken =
				typeof projectData.publishedAccessToken === "string" && projectData.publishedAccessToken
					? projectData.publishedAccessToken
					: undefined;

			// ── Check slug reservation still belongs to this project ──────
			const hashedToken = publishedAccessToken
				? createHash("sha256").update(publishedAccessToken).digest("hex")
				: undefined;
			const slugRef = db.collection(PUBLISHED_PROJECT_SLUGS_COLLECTION).doc(
				getSlugReservationDocId(mode, publishedSlug, hashedToken),
			);
			const slugSnap = await slugRef.get();
			if (slugSnap.exists && slugSnap.data()?.projectId !== projectId) {
				res.status(409).json({
					error: ERROR.SLUG_TAKEN,
					message: "Your previous slug has been taken. Please publish with a new slug.",
				});
				return;
			}

			// ── Count photos in current content ───────────────────────────
			// Load current content + previously published content in parallel (for diff)
			const [contentSnap, publishedSnap] = await Promise.all([
				db.collection("projects").doc(projectId).collection("data").doc("content").get(),
				db.collection("published_projects").doc(projectId).get(),
			]);
			const editorData = contentSnap.exists ? contentSnap.data()! : {};
			const photoCount = countUniquePhotos(editorData.content ?? null);

			// ── SafeSearch content moderation (with republish diff) ────────
			// previousImageIds = images that were already in the last published version.
			// These are skipped entirely — cache or not — because they haven't changed.
			const publishedContent = publishedSnap.exists ? publishedSnap.data()?.content : null;
			const previousImageIds = extractImageIds(publishedContent ?? null);
			const safeSearch = await runSafeSearchCheck(
				editorData.content ?? null,
				{ previousImageIds },
			);
			if (!safeSearch.safe) {
				logger.warn(`[analyzeRepublish] SafeSearch blocked project ${projectId}`, { violations: safeSearch.violations });
				res.status(400).json({
					error: ERROR.CONTENT_POLICY_VIOLATION,
					message: "Project contains content that violates our content policy and cannot be published.",
				});
				return;
			}

			const userData = userSnap.data() ?? {};
			const userBalance: number =
				typeof userData.balance?.total === "number" ? userData.balance.total : 0;

			// ── Delta cost calculation ────────────────────────────────────
			const newCreditCost = calculateCreditCost(mode, photoCount);
			const previousCreditCost: number =
				typeof projectData.publishedCreditCost === "number" ? projectData.publishedCreditCost : 0;
			const deltaCost = Math.max(0, newCreditCost - previousCreditCost);

			// ── Write quote ───────────────────────────────────────────────
			const expiresAt = Date.now() + QUOTE_TTL_MS;
			const quoteId = randomUUID();

			await db.collection("publish_quotes").doc(quoteId).set({
				quoteId,
				projectId,
				uid,
				mode,
				slug: publishedSlug,
				creditCost: deltaCost,
				newCreditCost,
				photoCount,
				type: "republish",
				expiresAt: Timestamp.fromMillis(expiresAt),
				createdAt: FieldValue.serverTimestamp(),
			});

			const result: AnalyzeRepublishOutput = {
				ok: true,
				quoteId,
				projectName: typeof projectData.name === "string" ? projectData.name : projectId,
				domain: buildDomain(mode, publishedSlug),
				photoCount,
				creditCost: deltaCost,
				newCreditCost,
				previousCreditCost,
				userBalance,
				expiresAt,
				publishedSlug,
				...(publishedAccessToken ? { publishedAccessToken } : {}),
			};

			logger.info(
				`[analyzeRepublish] Quote ${quoteId} for project ${projectId} (mode=${mode}, delta=${deltaCost} cr, photos=${photoCount})`,
			);
			res.status(200).json(result);
		} catch (err) {
			logger.error(`[analyzeRepublish] Unexpected error for project ${projectId}:`, err);
			res.status(500).json({ error: ERROR.INTERNAL_SERVER_ERROR });
		}
	},
);
