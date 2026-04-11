import { onRequest } from "firebase-functions/v2/https";
import { logger } from "firebase-functions/v2";
import { defineSecret } from "firebase-functions/params";
import { Paddle, EventName } from "@paddle/paddle-node-sdk";

import { processTransaction } from "../engine";

const paddleApiKey = defineSecret("PADDLE_API_KEY");
const paddleWebhookSecret = defineSecret("PADDLE_WEBHOOK_SECRET");

export const webhookPaddle = onRequest(
	{
		concurrency: 50,
		timeoutSeconds: 60,
		maxInstances: 20,
		secrets: [paddleApiKey, paddleWebhookSecret],
	},
	async (req, res) => {
		if (req.method !== "POST") {
			res.status(405).json({ error: "METHOD_NOT_ALLOWED" });
			return;
		}

		const rawBody = (req as unknown as Record<string, unknown>).rawBody as Buffer | undefined;
		if (!rawBody) {
			res.status(400).json({ error: "RAW_BODY_REQUIRED" });
			return;
		}

		const signature = (req.header("paddle-signature") ?? "").trim();
		if (!signature) {
			res.status(401).json({ error: "MISSING_SIGNATURE" });
			return;
		}

		const paddle = new Paddle(paddleApiKey.value());

		let event: Awaited<ReturnType<typeof paddle.webhooks.unmarshal>>;
		try {
			event = await paddle.webhooks.unmarshal(
				rawBody.toString("utf8"),
				paddleWebhookSecret.value(),
				signature,
			);
		} catch (err) {
			logger.warn("Paddle: webhook signature verification failed", { err });
			res.status(401).json({ error: "INVALID_SIGNATURE" });
			return;
		}

		if (!event) {
			logger.warn("Paddle: unmarshal returned undefined");
			res.status(401).json({ error: "INVALID_SIGNATURE" });
			return;
		}

		// ── One-time purchase ──────────────────────────────────────────────────
		if (event.eventType === EventName.TransactionCompleted) {
			const txn = event.data;

			// Subscription renewals also fire transaction.completed — skip them here.
			// Their credit grant is handled by subscription activation/renewal logic.
			if (txn.subscriptionId) {
				logger.info("Paddle: subscription transaction — skipping credit grant", {
					paddleTransactionId: txn.id,
					subscriptionId: txn.subscriptionId,
				});
				res.status(200).json({ ok: true });
				return;
			}

			// IMPORTANT: custom_data must be set server-side when creating the checkout.
			// Never allow the frontend to set uid or credits — Paddle signs the payload
			// but cannot validate the contents of custom_data.
			const customData = (txn.customData ?? {}) as Record<string, unknown>;

			const uid = typeof customData.uid === "string" ? customData.uid : undefined;
			if (!uid) {
				logger.error("Paddle: missing uid in custom_data", { paddleTransactionId: txn.id });
				res.status(400).json({ error: "MISSING_UID" });
				return;
			}

			const credits = typeof customData.credits === "number" ? customData.credits : NaN;
			if (!Number.isFinite(credits) || credits <= 0) {
				logger.error("Paddle: invalid credits in custom_data", { paddleTransactionId: txn.id });
				res.status(400).json({ error: "MISSING_CREDITS" });
				return;
			}

			const currency = txn.currencyCode ?? "USD";
			// Paddle totals are strings in subunits (cents), e.g. "1000" = $10.00
			const grandTotalMinor = parseInt(txn.details?.totals?.grandTotal ?? "0", 10);
			const paddleTransactionId = txn.id;
			const paddleEventId = event.eventId;
			const paddleCustomerId = txn.customerId ?? undefined;

			const billingResult = await processTransaction({
				uid,
				idempotencyKey: `paddle:${paddleEventId}:billing`,
				category: "billing",
				direction: "in",
				billing: {
					type: "buy_credits",
					currency,
					amountMinor: grandTotalMinor,
					meta: {
						paddleEventId,
						paddleTransactionId,
						paddleCustomerId,
						packId: customData.packId,
						promoCode: customData.promoCode,
					},
				},
			});

			const creditResult = await processTransaction({
				uid,
				idempotencyKey: `paddle:${paddleEventId}:credit_grant`,
				category: "credit",
				direction: "in",
				credit: {
					type: "grant",
					amount: credits,
					billingTid: billingResult.tid,
					creditBucket: "purchased",
					meta: {
						paddleEventId,
						paddleTransactionId,
						promoCode: customData.promoCode,
						reason: "paddle_purchase",
					},
				},
			});

			logger.info("Paddle: credits granted", {
				uid,
				credits,
				billingTid: billingResult.tid,
				creditTid: creditResult.tid,
			});

			res.status(200).json({
				ok: true,
				billingTid: billingResult.tid,
				creditTid: creditResult.tid,
			});
			return;
		}

		// ── Subscription events ────────────────────────────────────────────────
		if (
			event.eventType === EventName.SubscriptionActivated ||
			event.eventType === EventName.SubscriptionUpdated ||
			event.eventType === EventName.SubscriptionCanceled
		) {
			// Subscription lifecycle is handled separately (e.g. update user plan doc).
			// Acknowledge here so Paddle stops retrying.
			logger.info("Paddle: subscription event received", {
				eventType: event.eventType,
				eventId: event.eventId,
			});
			res.status(200).json({ ok: true });
			return;
		}

		// ── All other events — acknowledge and ignore ──────────────────────────
		logger.info("Paddle: unhandled event type (acknowledged)", { eventType: event.eventType });
		res.status(200).json({ ok: true });
	},
);
