import { getStorage } from "firebase-admin/storage";
import { db } from "../lib/firebaseAdmin";
import { logger } from "firebase-functions/v2";
import * as os from "os";
import * as fs from "fs";
import * as path from "path";
import { randomBytes } from "crypto";
import sharp from "sharp";

const OG_WIDTH = 1200;
const OG_HEIGHT = 630;

function extractCoverUrl(content: Record<string, unknown> | null, mode: string): string | null {
	if (!content) return null;
	const imageContent = content.imageContent as Record<string, unknown> | undefined;
	if (!imageContent) return null;

	if (mode === "photobook") {
		const cover = imageContent.cover as { value?: { asset?: { src?: string } } } | undefined;
		return cover?.value?.asset?.src ?? null;
	}
	if (mode === "portfolio") {
		const hero = imageContent.hero as { value?: { asset?: { src?: string } } } | undefined;
		const bio = imageContent.bio as { value?: { asset?: { src?: string } } } | undefined;
		return hero?.value?.asset?.src ?? bio?.value?.asset?.src ?? null;
	}
	return null;
}

/**
 * Downloads the project cover image, resizes it to 1200×630, uploads it to
 * Firebase Storage at `og/{projectId}.jpg` and saves a download-token URL to
 * `published_projects/{projectId}.ogImageUrl`.
 *
 * Callers should `await` this (ideally via `generateAndStoreOgImageBounded`)
 * so `ogImageUrl` is populated before the publish response is returned —
 * otherwise a link shared immediately after publish has no OG image yet and
 * messaging apps (WhatsApp/Telegram) may render it as plain text.
 */
export async function generateAndStoreOgImage(
	projectId: string,
	mode: string,
	content: Record<string, unknown> | null,
): Promise<void> {
	const coverUrl = extractCoverUrl(content, mode);
	if (!coverUrl) {
		logger.info(`[ogImage] No cover image for ${projectId} (mode=${mode}), skipping.`);
		return;
	}

	const response = await fetch(coverUrl, { signal: AbortSignal.timeout(10_000) });
	if (!response.ok) {
		logger.warn(`[ogImage] Failed to fetch cover for ${projectId}: HTTP ${response.status}`);
		return;
	}

	const buffer = Buffer.from(await response.arrayBuffer());
	const tempFile = path.join(os.tmpdir(), `og_${projectId}_${Date.now()}.jpg`);

	try {
		await sharp(buffer)
			.resize(OG_WIDTH, OG_HEIGHT, { fit: "cover", position: "centre" })
			// JPEG, not WebP — Telegram's link-preview crawler frequently fails to
			// render (or outright rejects) image/webp og:image files.
			.jpeg({ quality: 85 })
			.toFile(tempFile);

		const bucket = getStorage().bucket();
		const storagePath = `og/${projectId}.jpg`;

		await bucket.upload(tempFile, {
			destination: storagePath,
			metadata: { contentType: "image/jpeg" },
		});

		// Use a download token instead of makePublic() — makePublic() fails when
		// Uniform Bucket-Level Access (UBLA) is enabled on the bucket.
		const file = bucket.file(storagePath);
		const [meta] = await file.getMetadata();
		const existingToken = (meta.metadata as Record<string, string> | undefined)
			?.firebaseStorageDownloadTokens;
		const token = existingToken ?? randomBytes(16).toString("hex");
		if (!existingToken) {
			await file.setMetadata({ metadata: { firebaseStorageDownloadTokens: token } });
		}
		const encodedPath = storagePath.split("/").map(encodeURIComponent).join("%2F");
		const ogImageUrl = `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/${encodedPath}?alt=media&token=${token}`;

		await db.collection("published_projects").doc(projectId).update({ ogImageUrl });
		logger.info(`[ogImage] Stored OG image for ${projectId}: ${ogImageUrl}`);
	} finally {
		if (fs.existsSync(tempFile)) fs.unlinkSync(tempFile);
	}
}

/**
 * Awaits `generateAndStoreOgImage` but never blocks the caller for more than
 * `timeoutMs`. In the common case (fast network) this lets the publish
 * response wait for `ogImageUrl` to be ready, so a link shared immediately
 * after publish already has a working preview. If generation is slow, it
 * keeps running in the background and the publish response is not delayed
 * further.
 */
export async function generateAndStoreOgImageBounded(
	projectId: string,
	mode: string,
	content: Record<string, unknown> | null,
	timeoutMs = 8_000,
): Promise<void> {
	const task = generateAndStoreOgImage(projectId, mode, content);
	let timer: ReturnType<typeof setTimeout> | undefined;
	const timeout = new Promise<void>((resolve) => {
		timer = setTimeout(resolve, timeoutMs);
	});
	try {
		await Promise.race([task, timeout]);
	} finally {
		clearTimeout(timer);
	}
	// Ensure a slow/failed generation still gets logged even after the race.
	task.catch((err) => {
		logger.warn(`[ogImage] Background OG image generation failed for ${projectId}:`, err);
	});
}
