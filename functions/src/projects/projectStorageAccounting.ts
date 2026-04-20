import { FieldValue } from "firebase-admin/firestore";
import { getStorage } from "firebase-admin/storage";
import { logger } from "firebase-functions/v2";
import { db } from "../lib/firebaseAdmin";

export function buildStorageUsedBytesReleaseUpdate(freedBytes: number): Record<string, unknown> {
  return freedBytes > 0
    ? { "stats.storageUsedBytes": FieldValue.increment(-freedBytes) }
    : {};
}

export async function projectHasPrivateMedia(
  ownerId: string,
  projectId: string,
): Promise<boolean> {
  const bucket = getStorage().bucket();

  try {
    const [files] = await bucket.getFiles({
      prefix: `users/${ownerId}/projects/${projectId}/`,
      maxResults: 1,
      autoPaginate: false,
    });
    return files.length > 0;
  } catch (err) {
    logger.warn(
      `[projectStorageAccounting] Failed to inspect private media for ${projectId}; defaulting to quota release for safety.`,
      err,
    );
    return true;
  }
}

/**
 * Deletes all Firestore `images` documents for a given project and optionally
 * returns the total number of storage bytes to release from user quota.
 */
export async function deleteProjectImageDocs(
  projectId: string,
  logPrefix: string,
  options?: { countFreedBytes?: boolean },
): Promise<number> {
  const imagesSnap = await db
    .collection("images")
    .where("projectId", "==", projectId)
    .get();

  if (imagesSnap.empty) return 0;

  const countFreedBytes = options?.countFreedBytes ?? true;
  let freedBytes = 0;
  const batch = db.batch();

  for (const imgDoc of imagesSnap.docs) {
    if (countFreedBytes) {
      freedBytes += (imgDoc.data().meta?.generatedSizeBytes ?? 0) as number;
    }
    batch.delete(imgDoc.ref);
  }
  await batch.commit();

  logger.info(
    `${logPrefix} Deleted ${imagesSnap.size} image doc(s) for project ${projectId}, ${countFreedBytes ? `freed ${freedBytes}` : "skipped quota decrement for"} bytes.`,
  );

  return freedBytes;
}