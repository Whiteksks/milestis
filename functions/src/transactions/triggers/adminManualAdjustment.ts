import { onCall, HttpsError } from "firebase-functions/v2/https";
import { logger } from "firebase-functions/v2";
import { getAuth } from "firebase-admin/auth";

import { processTransaction, TransactionEngineError } from "../engine";

type AdminManualAdjustmentInput = {
	targetUid: string;
	amount: number; // positive=credit in, negative=credit out
	bucket: "purchased" | "subscription" | "bonus";
	idempotencyKey: string;
	reason?: string;
	supportTicketId?: string;
	expiresAtMillis?: number; // optional for credit-in lot
};

async function assertAdmin(uid: string): Promise<void> {
	const user = await getAuth().getUser(uid);
	const claims = (user.customClaims ?? {}) as Record<string, unknown>;
	const isAdmin = claims.admin === true || claims.support === true;
	if (!isAdmin) throw new HttpsError("permission-denied", "ADMIN_REQUIRED");
}

export const adminManualAdjustment = onCall(
	{
		concurrency: 20,
		timeoutSeconds: 60,
		maxInstances: 10,
	},
	async (request) => {
		if (!request.auth?.uid) {
			throw new HttpsError("unauthenticated", "AUTH_REQUIRED");
		}
		const adminUid = request.auth.uid;
		await assertAdmin(adminUid);

		const data = (request.data ?? {}) as Partial<AdminManualAdjustmentInput>;
		if (!data.targetUid) {
			throw new HttpsError("invalid-argument", "targetUid is required");
		}
		if (!data.idempotencyKey) {
			throw new HttpsError("invalid-argument", "idempotencyKey is required");
		}
		if (!data.bucket) {
			throw new HttpsError("invalid-argument", "bucket is required");
		}
		const amount = typeof data.amount === "number" ? data.amount : NaN;
		if (!Number.isFinite(amount) || amount === 0) {
			throw new HttpsError("invalid-argument", "amount must be non-zero number");
		}

		const direction = amount > 0 ? "in" : "out";
		const absAmount = Math.abs(amount);

		try {
			const result = await processTransaction({
				uid: data.targetUid,
				idempotencyKey: data.idempotencyKey,
				category: "credit",
				direction,
				credit: {
					type: "admin_adjustment",
					amount: absAmount,
					creditBucket: direction === "in" ? data.bucket : undefined,
					lot: direction === "in" ? { expiresAtMillis: data.expiresAtMillis } : undefined,
					meta: {
						adminId: adminUid,
						supportTicketId: data.supportTicketId,
						reason: data.reason ?? "manual_adjustment",
					},
				},
			});

			return { ok: true, tid: result.tid, balance: result.balanceSnapshot };
		} catch (err) {
			if (err instanceof TransactionEngineError && err.code === "insufficient_funds") {
				throw new HttpsError("failed-precondition", "insufficient_funds");
			}
			logger.error("adminManualAdjustment failed", { err, adminUid, targetUid: data.targetUid });
			throw new HttpsError("internal", "INTERNAL_ERROR");
		}
	},
);
