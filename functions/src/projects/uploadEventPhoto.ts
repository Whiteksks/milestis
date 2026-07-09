import { onRequest } from "firebase-functions/v2/https";
import { logger } from "firebase-functions/v2";
import { FieldValue } from "firebase-admin/firestore";
import { getAuth } from "firebase-admin/auth";
import { getStorage } from "firebase-admin/storage";
import { randomUUID, createHash } from "node:crypto";
import { db } from "../lib/firebaseAdmin";
import { ALLOWED_ORIGINS } from "../lib/cors";
import { PUBLISHED_PROJECT_SLUGS_COLLECTION } from "./publish/slug/constants";
import type { EventPhotoRecord } from "./projectInterface";

// ─── Constants ────────────────────────────────────────────────────────────

/** MIME types accepted for event photo uploads → file extension. */
const ALLOWED_MIME_TYPES: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png":  "png",
  "image/webp": "webp",
  "image/heic": "heic",
  "image/heif": "heif",
};

/** Signed URL expires after 10 minutes — enough for a mobile upload. */
const SIGNED_URL_EXPIRY_MS = 10 * 60 * 1000;

/** Maximum length of a sanitized file name stored in the record. */
const MAX_FILE_NAME_LENGTH = 200;

const ERROR = {
  METHOD_NOT_ALLOWED:       "METHOD_NOT_ALLOWED",
  UNAUTHORIZED:             "UNAUTHORIZED",
  INVALID_OR_EXPIRED_TOKEN: "INVALID_OR_EXPIRED_TOKEN",
  INVALID_PAYLOAD:          "INVALID_PAYLOAD",
  EVENT_NOT_FOUND:          "EVENT_NOT_FOUND",
  UNAUTHORIZED_EVENT:       "UNAUTHORIZED_EVENT",
  EVENT_FULL:               "EVENT_FULL",
  GUEST_QUOTA_EXCEEDED:     "GUEST_QUOTA_EXCEEDED",
  INTERNAL_SERVER_ERROR:    "INTERNAL_SERVER_ERROR",
} as const;

// ─── Payload ──────────────────────────────────────────────────────────────

interface UploadPayload {
  projectId:   string;
  accessToken: string;
  contentType: string;
  /** Original file name from the client. Stored as metadata only. */
  fileName?:   string;
}

function validatePayload(body: unknown): UploadPayload {
  if (!body || typeof body !== "object") {
    throw new Error("Body must be a JSON object.");
  }

  const { projectId, accessToken, contentType, fileName } = body as Record<string, unknown>;

  if (typeof projectId !== "string" || projectId.length < 10 || projectId.length > 128) {
    throw new Error("Invalid projectId.");
  }

  if (typeof accessToken !== "string" || accessToken.length < 8 || accessToken.length > 256) {
    throw new Error("Invalid accessToken.");
  }

  if (typeof contentType !== "string" || !(contentType in ALLOWED_MIME_TYPES)) {
    throw new Error(
      `contentType must be one of: ${Object.keys(ALLOWED_MIME_TYPES).join(", ")}.`
    );
  }

  let sanitizedFileName: string | undefined;
  if (fileName !== undefined) {
    if (typeof fileName !== "string") throw new Error("fileName must be a string.");
    sanitizedFileName = fileName
      .replace(/[/\\]/g, "_")
      // eslint-disable-next-line no-control-regex
      .replace(/[\x00-\x1F\x7F]/g, "")
      .slice(0, MAX_FILE_NAME_LENGTH)
      .trim() || undefined;
  }

  return { projectId, accessToken, contentType, fileName: sanitizedFileName };
}

// ─── Cloud Function ───────────────────────────────────────────────────────

/**
 * uploadEventPhoto
 *
 * Called by the guest upload page. Does NOT accept the file itself —
 * instead it validates quotas, reserves a slot in Firestore, and returns
 * a short-lived signed GCS URL the client uses to PUT the file directly.
 *
 * Flow:
 *   1. Verify Firebase ID token (anonymous sign-in is accepted).
 *   2. Verify accessToken by looking up published_project_slugs/{sha256(token)}.
 *      Confirms the token is valid for the given projectId and mode === "event".
 *   3. Firestore transaction:
 *        a. Re-read projects/{projectId}.eventConfig (authoritative state).
 *        b. Check total quota not exceeded.
 *        c. Check per-guest quota via eventGuestQuota/{uid} counter doc.
 *        d. Create eventPhotos/{photoId} with status "pending".
 *        e. Increment pendingCount on project document.
 *        f. Upsert eventGuestQuota/{uid}.count.
 *   4. Generate a v4 signed PUT URL scoped to the reserved Storage path.
 *   5. Return { uploadUrl, storageRef, photoId }.
 *
 * The client PUTs the binary file to uploadUrl, then the SafeSearch batch
 * trigger picks up the pending record and approves or rejects it.
 */
export const uploadEventPhoto = onRequest(
  {
    concurrency: 50,
    timeoutSeconds: 30,
    maxInstances: 20,
    cors: ALLOWED_ORIGINS,
  },
  async (req, res) => {
    // ── Method guard ────────────────────────────────────────────────────
    if (req.method !== "POST") {
      res.status(405).json({ error: ERROR.METHOD_NOT_ALLOWED });
      return;
    }

    // ── Auth — anonymous Firebase Auth is accepted ───────────────────────
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

    // ── Payload validation ───────────────────────────────────────────────
    let payload: UploadPayload;
    try {
      payload = validatePayload(req.body);
    } catch (err) {
      res.status(400).json({ error: ERROR.INVALID_PAYLOAD, message: (err as Error).message });
      return;
    }

    const { projectId, accessToken, contentType, fileName } = payload;

    try {
      // ── Verify access token → confirm this event is published ────────
      const hashedToken = createHash("sha256").update(accessToken).digest("hex");
      const slugSnap = await db
        .collection(PUBLISHED_PROJECT_SLUGS_COLLECTION)
        .doc(hashedToken)
        .get();

      if (
        !slugSnap.exists ||
        slugSnap.data()?.projectId !== projectId ||
        slugSnap.data()?.mode !== "event"
      ) {
        res.status(403).json({ error: ERROR.UNAUTHORIZED_EVENT });
        return;
      }

      // ── Reserve a slot atomically ──────────────────────────────────────
      const projectRef    = db.collection("projects").doc(projectId);
      const guestQuotaRef = db
        .collection("projects").doc(projectId)
        .collection("eventGuestQuota").doc(uid);

      const photoId   = randomUUID();
      const ext       = ALLOWED_MIME_TYPES[contentType];
      const storageRef = `events/${projectId}/${photoId}.${ext}`;
      const originalFileName = fileName ?? `photo.${ext}`;

      await db.runTransaction(async (tx) => {
        const [projectSnap, guestSnap] = await Promise.all([
          tx.get(projectRef),
          tx.get(guestQuotaRef),
        ]);

        if (!projectSnap.exists) throw new Error(ERROR.EVENT_NOT_FOUND);

        const cfg = projectSnap.data()!.eventConfig as {
          maxPhotos:         number;
          maxPhotosPerGuest: number;
          approvedCount:     number;
          pendingCount:      number;
        };

        // Authoritative checks inside the transaction
        if (cfg.approvedCount + cfg.pendingCount >= cfg.maxPhotos) {
          throw new Error(ERROR.EVENT_FULL);
        }

        const guestCount: number =
          guestSnap.exists ? (guestSnap.data()!.count as number) : 0;

        if (guestCount >= cfg.maxPhotosPerGuest) {
          throw new Error(ERROR.GUEST_QUOTA_EXCEEDED);
        }

        // Write the eventPhotos record (pending — awaiting SafeSearch batch)
        const photoRecord: Omit<EventPhotoRecord, "reviewedAt" | "violations"> = {
          anonymousUid:  uid,
          storageRef,
          originalFileName,
          status:       "pending",
          uploadedAt:   FieldValue.serverTimestamp(),
        };

        tx.create(
          db.collection("projects").doc(projectId)
            .collection("eventPhotos").doc(photoId),
          photoRecord,
        );

        // Upsert per-guest quota counter
        if (guestSnap.exists) {
          tx.update(guestQuotaRef, { count: FieldValue.increment(1) });
        } else {
          tx.create(guestQuotaRef, { count: 1 });
        }

        // Reflect the new pending slot on the project document
        tx.update(projectRef, {
          "eventConfig.pendingCount": FieldValue.increment(1),
          updatedAt: FieldValue.serverTimestamp(),
        });
      });

      // ── Generate signed PUT URL ──────────────────────────────────────
      const bucket = getStorage().bucket();
      const [uploadUrl] = await bucket.file(storageRef).getSignedUrl({
        version:     "v4",
        action:      "write",
        expires:     Date.now() + SIGNED_URL_EXPIRY_MS,
        contentType,
      });

      logger.info("Event upload URL issued", {
        projectId,
        photoId,
        // Log only first 8 chars of uid to avoid storing full anonymous IDs
        uidPrefix: uid.slice(0, 8),
      });

      res.status(200).json({ ok: true, uploadUrl, storageRef, photoId });

    } catch (err) {
      const code = (err as Error).message;

      if (code === ERROR.EVENT_NOT_FOUND) {
        res.status(404).json({ error: ERROR.EVENT_NOT_FOUND });
        return;
      }
      if (code === ERROR.EVENT_FULL) {
        res.status(403).json({ error: ERROR.EVENT_FULL });
        return;
      }
      if (code === ERROR.GUEST_QUOTA_EXCEEDED) {
        res.status(403).json({ error: ERROR.GUEST_QUOTA_EXCEEDED });
        return;
      }

      logger.error("uploadEventPhoto: unexpected error", { projectId, err });
      res.status(500).json({ error: ERROR.INTERNAL_SERVER_ERROR });
    }
  }
);
