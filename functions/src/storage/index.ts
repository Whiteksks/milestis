import { FieldValue, Timestamp } from "firebase-admin/firestore";
import { getAuth } from "firebase-admin/auth";
import { getStorage } from "firebase-admin/storage";
import { logger } from "firebase-functions/v2";
import { db } from "../lib/firebaseAdmin";
import { getEffectiveSubscriptionFeatures } from "../users/subscriptionFeatures";
import { makeResizeFunction, OutputFile } from "./resizeImage";

/**
 * Triggered when a file is uploaded to: avatars/{uid}/original.*
 *
 * - Resizes to 256×256 WebP (center crop)
 * - Deletes original
 * - Updates photoURL in Firestore users/{uid} and Firebase Auth
 */
export const resizeAvatar = makeResizeFunction({
  bucketPrefix: "avatars/",
  keepOriginal: false,
  runtimeOptions: { memory: "512MiB", timeoutSeconds: 60, maxInstances: 10 },
  // Always write to the same path — the new token in the URL acts as cache-buster
  outputDir: (event) => {
    const uid = event.data.name.split("/")[1];
    return `users/${uid}/avatar`;
  },
  outputs: [
    { name: "avatar.webp", width: 256, height: 256, format: "webp", quality: 85, fit: "cover" },
  ],
  onComplete: async (event, urls) => {
    // Input:  avatars/{uid}/original.*
    // Output: users/{uid}/avatar/avatar.webp  (overwritten each time, new token = new URL)
    const uid = event.data.name.split("/")[1];
    const photoURL = urls["avatar"];
    if (!uid || !photoURL) return;

    await Promise.all([
      db.collection("users").doc(uid).update({ photoURL }),
      getAuth().updateUser(uid, { photoURL }),
    ]);
  },
});

/**
 * Per-mode backend capabilities.
 * Add an entry here when introducing a new project mode.
 * generatePrintVariant: whether to produce a high-quality print.jpg alongside the webp variants.
 */
const BACKEND_MODE_CONFIG: Record<string, { generatePrintVariant: boolean }> = {
  portfolio: { generatePrintVariant: false },
  photobook: { generatePrintVariant: true },
}

/**
 * Triggered when a file is uploaded to: projects/{uid}/{projectId}/{imageId}/original.*
 *
 * Works for both photobooks and portfolio websites — project type is read from
 * Firestore projects/{projectId}.type to decide which outputs to generate:
 *
 *   photobook → print.jpg + full.webp + middle.webp + thumb.webp
 *   portfolio → full.webp + middle.webp + thumb.webp  (no print.jpg)
 *
 * Firestore: images/{imageId} (top-level, with ownerId + projectId fields)
 */

function imageJob(event: { data: { name: string } }) {
  const match = /^users\/([^/]+)\/projects\/([^/]+)\/images\/([^/]+)\/original\.[^/]+$/.exec(event.data.name);
  if (!match) return null;
  const [, uid, projectId, imageId] = match;
  return { uid, projectId, imageId, ref: db.doc(`projects/${projectId}/imageJobs/${imageId}`) };
}

export const resizeProjectImage = makeResizeFunction({
  bucketPrefix: "users/",
  keepOriginal: false,
  runtimeOptions: { memory: "1GiB", timeoutSeconds: 300, maxInstances: 20, concurrency: 1 },
  limitInputPixels: 100_000_000,
  onStart: async (event) => {
    const job = imageJob(event);
    if (!job) return false;
    return db.runTransaction(async (tx) => {
      const [existing, image, project] = await Promise.all([
        tx.get(job.ref), tx.get(db.doc(`images/${job.imageId}`)), tx.get(db.doc(`projects/${job.projectId}`)),
      ]);
      if (project.data()?.ownerId !== job.uid || image.exists || existing.data()?.status === "ready") return false;
      const data = existing.data();
      if (data?.status === "processing" && (data.updatedAt?.toMillis?.() ?? 0) > Date.now() - 360_000) return false;
      tx.set(job.ref, {
        ownerId: job.uid, projectId: job.projectId, status: "processing",
        name: event.data.metadata?.originalName ?? "image",
        updatedAt: Timestamp.now(), errorCode: null,
      });
      return true;
    });
  },
  onError: async (event, error) => {
    const job = imageJob(event);
    if (!job) return;
    const message = error instanceof Error ? error.message : "";
    const errorCode = message === "STORAGE_LIMIT" ? "storageLimit"
      : /pixel limit/i.test(message) ? "tooManyPixels" : "processingFailed";
    const shouldClean = await db.runTransaction(async (tx) => {
      const current = await tx.get(job.ref);
      if (current.data()?.status === "ready") return false;
      tx.set(job.ref, { status: "failed", errorCode, updatedAt: Timestamp.now() }, { merge: true });
      return true;
    });
    if (!shouldClean) return;
    // Keep the input after unexpected failures so a server-side retry remains possible.
    // Definitive quota/pixel-limit failures do not need to retain an unusable original.
    const bucket = getStorage().bucket(event.data.bucket);
    const folder = event.data.name.slice(0, event.data.name.lastIndexOf("/"));
    const cleanupFiles = ["thumb.webp", "middle.webp", "full.webp", "print.jpg"];
    if (errorCode === "storageLimit" || errorCode === "tooManyPixels") cleanupFiles.push(event.data.name.split("/").pop()!);
    await Promise.all(cleanupFiles.map(async (name) => {
      try { await bucket.file(`${folder}/${name}`).delete({ ignoreNotFound: true }); }
      catch (cleanupError) { logger.warn("Failed image cleanup", { imageId: job.imageId, name, cleanupError }); }
    }));
  },
  outputs: async (event) => {
    // Path: users/{uid}/projects/{projectId}/images/{imageId}/original.*
    const parts = event.data.name.split("/");
    const uid = parts[1];
    const projectId = parts[3];

    const webpOutputs: OutputFile[] = [
      { name: "thumb.webp", width: 512, height: 512, format: "webp", quality: 80 },
      { name: "middle.webp", width: 1280, height: 1280, format: "webp", quality: 85 },
      { name: "full.webp", width: 2560, height: 2560, format: "webp", quality: 85 },
    ];

    if (!uid || !projectId) {
      logger.error("resizeProjectImage: invalid storage path", { path: event.data.name });
      return webpOutputs;
    }

    const projectSnap = await db.collection("projects").doc(projectId).get();
    const modeConfig = BACKEND_MODE_CONFIG[projectSnap.data()?.mode] ?? { generatePrintVariant: false }

    if (modeConfig.generatePrintVariant) {
      return [
        ...webpOutputs,
        { name: "print.jpg", width: 2560, height: 2560, format: "jpeg", quality: 95, fit: "outside" },
      ];
    }

    return webpOutputs;
  },
  onComplete: async (event, urls, meta) => {
    // Path: users/{uid}/projects/{projectId}/images/{imageId}/original.*
    const parts = event.data.name.split("/");
    const uid = parts[1];
    const projectId = parts[3];
    const imageId = parts[5];
    if (!uid || !projectId || !imageId) {
      logger.error("resizeProjectImage: invalid storage path in onComplete", { path: event.data.name });
      return;
    }

    const job = imageJob(event)!;
    const imageRef = db.collection("images").doc(imageId);
    const userRef = db.collection("users").doc(uid);
    // The quota decision, media document and accounting must commit together.
    await db.runTransaction(async (tx) => {
      const [userSnap, existingImage] = await Promise.all([tx.get(userRef), tx.get(imageRef)]);
      if (existingImage.exists) return;
      const userData = userSnap.data();
      const maxStorageBytes = getEffectiveSubscriptionFeatures(userData?.subscription).maxStorageBytes;
      const usedStorageBytes: number = userData?.stats?.storageUsedBytes ?? 0;
      if (maxStorageBytes > 0 && usedStorageBytes + meta.generatedSizeBytes > maxStorageBytes) {
        throw new Error("STORAGE_LIMIT");
      }
      tx.set(imageRef, { ownerId: uid, projectId, urls, meta, createdAt: FieldValue.serverTimestamp() });
      tx.update(userRef, { "stats.storageUsedBytes": FieldValue.increment(meta.generatedSizeBytes) });
      tx.set(job.ref, { status: "ready", updatedAt: Timestamp.now(), errorCode: null }, { merge: true });
    });
  },
});
