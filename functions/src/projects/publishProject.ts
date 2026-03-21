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
  PROJECT_NOT_ACTIVE:       "PROJECT_NOT_ACTIVE",
  NO_CONTENT:               "NO_CONTENT",
  INTERNAL_SERVER_ERROR:    "INTERNAL_SERVER_ERROR",
} as const;

/**
 * Extracts the GCS storage path from a Firebase Storage download URL.
 * e.g. https://firebasestorage.googleapis.com/v0/b/BUCKET/o/users%2Fuid%2F...?alt=media&token=...
 *   → users/uid/...
 */
function extractStoragePath(url: string): string | null {
  try {
    const parsed = new URL(url);
    // pathname = /v0/b/{bucket}/o/{encodedPath}
    const match = parsed.pathname.match(/\/v0\/b\/[^/]+\/o\/(.+)/);
    if (!match) return null;
    return decodeURIComponent(match[1]);
  } catch {
    return null;
  }
}

/**
 * Constructs a Firebase Storage URL for public access (no token required).
 * Works when Storage rules allow `read: if true` for the given path.
 */
function makePublicStorageUrl(bucketName: string, filePath: string): string {
  const encoded = filePath.split("/").map(encodeURIComponent).join("%2F");
  return `https://firebasestorage.googleapis.com/v0/b/${bucketName}/o/${encoded}?alt=media`;
}

/**
 * Finds all Firebase Storage download URLs in a JSON string that belong
 * to files owned by this project (private path), and returns a map of
 * originalUrl → decodedStoragePath.
 */
function extractProjectImageUrls(
  contentJson: string,
  uid: string,
  projectId: string
): Map<string, string> {
  const result = new Map<string, string>();
  const privatePrefix = `users/${uid}/projects/${projectId}/`;
  // Match Firebase Storage URLs within JSON string values
  const urlRegex = /"(https:\/\/firebasestorage\.googleapis\.com\/v0\/b\/[^"\\]+)"/g;
  let match: RegExpExecArray | null;
  while ((match = urlRegex.exec(contentJson)) !== null) {
    const originalUrl = match[1];
    const path = extractStoragePath(originalUrl);
    if (path && path.startsWith(privatePrefix)) {
      result.set(originalUrl, path);
    }
  }
  return result;
}

/**
 * Publishes a project snapshot:
 *   1. Reads editor content from projects/{id}/data/content
 *   2. Copies all referenced Storage files from users/{uid}/projects/{id}/
 *      to public/{id}/ (overwriting previous publish)
 *   3. Replaces private URLs with public URLs in the snapshot
 *   4. Writes the snapshot to published_projects/{id}
 *   5. Sets isPublished: true on the project document
 *
 * POST /publishProject
 * Body: { projectId: string }
 * Auth: Bearer <idToken>
 */
export const publishProject = onRequest(
  {
    concurrency: 5,
    timeoutSeconds: 300,
    memory: "512MiB",
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

    const projectData = projectSnap.data()!;

    if (projectData.ownerId !== uid) {
      res.status(403).json({ error: ERROR.FORBIDDEN });
      return;
    }

    if (projectData.status !== "active") {
      res.status(400).json({ error: ERROR.PROJECT_NOT_ACTIVE, message: "Only active projects can be published." });
      return;
    }

    // ── Load editor content ───────────────────────────────────────────────
    const contentSnap = await projectRef.collection("data").doc("content").get();
    if (!contentSnap.exists) {
      res.status(400).json({ error: ERROR.NO_CONTENT, message: "Save the project at least once before publishing." });
      return;
    }

    const editorData = contentSnap.data()!;

    try {
      const bucket = getStorage().bucket();
      const bucketName = bucket.name;

      // ── Serialize everything that may contain Storage URLs ────────────
      const rawPayload = {
        theme:   editorData.theme   ?? null,
        content: editorData.content ?? null,
        preview: projectData.preview ?? null,
      };
      let payloadJson = JSON.stringify(rawPayload);

      // ── Find & replace private Storage URLs ───────────────────────────
      const urlToPath = extractProjectImageUrls(payloadJson, uid, projectId);
      logger.info(`[publishProject] ${urlToPath.size} image(s) to copy for project ${projectId}.`);

      // Delete previous public files so orphans from prior publishes are removed
      try {
        await bucket.deleteFiles({ prefix: `public/${projectId}/` });
      } catch {
        // No files existed — safe to ignore
      }

      const privatePrefix = `users/${uid}/projects/${projectId}/`;

      for (const [originalUrl, privatePath] of urlToPath) {
        const relativePath = privatePath.slice(privatePrefix.length);
        const publicPath   = `public/${projectId}/${relativePath}`;
        try {
          await bucket.file(privatePath).copy(bucket.file(publicPath));
          const publicUrl = makePublicStorageUrl(bucketName, publicPath);
          // Global replace — the same URL may appear multiple times in content
          payloadJson = payloadJson.split(originalUrl).join(publicUrl);
          logger.info(`[publishProject] Copied ${privatePath} → ${publicPath}`);
        } catch (copyErr) {
          logger.warn(`[publishProject] Failed to copy ${privatePath}:`, copyErr);
          // Continue — don't fail the whole publish for one image
        }
      }

      const processedPayload = JSON.parse(payloadJson) as typeof rawPayload;

      // ── Write published snapshot + update main doc ────────────────────
      const publishedRef = db.collection("published_projects").doc(projectId);
      const batch = db.batch();

      batch.set(publishedRef, {
        ownerId:     uid,
        name:        projectData.name,
        mode:        projectData.mode,
        theme:       processedPayload.theme,
        content:     processedPayload.content,
        preview:     processedPayload.preview,
        publishedAt: FieldValue.serverTimestamp(),
      });

      batch.update(projectRef, {
        isPublished: true,
        updatedAt:   FieldValue.serverTimestamp(),
      });

      await batch.commit();

      logger.info(`[publishProject] Project ${projectId} published by user ${uid}.`);
      res.status(200).json({ ok: true });
    } catch (err) {
      logger.error(`[publishProject] Error publishing project ${projectId}:`, err);
      res.status(500).json({ error: ERROR.INTERNAL_SERVER_ERROR });
    }
  }
);
