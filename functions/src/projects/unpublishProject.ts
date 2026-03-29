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
  INTERNAL_SERVER_ERROR:    "INTERNAL_SERVER_ERROR",
} as const;

/**
 * Unpublishes a project:
 *   1. Deletes all public Storage files under public/{projectId}/
 *   2. Deletes the published_projects/{projectId} document
 *   3. Sets isPublished: false on the project document
 *
 * POST /unpublishProject
 * Body: { projectId: string }
 * Auth: Bearer <idToken>
 */
export const unpublishProject = onRequest(
  {
    concurrency: 10,
    timeoutSeconds: 120,
    maxInstances: 10,
    cors: [/localhost/, /milestis\.com$/, /milestis\.site$/],
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

    if (projectSnap.data()!.ownerId !== uid) {
      res.status(403).json({ error: ERROR.FORBIDDEN });
      return;
    }

    try {
      // 1. Delete public Storage files
      await getStorage().bucket().deleteFiles({ prefix: `public/${projectId}/` });
      logger.info(`[unpublishProject] Deleted public Storage files for ${projectId}.`);

      // 2. Delete published snapshot + mark project as unpublished
      const publishedRef = db.collection("published_projects").doc(projectId);
      const batch = db.batch();
      batch.delete(publishedRef);
      batch.update(projectRef, {
        isPublished: false,
        publishedSlug: FieldValue.delete(),
        publishedAccessToken: FieldValue.delete(),
        updatedAt: FieldValue.serverTimestamp(),
      });
      await batch.commit();

      logger.info(`[unpublishProject] Project ${projectId} unpublished by user ${uid}.`);
      res.status(200).json({ ok: true });
    } catch (err) {
      logger.error(`[unpublishProject] Error unpublishing project ${projectId}:`, err);
      res.status(500).json({ error: ERROR.INTERNAL_SERVER_ERROR });
    }
  }
);
