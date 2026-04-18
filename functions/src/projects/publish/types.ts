import type { BalanceSnapshot } from "../../transactions/types";
import type { ProjectMode } from "../projectInterface";

// ─── Input ────────────────────────────────────────────────────────────────────

export interface PublishInput {
	projectId: string;
	/** URL-safe slug (3–24 chars, lowercase alphanumeric + hyphens). */
	slug: string;
	/** Plaintext access token — required for photobooks, ignored for portfolios. */
	accessToken?: string;
	/** Quote ID returned by analyzeProject — must be valid and not expired. */
	quoteId: string;
}

// ─── Output ───────────────────────────────────────────────────────────────────

export interface PublishOutput {
	ok: true;
	publishedSlug: string;
	/** Updated balance after the credit deduction. */
	balance: BalanceSnapshot;
}

export interface PreparedPublishInput {
	slug: string;
	accessToken?: string;
	hashedToken?: string;
}

export interface PublishCommitResult {
	balanceSnapshot: BalanceSnapshot;
	publishedSlug: string;
	transactionId: string;
}

export interface CommitPublishInput {
	projectId: string;
	uid: string;
	mode: ProjectMode;
	projectName: string;
	prepared: PreparedPublishInput;
	contentSnapshot: {
		theme: Record<string, unknown> | null;
		content: Record<string, unknown> | null;
	};
	creditCost: number;
	freedBytes: number;
	previewHeroUrl?: string;
}
