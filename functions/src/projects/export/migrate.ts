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

	// Track which public paths we write during this migration so we can prune
	// orphaned files (images removed from the project) at the end — AFTER all
	// copies succeed.  We must NOT delete upfront because on a re-export the
	// sources are already in public/ and would vanish before the copy loop runs.
	const newPublicPaths = new Set<string>();

	for (const [oldUrl, oldPath] of urlToPath) {
		// Derive the relative path within the project folder.
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
				// Source is in private storage — copy it to public.
				await bucket.file(oldPath).copy(bucket.file(newPath));
			}
			// Source is already in public/ (re-export) — file is already at newPath,
			// nothing to copy.  Just ensure it has a download token below.
			const token = await ensureDownloadToken(bucket, newPath);
			urlMapping.set(oldUrl, makeDownloadUrl(bucketName, newPath, token));
			newPublicPaths.add(newPath);

			// Track bytes freed from the user's private quota only.
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

	// Prune orphaned public media: files that existed from a previous export but
	// are no longer referenced in the current content.  The rendered export file
	// lives under public/{id}/exports/ and must be preserved — skip that prefix.
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
 * Call this after a successful export to free the user's quota.
 */
export async function deletePrivateProjectMedia(
	uid: string,
	projectId: string,
	contentJson: string,
): Promise<void> {
	const bucket = getStorage().bucket();
	const usersPrefix = `users/${uid}/projects/${projectId}/`;
	const urlToPath = extractProjectUrls(contentJson, uid, projectId);

	const privatePaths = Array.from(urlToPath.values()).filter((p) =>
		p.startsWith(usersPrefix),
	);

	await Promise.all(
		privatePaths.map((p) =>
			bucket
				.file(p)
				.delete()
				.catch((err) => {
					logger.warn(`[migrate] Failed to delete private file ${p}`, err);
				}),
		),
	);
}
