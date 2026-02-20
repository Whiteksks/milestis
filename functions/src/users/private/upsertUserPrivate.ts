import { FieldValue } from "firebase-admin/firestore";
import { db } from "../../lib/firebaseAdmin";
import type { UserPrivateDocument } from "./userPrivate";

function isPlainObject(value: unknown): value is Record<string, unknown> {
  if (!value || typeof value !== "object") return false;
  if (Array.isArray(value)) return false;
  if (value instanceof Date) return false;
  if (value instanceof FieldValue) return false;
  return Object.getPrototypeOf(value) === Object.prototype;
}

function toDotNotation(
  updates: Record<string, unknown>,
  prefix = "",
): Record<string, unknown> {
  const out: Record<string, unknown> = {};

  for (const [key, value] of Object.entries(updates)) {
    if (value === undefined) continue;

    const path = prefix ? `${prefix}.${key}` : key;

    if (isPlainObject(value)) {
      const nested = toDotNotation(value, path);
      for (const [nestedKey, nestedValue] of Object.entries(nested)) {
        out[nestedKey] = nestedValue;
      }
      continue;
    }

    out[path] = value;
  }

  return out;
}

export async function upsertUserPrivate(
  userId: string,
  updates: Partial<UserPrivateDocument>,
): Promise<void> {
  const dotUpdates = toDotNotation(updates as Record<string, unknown>);

  // Обновляем системный timestamp
  dotUpdates["system.updatedAt"] = FieldValue.serverTimestamp();

  await db
    .collection("users")
    .doc(userId)
    .collection("private")
    .doc("data")
    .set(dotUpdates, { merge: true });
}