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
 * Firebase Storage at `og/{projectId}.png` and saves a download-token URL to
 * `published_projects/{projectId}.ogImageUrl`.
 *
 * This is fire-and-forget — call with `.catch(...)` and never await in
 * the critical publish path.
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
	const tempFile = path.join(os.tmpdir(), `og_${projectId}_${Date.now()}.png`);

	try {
		await sharp(buffer)
			.resize(OG_WIDTH, OG_HEIGHT, { fit: "cover", position: "centre" })
			.png({ quality: 90 })
			.toFile(tempFile);

		const bucket = getStorage().bucket();
		const storagePath = `og/${projectId}.png`;

		await bucket.upload(tempFile, {
			destination: storagePath,
			metadata: { contentType: "image/png" },
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
