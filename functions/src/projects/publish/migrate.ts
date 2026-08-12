import { getStorage } from "firebase-admin/storage";
import { logger } from "firebase-functions/v2";
import { randomBytes } from "crypto";
import { db } from "../../lib/firebaseAdmin";

// ─── Types ───────────────────────────────────────────────────────────────────

export interface MigrateResult {
	/** old Firebase Storage download URL → new public Firebase Storage download URL */
	urlMapping: Map<string, string>;
	/** Bytes freed from the user's private quota (users/ files only). */
	freedBytes: number;
	/** imageIds confirmed referenced in the editor content — anything else in the
	 *  `images` collection for this project is an unplaced/orphaned upload. */
	usedImageIds: Set<string>;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function extractStoragePath(url: string): string | null {
	try {
		const parsed = new URL(url);
		const match = parsed.pathname.match(/\/v0\/b\/[^/]+\/o\/(.+)/);
		if (!match) return null;
		return decodeURIComponent(match[1]);
	} catch {
		return null;
	}
}

function makeDownloadUrl(bucketName: string, filePath: string, token: string): string {
	const encoded = filePath.split("/").map(encodeURIComponent).join("%2F");
	return `https://firebasestorage.googleapis.com/v0/b/${bucketName}/o/${encoded}?alt=media&token=${token}`;
}

async function ensureDownloadToken(
	bucket: ReturnType<ReturnType<typeof getStorage>["bucket"]>,
	filePath: string,
): Promise<string> {
	const file = bucket.file(filePath);
	const [meta] = await file.getMetadata();
	const existing = (meta.metadata as Record<string, string> | undefined)
		?.firebaseStorageDownloadTokens;
	if (existing) return existing;
	const token = randomBytes(16).toString("hex");
	await file.setMetadata({ metadata: { firebaseStorageDownloadTokens: token } });
	return token;
}

/**
 * Extracts Storage URLs referenced in contentJson that live under exports/ or
 * public/ prefixes — previous export artifacts or already-public URLs from an
 * earlier publish. Photo URLs are handled separately via the images collection
 * (see migrateProjectMedia) so the used/orphan decision never depends on
 * reverse-parsing a path out of a regex match.
 */
function extractOtherProjectUrls(
	contentJson: string,
	uid: string,
	projectId: string,
	exclude: Set<string>,
): Map<string, string> {
	const result = new Map<string, string>();
	const prefixes = [`exports/${uid}/${projectId}/`, `public/${projectId}/`];
	const re = /"(https:\/\/firebasestorage\.googleapis\.com\/v0\/b\/[^"\\]+)"/g;
	let m: RegExpExecArray | null;
	while ((m = re.exec(contentJson)) !== null) {
		const url = m[1];
		if (exclude.has(url)) continue;
		const path = extractStoragePath(url);
		if (path && prefixes.some((p) => path.startsWith(p))) {
			result.set(url, path);
		}
	}
	return result;
}

// ─── Public API ───────────────────────────────────────────────────────────────

/**
 * Copies all project media files from private storage (users/) to the public
 * storage area (public/{projectId}/).
 *
 * Returns a URL mapping (old URL → new public download URL) and the number of
 * bytes freed from the user's quota.
 *
 * Does NOT delete the originals — call `deletePrivateProjectMedia()` after a
 * successful render to avoid data loss on early failures.
 */
export async function migrateProjectMedia(
	uid: string,
	projectId: string,
	contentJson: string,
): Promise<MigrateResult> {
	const bucket = getStorage().bucket();
	const bucketName = bucket.name;
	const urlMapping = new Map<string, string>();
	const usedImageIds = new Set<string>();
	let freedBytes = 0;

	const usersPrefix = `users/${uid}/projects/${projectId}/`;
	const publicPrefix = `public/${projectId}/`;

	// Track which public paths we write so we can prune orphans afterwards.
	// We must NOT delete public files upfront: on re-export the sources are
	// already in public/ and would vanish before we copy them.
	const newPublicPaths = new Set<string>();

	async function migrateFile(oldUrl: string): Promise<void> {
		if (urlMapping.has(oldUrl)) return;
		const oldPath = extractStoragePath(oldUrl);
		if (!oldPath) return;

		let relativePath: string;
		if (oldPath.startsWith(usersPrefix)) {
			relativePath = oldPath.slice(usersPrefix.length);
		} else if (oldPath.startsWith(publicPrefix)) {
			relativePath = oldPath.slice(publicPrefix.length);
		} else if (oldPath.startsWith(`exports/${uid}/${projectId}/`)) {
			// exports/{uid}/{projectId}/{exportId}/{relative} — strip the exportId segment.
			const afterProject = oldPath.slice(`exports/${uid}/${projectId}/`.length);
			relativePath = afterProject.replace(/^[^/]+\//, "");
		} else {
			return; // not this project's own storage — ignore defensively
		}

		const newPath = `${publicPrefix}${relativePath}`;
		try {
			if (!oldPath.startsWith(publicPrefix)) {
				await bucket.file(oldPath).copy(bucket.file(newPath));
			}
			const token = await ensureDownloadToken(bucket, newPath);
			urlMapping.set(oldUrl, makeDownloadUrl(bucketName, newPath, token));
			newPublicPaths.add(newPath);

			if (oldPath.startsWith(usersPrefix)) {
				try {
					const [meta] = await bucket.file(oldPath).getMetadata();
					const size =
						typeof meta.size === "string"
							? parseInt(meta.size, 10)
							: (meta.size as number | undefined) ?? 0;
					if (!isNaN(size)) freedBytes += size;
				} catch {
					// Size unknown — approximate is fine.
				}
			}
		} catch (err) {
			logger.warn(`[migrate] Failed to migrate ${oldPath} → ${newPath}`, err);
		}
	}

	// ── Pass 1: images collection — ground truth for this project's uploaded photos ──
	// A photo is "used" iff one of its own known variant URLs (straight from Firestore,
	// not reconstructed) literally appears in the editor content JSON. This is what
	// decides whether the doc — and its private files — survive publish, so it must
	// never depend on regex-reverse-parsing a path out of an arbitrary URL string.
	const imagesSnap = await db
		.collection("images")
		.where("projectId", "==", projectId)
		.where("ownerId", "==", uid)
		.get();

	for (const imageDoc of imagesSnap.docs) {
		const data = imageDoc.data() as { urls?: Record<string, string> };
		const variantUrls = Object.values(data.urls ?? {}).filter((u): u is string => !!u);
		if (variantUrls.length === 0) continue;
		if (!variantUrls.some((url) => contentJson.includes(url))) continue;
		usedImageIds.add(imageDoc.id);

		// Migrate every variant we know about, then broaden to a prefix scan so
		// variants missing from the `urls` field (or added out of band) aren't left behind.
		await Promise.all(variantUrls.map(migrateFile));
		try {
			const imagePrefix = `${usersPrefix}images/${imageDoc.id}/`;
			const [variantFiles] = await bucket.getFiles({ prefix: imagePrefix });
			await Promise.all(
				variantFiles.map(async (file) => {
					const newPath = `${publicPrefix}${file.name.slice(usersPrefix.length)}`;
					if (newPublicPaths.has(newPath)) return; // already handled above
					try {
						const [oldMeta] = await file.getMetadata();
						const oldToken = (oldMeta.metadata as Record<string, string> | undefined)
							?.firebaseStorageDownloadTokens;

						await file.copy(bucket.file(newPath));
						newPublicPaths.add(newPath);

						const newToken = await ensureDownloadToken(bucket, newPath);
						const newUrl = makeDownloadUrl(bucketName, newPath, newToken);
						if (oldToken) {
							urlMapping.set(makeDownloadUrl(bucketName, file.name, oldToken), newUrl);
						}

						const size =
							typeof oldMeta.size === "string"
								? parseInt(oldMeta.size, 10)
								: (oldMeta.size as number | undefined) ?? 0;
						if (!isNaN(size)) freedBytes += size;
					} catch (err) {
						logger.warn(`[migrate] Failed to copy ${file.name} → ${newPath}`, err);
					}
				}),
			);
		} catch (err) {
			logger.warn(`[migrate] Failed to scan variants for imageId ${imageDoc.id}`, err);
		}
	}

	// ── Pass 2: anything else referenced in content under exports/ or public/ ──
	// (previous export artifacts, or URLs already migrated by an earlier publish).
	const otherUrls = extractOtherProjectUrls(contentJson, uid, projectId, new Set(urlMapping.keys()));
	await Promise.all([...otherUrls.keys()].map(migrateFile));

	// ── Prune orphans ────────────────────────────────────────────────────────
	// Delete public files from a previous export that are no longer in use.
	// The rendered export file lives under public/{id}/exports/ — preserve it.
	try {
		const [existingFiles] = await bucket.getFiles({ prefix: publicPrefix });
		const exportsSubdir = `${publicPrefix}exports/`;
		await Promise.all(
			existingFiles
				.filter((f) => !f.name.startsWith(exportsSubdir) && !newPublicPaths.has(f.name))
				.map((f) =>
					f.delete().catch((err) => {
						logger.warn(`[migrate] Failed to delete orphaned public file ${f.name}`, err);
					}),
				),
		);
	} catch (err) {
		logger.warn("[migrate] Orphan pruning failed — skipping", err);
	}

	return { urlMapping, freedBytes, usedImageIds };
}

/**
 * Deletes all project media from users/ private storage.
 * Uses a bucket prefix scan — not just content-referenced files — so that
 * all variants (middle.webp etc.) that aren't in the editor JSON are also removed.
 */
export async function deletePrivateProjectMedia(
	uid: string,
	projectId: string,
): Promise<void> {
	const bucket = getStorage().bucket();
	const usersPrefix = `users/${uid}/projects/${projectId}/`;
	try {
		await bucket.deleteFiles({ prefix: usersPrefix });
	} catch (err) {
		logger.warn(`[migrate] Failed to delete private files for ${projectId}`, err);
	}
}
