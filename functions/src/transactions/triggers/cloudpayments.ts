import crypto from "crypto";

import { onRequest } from "firebase-functions/v2/https";
import { logger } from "firebase-functions/v2";
import { defineSecret } from "firebase-functions/params";

import { processTransaction } from "../engine";
import type { Currency } from "../types";

const cloudPaymentsSecret = defineSecret("CLOUDPAYMENTS_WEBHOOK_SECRET");

type CloudPaymentsWebhookBody = {
	TransactionId?: string | number;
	InvoiceId?: string;
	AccountId?: string; // we treat as uid
	Amount?: number;
	Currency?: Currency | string;
	Status?: string;
	Success?: boolean;
	CardFirstSix?: string;
	CardLastFour?: string;
	CardType?: string;
	CardExpDate?: string;
	IpCountry?: string;
	Data?: {
		credits?: number;
		packId?: string;
		promoCode?: string;
	};
	Credits?: number;
	PackId?: string;
	PromoCode?: string;
};

function timingSafeEqualString(a: string, b: string): boolean {
	const ab = Buffer.from(a);
	const bb = Buffer.from(b);
	if (ab.length !== bb.length) return false;
	return crypto.timingSafeEqual(ab, bb);
}

function verifyCloudPaymentsSignature(
	rawBody: Buffer,
	signatureHeader: string | undefined,
	secret: string,
): boolean {
	if (!signatureHeader) return false;
	const expected = crypto
		.createHmac("sha256", secret)
		.update(rawBody)
		.digest("base64");
	return timingSafeEqualString(expected, signatureHeader);
}

function isSuccessfulPayment(body: CloudPaymentsWebhookBody): boolean {
	if (body.Success === true) return true;
	const status = (body.Status ?? "").toString().toLowerCase();
	return status === "completed" || status === "success" || status === "paid";
}

export const webhookCloudPayments = onRequest(
	{
		concurrency: 50,
		timeoutSeconds: 60,
		maxInstances: 20,
		secrets: [cloudPaymentsSecret],
	},
	async (req, res) => {
		if (req.method !== "POST") {
			res.status(405).json({ error: "METHOD_NOT_ALLOWED" });
			return;
		}

		const secret = cloudPaymentsSecret.value();
		const signature = (req.header("Content-HMAC") ??
			req.header("content-hmac") ??
			"")
			.toString()
			.trim();
		const rawBody = (req as any).rawBody as Buffer | undefined;
		if (!rawBody) {
			res.status(400).json({ error: "RAW_BODY_REQUIRED" });
			return;
		}

		if (!verifyCloudPaymentsSignature(rawBody, signature, secret)) {
			logger.warn("CloudPayments signature verification failed");
			res.status(401).json({ error: "INVALID_SIGNATURE" });
			return;
		}

		const body = (req.body ?? {}) as CloudPaymentsWebhookBody;
		if (!isSuccessfulPayment(body)) {
			// Acknowledge webhook but do nothing
			res.status(200).json({ code: 0 });
			return;
		}

		const uid = body.AccountId;
		if (!uid) {
			res.status(400).json({ error: "MISSING_ACCOUNT_ID" });
			return;
		}

		const cpTransactionId = body.TransactionId?.toString();
		const cpInvoiceId = body.InvoiceId;
		const currency = (body.Currency ?? "KZT") as Currency;
		const amount = typeof body.Amount === "number" ? body.Amount : NaN;
		if (!Number.isFinite(amount)) {
			res.status(400).json({ error: "MISSING_AMOUNT" });
			return;
		}
		const currencyAmountMinor = Math.round(amount * 100);

		const credits =
			(typeof body.Credits === "number" ? body.Credits : undefined) ??
			(typeof body.Data?.credits === "number" ? body.Data.credits : undefined);
		if (!credits || !Number.isFinite(credits) || credits <= 0) {
			res.status(400).json({ error: "MISSING_CREDITS" });
			return;
		}

		const baseIdem =
			cpTransactionId ? `cp:${cpTransactionId}` : `cpInvoice:${cpInvoiceId ?? "unknown"}`;

		const clientIpCountry =
			(body.IpCountry ?? req.header("cf-ipcountry") ?? "unknown").toString();

		const billingResult = await processTransaction({
			uid,
			idempotencyKey: `${baseIdem}:billing`,
			category: "billing",
			direction: "in",
			termsVersion: 1,
			clientIpCountry,
			isManual: false,
			billing: {
				type: "buy_credits",
				currency,
				currencyAmountMinor,
				metadata: {
					provider: "cloudpayments",
					cpTransactionId,
					cpInvoiceId,
					cardLastFour: body.CardLastFour,
					cardType: body.CardType,
					cardExpDate: body.CardExpDate,
					issuerBankCountry: body.IpCountry,
					packId: body.Data?.packId ?? body.PackId,
					promoCode: body.Data?.promoCode ?? body.PromoCode,
				},
			},
		});

		const creditResult = await processTransaction({
			uid,
			idempotencyKey: `${baseIdem}:credit_grant`,
			category: "credit",
			direction: "in",
			termsVersion: 1,
			clientIpCountry,
			isManual: false,
			credit: {
				type: "grant",
				amount: credits,
				relatedBillingId: billingResult.tid,
				creditBucket: "purchased",
				metadata: {
					promoCode: body.Data?.promoCode ?? body.PromoCode,
					reason: "cloudpayments_purchase",
				},
			},
		});

		res.status(200).json({
			code: 0,
			ok: true,
			billingTid: billingResult.tid,
			creditTid: creditResult.tid,
		});
	},
);
