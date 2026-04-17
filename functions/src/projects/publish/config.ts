import type { ProjectMode } from "../projectInterface";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface PublishModeConfig {
	/** Credits deducted from the user's balance on first publish. */
	creditCost: number;
	/**
	 * Credits deducted on re-publish (showing a previously hidden project).
	 * 0 = free re-publish. Can be changed per-mode in the future to support
	 * dynamic repricing (e.g. based on photo count or updated content).
	 */
	republishCreditCost: number;
	/**
	 * Whether an access token is required.
	 * Portfolios are public — no token.
	 * Photobooks are private — a token is required to view the link.
	 */
	requiresAccessToken: boolean;
}

// ─── Config ───────────────────────────────────────────────────────────────────

export const PUBLISH_MODE_CONFIG = {
	portfolio: {
		creditCost: 10,
		republishCreditCost: 0,
		requiresAccessToken: false,
	},
	photobook: {
		creditCost: 10,
		republishCreditCost: 0,
		requiresAccessToken: true,
	},
} as const satisfies Record<ProjectMode, PublishModeConfig>;

export function getPublishConfig(mode: ProjectMode): PublishModeConfig {
	return PUBLISH_MODE_CONFIG[mode];
}
