import type { ProjectMode } from "../projectInterface";

/** Fixed price regardless of content. */
interface FlatPricing {
	strategy: "flat";
	creditCost: number;
}

/**
 * Stepped price based on a count (e.g. number of photos).
 * Tiers are evaluated in order; the first matching tier wins.
 * Counts above the final threshold use the final tier's price.
 */
interface TieredPricing {
	strategy: "tiered";
	tiers: Array<{ upTo: number; cost: number }>;
}

type PricingStrategy = FlatPricing | TieredPricing | { strategy: "disabled" };

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

export const PUBLISH_MODE_CONFIG = {
	// Menu uses its own recurring package billing during publishMenu.
	menu: { pricing: { strategy: "disabled" }, republishCreditCost: 0, requiresAccessToken: false },
	portfolio: {
		pricing: {
			strategy: "flat",
			creditCost: 20,
		},
		republishCreditCost: 0,
		requiresAccessToken: false,
	},
	photobook: {
		pricing: {
			strategy: "tiered",
			// Bulk-discount gradient — per-photo cost decreases as the book grows.
			// Anchor: 20 photos = 20 credits (1.0 cr/photo).
			// Each 10-photo band costs fewer incremental credits than the last.
			tiers: [
				{ upTo: 20,       cost: 20 },
				{ upTo: 30,       cost: 25 },
				{ upTo: 40,       cost: 30 },
				{ upTo: 50,       cost: 35 },
				{ upTo: 60,       cost: 40 },
			],
		},
		republishCreditCost: 0,
		requiresAccessToken: true,
	},
	// Events are published via the standard slug+token flow.
	// A flat fee covers hosting the guest upload page.
	event: {
		pricing: { strategy: "flat", creditCost: 150 },
		republishCreditCost: 0,
		requiresAccessToken: true,
	},
} as const satisfies Record<ProjectMode, PublishModeConfig>;

export function getPublishConfig(mode: ProjectMode): PublishModeConfig {
	return PUBLISH_MODE_CONFIG[mode];
}

/**
 * Returns the credit cost for publishing a project.
 * @param mode    - project mode (determines pricing strategy)
 * @param photoCount - number of unique photos (used only by tiered strategies)
 */
export function calculateCreditCost(mode: ProjectMode, photoCount: number): number {
	const { pricing } = getPublishConfig(mode);
	if (pricing.strategy === "disabled") throw new Error("Publishing is not enabled for this mode.");

	if (pricing.strategy === "flat") {
		return pricing.creditCost;
	}

	for (const tier of pricing.tiers) {
		if (photoCount <= tier.upTo) {
			return tier.cost;
		}
	}

	return pricing.tiers[pricing.tiers.length - 1].cost;
}
