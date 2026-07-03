/**
 * Handlers for Polar order events (order.created, order.refunded).
 *
 * order.created covers two distinct cases:
 *  1. Subscription initial / renewal payment  → records a billing transaction only
 *  2. One-time credit topup                   → records billing + grants credits
 *
 * Credits are always computed from order.totalAmount × ratePerDollar so the
 * user cannot gain extra credits by altering the checkout amount.
 */

import { logger } from "firebase-functions/v2";
import type { Response } from "express";
import { processTransaction } from "../engine";
import { db } from "../../lib/firebaseAdmin";

// ─── Polar order shape (camelCase as returned by validateEvent) ───────────────

interface PolarOrder {
	id: string;
	subscriptionId: string | null;
	metadata: Record<string, unknown>;
	currency: string;
	totalAmount: number;
	customerId: string;
}

interface PolarRefundOrder {
	id: string;
	subscriptionId: string | null;
	metadata: Record<string, unknown>;
	currency: string;
	refundedAmount: number;
	customerId: string;
}

// ─── order.created ────────────────────────────────────────────────────────────

export async function handleOrderCreated(
	webhookId: string,
	rawData: unknown,
	res: Response,
): Promise<void> {
	const order = rawData as PolarOrder;

	// Debug log — visible in Firebase Functions console.
	// Helps diagnose metadata propagation issues between checkout and order.
	logger.info("Polar: order.created received", {
		orderId: order.id,
		subscriptionId: order.subscriptionId ?? null,
		totalAmount: order.totalAmount,
		currency: order.currency,
		metadataKeys: Object.keys(order.metadata ?? {}),
		metadata: order.metadata ?? {},
	});

	if (order.subscriptionId) {
		await recordSubscriptionOrder(webhookId, order);
		res.status(200).json({ ok: true });
		return;
	}

	await grantCreditTopup(webhookId, order, res);
}

// ─── Subscription billing (initial checkout + renewals) ───────────────────────

async function recordSubscriptionOrder(
	webhookId: string,
	order: PolarOrder,
): Promise<void> {
	const metadata = order.metadata ?? {};
	const uid = typeof metadata.uid === "string" ? metadata.uid : undefined;

	if (uid) {
		// Initial subscription checkout — uid is in checkout metadata.
		await processTransaction({
			uid,
			idempotencyKey: `polar:${webhookId}:sub_billing`,
			category: "billing",
			direction: "in",
			billing: {
				type: "subscription_payment",
				currency: order.currency ?? "USD",
				amountMinor: order.totalAmount ?? 0,
				meta: {
					polarEventId: webhookId,
					polarOrderId: order.id,
					polarCustomerId: order.customerId,
					polarSubscriptionId: order.subscriptionId,
				},
			},
		});
		logger.info("Polar: subscription_payment recorded", { uid, polarOrderId: order.id });
		return;
	}

	// Renewal orders don't carry checkout metadata — look up uid via subscriptionId.
	const usersSnap = await db
		.collection("users")
		.where("subscription.polarSubscriptionId", "==", order.subscriptionId)
		.limit(1)
		.get();
	const renewalUid = usersSnap.docs[0]?.id;

	if (!renewalUid) {
		logger.warn("Polar: renewal order — could not find user for subscription, skipping", {
			polarOrderId: order.id,
			subscriptionId: order.subscriptionId,
		});
		return;
	}

	await processTransaction({
		uid: renewalUid,
		idempotencyKey: `polar:${webhookId}:sub_billing`,
		category: "billing",
		direction: "in",
		billing: {
			type: "subscription_payment",
			currency: order.currency ?? "USD",
			amountMinor: order.totalAmount ?? 0,
			meta: {
				polarEventId: webhookId,
				polarOrderId: order.id,
				polarCustomerId: order.customerId,
				polarSubscriptionId: order.subscriptionId,
			},
		},
	});
	logger.info("Polar: subscription renewal payment recorded", {
		uid: renewalUid,
		polarOrderId: order.id,
	});
}

// ─── Credit topup ─────────────────────────────────────────────────────────────

async function grantCreditTopup(
	webhookId: string,
	order: PolarOrder,
	res: Response,
): Promise<void> {
	const metadata = order.metadata ?? {};

	const uid = typeof metadata.uid === "string" ? metadata.uid : undefined;
	if (!uid) {
		logger.error("Polar: credit topup — missing uid in order metadata", {
			polarOrderId: order.id,
			metadata,
		});
		res.status(400).json({ error: "MISSING_UID" });
		return;
	}

	// ratePerDollar may arrive as number or string depending on Polar serialization.
	const rawRate = metadata.ratePerDollar;
	const ratePerDollar =
		typeof rawRate === "number" ? rawRate :
		typeof rawRate === "string" ? parseFloat(rawRate) : NaN;

	if (!Number.isFinite(ratePerDollar) || ratePerDollar <= 0) {
		logger.error("Polar: credit topup — missing or invalid ratePerDollar", {
			polarOrderId: order.id,
			rawRate,
			metadata,
		});
		res.status(400).json({ error: "MISSING_RATE" });
		return;
	}

	// Credits = actual amount paid × rate. User cannot gain extra credits by
	// changing the checkout amount because we derive credits from totalAmount here.
	const credits = Math.floor((order.totalAmount / 100) * ratePerDollar);
	if (credits <= 0) {
		logger.error("Polar: credit topup — computed credits is zero", {
			polarOrderId: order.id,
			totalAmount: order.totalAmount,
			ratePerDollar,
		});
		res.status(400).json({ error: "ZERO_CREDITS" });
		return;
	}

	try {
		const billingResult = await processTransaction({
			uid,
			idempotencyKey: `polar:${webhookId}:billing`,
			category: "billing",
			direction: "in",
			billing: {
				type: "buy_credits",
				currency: order.currency ?? "USD",
				amountMinor: order.totalAmount ?? 0,
				meta: {
					polarEventId: webhookId,
					polarOrderId: order.id,
					polarCustomerId: order.customerId,
				},
			},
		});

		const creditResult = await processTransaction({
			uid,
			idempotencyKey: `polar:${webhookId}:credit_grant`,
			category: "credit",
			direction: "in",
			credit: {
				type: "grant",
				amount: credits,
				billingTid: billingResult.tid,
				creditBucket: "purchased",
				meta: {
					polarEventId: webhookId,
					polarOrderId: order.id,
					reason: "polar_purchase",
					totalAmount: order.totalAmount,
					ratePerDollar,
				},
			},
		});

		logger.info("Polar: credits granted", {
			uid,
			credits,
			billingTid: billingResult.tid,
			creditTid: creditResult.tid,
			totalAmount: order.totalAmount,
			ratePerDollar,
		});

		res.status(200).json({
			ok: true,
			billingTid: billingResult.tid,
			creditTid: creditResult.tid,
		});
	} catch (err) {
		// Return 500 so Polar retries the webhook.
		logger.error("Polar: credit topup — processTransaction failed", {
			polarOrderId: order.id,
			uid,
			credits,
			err: String(err),
		});
		res.status(500).json({ error: "TRANSACTION_FAILED" });
	}
}

// ─── order.refunded ───────────────────────────────────────────────────────────

export async function handleOrderRefunded(
	webhookId: string,
	rawData: unknown,
	res: Response,
): Promise<void> {
	const order = rawData as PolarRefundOrder;
	const metadata = (order.metadata ?? {}) as Record<string, unknown>;
	let refundUid = typeof metadata.uid === "string" ? metadata.uid : undefined;

	if (!refundUid && order.subscriptionId) {
		const usersSnap = await db
			.collection("users")
			.where("subscription.polarSubscriptionId", "==", order.subscriptionId)
			.limit(1)
			.get();
		refundUid = usersSnap.docs[0]?.id;
	}

	if (!refundUid) {
		logger.warn("Polar: refund — could not resolve uid, acknowledging without record", {
			polarOrderId: order.id,
			webhookId,
		});
		res.status(200).json({ ok: true });
		return;
	}

	try {
		await processTransaction({
			uid: refundUid,
			idempotencyKey: `polar:${webhookId}:refund`,
			category: "billing",
			direction: "out",
			billing: {
				type: "refund",
				currency: order.currency ?? "USD",
				amountMinor: order.refundedAmount ?? 0,
				meta: {
					polarEventId: webhookId,
					polarOrderId: order.id,
					polarCustomerId: order.customerId,
					...(order.subscriptionId ? { polarSubscriptionId: order.subscriptionId } : {}),
				},
			},
		});

		logger.info("Polar: refund recorded", {
			uid: refundUid,
			polarOrderId: order.id,
			refundedAmount: order.refundedAmount,
		});

		res.status(200).json({ ok: true });
	} catch (err) {
		logger.error("Polar: refund — processTransaction failed", {
			polarOrderId: order.id,
			uid: refundUid,
			err: String(err),
		});
		res.status(500).json({ error: "TRANSACTION_FAILED" });
	}
}
