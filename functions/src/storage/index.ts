import { FieldValue } from "firebase-admin/firestore";
import { getAuth } from "firebase-admin/auth";
import { getStorage } from "firebase-admin/storage";
import { logger } from "firebase-functions/v2";
import { db } from "../lib/firebaseAdmin";
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
export const resizeProjectImage = makeResizeFunction({
  bucketPrefix: "users/",
  keepOriginal: false,
  runtimeOptions: { memory: "1GiB", timeoutSeconds: 300, maxInstances: 20 },
  outputs: async (event) => {
    // Path: users/{uid}/projects/{projectId}/images/{imageId}/original.*
    const parts = event.data.name.split("/");
    const uid = parts[1];
    const projectId = parts[3];

    const webpOutputs: OutputFile[] = [
      { name: "full.webp",   width: 2560, height: 2560, format: "webp", quality: 90, fit: "outside" },
      { name: "middle.webp", width: 1280, format: "webp", quality: 85 },
      { name: "thumb.webp",  width: 512,  format: "webp", quality: 80 },
    ];

    if (!uid || !projectId) {
      logger.error("resizeProjectImage: invalid storage path", { path: event.data.name });
      return webpOutputs;
    }

    const projectSnap = await db.collection("projects").doc(projectId).get();
    const modeConfig = BACKEND_MODE_CONFIG[projectSnap.data()?.mode] ?? { generatePrintVariant: false }

    if (modeConfig.generatePrintVariant) {
      return [
        { name: "print.jpg", width: 2560, height: 2560, format: "jpeg", quality: 95, fit: "outside" },
        ...webpOutputs,
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

    // ── Storage limit check ───────────────────────────────────────────────
    const userSnap = await db.collection("users").doc(uid).get();
    const userData = userSnap.data();
    const maxStorageBytes: number = userData?.subscription?.features?.maxStorageBytes ?? 0;
    const usedStorageBytes: number = userData?.stats?.storageUsedBytes ?? 0;

    if (maxStorageBytes > 0 && usedStorageBytes + meta.generatedSizeBytes > maxStorageBytes) {
      logger.warn(`[resizeProjectImage] Storage limit exceeded for user ${uid}. Deleting generated files.`, {
        usedStorageBytes,
        generatedSizeBytes: meta.generatedSizeBytes,
        maxStorageBytes,
      });
      // Delete all generated files to avoid silent quota creep
      const bucket = getStorage().bucket();
      const basePath = `users/${uid}/projects/${projectId}/images/${imageId}`;
      await Promise.allSettled(
        Object.keys(urls).map((name) =>
          bucket.file(`${basePath}/${name}`).delete().catch(() => undefined),
        ),
      );
      return;
    }

    await Promise.all([
      db.collection("images").doc(imageId).set({
        ownerId: uid,
        projectId,
        urls,   // photobook: { print, full, middle, thumb } | portfolio: { full, middle, thumb }
        meta,   // { width, height, sizeBytes, generatedSizeBytes, originalName }
        createdAt: FieldValue.serverTimestamp(),
      }),
      db.collection("users").doc(uid).update({
        // Track only the generated files — the original is deleted and not stored
        "stats.storageUsedBytes": FieldValue.increment(meta.generatedSizeBytes),
      }),
    ]);
  },
});
