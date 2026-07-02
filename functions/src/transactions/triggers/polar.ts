import { onRequest } from "firebase-functions/v2/https";
import { logger } from "firebase-functions/v2";
import { defineSecret } from "firebase-functions/params";
import { validateEvent, WebhookVerificationError } from "@polar-sh/sdk/webhooks";

import { processTransaction } from "../engine";
import { upsertSubscription, resolveSubscriptionTier, getMonthlyCreditsForTier } from "../../users/upsertSubscription";
import { db } from "../../lib/firebaseAdmin";
import type { SubscriptionStatus } from "../../users/userInterface";

const polarWebhookSecret = defineSecret("POLAR_WEBHOOK_SECRET");

export const webhookPolar = onRequest(
	{
		concurrency: 50,
		timeoutSeconds: 60,
		maxInstances: 20,
		secrets: [polarWebhookSecret],
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

		// Polar uses Standard Webhooks spec (same as Svix)
		const webhookId = (req.header("webhook-id") ?? "").trim();
		const webhookTimestamp = (req.header("webhook-timestamp") ?? "").trim();
		const webhookSignature = (req.header("webhook-signature") ?? "").trim();

		if (!webhookId || !webhookTimestamp || !webhookSignature) {
			res.status(401).json({ error: "MISSING_SIGNATURE_HEADERS" });
			return;
		}

		let event: ReturnType<typeof validateEvent>;
		try {
			event = validateEvent(
				rawBody.toString("utf8"),
				{
					"webhook-id": webhookId,
					"webhook-timestamp": webhookTimestamp,
					"webhook-signature": webhookSignature,
				},
				polarWebhookSecret.value(),
			);
		} catch (err) {
			if (err instanceof WebhookVerificationError) {
				logger.warn("Polar: webhook signature verification failed", { err: String(err) });
				res.status(401).json({ error: "INVALID_SIGNATURE" });
				return;
			}
			throw err;
		}

		// ── One-time purchase (credit pack) ───────────────────────────────────
		if (event.type === "order.created") {
			const order = event.data as unknown as {
				id: string;
				subscriptionId: string | null;
				metadata: Record<string, string | number | boolean>;
				currency: string;
				totalAmount: number;
				customerId: string;
			};

		// Subscription initial orders also fire order.created — record as subscription_payment
		// and skip credit grant (credits are handled in subscription.created/updated instead).
		if (order.subscriptionId) {
			const subOrderMetadata: Record<string, unknown> = order.metadata ?? {};
			const subOrderUid = typeof subOrderMetadata.uid === "string" ? subOrderMetadata.uid : undefined;

			if (subOrderUid) {
				await processTransaction({
					uid: subOrderUid,
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
				logger.info("Polar: subscription_payment recorded", {
					uid: subOrderUid,
					polarOrderId: order.id,
				});
			} else {
				// Renewal orders don't carry checkout metadata — look up uid via subscription.
				const usersSnap = await db.collection("users")
					.where("subscription.polarSubscriptionId", "==", order.subscriptionId)
					.limit(1)
					.get();
				const renewalUid = usersSnap.docs[0]?.id;

				if (renewalUid) {
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
				} else {
					logger.warn("Polar: renewal order — could not find user for subscription, skipping", {
						polarOrderId: order.id,
						subscriptionId: order.subscriptionId,
					});
				}
			}
			res.status(200).json({ ok: true });
			return;
		}

			// IMPORTANT: uid and credits must be injected server-side when creating
			// a checkout session via the Polar API. Never trust client-supplied metadata.
			const metadata: Record<string, unknown> = order.metadata ?? {};

			const uid = typeof metadata.uid === "string" ? metadata.uid : undefined;
			if (!uid) {
				logger.error("Polar: missing uid in order metadata", { polarOrderId: order.id });
				res.status(400).json({ error: "MISSING_UID" });
				return;
			}

			const credits = typeof metadata.credits === "number" ? metadata.credits : NaN;
			if (!Number.isFinite(credits) || credits <= 0) {
				logger.error("Polar: invalid credits in order metadata", { polarOrderId: order.id });
				res.status(400).json({ error: "MISSING_CREDITS" });
				return;
			}

			const currency = order.currency ?? "USD";
			// Polar totalAmount is in smallest currency unit (cents)
			const amountMinor = order.totalAmount ?? 0;
			const polarOrderId = order.id;
			const polarCustomerId = order.customerId;

			const billingResult = await processTransaction({
				uid,
				idempotencyKey: `polar:${webhookId}:billing`,
				category: "billing",
				direction: "in",
				billing: {
					type: "buy_credits",
					currency,
					amountMinor,
					meta: {
						polarEventId: webhookId,
						polarOrderId,
						polarCustomerId,
						packId: metadata.packId,
						promoCode: metadata.promoCode,
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
						polarOrderId,
						promoCode: metadata.promoCode,
						reason: "polar_purchase",
					},
				},
			});

			logger.info("Polar: credits granted", {
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

		// ── Subscription lifecycle ─────────────────────────────────────────────
		if (
			event.type === "subscription.created" ||
			event.type === "subscription.updated" ||
			event.type === "subscription.canceled" ||
			event.type === "subscription.revoked"
		) {
			const sub = event.data as unknown as {
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
			};

			const metadata = (sub.metadata ?? {}) as Record<string, unknown>;
			const uid = typeof metadata.uid === "string" ? metadata.uid : undefined;

			if (!uid) {
				logger.error("Polar: missing uid in subscription metadata", {
					eventType: event.type,
					webhookId,
				});
				res.status(400).json({ error: "MISSING_UID" });
				return;
			}

			// subscription.revoked: access fully removed — reset to free tier immediately
			if (event.type === "subscription.revoked") {
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

			// For all other subscription events, resolve tier from product metadata.
			// Set product.metadata.tier = "creator" | "archive" in the Polar dashboard.
			const productMeta = (sub.product?.metadata ?? {}) as Record<string, unknown>;
			const tier = resolveSubscriptionTier(productMeta);

			if (!tier) {
				logger.error("Polar: missing or invalid tier in product metadata", {
					eventType: event.type,
					webhookId,
				});
				res.status(400).json({ error: "MISSING_TIER" });
				return;
			}

			const POLAR_STATUS_MAP: Record<string, SubscriptionStatus> = {
				active: "active",
				trialing: "trialing",
				past_due: "past_due",
				paused: "paused",
				canceled: "canceled",
			};
			const status: SubscriptionStatus = POLAR_STATUS_MAP[sub.status] ?? "active";

			const interval = sub.recurringInterval === "month" || sub.recurringInterval === "year"
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

			// ── Grant monthly credits for the current billing period ───────────
			// Idempotency key includes subscriptionId + tier + currentPeriodEnd so
			// each (tier, period) pair gets exactly one grant entry.
			//
			// Upgrade handling (e.g. Creator → Archive within the same period):
			//   - periodEnd is unchanged by Polar on a prorated upgrade
			//   - so the Creator key already exists; we must NOT re-grant the full 750
			//   - instead we grant only the DIFF (750 − 250 = 500)
			//
			// New period / first purchase: grant the full tier amount.
			const monthlyCredits = getMonthlyCreditsForTier(tier);
			const periodEndIso = sub.currentPeriodEnd;

			if (status === "active" && monthlyCredits > 0 && periodEndIso) {
				const incomingPeriodEndMillis = new Date(periodEndIso).getTime();
				const isSamePeriod =
					upsertResult.prevPeriodEndMillis !== null &&
					upsertResult.prevPeriodEndMillis === incomingPeriodEndMillis;

				const prevMonthlyCredits = isSamePeriod
					? getMonthlyCreditsForTier(upsertResult.prevTier)
					: 0;
				const creditsToGrant = Math.max(0, monthlyCredits - prevMonthlyCredits);

				if (creditsToGrant > 0) {
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
								// Subscription credits expire at the end of the billing period.
								// Unused monthly credits do not roll over to the next period.
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
						uid,
						tier,
						creditsToGrant,
						prevTier: upsertResult.prevTier,
						isSamePeriod,
						periodEnd: periodEndIso,
					});
				} else {
					logger.info("Polar: monthly credits skipped — downgrade within period, no additional grant", {
						uid,
						tier,
						prevTier: upsertResult.prevTier,
						periodEnd: periodEndIso,
					});
				}
			}

			res.status(200).json({ ok: true });
			return;
		}

		// ── Refund ────────────────────────────────────────────────────────────
		if (event.type === "order.refunded") {
			const order = event.data as unknown as {
				id: string;
				subscriptionId: string | null;
				metadata: Record<string, string | number | boolean>;
				currency: string;
				refundedAmount: number;
				customerId: string;
			};

			// Try uid from metadata first (direct/credit-pack refunds).
			// For subscription refunds metadata may be empty — look up via subscription.
			const refundMeta = (order.metadata ?? {}) as Record<string, unknown>;
			let refundUid = typeof refundMeta.uid === "string" ? refundMeta.uid : undefined;

			if (!refundUid && order.subscriptionId) {
				const usersSnap = await db.collection("users")
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

			await processTransaction({
				uid: refundUid,
				idempotencyKey: `polar:${webhookId}:refund`,
				category: "billing",
				direction: "out", // money going OUT of service back to user
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
			return;
		}

		// ── All other events — acknowledge and ignore ──────────────────────────
		logger.info("Polar: unhandled event type (acknowledged)", { eventType: event.type });
		res.status(200).json({ ok: true });
	},
);
