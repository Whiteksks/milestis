import { logger } from "firebase-functions/v2";
import { FieldValue } from "firebase-admin/firestore";
import { db } from "../lib/firebaseAdmin";
import { processTransaction } from "../transactions/engine";

const SIGNUP_BONUS_CREDITS = 20;
const REFERRAL_BONUS_CREDITS = 10;

// Firebase Auth uids are flat, single-segment ids (<=128 chars). Reject anything else so a
// crafted `ref` value (e.g. containing "/") can't make `.doc(uid)` resolve into an unrelated
// subcollection path (Firestore path traversal via string concatenation).
function isPlausibleUid(uid: string): boolean {
  return uid.length > 0 && uid.length <= 128 && !uid.includes("/");
}

/**
 * Grants the base signup bonus (best-effort — must never fail account creation).
 * Applies to every new account regardless of referral.
 */
export async function grantSignupBonus(newUid: string): Promise<void> {
  try {
    await processTransaction({
      uid: newUid,
      idempotencyKey: `signup:${newUid}:welcome_grant`,
      category: "credit",
      direction: "in",
      credit: {
        type: "grant",
        amount: SIGNUP_BONUS_CREDITS,
        creditBucket: "bonus",
        meta: { reason: "signup_bonus" },
      },
    });
  } catch (error) {
    logger.error("[referral] Failed to grant signup bonus", { newUid, error });
  }
}

/**
 * Grants signup referral bonuses (best-effort — must never fail account creation).
 * Rewards both the new user and the referrer with REFERRAL_BONUS_CREDITS bonus credits.
 * No-op if `referrerUid` is missing, self-referral, or the referrer doesn't exist.
 */
export async function grantReferralBonus(newUid: string, referrerUid: unknown): Promise<void> {
  if (typeof referrerUid !== "string" || !isPlausibleUid(referrerUid) || referrerUid === newUid) {
    return;
  }

  try {
    const referrerSnap = await db.collection("users").doc(referrerUid).get();
    if (!referrerSnap.exists) {
      logger.warn("[referral] Referrer not found, skipping bonus", { newUid, referrerUid });
      return;
    }

    await processTransaction({
      uid: referrerUid,
      idempotencyKey: `referral:${newUid}:referrer_grant`,
      category: "credit",
      direction: "in",
      credit: {
        type: "grant",
        amount: REFERRAL_BONUS_CREDITS,
        creditBucket: "bonus",
        meta: { reason: "referral_referrer", referredUid: newUid },
      },
    });

    await processTransaction({
      uid: newUid,
      idempotencyKey: `referral:${newUid}:referred_grant`,
      category: "credit",
      direction: "in",
      credit: {
        type: "grant",
        amount: REFERRAL_BONUS_CREDITS,
        creditBucket: "bonus",
        meta: { reason: "referral_referred", referrerUid },
      },
    });

    await db.collection("referrals").doc(newUid).set({
      referrerUid,
      referredUid: newUid,
      rewardedReferrer: REFERRAL_BONUS_CREDITS,
      rewardedReferred: REFERRAL_BONUS_CREDITS,
      createdAt: FieldValue.serverTimestamp(),
    });

    logger.info("[referral] Bonus granted", { newUid, referrerUid, amount: REFERRAL_BONUS_CREDITS });
  } catch (error) {
    logger.error("[referral] Failed to grant referral bonus", { newUid, referrerUid, error });
  }
}
