import { createHash, randomUUID } from "crypto";
import { getStorage } from "firebase-admin/storage";
import { MenuPublishError } from "./snapshot";

/** Copies referenced uploads without rewriting or deleting the editable originals.
 * Source generation is part of the key: repeated text updates reuse existing copies.
 * Older copies remain valid for open guest pages and are removed with the project.
 */
export async function copyMenuMedia<T>(snapshot: T, uid: string, projectId: string): Promise<T> {
  const bucket = getStorage().bucket();
  const mapping = new Map<string, string>();
  async function copy(url: string): Promise<string> {
    if (mapping.has(url)) return mapping.get(url)!;
    const parsed = new URL(url);
    if (parsed.hostname !== "firebasestorage.googleapis.com") return url;
    const match = parsed.pathname.match(/^\/v0\/b\/([^/]+)\/o\/(.+)$/);
    if (!match || decodeURIComponent(match[1]) !== bucket.name) throw new MenuPublishError("INVALID_IMAGE");
    const sourcePath = decodeURIComponent(match[2]);
    if (!sourcePath.startsWith(`users/${uid}/projects/${projectId}/`) && !sourcePath.startsWith(`public/${projectId}/`)) throw new MenuPublishError("INVALID_IMAGE");
    if (sourcePath.startsWith(`public/${projectId}/menu/`)) return url;
    const [metadata] = await bucket.file(sourcePath).getMetadata();
    const key = createHash("sha256").update(`${sourcePath}:${metadata.generation}`).digest("hex");
    const target = bucket.file(`public/${projectId}/menu/${key}`);
    const [exists] = await target.exists();
    if (!exists) {
      await bucket.file(sourcePath, { generation: metadata.generation }).copy(target);
      await target.setMetadata({ cacheControl: "public,max-age=31536000,immutable", metadata: { firebaseStorageDownloadTokens: randomUUID() } });
    }
    const [targetMetadata] = await target.getMetadata();
    let token = targetMetadata.metadata?.firebaseStorageDownloadTokens as string | undefined;
    if (!token) {
      token = randomUUID();
      await target.setMetadata({ metadata: { firebaseStorageDownloadTokens: token } });
    }
    const result = `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/${encodeURIComponent(target.name)}?alt=media&token=${token}`;
    mapping.set(url, result);
    return result;
  }
  async function walk(value: unknown, key = ""): Promise<unknown> {
    if (typeof value === "string" && ["src", "assetSrc"].includes(key)) {
      let url: URL;
      try { url = new URL(value); } catch { throw new MenuPublishError("INVALID_IMAGE"); }
      if (url.protocol !== "https:" && url.protocol !== "http:") throw new MenuPublishError("INVALID_IMAGE");
      return copy(value);
    }
    if (Array.isArray(value)) {
      const values = [];
      for (const entry of value) values.push(await walk(entry));
      return values;
    }
    if (value && typeof value === "object") {
      const entries = [];
      for (const [name, entry] of Object.entries(value)) entries.push([name, await walk(entry, name)]);
      return Object.fromEntries(entries);
    }
    return value;
  }
  return await walk(snapshot) as T;
}
