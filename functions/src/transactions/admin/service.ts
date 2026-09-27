import { getAuth } from "firebase-admin/auth";
import { HttpsError } from "firebase-functions/v2/https";
import { db } from "../../lib/firebaseAdmin";
import { availableCreditsInTransaction, processTransaction, TransactionEngineError } from "../engine";
import { MAX_COMPENSATION_CREDITS, type CreditAccount, type CompensationInput, type CompensationReceipt } from "./contracts";

export async function assertCreditsAdmin(uid: string) {
  const user = await getAuth().getUser(uid);
  if (user.disabled || user.customClaims?.creditsAdmin !== true) throw new HttpsError("permission-denied", "CREDITS_ADMIN_REQUIRED");
}

export async function findCreditAccount(identifier: unknown): Promise<CreditAccount> {
  if (typeof identifier !== "string" || !identifier.trim() || identifier.length > 254) throw new HttpsError("invalid-argument", "INVALID_ACCOUNT");
  const value = identifier.trim();
  if (!value.includes("@") && (value.includes("/") || value.length > 128)) throw new HttpsError("invalid-argument", "INVALID_ACCOUNT");
  const user = value.includes("@") ? await getAuth().getUserByEmail(value) : await getAuth().getUser(value);
  if (user.disabled) throw new HttpsError("failed-precondition", "ACCOUNT_DISABLED");
  return db.runTransaction(async (tx) => {
    const profile = await tx.get(db.collection("users").doc(user.uid));
    if (!profile.exists) throw new HttpsError("not-found", "ACCOUNT_NOT_FOUND");
    let availableCredits: number | null = null;
    let needsReconciliation = false;
    try { availableCredits = await availableCreditsInTransaction(tx, user.uid); }
    catch (error) {
      if (!(error instanceof TransactionEngineError) || error.code !== "balance_inconsistent") throw error;
      needsReconciliation = true;
    }
    const value = profile.data()!.balance;
    const balance = value && [value.total, value.purchased, value.subscription, value.bonus].every((n) => Number.isSafeInteger(n) && n >= 0)
      ? { total: value.total, purchased: value.purchased, subscription: value.subscription, bonus: value.bonus } : null;
    return { uid: user.uid, email: user.email ?? null, displayName: user.displayName ?? null,
      balance, availableCredits, needsReconciliation };
  });
}

export async function grantCompensation(adminUid: string, input: Partial<CompensationInput>): Promise<CompensationReceipt> {
  const { targetUid, amount, requestId } = input;
  const reason = typeof input.reason === "string" ? input.reason.trim() : "";
  if (typeof targetUid !== "string" || !targetUid || targetUid.length > 128 || targetUid.includes("/")
    || typeof amount !== "number" || !Number.isSafeInteger(amount) || amount < 1 || amount > MAX_COMPENSATION_CREDITS
    || reason.length < 3 || reason.length > 500 || typeof requestId !== "string" || !/^[a-zA-Z0-9_-]{16,128}$/.test(requestId)) {
    throw new HttpsError("invalid-argument", "INVALID_COMPENSATION");
  }
  const target = await getAuth().getUser(targetUid);
  if (target.disabled) throw new HttpsError("failed-precondition", "ACCOUNT_DISABLED");
  const result = await processTransaction({
    uid: targetUid, idempotencyKey: `compensation:${adminUid}:${requestId}`, category: "credit", direction: "in",
    credit: { type: "admin_adjustment", creditBucket: "bonus", amount,
      meta: { reason: "support_compensation", note: reason, adminUid } },
  });
  return { tid: result.tid, targetUid, amount, balance: result.balanceSnapshot, idempotent: result.idempotent };
}
