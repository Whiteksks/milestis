import { FieldValue } from "firebase-admin/firestore";
import { logger } from "firebase-functions/v2";
import { db } from "../lib/firebaseAdmin";
import type { SubscriptionTier, SubscriptionStatus, SubscriptionFeatures } from "./userInterface";

// ── Per-tier feature limits — adjust to match your pricing page ───────────
const TIER_FEATURES: Record<SubscriptionTier, SubscriptionFeatures> = {
	free: {
		maxProjects: 5,
		maxStorageBytes: 1 * 1024 * 1024 * 1024, // 1 GB
		canRemoveBranding: false,
		photographerWorkspace: false,
		monthlyCredits: 0,
		creditTopupRatePerDollar: 1, // base rate: 1 credit per $1
		prioritySupport: false,
	},
	explorer: {
		maxProjects: 5,
		maxStorageBytes: 1 * 1024 * 1024 * 1024, // 1 GB
		canRemoveBranding: false,
		photographerWorkspace: false,
		monthlyCredits: 0,
		creditTopupRatePerDollar: 1, // base rate: 1 credit per $1
		prioritySupport: false,
	},
	creator: {
		maxProjects: 25,
		maxStorageBytes: 10 * 1024 * 1024 * 1024, // 10 GB
		canRemoveBranding: true,
		photographerWorkspace: true,
		monthlyCredits: 250,
		creditTopupRatePerDollar: 5, // subscriber rate: 5 credits per $1
		prioritySupport: false,
	},
	archive: {
		maxProjects: 100,
		maxStorageBytes: 50 * 1024 * 1024 * 1024, // 50 GB
		canRemoveBranding: true,
		photographerWorkspace: true,
		monthlyCredits: 750,
		creditTopupRatePerDollar: 5, // subscriber rate: 5 credits per $1
		prioritySupport: true,
	},
};

const VALID_TIERS = new Set<string>(["free", "explorer", "creator", "archive"]);

/**
 * Returns the number of credits to grant at the start of each billing period
 * for the given tier. Returns 0 for tiers without monthly credits.
 */
export function getMonthlyCreditsForTier(tier: SubscriptionTier): number {
	return TIER_FEATURES[tier]?.monthlyCredits ?? 0;
}

export interface UpsertSubscriptionInput {
	uid: string;
	webhookId: string;
	polarSubscriptionId: string;
	polarCustomerId: string;
	polarProductId?: string;
	tier: SubscriptionTier;
	interval?: "month" | "year";
	status: SubscriptionStatus;
	amountMinor: number; // in cents
	currency: string;
	currentPeriodEnd: Date | null;
	cancelAtPeriodEnd: boolean;
}

export interface UpsertSubscriptionResult {
	/** The tier the user was on BEFORE this update (captured inside the transaction). */
	prevTier: SubscriptionTier;
	/** Milliseconds of currentPeriodEnd BEFORE this update, or null if not set. */
	prevPeriodEndMillis: number | null;
}

/**
 * Resolve the subscription tier from Polar product.metadata.tier.
 * You set this field in the Polar dashboard per-product (e.g. "creator", "archive").
 * Returns null if the value is missing or not a recognised tier.
 */
export function resolveSubscriptionTier(
	productMetadata: Record<string, unknown>,
): SubscriptionTier | null {
	const tier = productMetadata?.tier;
	if (typeof tier === "string" && VALID_TIERS.has(tier)) {
		return tier as SubscriptionTier;
	}
	return null;
}

/**
 * Atomically syncs one Polar subscription event to the user's Firestore doc.
 *
 * Idempotency guarantee:
 *   The write is keyed by `webhookId` in `subscriptionIdempotency/{base64(webhookId)}`.
 *   If Polar retries the same event, the second call is a safe no-op.
 *   Both the idempotency record and the user update land in one Firestore transaction.
 */
export async function upsertSubscription(input: UpsertSubscriptionInput): Promise<UpsertSubscriptionResult> {
	const idemId = Buffer.from(`sub:${input.webhookId}`, "utf8").toString("base64url");
	const idemRef = db.collection("subscriptionIdempotency").doc(idemId);
	const userRef = db.collection("users").doc(input.uid);

	const result: UpsertSubscriptionResult = { prevTier: "free", prevPeriodEndMillis: null };

	await db.runTransaction(async (tx) => {
		const [idemSnap, userSnap] = await Promise.all([
			tx.get(idemRef),
			tx.get(userRef),
		]);

		if (idemSnap.exists) {
			logger.info("upsertSubscription: idempotent — already processed", {
				webhookId: input.webhookId,
				uid: input.uid,
			});
			return;
		}

		if (!userSnap.exists) {
			throw new Error(`upsertSubscription: user not found — uid=${input.uid}`);
		}

		// Capture the previous subscription state BEFORE writing the update.
		const prevSub = userSnap.data()?.subscription as Record<string, unknown> | undefined;
		result.prevTier = (typeof prevSub?.planTier === "string" ? prevSub.planTier : "free") as SubscriptionTier;
		const prevPeriodEndTs = prevSub?.currentPeriodEnd as { toMillis?: () => number } | null | undefined;
		result.prevPeriodEndMillis = typeof prevPeriodEndTs?.toMillis === "function"
			? prevPeriodEndTs.toMillis()
			: null;

		const features = TIER_FEATURES[input.tier];

		const userUpdates: Record<string, unknown> = {
			"subscription.planTier": input.tier,
			...(input.interval ? { "subscription.planInterval": input.interval } : {}),
			"subscription.status": input.status,
			"subscription.features": features,
			"subscription.cancelAtPeriodEnd": input.cancelAtPeriodEnd,
			"subscription.currency": input.currency,
			"subscription.amount": input.amountMinor,
			"subscription.polarSubscriptionId": input.polarSubscriptionId,
			"subscription.polarCustomerId": input.polarCustomerId,
			...(input.polarProductId ? { "subscription.polarProductId": input.polarProductId } : {}),
		};

		if (input.currentPeriodEnd) {
			userUpdates["subscription.currentPeriodEnd"] = input.currentPeriodEnd;
		}

		tx.set(idemRef, {
			uid: input.uid,
			webhookId: input.webhookId,
			tier: input.tier,
			status: input.status,
			processedAt: FieldValue.serverTimestamp(),
		});

		tx.update(userRef, userUpdates);
	});

	logger.info("upsertSubscription: done", {
		uid: input.uid,
		tier: input.tier,
		status: input.status,
		polarSubscriptionId: input.polarSubscriptionId,
	});

	return result;
}
