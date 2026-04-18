import type { ProjectMode } from "../projectInterface";

// ─── Pricing strategies ───────────────────────────────────────────────────────

/** Fixed price regardless of content. Used for portfolios. */
interface FlatPricing {
	strategy: "flat";
	creditCost: number;
}

/**
 * Stepped price based on a count (e.g. number of photos).
 * Tiers are evaluated in order; the first matching tier wins.
 * The last tier should always use upTo: Infinity as a catch-all.
 */
interface TieredPricing {
	strategy: "tiered";
	tiers: Array<{ upTo: number; cost: number }>;
}

type PricingStrategy = FlatPricing | TieredPricing;

// ─── Config type ──────────────────────────────────────────────────────────────

export interface PublishModeConfig {
	pricing: PricingStrategy;
	/**
	 * Credits deducted on re-publish (showing a previously hidden project).
	 * 0 = free re-publish.
	 */
	republishCreditCost: number;
	/**
	 * Whether an access token is required.
	 * Portfolios are public — no token.
	 * Photobooks are private — a token is required to view the link.
	 */
	requiresAccessToken: boolean;
}

// ─── Per-mode config ──────────────────────────────────────────────────────────

export const PUBLISH_MODE_CONFIG = {
	portfolio: {
		pricing: {
			strategy: "flat",
			creditCost: 10,
		},
		republishCreditCost: 0,
		requiresAccessToken: false,
	},
	photobook: {
		pricing: {
			strategy: "tiered",
			tiers: [
				{ upTo: 20,       cost: 20 },
				{ upTo: 30,       cost: 25 },
				{ upTo: 50,       cost: 35 },
			],
		},
		republishCreditCost: 0,
		requiresAccessToken: true,
	},
} as const satisfies Record<ProjectMode, PublishModeConfig>;

export function getPublishConfig(mode: ProjectMode): PublishModeConfig {
	return PUBLISH_MODE_CONFIG[mode];
}

// ─── Price calculation ────────────────────────────────────────────────────────

/**
 * Returns the credit cost for publishing a project.
 * @param mode    - project mode (determines pricing strategy)
 * @param photoCount - number of unique photos (used only by tiered strategies)
 */
export function calculateCreditCost(mode: ProjectMode, photoCount: number): number {
	const { pricing } = getPublishConfig(mode);

	if (pricing.strategy === "flat") {
		return pricing.creditCost;
	}

	// tiered: find the first tier where photoCount <= upTo
	for (const tier of pricing.tiers) {
		if (photoCount <= tier.upTo) {
			return tier.cost;
		}
	}

	// Fallback — should never happen if last tier is Infinity
	return pricing.tiers[pricing.tiers.length - 1].cost;
}
