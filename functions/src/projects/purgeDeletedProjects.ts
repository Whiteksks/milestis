import { onSchedule } from "firebase-functions/v2/scheduler";
import { logger } from "firebase-functions/v2";
import { Timestamp, FieldValue } from "firebase-admin/firestore";
import { getStorage } from "firebase-admin/storage";
import { db } from "../lib/firebaseAdmin";
import {
  buildStorageUsedBytesReleaseUpdate,
  deleteProjectImageDocs,
  deleteProjectSlugReservations,
  projectHasPrivateMedia,
} from "./projectUtils";

/**
 * Runs at 00:00 UTC on the 1st of every month.
 * Permanently deletes all projects where:
 *   - status == 'deleted'
 *   - purgeAt <= now()
 *
 * Also removes:
 *   - All Firestore 'images' documents for the project
 *   - All Storage files under users/{ownerId}/projects/{projectId}/
 */
export const purgeDeletedProjects = onSchedule(
  {
    schedule: "0 0 1 * *",
    timeZone: "UTC",
    timeoutSeconds: 540,
    memory: "256MiB",
  },
  async () => {
    const now = Timestamp.now();

    const snapshot = await db
      .collection("projects")
      .where("status", "==", "deleted")
      .where("purgeAt", "<=", now)
      .get();

    if (snapshot.empty) {
      logger.info("[purgeDeletedProjects] No projects to purge.");
      return;
    }

    logger.info(`[purgeDeletedProjects] Purging ${snapshot.size} project(s).`);

    const storage = getStorage();
    const bucket = storage.bucket();

    for (const projectDoc of snapshot.docs) {
      const projectData = projectDoc.data() as {
        ownerId: string;
        mode?: string;
      };
      const { ownerId } = projectData;
      const isEvent = projectData.mode === "event";
      const projectId = projectDoc.id;
      const projectRef = db.collection("projects").doc(projectId);

      let freedStorageBytes = 0;

      try {
        const shouldReleaseStorageBytes = await projectHasPrivateMedia(ownerId, projectId);

        // 1. Delete all Firestore image metadata documents + sum freed storage
        freedStorageBytes = await deleteProjectImageDocs(projectId, "[purgeDeletedProjects]", {
          countFreedBytes: shouldReleaseStorageBytes,
        });

        // 2. Delete editor content subcollection document
        const contentRef = db
          .collection("projects")
          .doc(projectId)
          .collection("data")
          .doc("content");
        await contentRef.delete();

        // 3. Event-mode: delete eventPhotos + eventGuestQuota subcollections + Storage files
        if (isEvent) {
          const [photosSnap, quotaSnap] = await Promise.all([
            projectRef.collection("eventPhotos").get(),
            projectRef.collection("eventGuestQuota").get(),
          ]);
          if (!photosSnap.empty || !quotaSnap.empty) {
            const MAX_BATCH = 400;
            const allDocs = [...photosSnap.docs, ...quotaSnap.docs];
            for (let i = 0; i < allDocs.length; i += MAX_BATCH) {
              const b = db.batch();
              allDocs.slice(i, i + MAX_BATCH).forEach((d) => b.delete(d.ref));
              await b.commit();
            }
            logger.info(`[purgeDeletedProjects] Deleted ${photosSnap.size} eventPhotos + ${quotaSnap.size} guestQuota docs for ${projectId}.`);
          }
          await bucket.deleteFiles({ prefix: `events/${projectId}/` });
          logger.info(`[purgeDeletedProjects] Deleted event Storage files for ${projectId}.`);
        }

        // 4. Delete all private Storage files
        await bucket.deleteFiles({
          prefix: `users/${ownerId}/projects/${projectId}/`,
        });
        // 4. Delete public Storage files (if the project was ever published)
        await bucket.deleteFiles({
          prefix: `public/${projectId}/`,
        });
        // 5. Delete pre-generated OG image
        await bucket.file(`og/${projectId}.webp`).delete().catch(() => {});
        await bucket.file(`og/${projectId}.png`).delete().catch(() => {}); // legacy
        logger.info(
          `[purgeDeletedProjects] Deleted Storage files for project ${projectId}.`
        );
      } catch (err) {
        logger.error(
          `[purgeDeletedProjects] Cleanup error for project ${projectId}:`,
          err
        );
        // Continue purging other projects even if one fails
      }

      // 5. Delete project doc + published snapshot + decrement user counters
      const userRef = db.collection("users").doc(ownerId);
      const publishedRef = db.collection("published_projects").doc(projectId);
      const deleteBatch = db.batch();
      deleteBatch.delete(projectDoc.ref);
      deleteBatch.delete(publishedRef);  // no-op if project was never published
      await deleteProjectSlugReservations(projectId);

      const userUpdates: Record<string, unknown> = {
        "stats.totalProjects": FieldValue.increment(-1),
        ...buildStorageUsedBytesReleaseUpdate(freedStorageBytes),
      };
      deleteBatch.update(userRef, userUpdates);
      await deleteBatch.commit();
      logger.info(`[purgeDeletedProjects] Deleted project document ${projectId}.`);
    }

    logger.info(
      `[purgeDeletedProjects] Done. ${snapshot.size} project(s) permanently deleted.`
    );
  }
);
