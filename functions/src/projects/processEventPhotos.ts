import { onObjectFinalized } from "firebase-functions/v2/storage";
import { logger } from "firebase-functions/v2";
import { FieldValue } from "firebase-admin/firestore";
import { getStorage } from "firebase-admin/storage";
import { ImageAnnotatorClient } from "@google-cloud/vision";
import { randomUUID } from "node:crypto";
import * as os from "node:os";
import * as path from "node:path";
import * as fs from "node:fs";
import sharp from "sharp";
import { db } from "../lib/firebaseAdmin";

// ─── SafeSearch configuration ─────────────────────────────────────────────────

const BLOCKED_CATEGORIES = ["adult", "violence"] as const;
const BLOCK_THRESHOLD_RANK = 4;

const LIKELIHOOD_RANK: Record<string, number> = {
  UNKNOWN: 0, VERY_UNLIKELY: 1, UNLIKELY: 2, POSSIBLE: 3, LIKELY: 4, VERY_LIKELY: 5,
  "0": 0, "1": 1, "2": 2, "3": 3, "4": 4, "5": 5,
};

function toLikelihoodRank(value: unknown): number {
  if (typeof value === "number") return LIKELIHOOD_RANK[String(value)] ?? 0;
  if (typeof value === "string") return LIKELIHOOD_RANK[value] ?? 0;
  return 0;
}

// ─── Resize helpers ───────────────────────────────────────────────────────────

async function uploadResized(
  bucketName: string,
  srcPath: string,   // local tmp file
  destPath: string,  // GCS destination
  contentType: "image/webp",
): Promise<string> {
  const token = randomUUID();
  const bucket = getStorage().bucket(bucketName);
  await bucket.upload(srcPath, {
    destination: destPath,
    metadata: {
      contentType,
      metadata: { firebaseStorageDownloadTokens: token },
    },
  });
  const encoded = encodeURIComponent(destPath);
  return `https://firebasestorage.googleapis.com/v0/b/${bucketName}/o/${encoded}?alt=media&token=${token}`;
}

async function resizeEventPhoto(
  bucketName: string,
  filePath: string,
  photoId: string,
): Promise<{ thumbUrl: string; fullUrl: string } | null> {
  const bucket = getStorage().bucket(bucketName);
  const tmpInput = path.join(os.tmpdir(), `evt_${Date.now()}_input`);
  const tmpThumb = path.join(os.tmpdir(), `evt_${Date.now()}_thumb.webp`);
  const tmpFull  = path.join(os.tmpdir(), `evt_${Date.now()}_full.webp`);

  try {
    await bucket.file(filePath).download({ destination: tmpInput });

    const folder = filePath.split("/").slice(0, -1).join("/");

    // Thumb: 800px wide, quality 80 (for masonry grid)
    await sharp(tmpInput)
      .resize(800, undefined, { fit: "inside", withoutEnlargement: true })
      .toFormat("webp", { quality: 80 })
      .toFile(tmpThumb);

    // Full: 1600px wide, quality 85 (for lightbox / download)
    await sharp(tmpInput)
      .resize(1600, undefined, { fit: "inside", withoutEnlargement: true })
      .toFormat("webp", { quality: 85 })
      .toFile(tmpFull);

    const [thumbUrl, fullUrl] = await Promise.all([
      uploadResized(bucketName, tmpThumb, `${folder}/${photoId}-thumb.webp`, "image/webp"),
      uploadResized(bucketName, tmpFull,  `${folder}/${photoId}-full.webp`,  "image/webp"),
    ]);

    return { thumbUrl, fullUrl };
  } catch (err) {
    logger.error("processEventPhotos: resize failed", { photoId, err });
    return null;
  } finally {
    for (const f of [tmpInput, tmpThumb, tmpFull]) {
      if (fs.existsSync(f)) fs.unlinkSync(f);
    }
  }
}

// ─── Cloud Function ───────────────────────────────────────────────────────────

export const processEventPhotos = onObjectFinalized(
  {
    timeoutSeconds: 120,
    memory: "512MiB",   // Sharp needs headroom for large HEIC/JPEG originals
    maxInstances: 30,
  },
  async (event) => {
    const filePath   = event.data.name;
    const bucketName = event.data.bucket;

    if (!filePath?.startsWith("events/")) return;

    const parts = filePath.split("/");
    if (parts.length !== 3) return;

    const projectId = parts[1];
    const fileName  = parts[2];
    const dotIndex  = fileName.lastIndexOf(".");
    const photoId   = dotIndex > 0 ? fileName.slice(0, dotIndex) : fileName;

    // Ignore files we generated ourselves (thumb / full variants)
    if (photoId.endsWith("-thumb") || photoId.endsWith("-full")) return;

    // ── Idempotency ───────────────────────────────────────────────────────
    const projectRef = db.collection("projects").doc(projectId);
    const photoRef   = projectRef.collection("eventPhotos").doc(photoId);

    const photoSnap = await photoRef.get();
    if (!photoSnap.exists) {
      logger.warn("processEventPhotos: no Firestore record", { projectId, photoId });
      return;
    }
    if (photoSnap.data()?.status !== "pending") return;

    // ── SafeSearch ────────────────────────────────────────────────────────
    const client = new ImageAnnotatorClient();
    let safe = true;
    const violations: string[] = [];

    try {
      const [result] = await client.annotateImage({
        image:    { source: { imageUri: `gs://${bucketName}/${filePath}` } },
        features: [{ type: "SAFE_SEARCH_DETECTION" as const }],
      });

      const annotation = result.safeSearchAnnotation;
      if (annotation) {
        for (const category of BLOCKED_CATEGORIES) {
          const rank = toLikelihoodRank(annotation[category]);
          if (rank >= BLOCK_THRESHOLD_RANK) {
            safe = false;
            violations.push(category);
          }
        }
      }
    } catch (err) {
      logger.error("processEventPhotos: Vision API error", { projectId, photoId, err });
      return;
    }

    const status = safe ? "approved" : "rejected";

    // ── Resize (approved only) ────────────────────────────────────────────
    let resizeUrls: { thumbUrl: string; fullUrl: string } | null = null;
    if (safe) {
      resizeUrls = await resizeEventPhoto(bucketName, filePath, photoId);
    }

    // ── Counters ──────────────────────────────────────────────────────────
    const updateData: Record<string, unknown> = {
      status,
      reviewedAt: FieldValue.serverTimestamp(),
    };
    if (!safe) updateData.violations = violations;
    if (resizeUrls) {
      updateData.thumbUrl = resizeUrls.thumbUrl;
      updateData.fullUrl  = resizeUrls.fullUrl;
    }

    const batch = db.batch();
    batch.update(photoRef, updateData);
    batch.update(projectRef, {
      "eventConfig.pendingCount":  FieldValue.increment(-1),
      ...(safe ? { "eventConfig.approvedCount": FieldValue.increment(1) } : {}),
      updatedAt: FieldValue.serverTimestamp(),
    });

    await batch.commit();

    logger.info("processEventPhotos: done", {
      projectId,
      photoId,
      status,
      resized: resizeUrls !== null,
    });
  },
);