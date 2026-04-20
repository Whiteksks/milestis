import { db } from "../lib/firebaseAdmin";
import { PUBLISHED_PROJECT_SLUGS_COLLECTION } from "./publish/slug";

export {
  buildStorageUsedBytesReleaseUpdate,
  deleteProjectImageDocs,
  projectHasPrivateMedia,
} from "./projectStorageAccounting";

export async function deleteProjectSlugReservations(projectId: string): Promise<number> {
  const reservationsSnap = await db
    .collection(PUBLISHED_PROJECT_SLUGS_COLLECTION)
    .where("projectId", "==", projectId)
    .get();

  if (reservationsSnap.empty) return 0;

  const batch = db.batch();
  for (const reservationDoc of reservationsSnap.docs) {
    batch.delete(reservationDoc.ref);
  }
  await batch.commit();

  return reservationsSnap.size;
}
