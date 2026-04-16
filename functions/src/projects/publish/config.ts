import type { ProjectMode } from "../projectInterface";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface PublishModeConfig {
	/** Credits deducted from the user's balance on publish. */
	creditCost: number;
	/** Whether a slug is required in the publish request. Always true for now. */
	requiresSlug: true;
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
		requiresSlug: true,
		requiresAccessToken: false,
	},
	photobook: {
		creditCost: 10,
		requiresSlug: true,
		requiresAccessToken: true,
	},
} as const satisfies Record<ProjectMode, PublishModeConfig>;

export function getPublishConfig(mode: ProjectMode): PublishModeConfig {
	return PUBLISH_MODE_CONFIG[mode];
}
