import { db } from "../../lib/firebaseAdmin";
import type { UserModeration } from "./userModeration";

export async function upsertUserModeration(
  uid: string,
  updates: Partial<UserModeration>,
): Promise<void> {
  const payload: Record<string, unknown> = {};

  for (const [key, value] of Object.entries(updates)) {
    payload[`moderation.${key}`] = value;
  }

  await db
    .collection("users")
    .doc(uid)
    .set(payload, { merge: true });
}