import type { SubscriptionFeatures, SubscriptionStatus } from "./userInterface";

export const FREE_SUBSCRIPTION_FEATURES: SubscriptionFeatures = {
	maxProjects: 5,
	maxStorageBytes: 1 * 1024 * 1024 * 1024,
	canRemoveBranding: false,
	photographerWorkspace: false,
	monthlyCredits: 0,
	creditTopupRatePerDollar: 1,
	prioritySupport: false,
};

function timestampToMillis(value: unknown): number | null {
	if (!value) return null;
	if (value instanceof Date) return value.getTime();
	if (typeof value === "object" && typeof (value as { toMillis?: unknown }).toMillis === "function") {
		return (value as { toMillis: () => number }).toMillis();
	}
	if (typeof value === "string") {
		const parsed = new Date(value).getTime();
		return Number.isNaN(parsed) ? null : parsed;
	}
	return null;
}

export function getEffectiveSubscriptionFeatures(subscription: unknown): SubscriptionFeatures {
	const sub = subscription as Record<string, unknown> | null | undefined;
	const status = sub?.status as SubscriptionStatus | undefined;
	if (status !== "active" && status !== "trialing") return FREE_SUBSCRIPTION_FEATURES;

	const periodEndMillis = timestampToMillis(sub?.currentPeriodEnd);
	if (periodEndMillis !== null && periodEndMillis <= Date.now()) return FREE_SUBSCRIPTION_FEATURES;

	const features = sub?.features as SubscriptionFeatures | undefined;
	return features ?? FREE_SUBSCRIPTION_FEATURES;
}