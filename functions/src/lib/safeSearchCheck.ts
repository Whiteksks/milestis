/**
 * safeSearchCheck.ts
 *
 * Google Vision SafeSearch content moderation with three optimizations:
 *
 *  1. Firestore cache — each imageId is checked once and the result is stored
 *     permanently (imageIds are unique per upload so no TTL is needed).
 *     Subsequent publish/republish calls skip already-checked images.
 *
 *  2. Batch Vision API requests — up to VISION_BATCH_SIZE images are sent in a
 *     single batchAnnotateImages call, reducing HTTP round-trips dramatically.
 *
 *  3. Republish diff — callers can pass a Set of imageIds from the previously
 *     published version. Images that have not changed are excluded before cache
 *     lookup and API calls, making republish of unchanged projects near-instant.
 *
 * Usage (first publish):
 *   const result = await runSafeSearchCheck(content);
 *
 * Usage (republish - pass previous imageIds to skip unchanged photos):
 *   const previousIds = extractImageIds(publishedProjectContent);
 *   const result = await runSafeSearchCheck(content, { previousImageIds: previousIds });
 */

import { ImageAnnotatorClient } from "@google-cloud/vision";
import { FieldValue } from "firebase-admin/firestore";
import { db } from "./firebaseAdmin";

// --- Types -------------------------------------------------------------------

export type SafeSearchCategory = "adult" | "violence" | "racy" | "spoof" | "medical";

export type Likelihood =
| "UNKNOWN"
| "VERY_UNLIKELY"
| "UNLIKELY"
| "POSSIBLE"
| "LIKELY"
| "VERY_LIKELY";

export interface ImageViolation {
imageId:    string;
category:   SafeSearchCategory;
likelihood: Likelihood;
}

export interface SafeSearchResult {
/** True when all images pass the safety threshold. */
safe:         boolean;
/** How many images were actually sent to Vision API this run (cache hits excluded). */
checkedCount: number;
/** How many images were served from the Firestore cache. */
cachedCount:  number;
/** How many images were skipped because they existed in the previous content (diff). */
skippedCount: number;
violations:   ImageViolation[];
}

export interface SafeSearchCheckOptions {
/**
 * imageIds from the previously published project content.
 * Images whose IDs are in this set are assumed unchanged and skipped entirely.
 * Obtain via extractImageIds(publishedProjectContent).
 */
previousImageIds?: Set<string>;
}

// --- Configuration -----------------------------------------------------------

/** Categories that trigger a block. "racy" excluded to avoid false positives on swimwear etc. */
const BLOCKED_CATEGORIES: SafeSearchCategory[] = ["adult", "violence"];

/** Minimum likelihood to trigger a block. POSSIBLE and below are allowed. */
const BLOCK_THRESHOLD: Likelihood = "LIKELY";

/** Hard cap on images checked per project (cost + latency guard). */
const MAX_IMAGES_TO_CHECK = 50;

/** Vision API batch size limit. */
const VISION_BATCH_SIZE = 16;

/** Firestore collection where per-image SafeSearch results are cached. */
const CACHE_COLLECTION = "safesearch_cache";

const LIKELIHOOD_RANK: Record<Likelihood, number> = {
UNKNOWN:       0,
VERY_UNLIKELY: 1,
UNLIKELY:      2,
POSSIBLE:      3,
LIKELY:        4,
VERY_LIKELY:   5,
};

const NUMERIC_TO_LIKELIHOOD: Record<number, Likelihood> = {
0: "UNKNOWN",
1: "VERY_UNLIKELY",
2: "UNLIKELY",
3: "POSSIBLE",
4: "LIKELY",
5: "VERY_LIKELY",
};

// --- Image extraction --------------------------------------------------------

interface ImageEntry {
imageId: string;
/** Best URL to use for Vision API (prefer "middle" variant). */
url:     string;
}

/**
 * Extracts unique image entries (imageId + best URL) from project content.
 * Matches both public (/o/images%2F) and private (/o/users%2F.../images%2F) paths.
 */
function extractEntries(content: unknown): ImageEntry[] {
const json = JSON.stringify(content);
const urlPattern =
/"(https:\/\/firebasestorage\.googleapis\.com\/v0\/b\/[^"]+(?:\/|%2F)images%2F[^"]+)"/g;

const byId = new Map<string, { middle?: string; fallback: string }>();

let m: RegExpExecArray | null;
while ((m = urlPattern.exec(json)) !== null) {
const url = m[1];
const idMatch = url.match(/(?:\/|%2F)images%2F([^%"/]+)%2F/);
if (!idMatch) continue;

const imageId = idMatch[1];
const existing = byId.get(imageId);

if (url.includes("middle")) {
byId.set(imageId, { middle: url, fallback: existing?.fallback ?? url });
} else if (!existing) {
byId.set(imageId, { fallback: url });
}
}

const entries: ImageEntry[] = [];
for (const [imageId, { middle, fallback }] of byId) {
entries.push({ imageId, url: middle ?? fallback });
}
return entries;
}

/**
 * Extracts just the set of imageIds from content.
 * Use this in the republish flow to get previousImageIds from the published project.
 */
export function extractImageIds(content: unknown): Set<string> {
return new Set(extractEntries(content).map((e) => e.imageId));
}

// --- Likelihood helpers -------------------------------------------------------

function normaliseLikelihood(raw: unknown): Likelihood {
if (typeof raw === "string" && raw in LIKELIHOOD_RANK) return raw as Likelihood;
if (typeof raw === "number" && raw in NUMERIC_TO_LIKELIHOOD) return NUMERIC_TO_LIKELIHOOD[raw];
return "UNKNOWN";
}

function isBlocked(likelihood: Likelihood): boolean {
return LIKELIHOOD_RANK[likelihood] >= LIKELIHOOD_RANK[BLOCK_THRESHOLD];
}

// --- Firestore cache ----------------------------------------------------------

interface CacheEntry {
safe:           boolean;
categoryScores: Partial<Record<SafeSearchCategory, Likelihood>>;
}

/** Reads cache entries for multiple imageIds in one getAll call. */
async function readCache(imageIds: string[]): Promise<Map<string, CacheEntry>> {
if (imageIds.length === 0) return new Map();

const refs = imageIds.map((id) => db.collection(CACHE_COLLECTION).doc(id));
const snaps = await db.getAll(...refs);

const result = new Map<string, CacheEntry>();
for (const snap of snaps) {
if (snap.exists) {
result.set(snap.id, snap.data() as CacheEntry);
}
}
return result;
}

/** Writes a batch of cache entries atomically. */
async function writeCache(entries: Array<{ imageId: string; entry: CacheEntry }>): Promise<void> {
if (entries.length === 0) return;
const batch = db.batch();
for (const { imageId, entry } of entries) {
batch.set(db.collection(CACHE_COLLECTION).doc(imageId), {
...entry,
checkedAt: FieldValue.serverTimestamp(),
});
}
await batch.commit();
}

// --- Vision API ---------------------------------------------------------------

/**
 * Sends one batch (up to VISION_BATCH_SIZE images) to batchAnnotateImages.
 * Returns a map of imageId -> CacheEntry.
 */
async function checkBatch(
client:  ImageAnnotatorClient,
entries: ImageEntry[],
): Promise<Map<string, CacheEntry>> {
const [response] = await client.batchAnnotateImages({
requests: entries.map((e) => ({
image:    { source: { imageUri: e.url } },
features: [{ type: "SAFE_SEARCH_DETECTION" as const }],
})),
});

const results = new Map<string, CacheEntry>();

for (let i = 0; i < entries.length; i++) {
const { imageId } = entries[i];
const annotation = response.responses?.[i]?.safeSearchAnnotation;

if (!annotation) {
// No annotation returned - treat as safe to avoid false blocks.
results.set(imageId, { safe: true, categoryScores: {} });
continue;
}

const categoryScores: Partial<Record<SafeSearchCategory, Likelihood>> = {};
let safe = true;

for (const category of BLOCKED_CATEGORIES) {
const likelihood = normaliseLikelihood(annotation[category]);
categoryScores[category] = likelihood;
if (isBlocked(likelihood)) safe = false;
}

results.set(imageId, { safe, categoryScores });
}

return results;
}

// --- Public API ---------------------------------------------------------------

/**
 * Runs SafeSearch on all images in project content with caching and batching.
 *
 * @param content                  - Raw project `content` field from Firestore.
 * @param options.previousImageIds - imageIds from the previously published version.
 *                                   Images whose IDs appear here are skipped (republish diff).
 */
export async function runSafeSearchCheck(
content: unknown,
options?: SafeSearchCheckOptions,
): Promise<SafeSearchResult> {
const allEntries = extractEntries(content).slice(0, MAX_IMAGES_TO_CHECK);

if (allEntries.length === 0) {
return { safe: true, checkedCount: 0, cachedCount: 0, skippedCount: 0, violations: [] };
}

// 1. Diff: exclude images that have not changed since last publish
const previousImageIds = options?.previousImageIds ?? new Set<string>();
const toCheck      = allEntries.filter((e) => !previousImageIds.has(e.imageId));
const skippedCount = allEntries.length - toCheck.length;

if (toCheck.length === 0) {
return { safe: true, checkedCount: 0, cachedCount: 0, skippedCount, violations: [] };
}

// 2. Cache: split into hits and misses
const cached      = await readCache(toCheck.map((e) => e.imageId));
const cacheHits   = toCheck.filter((e) =>  cached.has(e.imageId));
const cacheMisses = toCheck.filter((e) => !cached.has(e.imageId));
const cachedCount = cacheHits.length;

// 3. Vision API: check uncached images in batches
const freshResults = new Map<string, CacheEntry>();

if (cacheMisses.length > 0) {
		const client  = new ImageAnnotatorClient();
const batches: ImageEntry[][] = [];

for (let i = 0; i < cacheMisses.length; i += VISION_BATCH_SIZE) {
batches.push(cacheMisses.slice(i, i + VISION_BATCH_SIZE));
}

// Run all batches in parallel.
const batchMaps = await Promise.all(batches.map((b) => checkBatch(client, b)));
for (const batchMap of batchMaps) {
for (const [id, entry] of batchMap) freshResults.set(id, entry);
}

// Persist to cache - fire-and-forget, non-fatal.
writeCache(
[...freshResults.entries()].map(([imageId, entry]) => ({ imageId, entry })),
).catch(() => { /* intentionally ignored */ });
}

// 4. Collect violations from all checked images
const violations: ImageViolation[] = [];

for (const { imageId } of toCheck) {
const entry = freshResults.get(imageId) ?? cached.get(imageId);
if (!entry || entry.safe) continue;

for (const category of BLOCKED_CATEGORIES) {
const likelihood = entry.categoryScores[category] ?? "UNKNOWN";
if (isBlocked(likelihood)) {
violations.push({ imageId, category, likelihood });
}
}
}

return {
safe:         violations.length === 0,
checkedCount: cacheMisses.length,
cachedCount,
skippedCount,
violations,
};
}
