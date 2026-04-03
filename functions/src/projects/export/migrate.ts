import { getStorage } from "firebase-admin/storage";
import { logger } from "firebase-functions/v2";
import { randomBytes } from "crypto";

// ─── Types ───────────────────────────────────────────────────────────────────

export interface MigrateResult {
	/** old Firebase Storage download URL → new public Firebase Storage download URL */
	urlMapping: Map<string, string>;
	/** Bytes freed from the user's private quota (users/ files only). */
	freedBytes: number;
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
 * Extracts all Firebase Storage URLs from a JSON string that belong to this
 * project — private (users/), previous exports (exports/), or already public.
 * Returns a map of originalUrl → storagePath.
 */
function extractProjectUrls(
	contentJson: string,
	uid: string,
	projectId: string,
): Map<string, string> {
	const result = new Map<string, string>();
	const prefixes = [
		`users/${uid}/projects/${projectId}/`,
		`exports/${uid}/${projectId}/`,
		`public/${projectId}/`,
	];
	const re = /"(https:\/\/firebasestorage\.googleapis\.com\/v0\/b\/[^"\\]+)"/g;
	let m: RegExpExecArray | null;
	while ((m = re.exec(contentJson)) !== null) {
		const url = m[1];
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
	const urlToPath = extractProjectUrls(contentJson, uid, projectId);
	const urlMapping = new Map<string, string>();
	let freedBytes = 0;

	const usersPrefix = `users/${uid}/projects/${projectId}/`;
	const publicPrefix = `public/${projectId}/`;

	// Track which public paths we write so we can prune orphans afterwards.
	// We must NOT delete public files upfront: on re-export the sources are
	// already in public/ and would vanish before we copy them.
	const newPublicPaths = new Set<string>();

	// ── Pass 1: content-referenced files ────────────────────────────────────
	// Build urlMapping for every URL found in the editor content JSON.
	// These are the URLs that need to be rewritten in the content doc.
	for (const [oldUrl, oldPath] of urlToPath) {
		let relativePath: string;
		if (oldPath.startsWith(usersPrefix)) {
			relativePath = oldPath.slice(usersPrefix.length);
		} else if (oldPath.startsWith(publicPrefix)) {
			relativePath = oldPath.slice(publicPrefix.length);
		} else {
			// exports/{uid}/{projectId}/{exportId}/{relative} — strip the exportId segment.
			const afterProject = oldPath.slice(`exports/${uid}/${projectId}/`.length);
			relativePath = afterProject.replace(/^[^/]+\//, "");
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

	// ── Pass 2: full private folder scan ────────────────────────────────────
	// Some variants (e.g. middle.webp) may be stored only in Firestore images
	// collection and not directly referenced in the editor content JSON.
	// Copy everything under usersPrefix so ALL variants end up in public/.
	try {
		const [privateFiles] = await bucket.getFiles({ prefix: usersPrefix });
		await Promise.all(
			privateFiles.map(async (file) => {
				const relativePath = file.name.slice(usersPrefix.length);
				const newPath = `${publicPrefix}${relativePath}`;
				if (newPublicPaths.has(newPath)) return; // already handled in pass 1
				try {
					await file.copy(bucket.file(newPath));
					newPublicPaths.add(newPath);
					// Count bytes freed for quota tracking.
					try {
						const [meta] = await file.getMetadata();
						const size =
							typeof meta.size === "string"
								? parseInt(meta.size, 10)
								: (meta.size as number | undefined) ?? 0;
						if (!isNaN(size)) freedBytes += size;
					} catch {
						// ignore
					}
				} catch (err) {
					logger.warn(`[migrate] Pass 2: failed to copy ${file.name} → ${newPath}`, err);
				}
			}),
		);
	} catch (err) {
		logger.warn("[migrate] Pass 2 full-folder scan failed — skipping", err);
	}

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

	return { urlMapping, freedBytes };
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
