/**
 * Polar webhook entrypoint.
 *
 * Responsibilities (only):
 *  - Validate HTTP method
 *  - Read and verify the webhook signature (Standard Webhooks / Svix spec)
 *  - Route the validated event to the appropriate domain handler
 *  - Return a well-formed HTTP response in all cases
 *
 * Domain logic lives in:
 *  polar-order.ts        — order.created, order.refunded
 *  polar-subscription.ts — subscription lifecycle events
 */

import { onRequest } from "firebase-functions/v2/https";
import { logger } from "firebase-functions/v2";
import { defineSecret } from "firebase-functions/params";
import { validateEvent, WebhookVerificationError } from "@polar-sh/sdk/webhooks";

import { handleOrderCreated, handleOrderRefunded } from "./polar-order";
import { handleSubscription } from "./polar-subscription";

const polarWebhookSecret = defineSecret("POLAR_WEBHOOK_SECRET");

export const webhookPolar = onRequest(
	{
		concurrency: 50,
		timeoutSeconds: 60,
		maxInstances: 20,
		secrets: [polarWebhookSecret],
	},
	async (req, res) => {
		// ── 1. Method guard ───────────────────────────────────────────────────
		if (req.method !== "POST") {
			res.status(405).json({ error: "METHOD_NOT_ALLOWED" });
			return;
		}

		// ── 2. Raw body (required for signature verification) ─────────────────
		const rawBody = (req as unknown as Record<string, unknown>).rawBody as Buffer | undefined;
		if (!rawBody) {
			res.status(400).json({ error: "RAW_BODY_REQUIRED" });
			return;
		}

		// ── 3. Signature headers ──────────────────────────────────────────────
		const webhookId        = (req.header("webhook-id")        ?? "").trim();
		const webhookTimestamp = (req.header("webhook-timestamp")  ?? "").trim();
		const webhookSignature = (req.header("webhook-signature")  ?? "").trim();

		if (!webhookId || !webhookTimestamp || !webhookSignature) {
			res.status(401).json({ error: "MISSING_SIGNATURE_HEADERS" });
			return;
		}

		// ── 4. Verify signature ───────────────────────────────────────────────
		let event: ReturnType<typeof validateEvent>;
		try {
			event = validateEvent(
				rawBody.toString("utf8"),
				{
					"webhook-id":        webhookId,
					"webhook-timestamp": webhookTimestamp,
					"webhook-signature": webhookSignature,
				},
				polarWebhookSecret.value(),
			);
		} catch (err) {
			if (err instanceof WebhookVerificationError) {
				logger.warn("Polar: signature verification failed", { err: String(err) });
				res.status(401).json({ error: "INVALID_SIGNATURE" });
				return;
			}
			throw err;
		}

		logger.info("Polar: webhook received", { eventType: event.type, webhookId });

		// ── 5. Route to domain handler ────────────────────────────────────────
		try {
			if (event.type === "order.created") {
				await handleOrderCreated(webhookId, event.data, res);
				return;
			}

			if (event.type === "order.refunded") {
				await handleOrderRefunded(webhookId, event.data, res);
				return;
			}

			if (
				event.type === "subscription.created"  ||
				event.type === "subscription.updated"  ||
				event.type === "subscription.canceled" ||
				event.type === "subscription.revoked"
			) {
				await handleSubscription(event.type, webhookId, event.data, res);
				return;
			}

			// Unrecognised event — acknowledge so Polar stops retrying.
			logger.info("Polar: unhandled event type (acknowledged)", { eventType: event.type });
			res.status(200).json({ ok: true });
		} catch (err) {
			// Catch any unhandled error from a domain handler.
			// Returning 500 causes Polar to retry the delivery.
			logger.error("Polar: unhandled error in webhook handler", {
				eventType: event.type,
				webhookId,
				err: String(err),
			});
			res.status(500).json({ error: "INTERNAL_ERROR" });
		}
	},
);
