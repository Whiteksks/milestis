import { FieldValue } from "firebase-admin/firestore";
import { db } from "../lib/firebaseAdmin";
import type {
	BalanceSnapshot,
	BillingTransaction,
	CreditTransaction,
	Transaction,
	TransactionCategory,
	TransactionStatus,
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

	category: TransactionCategory;
	status?: TransactionStatus;
	direction: Direction;

	createdAtIso?: string;
	processedAtIso?: string;

	termsVersion: number;
	clientIpCountry: string;
	isManual: boolean;

	// Billing
	billing?: {
		type: BillingType;
		currency: Currency;
		currencyAmountMinor: number;
		originalTransactionId?: string;
		metadata: BillingTransaction["metadata"];
	};

	// Credit
	credit?: {
		type: CreditType;
		amount: number; // always positive
		relatedBillingId?: string;
		creditBucket?: BalanceBucket; // required for direction=in
		lot?: {
			expiresAtMillis?: number; // if omitted: non-expiring for purchased, otherwise non-expiring
		};
		// expire specific lot
		expireLotPath?: string;
		metadata: CreditTransaction["metadata"];
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

function normalizeBalance(balance: any): BalanceSnapshot {
	const total = typeof balance?.total === "number" ? balance.total : 0;
	const purchased = typeof balance?.purchased === "number" ? balance.purchased : 0;
	const subscription = typeof balance?.subscription === "number" ? balance.subscription : 0;
	const bonus = typeof balance?.bonus === "number" ? balance.bonus : 0;
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
		.where("expiresAtMillis", comparator as any, nowMillis)
		.orderBy("expiresAtMillis", "asc")
		.orderBy("createdAtMillis", "asc")
		.limit(200);

	const snap = await tx.get(q);
	let remaining = amount;
	for (const doc of snap.docs) {
		if (remaining <= 0) break;
		const data = doc.data() as any;
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
	const processedAtIso = input.processedAtIso;
	const status: TransactionStatus = input.status ?? "completed";
	const version = 1;

	return await db.runTransaction(async (tx) => {
		const idemSnap = await tx.get(idemRef);
		if (idemSnap.exists) {
			const existingTid = (idemSnap.data() as any)?.tid as string | undefined;
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

		const userData = userSnap.data() as any;
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
						const lotData = lotSnap.data() as any;
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
					// Spend/expire by consuming lots first (best-effort) then updating snapshot
					const { next, debited } = debitFromBuckets(
						currentBalance,
						amount,
						bucketOrder,
					);
					nextBalance = next;

					// Attempt to reflect debits into lots. If lots are missing (legacy users), balance still stays consistent.
					for (const bucket of bucketOrder) {
						const bucketDebit = debited[bucket];
						if (bucketDebit <= 0) continue;
						await consumeLots(tx, {
							uid: input.uid,
							bucket,
							amount: bucketDebit,
							nowMillis,
							mode: credit.type === "expire" ? "expire" : "spend",
						});
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
			if (!Number.isFinite(billing.currencyAmountMinor)) {
				throw new TransactionEngineError(
					"invalid_argument",
					"billing.currencyAmountMinor must be a number",
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
				version,
				tid,
				uid: input.uid,
				createdAt: createdAtIso,
				processedAt: processedAtIso ?? nowIso(),
				status,
				direction: input.direction,
				category: "billing",
				type: billing.type,
				idempotencyKey: input.idempotencyKey,
				isManual: input.isManual,
				termsVersion: input.termsVersion,
				clientIpCountry: input.clientIpCountry,
				balanceSnapshot,
				currency: billing.currency,
				currencyAmountMinor: billing.currencyAmountMinor,
				originalTransactionId: billing.originalTransactionId,
				metadata: billing.metadata,
			};
		} else {
			const credit = input.credit!;
			txDoc = {
				version,
				tid,
				uid: input.uid,
				createdAt: createdAtIso,
				processedAt: processedAtIso ?? nowIso(),
				status,
				direction: input.direction,
				category: "credit",
				type: credit.type,
				idempotencyKey: input.idempotencyKey,
				isManual: input.isManual,
				termsVersion: input.termsVersion,
				clientIpCountry: input.clientIpCountry,
				balanceSnapshot,
				amount: credit.amount,
				relatedBillingId: credit.relatedBillingId,
				metadata: credit.metadata,
			};
		}

		tx.set(txRef, txDoc);
		tx.set(idemRef, {
			tid,
			uid: input.uid,
			idempotencyKey: input.idempotencyKey,
			createdAt: FieldValue.serverTimestamp(),
		});

		// Update user snapshot
		const userUpdates: Record<string, unknown> = {
			balance: balanceSnapshot,
			"metadata.lastLoginAt": FieldValue.serverTimestamp(),
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
