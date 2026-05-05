import { onRequest } from "firebase-functions/v2/https";
import { logger } from "firebase-functions/v2";
import { FieldValue } from "firebase-admin/firestore";
import { getAuth } from "firebase-admin/auth";
import { db } from "../lib/firebaseAdmin";
import { VALID_MODES, type ProjectMode } from "./projectInterface";
import { ALLOWED_ORIGINS } from "../lib/cors";

const ERROR = {
  METHOD_NOT_ALLOWED:       "METHOD_NOT_ALLOWED",
  UNAUTHORIZED:             "UNAUTHORIZED",
  INVALID_OR_EXPIRED_TOKEN: "INVALID_OR_EXPIRED_TOKEN",
  INVALID_PAYLOAD:          "INVALID_PAYLOAD",
  NOT_FOUND:                "NOT_FOUND",
  FORBIDDEN:                "FORBIDDEN",
  INTERNAL_SERVER_ERROR:    "INTERNAL_SERVER_ERROR",
} as const;

class FlowError extends Error {
  constructor(
    public readonly status: number,
    public readonly code: typeof ERROR[keyof typeof ERROR],
    message?: string,
  ) {
    super(message);
  }
}

/**
 * Unpublishes a project (hides it from the internet without deleting data):
 *   1. Sets isPublished: false + removes slug/token from published_projects/{id}
 *   2. Clears isPublished on projects/{id} but keeps slug/token for safe re-publish
 *
 * Storage files under public/{projectId}/ are intentionally NOT deleted.
 * The project content and export files must remain accessible so the user
 * can re-publish without re-exporting.
 *
 * POST /unpublishProject
 * Body: { projectId: string }
 * Auth: Bearer <idToken>
 */
export const unpublishProject = onRequest(
  {
    concurrency: 10,
    timeoutSeconds: 60,
    maxInstances: 10,
    cors: ALLOWED_ORIGINS,
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

    try {
      await db.runTransaction(async (tx) => {
        const projectRef = db.collection("projects").doc(projectId.trim());
        const projectSnap = await tx.get(projectRef);

        if (!projectSnap.exists) {
          throw new FlowError(404, ERROR.NOT_FOUND);
        }

        const projectData = projectSnap.data()!;

        if (projectData.ownerId !== uid) {
          throw new FlowError(403, ERROR.FORBIDDEN);
        }

        if (projectData.isPublished !== true) {
          throw new FlowError(409, ERROR.INVALID_PAYLOAD, "Project is not published.");
        }

        // Validate mode (needed for slug reservation key calculation).
        const rawMode = projectData.mode;
        if (!VALID_MODES.includes(rawMode as ProjectMode)) {
          throw new FlowError(500, ERROR.INTERNAL_SERVER_ERROR);
        }

        // Intentionally NOT deleting the slug reservation so the user can
        // re-publish with the same slug via republishProject.
        // The slug remains reserved for this project while it is hidden.

        // Hide published_projects doc (keep content for re-publish).
        const publishedRef = db.collection("published_projects").doc(projectId.trim());
        tx.set(publishedRef, {
          isPublished: false,
          slug: FieldValue.delete(),
          accessToken: FieldValue.delete(),
          unpublishedAt: FieldValue.serverTimestamp(),
        }, { merge: true });

        // Clear publish fields on the project doc.
        tx.update(projectRef, {
          isPublished: false,
          publishLockId: FieldValue.delete(),
          publishLockExpiresAtMillis: FieldValue.delete(),
          updatedAt: FieldValue.serverTimestamp(),
        });
      });

      logger.info(`[unpublishProject] Project ${projectId} unpublished by user ${uid}.`);
      res.status(200).json({ ok: true });
    } catch (err: unknown) {
      if (err instanceof FlowError) {
        res.status(err.status).json({ error: err.code, ...(err.message ? { message: err.message } : {}) });
        return;
      }
      logger.error(`[unpublishProject] Error unpublishing project ${projectId}:`, err);
      res.status(500).json({ error: ERROR.INTERNAL_SERVER_ERROR });
    }
  }
);
