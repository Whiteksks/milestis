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
import { FieldValue } from "firebase-admin/firestore";
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

function encodeDocId(raw: string): string {
	return Buffer.from(raw, "utf8").toString("base64url");
}

async function recordPolarAuditEvent(
	webhookId: string,
	eventType: string,
	payload: Record<string, unknown>,
): Promise<void> {
	const auditRef = db.collection("polarWebhookAudit").doc(encodeDocId(`${eventType}:${webhookId}`));
	await auditRef.set({
		webhookId,
		eventType,
		provider: "polar",
		createdAt: FieldValue.serverTimestamp(),
		...payload,
	}, { merge: false });
}

async function findUserByPolarIdentifiers(params: {
	uid?: string;
	subscriptionId?: string | null;
	customerId?: string | null;
}): Promise<string | null> {
	if (params.uid) return params.uid;

	if (params.subscriptionId) {
		const usersSnap = await db
			.collection("users")
			.where("subscription.polarSubscriptionId", "==", params.subscriptionId)
			.limit(1)
			.get();
		const uid = usersSnap.docs[0]?.id;
		if (uid) return uid;
	}

	if (params.customerId) {
		const usersSnap = await db
			.collection("users")
			.where("subscription.polarCustomerId", "==", params.customerId)
			.limit(1)
			.get();
		return usersSnap.docs[0]?.id ?? null;
	}

	return null;
}

async function findOriginalBillingTransaction(orderId: string): Promise<string | undefined> {
	const txSnap = await db
		.collection("transactions")
		.where("meta.polarOrderId", "==", orderId)
		.limit(10)
		.get();

	return txSnap.docs.find((doc) => {
		const data = doc.data();
		return data.category === "billing" && data.direction === "in";
	})?.id;
}

// ─── order.created ────────────────────────────────────────────────────────────

export async function handleOrderCreated(
	webhookId: string,
	rawData: unknown,
	res: Response,
): Promise<void> {
	const order = rawData as PolarOrder;

	logger.info("Polar: order.created received", {
		orderId: order.id,
		subscriptionId: order.subscriptionId ?? null,
		totalAmount: order.totalAmount,
		currency: order.currency,
		metadataKeys: Object.keys(order.metadata ?? {}),
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

	// Renewal orders don't carry checkout metadata — look up uid via subscriptionId,
	// then by customerId as a fallback for out-of-order webhook delivery.
	let usersSnap = await db
		.collection("users")
		.where("subscription.polarSubscriptionId", "==", order.subscriptionId)
		.limit(1)
		.get();

	if (usersSnap.empty) {
		usersSnap = await db
			.collection("users")
			.where("subscription.polarCustomerId", "==", order.customerId)
			.limit(1)
			.get();
	}

	const renewalUid = usersSnap.docs[0]?.id;

	if (!renewalUid) {
		logger.error("Polar: renewal order — could not find user for subscription", {
			polarOrderId: order.id,
			subscriptionId: order.subscriptionId,
			customerId: order.customerId,
		});
		throw new Error(`Polar renewal user not found for subscription ${order.subscriptionId}`);
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
	const refundUid = await findUserByPolarIdentifiers({
		uid: typeof metadata.uid === "string" ? metadata.uid : undefined,
		subscriptionId: order.subscriptionId,
		customerId: order.customerId,
	});
	const refundedTxId = await findOriginalBillingTransaction(order.id);

	if (!refundUid) {
		await recordPolarAuditEvent(webhookId, "order.refunded", {
			status: "unresolved_user",
			polarOrderId: order.id,
			polarCustomerId: order.customerId,
			polarSubscriptionId: order.subscriptionId ?? null,
			currency: order.currency ?? "USD",
			refundedAmount: order.refundedAmount ?? 0,
			metadataKeys: Object.keys(metadata),
		});

		logger.warn("Polar: refund — could not resolve uid, audit event recorded", {
			polarOrderId: order.id,
			webhookId,
		});
		res.status(200).json({ ok: true, audited: true });
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
				...(refundedTxId ? { refundedTxId } : {}),
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
