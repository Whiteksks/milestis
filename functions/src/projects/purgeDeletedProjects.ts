import { onSchedule } from "firebase-functions/v2/scheduler";
import { logger } from "firebase-functions/v2";
import { Timestamp } from "firebase-admin/firestore";
import { getStorage } from "firebase-admin/storage";
import { db } from "../lib/firebaseAdmin";

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
      const { ownerId } = projectDoc.data() as { ownerId: string };
      const projectId = projectDoc.id;

      try {
        // 1. Delete all Firestore image metadata documents for this project
        const imagesSnap = await db
          .collection("images")
          .where("projectId", "==", projectId)
          .get();

        if (!imagesSnap.empty) {
          const imgBatch = db.batch();
          for (const imgDoc of imagesSnap.docs) {
            imgBatch.delete(imgDoc.ref);
          }
          await imgBatch.commit();
          logger.info(
            `[purgeDeletedProjects] Deleted ${imagesSnap.size} image doc(s) for project ${projectId}.`
          );
        }

        // 2. Delete all Storage files under the project folder
        await bucket.deleteFiles({
          prefix: `users/${ownerId}/projects/${projectId}/`,
        });
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

      // 3. Delete the project document itself
      await projectDoc.ref.delete();
      logger.info(`[purgeDeletedProjects] Deleted project document ${projectId}.`);
    }

    logger.info(
      `[purgeDeletedProjects] Done. ${snapshot.size} project(s) permanently deleted.`
    );
  }
);
