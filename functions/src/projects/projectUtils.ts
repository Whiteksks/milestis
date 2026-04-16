import { logger } from "firebase-functions/v2";
import { db } from "../lib/firebaseAdmin";

/**
 * Deletes all Firestore `images` documents for a given project and returns
 * the total number of storage bytes freed (sum of meta.generatedSizeBytes).
 *
 * Call this before deleting the project document so the image metadata is
 * still available for byte accounting.
 */
export async function deleteProjectImageDocs(
  projectId: string,
  logPrefix: string,
): Promise<number> {
  const imagesSnap = await db
    .collection("images")
    .where("projectId", "==", projectId)
    .get();

  if (imagesSnap.empty) return 0;

  let freedBytes = 0;
  const batch = db.batch();
  for (const imgDoc of imagesSnap.docs) {
    freedBytes += (imgDoc.data().meta?.generatedSizeBytes ?? 0) as number;
    batch.delete(imgDoc.ref);
  }
  await batch.commit();

  logger.info(
    `${logPrefix} Deleted ${imagesSnap.size} image doc(s) for project ${projectId}, freed ${freedBytes} bytes.`,
  );

  return freedBytes;
}
