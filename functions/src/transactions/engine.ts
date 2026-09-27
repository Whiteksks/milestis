import { isDeepStrictEqual } from "node:util";
import { FieldValue } from "firebase-admin/firestore";
import { db } from "../lib/firebaseAdmin";
import type { BalanceSnapshot, Transaction, TransactionCategory, Currency, Direction, BillingType, CreditType } from "./types";

type BalanceBucket = Exclude<keyof BalanceSnapshot, "total">;
const BUCKET_ORDER: BalanceBucket[] = ["subscription", "bonus", "purchased"];

export class TransactionEngineError extends Error {
	constructor(
		public readonly code: "idempotency_conflict" | "user_not_found" | "insufficient_funds" | "invalid_argument" | "balance_inconsistent",
		message: string,
	) { super(message); }
}

export type ProcessTransactionInput = {
	uid: string;
	idempotencyKey: string;
	createdAtIso?: string;
	category: TransactionCategory;
	direction: Direction;
	billing?: {
		type: BillingType;
		currency: Currency;
		amountMinor: number;
		refundedTxId?: string;
		meta?: Record<string, unknown>;
	};
	credit?: {
		type: CreditType;
		amount: number;
		billingTid?: string;
		creditBucket?: BalanceBucket;
		lot?: { expiresAtMillis?: number };
		expireLotPath?: string;
		meta?: Record<string, unknown>;
	};
};

export type ProcessTransactionResult = {
	tid: string;
	transaction: Transaction;
	balanceSnapshot: BalanceSnapshot;
	idempotent: boolean;
};

interface CreditLot {
	ref: FirebaseFirestore.DocumentReference;
	bucket: BalanceBucket;
	remainingAmount: number;
	expiresAtMillis: number;
	createdAtMillis: number;
}

function isBucket(value: unknown): value is BalanceBucket {
	return BUCKET_ORDER.includes(value as BalanceBucket);
}

function isNonNegativeInteger(value: unknown): value is number {
	return typeof value === "number" && Number.isSafeInteger(value) && value >= 0;
}

function invalid(message: string): never {
	throw new TransactionEngineError("invalid_argument", message);
}

function inconsistent(message: string): never {
	throw new TransactionEngineError("balance_inconsistent", message);
}

function validateInput(input: ProcessTransactionInput): void {
	if (!input.uid || input.uid.includes("/")) invalid("A single-segment uid is required");
	if (!input.idempotencyKey) invalid("idempotencyKey is required");
	if (!["in", "out"].includes(input.direction)) invalid("Invalid direction");
	if (input.category === "billing") {
		const billing = input.billing;
		if (!billing || input.credit || !["buy_credits", "subscription_payment", "refund"].includes(billing.type)
			|| !billing.currency || !isNonNegativeInteger(billing.amountMinor)) invalid("Invalid billing payload");
	} else if (input.category === "credit") {
		const credit = input.credit;
		if (!credit || input.billing || !isNonNegativeInteger(credit.amount) || credit.amount === 0) invalid("Credit amount must be a positive integer");
		const allowed = input.direction === "in" ? ["grant", "admin_adjustment"] : ["spend", "expire", "admin_adjustment"];
		if (!allowed.includes(credit.type)) invalid("Invalid credit type for direction");
		if (input.direction === "in") {
			if (!isBucket(credit.creditBucket)) invalid("creditBucket is required for grants");
			const expiry = credit.lot?.expiresAtMillis;
			if (expiry !== undefined && !isNonNegativeInteger(expiry)) invalid("Invalid credit expiry");
		} else if (credit.creditBucket !== undefined || credit.lot !== undefined) invalid("Debit sources are selected by the ledger");
		if (credit.type === "expire") {
			const parts = credit.expireLotPath?.split("/");
			if (!parts || parts.length !== 4 || parts[0] !== "users" || parts[1] !== input.uid || parts[2] !== "creditLots" || !parts[3]) invalid("Expiry must target a lot owned by uid");
		} else if (credit.expireLotPath !== undefined) invalid("expireLotPath is only valid for expiry");
	} else invalid("Invalid transaction category");
}

function readBalance(value: unknown): BalanceSnapshot {
	const balance = value as BalanceSnapshot | undefined;
	if (!balance || ![balance.total, ...BUCKET_ORDER.map((bucket) => balance[bucket])].every(isNonNegativeInteger)
		|| balance.total !== balance.subscription + balance.bonus + balance.purchased) inconsistent("Invalid balance snapshot");
	return { total: balance.total, subscription: balance.subscription, bonus: balance.bonus, purchased: balance.purchased };
}

function readLot(ref: FirebaseFirestore.DocumentReference, data: FirebaseFirestore.DocumentData): CreditLot {
	if (!isBucket(data.bucket) || !isNonNegativeInteger(data.remainingAmount) || !isNonNegativeInteger(data.totalAmount)
		|| data.remainingAmount > data.totalAmount || !isNonNegativeInteger(data.expiresAtMillis) || !isNonNegativeInteger(data.createdAtMillis)) {
		inconsistent(`Invalid credit lot: ${ref.path}`);
	}
	return { ref, bucket: data.bucket, remainingAmount: data.remainingAmount, expiresAtMillis: data.expiresAtMillis, createdAtMillis: data.createdAtMillis };
}

/** Read all outstanding lots before any write. Empty history cannot hide usable lots. */
async function readOutstandingLots(tx: FirebaseFirestore.Transaction, uid: string, balance: BalanceSnapshot): Promise<CreditLot[]> {
	const snapshot = await tx.get(db.collection("users").doc(uid).collection("creditLots").where("remainingAmount", ">", 0));
	const lots = snapshot.docs.map((doc) => readLot(doc.ref, doc.data()));
	const totals = { subscription: 0, bonus: 0, purchased: 0 };
	for (const lot of lots) totals[lot.bucket] += lot.remainingAmount;
	if (BUCKET_ORDER.some((bucket) => totals[bucket] !== balance[bucket])) inconsistent("Balance does not match outstanding credit lots");
	return lots;
}

/** Call after the caller's reads; this function queues writes before returning. */
export async function processTransactionInFirestoreTransaction(
	tx: FirebaseFirestore.Transaction,
	input: ProcessTransactionInput,
): Promise<ProcessTransactionResult> {
	validateInput(input);
	const { uid, idempotencyKey, category, direction } = input;
	// Optional undefined values are omitted both for persistence and replay comparison.
	const request = JSON.parse(JSON.stringify({ uid, category, direction, credit: input.credit, billing: input.billing })) as
		Pick<ProcessTransactionInput, "uid" | "category" | "direction" | "credit" | "billing">;
	const idemRef = db.collection("transactionIdempotency").doc(Buffer.from(idempotencyKey, "utf8").toString("base64url"));
	const idemSnap = await tx.get(idemRef);
	if (idemSnap.exists) {
		const existing = idemSnap.data()!;
		if (!existing.tid || !isDeepStrictEqual(existing.request, request)) {
			throw new TransactionEngineError("idempotency_conflict", "Idempotency key belongs to a different operation");
		}
		const saved = await tx.get(db.collection("transactions").doc(existing.tid));
		if (!saved.exists) throw new TransactionEngineError("idempotency_conflict", "Idempotency points to missing transaction");
		const transaction = saved.data() as Transaction;
		return { tid: saved.id, transaction, balanceSnapshot: transaction.balanceSnapshot, idempotent: true };
	}

	const userRef = db.collection("users").doc(uid);
	const user = await tx.get(userRef);
	if (!user.exists) throw new TransactionEngineError("user_not_found", "User not found");
	const balance = readBalance(user.data()?.balance);
	const next = { ...balance };
	const nowMillis = Date.now();
	const txRef = db.collection("transactions").doc();
	const changes: Array<{ lot: CreditLot; amount: number }> = [];
	let newLot: { ref: FirebaseFirestore.DocumentReference; data: FirebaseFirestore.DocumentData } | undefined;

	if (category === "credit") {
		const credit = input.credit!;
		const lots = await readOutstandingLots(tx, uid, balance);
		if (direction === "in") {
			const bucket = credit.creditBucket!;
			next[bucket] += credit.amount;
			next.total += credit.amount;
			if (!Number.isSafeInteger(next.total)) invalid("Balance would exceed safe integer range");
			newLot = {
				ref: userRef.collection("creditLots").doc(),
				data: { bucket, totalAmount: credit.amount, remainingAmount: credit.amount, createdAtMillis: nowMillis,
					expiresAtMillis: credit.lot?.expiresAtMillis ?? Number.MAX_SAFE_INTEGER, sourceTransactionId: txRef.id,
					createdAt: FieldValue.serverTimestamp() },
			};
		} else if (credit.type === "expire") {
			const lot = lots.find((entry) => entry.ref.path === credit.expireLotPath);
			if (!lot || lot.expiresAtMillis > nowMillis || lot.remainingAmount !== credit.amount) invalid("Expiry must consume the current expired lot remainder");
			changes.push({ lot, amount: lot.remainingAmount });
		} else {
			let remaining = credit.amount;
			const available = lots.filter((lot) => lot.expiresAtMillis > nowMillis).sort((a, b) =>
				BUCKET_ORDER.indexOf(a.bucket) - BUCKET_ORDER.indexOf(b.bucket)
				|| a.expiresAtMillis - b.expiresAtMillis || a.createdAtMillis - b.createdAtMillis || a.ref.path.localeCompare(b.ref.path));
			for (const lot of available) {
				if (remaining === 0) break;
				const amount = Math.min(lot.remainingAmount, remaining);
				changes.push({ lot, amount });
				remaining -= amount;
			}
			if (remaining > 0) throw new TransactionEngineError("insufficient_funds", "Insufficient unexpired credits");
		}
		for (const { lot, amount } of changes) { next[lot.bucket] -= amount; next.total -= amount; }
	}

	const base = { tid: txRef.id, uid, createdAt: input.createdAtIso ?? new Date(nowMillis).toISOString(), direction, idempotencyKey, balanceSnapshot: next };
	const billing = request.billing;
	const transaction: Transaction = category === "billing"
		? { ...base, category: "billing", type: billing!.type, currency: billing!.currency, amountMinor: billing!.amountMinor,
			...(billing!.refundedTxId ? { refundedTxId: billing!.refundedTxId } : {}),
			...(billing!.meta ? { meta: billing!.meta } : {}) }
		: { ...base, category: "credit", type: input.credit!.type, amount: input.credit!.amount,
			...(input.credit!.billingTid ? { billingTid: input.credit!.billingTid } : {}),
			...(request.credit!.meta ? { meta: request.credit!.meta } : {}) };

	// No reads below this point. Lots, audit records and balance commit together.
	for (const { lot, amount } of changes) tx.update(lot.ref, { remainingAmount: lot.remainingAmount - amount, updatedAt: FieldValue.serverTimestamp() });
	if (newLot) tx.set(newLot.ref, newLot.data);
	tx.set(txRef, transaction);
	tx.set(idemRef, { tid: txRef.id, uid, idempotencyKey, request, createdAt: FieldValue.serverTimestamp() });
	const updates: Record<string, unknown> = { balance: next };
	if (category === "credit" && direction === "out" && input.credit!.type === "spend") {
		updates["stats.totalCreditsSpent"] = FieldValue.increment(input.credit!.amount);
	}
	tx.update(userRef, updates);
	return { tid: txRef.id, transaction, balanceSnapshot: next, idempotent: false };
}

export async function processTransaction(input: ProcessTransactionInput): Promise<ProcessTransactionResult> {
	return db.runTransaction((tx) => processTransactionInFirestoreTransaction(tx, input));
}

/** Used by payment review; the profile snapshot may still contain expired credits. */
export async function availableCreditsInTransaction(tx: FirebaseFirestore.Transaction, uid: string): Promise<number> {
	const user = await tx.get(db.collection("users").doc(uid));
	if (!user.exists) throw new TransactionEngineError("user_not_found", "User not found");
	const lots = await readOutstandingLots(tx, uid, readBalance(user.data()?.balance));
	const now = Date.now();
	return lots.filter((lot) => lot.expiresAtMillis > now).reduce((sum, lot) => sum + lot.remainingAmount, 0);
}

/** The scheduler supplies an identity, never an amount from an earlier query. */
export async function expireCreditLot(uid: string, lotId: string): Promise<ProcessTransactionResult | null> {
	if (!uid || uid.includes("/") || !lotId || lotId.includes("/")) invalid("Invalid credit lot identity");
	const ref = db.collection("users").doc(uid).collection("creditLots").doc(lotId);
	return db.runTransaction(async (tx) => {
		const snapshot = await tx.get(ref);
		if (!snapshot.exists) return null;
		const lot = readLot(ref, snapshot.data()!);
		if (lot.remainingAmount === 0 || lot.expiresAtMillis > Date.now()) return null;
		return processTransactionInFirestoreTransaction(tx, {
			uid, idempotencyKey: `expire:${uid}:${lotId}`, category: "credit", direction: "out",
			credit: { type: "expire", amount: lot.remainingAmount, expireLotPath: ref.path, meta: { reason: "credits_expired" } },
		});
	});
}
