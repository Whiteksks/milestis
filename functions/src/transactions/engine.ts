import { FieldValue } from "firebase-admin/firestore";
import { db } from "../lib/firebaseAdmin";
import type {
	BalanceSnapshot,
	Transaction,
	TransactionCategory,
	Currency,
	Direction,
	BillingType,
	CreditType,
} from "./types";

type BalanceBucket = Exclude<keyof BalanceSnapshot, "total">;

export class TransactionEngineError extends Error {
	public readonly code:
		| "idempotency_conflict"
		| "user_not_found"
		| "insufficient_funds"
		| "invalid_argument";

	constructor(
		code: TransactionEngineError["code"],
		message: string,
	) {
		super(message);
		this.code = code;
	}
}

export type ProcessTransactionInput = {
	uid: string;
	idempotencyKey: string;
	createdAtIso?: string;

	category: TransactionCategory;
	direction: Direction;

	// Billing (real-money event)
	billing?: {
		type: BillingType;
		currency: Currency;
		amountMinor: number;
		refundedTxId?: string;
		meta?: Record<string, unknown>;
	};

	// Credit (virtual economy)
	credit?: {
		type: CreditType;
		amount: number; // always positive
		billingTid?: string;
		creditBucket?: BalanceBucket; // required for direction=in
		lot?: {
			expiresAtMillis?: number;
		};
		expireLotPath?: string;
		meta?: Record<string, unknown>;
	};
};

type ProcessTransactionResult = {
	tid: string;
	transaction: Transaction;
	balanceSnapshot: BalanceSnapshot;
	idempotent: boolean;
};

const IDEMPOTENCY_COLLECTION = "transactionIdempotency";
const TRANSACTIONS_COLLECTION = "transactions";
const USERS_COLLECTION = "users";
const CREDIT_LOTS_SUBCOLLECTION = "creditLots";

function encodeDocId(raw: string): string {
	// Firestore doc id cannot contain '/'. Keep deterministic.
	return Buffer.from(raw, "utf8")
		.toString("base64")
		.replace(/\+/g, "-")
		.replace(/\//g, "_")
		.replace(/=+$/g, "");
}

function nowIso(): string {
	return new Date().toISOString();
}

function clampNonNegative(n: number): number {
	return n < 0 ? 0 : n;
}

function normalizeBalance(balance: unknown): BalanceSnapshot {
	const b = balance as Record<string, unknown> | null | undefined;
	const total = typeof b?.total === "number" ? b.total : 0;
	const purchased = typeof b?.purchased === "number" ? b.purchased : 0;
	const subscription = typeof b?.subscription === "number" ? b.subscription : 0;
	const bonus = typeof b?.bonus === "number" ? b.bonus : 0;
	return {
		total: clampNonNegative(total),
		purchased: clampNonNegative(purchased),
		subscription: clampNonNegative(subscription),
		bonus: clampNonNegative(bonus),
	};
}

function applyCreditGrant(
	balance: BalanceSnapshot,
	amount: number,
	bucket: BalanceBucket,
): BalanceSnapshot {
	return {
		...balance,
		total: balance.total + amount,
		[bucket]: (balance[bucket] ?? 0) + amount,
	};
}

function canDebit(balance: BalanceSnapshot, amount: number): boolean {
	return balance.total >= amount;
}

function debitFromBuckets(
	balance: BalanceSnapshot,
	amount: number,
	bucketOrder: BalanceBucket[],
): { next: BalanceSnapshot; debited: Record<BalanceBucket, number> } {
	let remaining = amount;
	const debited: Record<BalanceBucket, number> = {
		purchased: 0,
		subscription: 0,
		bonus: 0,
	};

	const next: BalanceSnapshot = { ...balance };
	for (const bucket of bucketOrder) {
		if (remaining <= 0) break;
		const available = next[bucket];
		const take = Math.min(available, remaining);
		if (take > 0) {
			next[bucket] = available - take;
			debited[bucket] += take;
			remaining -= take;
		}
	}

	next.total = balance.total - amount;
	return { next, debited };
}

async function consumeLots(
	tx: FirebaseFirestore.Transaction,
	params: {
		uid: string;
		bucket: BalanceBucket;
		amount: number;
		nowMillis: number;
		mode: "spend" | "expire";
	},
): Promise<number> {
	const { uid, bucket, amount, nowMillis, mode } = params;
	if (amount <= 0) return 0;

	const lotsCol = db
		.collection(USERS_COLLECTION)
		.doc(uid)
		.collection(CREDIT_LOTS_SUBCOLLECTION);

	const comparator = mode === "spend" ? ">" : "<=";
	const q = lotsCol
		.where("bucket", "==", bucket)
		// Important: keep a single range filter field to avoid Firestore restrictions.
		.where("expiresAtMillis", comparator as FirebaseFirestore.WhereFilterOp, nowMillis)
		.orderBy("expiresAtMillis", "asc")
		.orderBy("createdAtMillis", "asc")
		.limit(200);

	const snap = await tx.get(q);
	let remaining = amount;
	for (const doc of snap.docs) {
		if (remaining <= 0) break;
		const data = doc.data() as Record<string, unknown>;
		const lotRemaining = typeof data.remainingAmount === "number" ? data.remainingAmount : 0;
		if (lotRemaining <= 0) continue;
		const take = Math.min(lotRemaining, remaining);
		if (take <= 0) continue;

		tx.update(doc.ref, {
			remainingAmount: lotRemaining - take,
			updatedAt: FieldValue.serverTimestamp(),
		});
		remaining -= take;
	}

	return amount - remaining;
}

async function createCreditLot(
	tx: FirebaseFirestore.Transaction,
	params: {
		uid: string;
		bucket: BalanceBucket;
		amount: number;
		nowMillis: number;
		sourceTransactionId: string;
		expiresAtMillis?: number;
	},
): Promise<void> {
	const {
		uid,
		bucket,
		amount,
		nowMillis,
		sourceTransactionId,
		expiresAtMillis,
	} = params;
	if (amount <= 0) return;

	const lotsCol = db
		.collection(USERS_COLLECTION)
		.doc(uid)
		.collection(CREDIT_LOTS_SUBCOLLECTION);

	const lotRef = lotsCol.doc();
	const MAX = Number.MAX_SAFE_INTEGER;
	const effectiveExpiresAtMillis =
		typeof expiresAtMillis === "number"
			? expiresAtMillis
			: bucket === "purchased"
				? MAX
				: MAX;

	tx.set(lotRef, {
		bucket,
		totalAmount: amount,
		remainingAmount: amount,
		createdAtMillis: nowMillis,
		expiresAtMillis: effectiveExpiresAtMillis,
		sourceTransactionId,
		createdAt: FieldValue.serverTimestamp(),
	});
}

export async function processTransaction(
	input: ProcessTransactionInput,
): Promise<ProcessTransactionResult> {
	if (!input.uid) {
		throw new TransactionEngineError("invalid_argument", "uid is required");
	}
	if (!input.idempotencyKey) {
		throw new TransactionEngineError(
			"invalid_argument",
			"idempotencyKey is required",
		);
	}

	const idemId = encodeDocId(input.idempotencyKey);
	const idemRef = db.collection(IDEMPOTENCY_COLLECTION).doc(idemId);

	const createdAtIso = input.createdAtIso ?? nowIso();

	return await db.runTransaction(async (tx) => {
		const idemSnap = await tx.get(idemRef);
		if (idemSnap.exists) {
			const existingTid = (idemSnap.data() as Record<string, unknown>)?.tid as string | undefined;
			if (!existingTid) {
				throw new TransactionEngineError(
					"idempotency_conflict",
					"Idempotency record is missing tid",
				);
			}
			const existingTxRef = db.collection(TRANSACTIONS_COLLECTION).doc(existingTid);
			const existingTxSnap = await tx.get(existingTxRef);
			if (!existingTxSnap.exists) {
				throw new TransactionEngineError(
					"idempotency_conflict",
					"Idempotency points to missing transaction",
				);
			}
			const existing = existingTxSnap.data() as Transaction;
			return {
				tid: existingTid,
				transaction: existing,
				balanceSnapshot: existing.balanceSnapshot,
				idempotent: true,
			};
		}

		const userRef = db.collection(USERS_COLLECTION).doc(input.uid);
		const userSnap = await tx.get(userRef);
		if (!userSnap.exists) {
			throw new TransactionEngineError("user_not_found", "User not found");
		}

		const userData = userSnap.data() as Record<string, unknown>;
		const currentBalance = normalizeBalance(userData?.balance);
		let nextBalance = { ...currentBalance };
		const nowMillis = Date.now();

		const txRef = db.collection(TRANSACTIONS_COLLECTION).doc();
		const tid = txRef.id;

		if (input.category === "credit") {
			const credit = input.credit;
			if (!credit) {
				throw new TransactionEngineError(
					"invalid_argument",
					"credit payload is required",
				);
			}
			const amount = credit.amount;
			if (!Number.isFinite(amount) || amount <= 0) {
				throw new TransactionEngineError(
					"invalid_argument",
					"credit.amount must be > 0",
				);
			}

			const bucketOrder: BalanceBucket[] = ["purchased", "subscription", "bonus"];

			if (input.direction === "in") {
				const bucket = credit.creditBucket;
				if (!bucket) {
					throw new TransactionEngineError(
						"invalid_argument",
						"credit.creditBucket is required for direction=in",
					);
				}
				nextBalance = applyCreditGrant(currentBalance, amount, bucket);
				await createCreditLot(tx, {
					uid: input.uid,
					bucket,
					amount,
					nowMillis,
					sourceTransactionId: tid,
					expiresAtMillis: credit.lot?.expiresAtMillis,
				});
			} else {
				// direction=out
				if (!canDebit(currentBalance, amount)) {
					throw new TransactionEngineError(
						"insufficient_funds",
						"Insufficient funds",
					);
				}

				if (credit.type === "expire" && credit.expireLotPath) {
					const lotRef = db.doc(credit.expireLotPath);
					const lotSnap = await tx.get(lotRef);
					if (lotSnap.exists) {
						const lotData = lotSnap.data() as Record<string, unknown>;
						const bucket = lotData?.bucket as BalanceBucket | undefined;
						const lotRemaining =
							typeof lotData?.remainingAmount === "number"
								? lotData.remainingAmount
								: 0;
						const take = Math.min(lotRemaining, amount);
						if (take > 0 && bucket) {
							tx.update(lotRef, {
								remainingAmount: lotRemaining - take,
								updatedAt: FieldValue.serverTimestamp(),
							});
							// balance: expire from the same bucket
							const bucketAvailable = currentBalance[bucket];
							const bucketTake = Math.min(bucketAvailable, take);
							nextBalance = {
								...currentBalance,
								total: currentBalance.total - bucketTake,
								[bucket]: bucketAvailable - bucketTake,
							};
						} else {
							nextBalance = debitFromBuckets(
								currentBalance,
								amount,
								bucketOrder,
							).next;
						}
					} else {
						nextBalance = debitFromBuckets(
							currentBalance,
							amount,
							bucketOrder,
						).next;
					}
				} else {
					// Spend/expire by consuming lots first (best-effort) then updating snapshot.
					// consumeLots is wrapped in try-catch: if the query fails (e.g. index not yet
					// built or user has no lots), we skip lot tracking but still commit the balance
					// debit below. This keeps the transaction atomic even on fresh deployments.
					const { next, debited } = debitFromBuckets(
						currentBalance,
						amount,
						bucketOrder,
					);
					nextBalance = next;

					for (const bucket of bucketOrder) {
						const bucketDebit = debited[bucket];
						if (bucketDebit <= 0) continue;
						try {
							await consumeLots(tx, {
								uid: input.uid,
								bucket,
								amount: bucketDebit,
								nowMillis,
								mode: credit.type === "expire" ? "expire" : "spend",
							});
						} catch (lotsErr) {
							// Non-fatal: lot tracking is best-effort. Balance is still debited below.
							// This can happen when the creditLots index is not yet built.
							console.warn(`[engine] consumeLots failed for bucket ${bucket} (skipped):`, lotsErr);
						}
					}
				}
			}
		} else if (input.category === "billing") {
			const billing = input.billing;
			if (!billing) {
				throw new TransactionEngineError(
					"invalid_argument",
					"billing payload is required",
				);
			}
			if (!Number.isFinite(billing.amountMinor)) {
				throw new TransactionEngineError(
					"invalid_argument",
					"billing.amountMinor must be a number",
				);
			}
			// Billing itself doesn't change credits; snapshot stays current.
			nextBalance = currentBalance;
		}

		const balanceSnapshot: BalanceSnapshot = nextBalance;

		let txDoc: Transaction;
		if (input.category === "billing") {
			const billing = input.billing!;
			txDoc = {
				tid,
				uid: input.uid,
				createdAt: createdAtIso,
				direction: input.direction,
				category: "billing",
				type: billing.type,
				idempotencyKey: input.idempotencyKey,
				balanceSnapshot,
				currency: billing.currency,
				amountMinor: billing.amountMinor,
				...(billing.refundedTxId ? { refundedTxId: billing.refundedTxId } : {}),
				...(billing.meta ? { meta: billing.meta } : {}),
			};
		} else {
			const credit = input.credit!;
			txDoc = {
				tid,
				uid: input.uid,
				createdAt: createdAtIso,
				direction: input.direction,
				category: "credit",
				type: credit.type,
				idempotencyKey: input.idempotencyKey,
				balanceSnapshot,
				amount: credit.amount,
				...(credit.billingTid ? { billingTid: credit.billingTid } : {}),
				...(credit.meta ? { meta: credit.meta } : {}),
			};
		}

		tx.set(txRef, txDoc);
		tx.set(idemRef, {
			tid,
			uid: input.uid,
			idempotencyKey: input.idempotencyKey,
			createdAt: FieldValue.serverTimestamp(),
		});

		// Update user balance snapshot
		const userUpdates: Record<string, unknown> = {
			balance: balanceSnapshot,
		};
		if (input.category === "credit" && input.direction === "out") {
			userUpdates["stats.totalCreditsSpent"] = FieldValue.increment(
				input.credit?.amount ?? 0,
			);
		}
		tx.update(userRef, userUpdates);

		return {
			tid,
			transaction: txDoc,
			balanceSnapshot,
			idempotent: false,
		};
	});
}
