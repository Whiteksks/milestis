import { logger } from "firebase-functions/v2";
import { FieldValue } from "firebase-admin/firestore";
import { db } from "../lib/firebaseAdmin";
import { processTransaction } from "../transactions/engine";

const SIGNUP_BONUS_CREDITS = 20;
const REFERRAL_BONUS_CREDITS = 5;

// One-time bonus credits awarded to the referrer once their total referral count reaches
// a tier, on top of the flat REFERRAL_BONUS_CREDITS per referral.
const MILESTONE_TIERS: Record<number, number> = {
  5: 50,
  10: 100,
  25: 250,
};

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

    await grantMilestoneBonusIfReached(referrerUid, newUid);
  } catch (error) {
    logger.error("[referral] Failed to grant referral bonus", { newUid, referrerUid, error });
  }
}

/**
 * Checks the referrer's total referral count and grants a one-time milestone bonus
 * (see MILESTONE_TIERS) the first time it hits 5/10/25. Best-effort — must never throw.
 */
async function grantMilestoneBonusIfReached(referrerUid: string, triggeringReferredUid: string): Promise<void> {
  try {
    const countSnap = await db.collection("referrals").where("referrerUid", "==", referrerUid).count().get();
    const total = countSnap.data().count;
    const tierBonus = MILESTONE_TIERS[total];
    if (!tierBonus) return;

    await processTransaction({
      uid: referrerUid,
      idempotencyKey: `referral_milestone:${referrerUid}:${total}`,
      category: "credit",
      direction: "in",
      credit: {
        type: "grant",
        amount: tierBonus,
        creditBucket: "bonus",
        meta: { reason: "referral_milestone", tier: total },
      },
    });

    // Fold the milestone bonus into the triggering referral doc's rewardedReferrer field so
    // the account/referral stats page's sum-of-rewardedReferrer keeps reflecting total earnings.
    await db.collection("referrals").doc(triggeringReferredUid).update({
      rewardedReferrer: FieldValue.increment(tierBonus),
    });

    logger.info("[referral] Milestone bonus granted", { referrerUid, tier: total, amount: tierBonus });
  } catch (error) {
    logger.error("[referral] Failed to grant milestone bonus", { referrerUid, error });
  }
}
