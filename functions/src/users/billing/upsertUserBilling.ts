import { db } from "../../lib/firebaseAdmin";
import type { UserBilling } from "./userBilling";

export async function upsertUserBilling(
  uid: string,
  updates: Partial<UserBilling>,
): Promise<void> {
  const payload: Record<string, any> = {}

  for (const [key, value] of Object.entries(updates)) {
    payload[`billing.${key}`] = value
  }

  await db.collection("users").doc(uid).set(payload, { merge: true })
}