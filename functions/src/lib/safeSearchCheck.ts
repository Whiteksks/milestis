/**
 * safeSearchCheck.ts
 *
 * Standalone module for Google Vision SafeSearch content moderation.
 * Extracts image URLs from project content and checks them against
 * Google Vision API SafeSearch Detection before publication.
 *
 * Usage:
 *   import { runSafeSearchCheck } from "../lib/safeSearchCheck";
 *   const result = await runSafeSearchCheck(projectContent);
 *   if (!result.safe) { ... reject ... }
 *
 * Required:
 *   npm install @google-cloud/vision --save  (inside /functions)
 *   Google Cloud Vision API must be enabled in Firebase project console.
 *   The Cloud Functions service account automatically has credentials.
 */

import { ImageAnnotatorClient } from "@google-cloud/vision";

// ─── Types ────────────────────────────────────────────────────────────────────

/** The 5 SafeSearch categories returned by Google Vision. */
export type SafeSearchCategory = "adult" | "violence" | "racy" | "spoof" | "medical";

/**
 * Likelihood levels as returned by the Vision API, ordered from least to most
 * likely (matches the numeric enum in the protobuf spec).
 */
export type Likelihood =
	| "UNKNOWN"
	| "VERY_UNLIKELY"
	| "UNLIKELY"
	| "POSSIBLE"
	| "LIKELY"
	| "VERY_LIKELY";

export interface ImageViolation {
	/** The image URL that triggered the violation. */
	imageUrl: string;
	/** Which category triggered it (e.g. "adult", "violence"). */
	category: SafeSearchCategory;
	/** Likelihood string returned by Vision API. */
	likelihood: Likelihood;
}

export interface SafeSearchResult {
	/** True when all images pass the safety threshold. */
	safe: boolean;
	/** Number of images that were analyzed. */
	checkedCount: number;
	/** Non-empty only when safe === false. */
	violations: ImageViolation[];
}

// ─── Configuration ────────────────────────────────────────────────────────────

/**
 * Categories that are considered policy violations.
 * "racy" is intentionally excluded because stock photos of swimwear etc.
 * would be flagged. Add it here if you want stricter moderation.
 */
const BLOCKED_CATEGORIES: SafeSearchCategory[] = ["adult", "violence"];

/**
 * Minimum likelihood level that triggers a block.
 * LIKELY and VERY_LIKELY are blocked; POSSIBLE and below are allowed.
 */
const BLOCK_THRESHOLD: Likelihood = "LIKELY";

/** Maximum number of images to check per project (cost + latency guard). */
const MAX_IMAGES_TO_CHECK = 60;

// Numeric rank used for threshold comparison.
const LIKELIHOOD_RANK: Record<Likelihood, number> = {
	UNKNOWN:       0,
	VERY_UNLIKELY: 1,
	UNLIKELY:      2,
	POSSIBLE:      3,
	LIKELY:        4,
	VERY_LIKELY:   5,
};

// ─── Image URL extraction ─────────────────────────────────────────────────────

/**
 * Extracts unique Firebase Storage image URLs from project content JSON.
 *
 * Matches both:
 *  - Public paths:  /o/images%2F{imageId}%2F...
 *  - Private paths: /o/users%2F...%2Fimages%2F{imageId}%2F...
 *
 * Prefers the "middle" variant for checking (lower bandwidth, sufficient
 * resolution for SafeSearch). Falls back to any available URL.
 */
function extractImageUrls(content: unknown): string[] {
	const json = JSON.stringify(content);

	// Collect all Firebase Storage image URLs
	const urlPattern =
		/"(https:\/\/firebasestorage\.googleapis\.com\/v0\/b\/[^"]+(?:\/|%2F)images%2F[^"]+)"/g;

	const byImageId = new Map<string, { middle?: string; fallback: string }>();

	let m: RegExpExecArray | null;
	while ((m = urlPattern.exec(json)) !== null) {
		const url = m[1];

		// Extract imageId from path — works for both public and private paths.
		const idMatch = url.match(/(?:\/|%2F)images%2F([^%"\/]+)%2F/);
		if (!idMatch) continue;

		const imageId = idMatch[1];
		const existing = byImageId.get(imageId);

		// Prefer "middle" variant as a balance of quality vs bandwidth.
		if (url.includes("middle")) {
			byImageId.set(imageId, { middle: url, fallback: existing?.fallback ?? url });
		} else if (!existing) {
			byImageId.set(imageId, { fallback: url });
		}
	}

	const urls: string[] = [];
	for (const entry of byImageId.values()) {
		urls.push(entry.middle ?? entry.fallback);
	}

	return urls.slice(0, MAX_IMAGES_TO_CHECK);
}

// ─── SafeSearch logic ─────────────────────────────────────────────────────────

/**
 * Checks a single image URL against Vision SafeSearch.
 * Returns an array of ImageViolation (empty when the image is clean).
 */
async function checkImageUrl(
	client: ImageAnnotatorClient,
	imageUrl: string,
): Promise<ImageViolation[]> {
	const [result] = await client.safeSearchDetection(imageUrl);
	const safe = result.safeSearchAnnotation;

	if (!safe) return [];

	const violations: ImageViolation[] = [];

	for (const category of BLOCKED_CATEGORIES) {
		// The Vision API returns likelihood as a string or number depending on
		// the client version. Normalise to string.
		const rawLikelihood = safe[category];
		const likelihood = normaliseLikelihood(rawLikelihood);

		if (LIKELIHOOD_RANK[likelihood] >= LIKELIHOOD_RANK[BLOCK_THRESHOLD]) {
			violations.push({ imageUrl, category, likelihood });
		}
	}

	return violations;
}

/**
 * Normalises the raw Vision API likelihood value to our Likelihood type.
 * The Node.js client may return a string like "LIKELY" or a numeric enum value.
 */
function normaliseLikelihood(raw: unknown): Likelihood {
	if (typeof raw === "string" && raw in LIKELIHOOD_RANK) {
		return raw as Likelihood;
	}
	// Numeric enum mapping (matches google.cloud.vision.v1.Likelihood protobuf)
	const numericMap: Record<number, Likelihood> = {
		0: "UNKNOWN",
		1: "VERY_UNLIKELY",
		2: "UNLIKELY",
		3: "POSSIBLE",
		4: "LIKELY",
		5: "VERY_LIKELY",
	};
	if (typeof raw === "number" && raw in numericMap) {
		return numericMap[raw];
	}
	return "UNKNOWN";
}

// ─── Public API ───────────────────────────────────────────────────────────────

/**
 * Runs Google Vision SafeSearch on all images found in project content.
 *
 * @param content - The raw project `content` field from Firestore.
 * @returns SafeSearchResult — safe flag, checked count, and any violations.
 *
 * @example
 * const result = await runSafeSearchCheck(projectData.content);
 * if (!result.safe) {
 *   logger.warn("SafeSearch blocked project", { violations: result.violations });
 *   res.status(400).json({ error: "CONTENT_POLICY_VIOLATION", violations: result.violations });
 *   return;
 * }
 */
export async function runSafeSearchCheck(content: unknown): Promise<SafeSearchResult> {
	const imageUrls = extractImageUrls(content);

	if (imageUrls.length === 0) {
		return { safe: true, checkedCount: 0, violations: [] };
	}

	const client = new ImageAnnotatorClient();

	// Check all images concurrently, but collect all violations (don't short-circuit)
	// so that the full picture can be logged / shown to the moderator.
	const violationArrays = await Promise.all(
		imageUrls.map((url) => checkImageUrl(client, url)),
	);

	const violations = violationArrays.flat();

	return {
		safe: violations.length === 0,
		checkedCount: imageUrls.length,
		violations,
	};
}
