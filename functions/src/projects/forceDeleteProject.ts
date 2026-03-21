import { onRequest } from "firebase-functions/v2/https";
import { logger } from "firebase-functions/v2";
import { FieldValue } from "firebase-admin/firestore";
import { getAuth } from "firebase-admin/auth";
import { getStorage } from "firebase-admin/storage";
import { db } from "../lib/firebaseAdmin";

const ERROR = {
  METHOD_NOT_ALLOWED:       "METHOD_NOT_ALLOWED",
  UNAUTHORIZED:             "UNAUTHORIZED",
  INVALID_OR_EXPIRED_TOKEN: "INVALID_OR_EXPIRED_TOKEN",
  INVALID_PAYLOAD:          "INVALID_PAYLOAD",
  NOT_FOUND:                "NOT_FOUND",
  FORBIDDEN:                "FORBIDDEN",
  PROJECT_NOT_IN_TRASH:     "PROJECT_NOT_IN_TRASH",
  INTERNAL_SERVER_ERROR:    "INTERNAL_SERVER_ERROR",
} as const;

/**
 * Permanently deletes a single project immediately.
 * The project must already have status == 'deleted' (trashed) —
 * this prevents accidental hard-deletes of active projects.
 *
 * Deletes:
 *   1. All Firestore documents in the 'images' collection for this project
 *   2. All Storage files under users/{uid}/projects/{projectId}/
 *   3. The project document itself
 *
 * POST /forceDeleteProject
 * Body: { projectId: string }
 * Auth: Bearer <idToken>
 */
export const forceDeleteProject = onRequest(
  {
    concurrency: 20,
    timeoutSeconds: 120,
    maxInstances: 10,
    cors: [/localhost/, /milestis\.app$/],
  },
  async (req, res) => {
    // ── Method guard ──────────────────────────────────────────────────────
    if (req.method !== "POST") {
      res.status(405).json({ error: ERROR.METHOD_NOT_ALLOWED });
      return;
    }

    // ── Auth ──────────────────────────────────────────────────────────────
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith("Bearer ")) {
      res.status(401).json({ error: ERROR.UNAUTHORIZED });
      return;
    }

    let uid: string;
    try {
      const decoded = await getAuth().verifyIdToken(authHeader.split("Bearer ")[1]);
      uid = decoded.uid;
    } catch {
      res.status(401).json({ error: ERROR.INVALID_OR_EXPIRED_TOKEN });
      return;
    }

    // ── Payload ───────────────────────────────────────────────────────────
    const { projectId } = req.body as Record<string, unknown>;
    if (typeof projectId !== "string" || !projectId.trim()) {
      res.status(400).json({ error: ERROR.INVALID_PAYLOAD, message: "projectId must be a non-empty string." });
      return;
    }

    // ── Load project & ownership check ────────────────────────────────────
    const projectRef = db.collection("projects").doc(projectId);
    const projectSnap = await projectRef.get();

    if (!projectSnap.exists) {
      res.status(404).json({ error: ERROR.NOT_FOUND });
      return;
    }

    const data = projectSnap.data()!;

    if (data.ownerId !== uid) {
      res.status(403).json({ error: ERROR.FORBIDDEN });
      return;
    }

    // Only allow deleting projects that are already in the trash
    if (data.status !== "deleted") {
      res.status(400).json({
        error: ERROR.PROJECT_NOT_IN_TRASH,
        message: "Move the project to trash before permanently deleting it.",
      });
      return;
    }

    // ── Cleanup ───────────────────────────────────────────────────────────
    try {
      // 1. Delete image metadata from Firestore
      const imagesSnap = await db
        .collection("images")
        .where("projectId", "==", projectId)
        .get();

      if (!imagesSnap.empty) {
        const batch = db.batch();
        for (const imgDoc of imagesSnap.docs) {
          batch.delete(imgDoc.ref);
        }
        await batch.commit();
        logger.info(`[forceDeleteProject] Deleted ${imagesSnap.size} image doc(s) for ${projectId}.`);
      }

      // 2. Delete editor content subcollection document
      const contentRef = projectRef.collection("data").doc("content");
      await contentRef.delete();

      // 3. Delete all Storage files for this project
      const storage = getStorage();
      await storage.bucket().deleteFiles({
        prefix: `users/${uid}/projects/${projectId}/`,
      });
      logger.info(`[forceDeleteProject] Deleted Storage files for ${projectId}.`);

      // 4. Delete the project document and decrement user counter atomically
      const userRef = db.collection("users").doc(uid);
      const deleteBatch = db.batch();
      deleteBatch.delete(projectRef);
      deleteBatch.update(userRef, {
        "stats.totalProjects": FieldValue.increment(-1),
      });
      await deleteBatch.commit();
      logger.info(`[forceDeleteProject] Project ${projectId} permanently deleted by user ${uid}.`);

      res.status(200).json({ success: true });
    } catch (err) {
      logger.error(`[forceDeleteProject] Error deleting project ${projectId}:`, err);
      res.status(500).json({ error: ERROR.INTERNAL_SERVER_ERROR });
    }
  }
);
