// ─── Balance ─────────────────────────────────────────────────────────────────

export interface BalanceSnapshot {
	total: number;
	purchased: number;
	subscription: number;
	bonus: number;
}

// ─── Primitives ──────────────────────────────────────────────────────────────

export type TransactionCategory = "billing" | "credit";
export type Direction = "in" | "out";
export type Currency = string; // ISO 4217, e.g. "USD", "EUR"

export type BillingType = "buy_credits" | "subscription_payment" | "refund";
export type CreditType = "grant" | "spend" | "expire" | "admin_adjustment";

// ─── Firestore document interfaces ───────────────────────────────────────────

interface TransactionBase {
	tid: string;              // Firestore doc ID (stored for audit convenience)
	uid: string;
	createdAt: string;        // ISO-8601
	direction: Direction;     // "in" = incoming, "out" = outgoing
	idempotencyKey: string;   // stored for audit / replay debugging
	balanceSnapshot: BalanceSnapshot; // balance AFTER this transaction
}

/** Real-money record (Paddle charge, refund, subscription renewal, etc.) */
export interface BillingTransaction extends TransactionBase {
	category: "billing";
	type: BillingType;
	currency: Currency;
	amountMinor: number;      // integer cents — avoids float precision issues
	refundedTxId?: string;    // for type="refund": internal billing tid being refunded
	meta?: Record<string, unknown>; // paddleEventId, paddleTxId, packId, promoCode, …
}

/** Virtual-credit record (grant, spend, expire, admin adjustment) */
export interface CreditTransaction extends TransactionBase {
	category: "credit";
	type: CreditType;
	amount: number;            // always > 0; direction tells you which way
	billingTid?: string;       // for type="grant": links back to the billing record
	meta?: Record<string, unknown>; // projectId, reason, adminUid, …
}

export type Transaction = BillingTransaction | CreditTransaction;