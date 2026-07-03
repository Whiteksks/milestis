/**
 * Handler for Polar subscription lifecycle events:
 *   subscription.created / subscription.updated / subscription.canceled / subscription.revoked
 *
 * Responsibilities:
 *  - Upsert the user's subscription record in Firestore
 *  - Grant subscription credits for the new billing period
 *
 * Upgrade diff logic (e.g. Creator → Archive mid-period):
 *  Polar does not change currentPeriodEnd on a prorated upgrade, so if the
 *  period end is identical to the previous one we only grant the DIFF between
 *  tiers rather than the full new-tier amount.
 *
 * Annual subscriptions:
 *  Polar fires one webhook per year, so we multiply monthlyCredits × 12.
 */

import { logger } from "firebase-functions/v2";
import type { Response } from "express";
import { processTransaction } from "../engine";
import {
	upsertSubscription,
	resolveSubscriptionTier,
	getMonthlyCreditsForTier,
	type UpsertSubscriptionResult,
} from "../../users/upsertSubscription";
import type { SubscriptionTier, SubscriptionStatus } from "../../users/userInterface";

// ─── Polar subscription shape (camelCase as returned by validateEvent) ────────

interface PolarSubscriptionEvent {
	id: string;
	customerId: string;
	status: string;
	amount: number;
	currency: string;
	currentPeriodEnd: string | null;
	cancelAtPeriodEnd: boolean;
	recurringInterval: "month" | "year" | null;
	metadata: Record<string, unknown>;
	product: { id: string; metadata: Record<string, unknown> };
}

const POLAR_STATUS_MAP: Record<string, SubscriptionStatus> = {
	active: "active",
	trialing: "trialing",
	past_due: "past_due",
	paused: "paused",
	canceled: "canceled",
};

// ─── Main handler ─────────────────────────────────────────────────────────────

export async function handleSubscription(
	eventType: string,
	webhookId: string,
	rawData: unknown,
	res: Response,
): Promise<void> {
	const sub = rawData as PolarSubscriptionEvent;
	const metadata = (sub.metadata ?? {}) as Record<string, unknown>;
	const uid = typeof metadata.uid === "string" ? metadata.uid : undefined;

	if (!uid) {
		logger.error("Polar: missing uid in subscription metadata", {
			eventType,
			webhookId,
			metadata,
		});
		res.status(400).json({ error: "MISSING_UID" });
		return;
	}

	// subscription.revoked: access fully removed — reset to free tier immediately.
	if (eventType === "subscription.revoked") {
		await upsertSubscription({
			uid,
			webhookId,
			polarSubscriptionId: sub.id,
			polarCustomerId: sub.customerId,
			tier: "free",
			status: "canceled",
			amountMinor: 0,
			currency: sub.currency ?? "usd",
			currentPeriodEnd: null,
			cancelAtPeriodEnd: false,
		});
		res.status(200).json({ ok: true });
		return;
	}

	// For all other events resolve tier from product.metadata.tier.
	// Set product.metadata.tier = "creator" | "archive" in the Polar dashboard.
	const productMeta = (sub.product?.metadata ?? {}) as Record<string, unknown>;
	const tier = resolveSubscriptionTier(productMeta);

	if (!tier) {
		logger.error("Polar: missing or invalid tier in product metadata", {
			eventType,
			webhookId,
			productMeta,
		});
		res.status(400).json({ error: "MISSING_TIER" });
		return;
	}

	const status: SubscriptionStatus = POLAR_STATUS_MAP[sub.status] ?? "active";
	const interval =
		sub.recurringInterval === "month" || sub.recurringInterval === "year"
			? sub.recurringInterval
			: undefined;

	const upsertResult = await upsertSubscription({
		uid,
		webhookId,
		polarSubscriptionId: sub.id,
		polarCustomerId: sub.customerId,
		polarProductId: sub.product?.id,
		tier,
		interval,
		status,
		amountMinor: sub.amount ?? 0,
		currency: sub.currency ?? "usd",
		currentPeriodEnd: sub.currentPeriodEnd ? new Date(sub.currentPeriodEnd) : null,
		cancelAtPeriodEnd: sub.cancelAtPeriodEnd ?? false,
	});

	// Grant monthly credits for the new billing period (non-fatal if it fails).
	await grantSubscriptionCredits({
		uid,
		sub,
		tier,
		interval,
		status,
		upsertResult,
	});

	res.status(200).json({ ok: true });
}

// ─── Monthly credit grant ─────────────────────────────────────────────────────

interface GrantParams {
	uid: string;
	sub: PolarSubscriptionEvent;
	tier: SubscriptionTier;
	interval: "month" | "year" | undefined;
	status: SubscriptionStatus;
	upsertResult: UpsertSubscriptionResult;
}

async function grantSubscriptionCredits(params: GrantParams): Promise<void> {
	const { uid, sub, tier, interval, status, upsertResult } = params;

	const monthlyCredits = getMonthlyCreditsForTier(tier);
	const periodEndIso = sub.currentPeriodEnd;

	if (status !== "active" || monthlyCredits <= 0 || !periodEndIso) return;

	const incomingPeriodEndMillis = new Date(periodEndIso).getTime();
	const isSamePeriod =
		upsertResult.prevPeriodEndMillis !== null &&
		upsertResult.prevPeriodEndMillis === incomingPeriodEndMillis;

	// Annual plans: one webhook per year → multiply by 12.
	const periodMultiplier = interval === "year" ? 12 : 1;
	const periodCredits = monthlyCredits * periodMultiplier;

	// Upgrade mid-period: only grant the diff so we don't double-grant.
	const prevMonthlyCredits = isSamePeriod
		? getMonthlyCreditsForTier(upsertResult.prevTier) * periodMultiplier
		: 0;
	const creditsToGrant = Math.max(0, periodCredits - prevMonthlyCredits);

	if (creditsToGrant <= 0) {
		logger.info("Polar: monthly credits skipped — downgrade within period, no additional grant", {
			uid, tier, prevTier: upsertResult.prevTier, periodEnd: periodEndIso,
		});
		return;
	}

	try {
		await processTransaction({
			uid,
			idempotencyKey: `polar:sub:${sub.id}:credits:${tier}:${periodEndIso}`,
			category: "credit",
			direction: "in",
			credit: {
				type: "grant",
				amount: creditsToGrant,
				creditBucket: "subscription",
				lot: {
					// Subscription credits expire at period end and do not roll over.
					expiresAtMillis: incomingPeriodEndMillis,
				},
				meta: {
					reason: "subscription_monthly_grant",
					polarSubscriptionId: sub.id,
					tier,
					periodEnd: periodEndIso,
					prevTier: upsertResult.prevTier,
					creditsToGrant,
				},
			},
		});

		logger.info("Polar: monthly credits granted", {
			uid, tier, creditsToGrant, prevTier: upsertResult.prevTier,
			isSamePeriod, periodEnd: periodEndIso,
		});
	} catch (err) {
		// Non-fatal: subscription was already upserted. Log and move on.
		// Polar will NOT retry because the outer handler already sent 200.
		logger.error("Polar: monthly credit grant failed — subscription still updated", {
			uid, tier, creditsToGrant, err: String(err),
		});
	}
}
