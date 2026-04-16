import type { BalanceSnapshot } from "../../transactions/types";

// ─── Input ────────────────────────────────────────────────────────────────────

export interface PublishInput {
	projectId: string;
	/** URL-safe slug (3–63 chars, lowercase alphanumeric + hyphens). */
	slug: string;
	/** Plaintext access token — required for photobooks, ignored for portfolios. */
	accessToken?: string;
}

// ─── Output ───────────────────────────────────────────────────────────────────

export interface PublishOutput {
	ok: true;
	publishedSlug: string;
	/** Updated balance after the credit deduction. */
	balance: BalanceSnapshot;
	/** Debit transaction id recorded for this publish. */
	transactionId: string;
}
