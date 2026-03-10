import { onObjectFinalized, StorageEvent } from "firebase-functions/v2/storage";
import { logger } from "firebase-functions/v2";
import { getStorage } from "firebase-admin/storage";
import { randomUUID } from "crypto";
import * as path from "path";
import * as os from "os";
import * as fs from "fs";
import sharp from "sharp";

export type OutputFile = {
  /** Output filename, e.g. "thumb.webp", "print.jpg" */
  name: string;
  width: number;
  height?: number;
  format: "webp" | "jpeg";
  quality?: number;
  /**
   * Sharp fit strategy. Default: "inside" (preserve aspect ratio, no crop).
   * Use "cover" for exact square crops (e.g. avatars).
   * Use "outside" so the MINIMUM side reaches the given dimension.
   */
  fit?: "cover" | "contain" | "fill" | "inside" | "outside";
};

export type ImageMeta = {
  width: number;
  height: number;
  sizeBytes: number;
  /** Total size of all generated output files (the original is deleted) */
  generatedSizeBytes: number;
  originalName: string;
};

export type ResizeRuntimeOptions = {
  memory?: "128MiB" | "256MiB" | "512MiB" | "1GiB" | "2GiB" | "4GiB" | "8GiB";
  timeoutSeconds?: number;
  /** Max instances to run in parallel (controls costs and cold-start behaviour) */
  maxInstances?: number;
  /** Min instances to keep warm (reduces cold starts, costs more) */
  minInstances?: number;
};

export type ResizeConfig = {
  /** Only objects whose Storage path starts with this prefix are processed */
  bucketPrefix: string;
  /** Whether to keep the original file after processing */
  keepOriginal: boolean;
  /** Cloud Function runtime options. Defaults: 512MiB, 120s. */
  runtimeOptions?: ResizeRuntimeOptions;
  /**
   * Output directory in Storage. Defaults to the same folder as the original.
   * Useful when outputs should live in a different path (e.g. avatars → users/{uid}/avatar).
   */
  outputDir?: string | ((event: StorageEvent) => string | Promise<string>);
  /**
   * Static list of outputs, or an async function that receives the event
   * and returns the list — useful when outputs depend on runtime data (e.g. project type).
   */
  outputs: OutputFile[] | ((event: StorageEvent) => Promise<OutputFile[]>);
  /**
   * Called after all outputs are uploaded.
   * @param event — original Storage trigger event
   * @param urls  — map of name-without-extension → permanent download URL
   *               e.g. { thumb, middle, full, print }
   * @param meta  — dimensions and size of the original file
   */
  onComplete: (
    event: StorageEvent,
    urls: Record<string, string>,
    meta: ImageMeta
  ) => Promise<void>;
};

export function makeResizeFunction(config: ResizeConfig) {
  const { memory = "512MiB", timeoutSeconds = 120, maxInstances, minInstances } = config.runtimeOptions ?? {};
  return onObjectFinalized(
    { memory, timeoutSeconds, ...(maxInstances != null && { maxInstances }), ...(minInstances != null && { minInstances }) },

    async (event) => {
      const { name: filePath, bucket: bucketName, contentType } = event.data;

      // Only process images under the configured prefix
      if (!filePath?.startsWith(config.bucketPrefix)) return;
      if (!contentType?.startsWith("image/")) return;

      // Only process the original upload, not generated copies
      // Convention: originals must be named "original.*" (e.g. original.jpg)
      const fileName = path.basename(filePath);
      if (!fileName.startsWith("original.")) return;

      const bucket = getStorage().bucket(bucketName);
      const tempInput = path.join(os.tmpdir(), `input_${Date.now()}_${fileName}`);

      try {
        await bucket.file(filePath).download({ destination: tempInput });

        // Read dimensions and file size from the original
        const sharpMeta = await sharp(tempInput).metadata();
        const originalSizeBytes = fs.statSync(tempInput).size;

        // Output files go into the configured directory (or same folder as original)
        const resolvedOutputDir = config.outputDir
          ? typeof config.outputDir === "function"
            ? await config.outputDir(event)
            : config.outputDir
          : filePath.split("/").slice(0, -1).join("/");

        const urls: Record<string, string> = {};
        let generatedSizeBytes = 0;

        const outputs = typeof config.outputs === "function"
          ? await config.outputs(event)
          : config.outputs;

        for (const spec of outputs) {
          const tempOut = path.join(os.tmpdir(), `${Date.now()}_${spec.name}`);
          const destPath = `${resolvedOutputDir}/${spec.name}`;

          try {
            try {
              await sharp(tempInput)
                .resize(spec.width, spec.height ?? null, {
                  fit: spec.fit ?? "inside",
                  position: "center",
                  withoutEnlargement: true,
                })
                .toFormat(spec.format, { quality: spec.quality ?? 80 })
                .toFile(tempOut);
            } catch (err) {
              logger.error("resizeImage: sharp processing failed", { destPath, err });
              throw err;
            }

            const token = randomUUID();
            try {
              await bucket.upload(tempOut, {
                destination: destPath,
                metadata: {
                  contentType: spec.format === "jpeg" ? "image/jpeg" : "image/webp",
                  metadata: { firebaseStorageDownloadTokens: token },
                },
              });
            } catch (err) {
              logger.error("resizeImage: Storage upload failed", { destPath, err });
              throw err;
            }

            generatedSizeBytes += fs.statSync(tempOut).size;
            const encodedPath = encodeURIComponent(destPath);
            // Key = filename without extension: "thumb.webp" → "thumb"
            const key = spec.name.replace(/\.[^.]+$/, "");
            urls[key] =
              `https://firebasestorage.googleapis.com/v0/b/${bucketName}/o/${encodedPath}?alt=media&token=${token}`;
          } finally {
            if (fs.existsSync(tempOut)) fs.unlinkSync(tempOut);
          }
        }

        const meta: ImageMeta = {
          width: sharpMeta.width ?? 0,
          height: sharpMeta.height ?? 0,
          sizeBytes: originalSizeBytes,
          generatedSizeBytes,
          originalName: event.data.name.split("/").pop() ?? fileName,
        };

        if (!config.keepOriginal) {
          await bucket.file(filePath).delete();
        }

        await config.onComplete(event, urls, meta);
        logger.info("Image processed", { filePath, outputs: Object.keys(urls) });
      } finally {
        if (fs.existsSync(tempInput)) fs.unlinkSync(tempInput);
      }
    }
  );
}
