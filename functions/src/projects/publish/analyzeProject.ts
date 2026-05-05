import { onRequest } from "firebase-functions/v2/https";
import { logger } from "firebase-functions/v2";
import { FieldValue, Timestamp } from "firebase-admin/firestore";
import { getAuth } from "firebase-admin/auth";
import { randomUUID } from "crypto";
import { db } from "../../lib/firebaseAdmin";
import { ALLOWED_ORIGINS } from "../../lib/cors";
import { calculateCreditCost } from "./config";
import { VALID_MODES, type ProjectMode } from "../projectInterface";
import {
	getSlugValidationError,
	isSlugBlocked,
	normalizeSlug,
	PUBLISHED_PROJECT_SLUGS_COLLECTION,
} from "./slug/index";
import { getSlugModePolicy } from "./slug/policy";

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
	NOT_PUBLISHABLE:          "NOT_PUBLISHABLE",
	INVALID_SLUG:             "INVALID_SLUG",
	SLUG_TAKEN:               "SLUG_TAKEN",
	INTERNAL_SERVER_ERROR:    "INTERNAL_SERVER_ERROR",
} as const;

// ─── Types ────────────────────────────────────────────────────────────────────

class ValidationError extends Error {}

interface AnalyzeInput {
	projectId: string;
	slug: string;
}

export interface AnalyzeOutput {
	ok: true;
	quoteId: string;
	projectName: string;
	/** Full canonical URL the project will be published at. */
	domain: string;
	photoCount: number;
	creditCost: number;
	/** User's current balance at analysis time. */
	userBalance: number;
	/** Unix ms — quote is invalid after this time. */
	expiresAt: number;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function validatePayload(body: unknown): AnalyzeInput {
	const b = body as Record<string, unknown> | null | undefined;
	if (!b || typeof b !== "object")
		throw new ValidationError("Request body must be a JSON object.");

	const { projectId, slug } = b;
	if (typeof projectId !== "string" || !projectId.trim())
		throw new ValidationError("'projectId' must be a non-empty string.");
	if (typeof slug !== "string" || !slug.trim())
		throw new ValidationError("'slug' must be a non-empty string.");

	return { projectId: projectId.trim(), slug: slug.trim() };
}

/**
 * Counts unique photos placed in the project content.
 * Extracts imageId from each Firebase Storage path (images/{imageId}/variant.ext)
 * so that multiple variants of the same photo (full, middle, thumb) count as one.
 */
function countUniquePhotos(content: unknown): number {
	const json = JSON.stringify(content);
	const unique = new Set<string>();
	// Match both public paths (/o/images%2F{id}%2F) and
	// private paths (/o/users%2F...%2Fimages%2F{id}%2F) by accepting %2F or / before "images".
	const re = /"https:\/\/firebasestorage\.googleapis\.com\/v0\/b\/[^"]+(?:\/|%2F)images%2F([^%"]+)%2F[^"]+"/g;
	let m: RegExpExecArray | null;
	while ((m = re.exec(json)) !== null) {
		unique.add(m[1]);
	}
	// Fallback: if paths don't follow the images/{imageId}/ structure,
	// count unique URLs so the result is never zero when photos exist.
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
 * Analyzes a project before publish and returns a short-lived quote.
 * This is step 1.5: called after the user picks a slug and before they confirm payment.
 *
 * POST /analyzeProject
 * Body: { projectId: string, slug: string }
 * Auth: Bearer <idToken>
 *
 * Returns: AnalyzeOutput — project name, canonical domain, photo count,
 *          credit cost, user's current balance, quote ID (valid 10 min).
 */
export const analyzeProject = onRequest(
	{
		concurrency: 50,
		timeoutSeconds: 30,
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

		// ── Body size guard ───────────────────────────────────────────────
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
		let payload: AnalyzeInput;
		try {
			payload = validatePayload(req.body);
		} catch (err) {
			const message = err instanceof ValidationError ? err.message : "Invalid payload.";
			res.status(400).json({ error: ERROR.INVALID_PAYLOAD, message });
			return;
		}

		const { projectId, slug: rawSlug } = payload;
		const slug = normalizeSlug(rawSlug);

		// ── Slug format validation ─────────────────────────────────────────
		const slugError = getSlugValidationError(slug);
		if (slugError) {
			res.status(400).json({ error: ERROR.INVALID_SLUG, message: slugError });
			return;
		}
		if (isSlugBlocked(slug)) {
			res.status(400).json({ error: ERROR.INVALID_SLUG, message: `"${slug}" is a reserved slug.` });
			return;
		}

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

			if (projectData.status !== "active" || projectData.isPublished === true) {
				res.status(409).json({ error: ERROR.NOT_PUBLISHABLE, message: "Project is not publishable." });
				return;
			}

			const rawMode = projectData.mode;
			if (!VALID_MODES.includes(rawMode as ProjectMode)) {
				logger.error(`[analyzeProject] Invalid project mode "${rawMode}" for ${projectId}`);
				res.status(500).json({ error: ERROR.INTERNAL_SERVER_ERROR });
				return;
			}
			const mode = rawMode as ProjectMode;
			const policy = getSlugModePolicy(mode);

			// ── Slug availability (global-namespace modes only) ────────────
			// Token-namespace modes (photobook) don't reserve by slug.
			if (policy.namespace === "global") {
				const slugSnap = await db
					.collection(PUBLISHED_PROJECT_SLUGS_COLLECTION)
					.doc(slug)
					.get();
				if (slugSnap.exists && slugSnap.data()?.projectId !== projectId) {
					res.status(409).json({ error: ERROR.SLUG_TAKEN, message: "This slug is already taken." });
					return;
				}
			}

			// ── Count unique photos ────────────────────────────────────────
			const contentSnap = await db
				.collection("projects")
				.doc(projectId)
				.collection("data")
				.doc("content")
				.get();
			const editorData = contentSnap.exists ? contentSnap.data()! : {};
			const photoCount = countUniquePhotos(editorData.content ?? null);

			const userData = userSnap.data() ?? {};
			const userBalance: number = typeof userData.balance?.total === "number"
				? userData.balance.total
				: 0;

			// Credit cost is calculated from photo count — each mode defines its own strategy.
			const creditCost = calculateCreditCost(mode, photoCount);

			// ── Write quote ───────────────────────────────────────────────
			const expiresAt = Date.now() + QUOTE_TTL_MS;
			const quoteId = randomUUID();

			await db.collection("publish_quotes").doc(quoteId).set({
				quoteId,
				projectId,
				uid,
				mode,
				slug,
				creditCost,
				photoCount,
				expiresAt: Timestamp.fromMillis(expiresAt),
				createdAt: FieldValue.serverTimestamp(),
			});

			const result: AnalyzeOutput = {
				ok: true,
				quoteId,
				projectName: typeof projectData.name === "string" ? projectData.name : projectId,
				domain: buildDomain(mode, slug),
				photoCount,
				creditCost,
				userBalance,
				expiresAt,
			};

			logger.info(`[analyzeProject] Quote ${quoteId} created for project ${projectId} (${mode}, ${slug})`);
			res.status(200).json(result);
		} catch (err) {
			logger.error(`[analyzeProject] Unexpected error for project ${projectId}:`, err);
			res.status(500).json({ error: ERROR.INTERNAL_SERVER_ERROR });
		}
	},
);
