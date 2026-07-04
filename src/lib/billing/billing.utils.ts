import type { SubscriptionPlanTier } from "@/lib/user/user-update.dto"
import type { UserSubscription, UserSubscriptionFeatures } from "@/lib/user/user-update.dto"

export const FREE_SUBSCRIPTION_FEATURES: UserSubscriptionFeatures = {
  maxProjects: 5,
  maxStorageBytes: 1 * 1024 * 1024 * 1024,
  canRemoveBranding: false,
  photographerWorkspace: false,
  monthlyCredits: 0,
  creditTopupRatePerDollar: 1,
  prioritySupport: false,
}

const LEGACY_PLAN_TIER_ALIASES: Record<string, SubscriptionPlanTier> = {
  basic: "explorer",
  pro: "creator",
  pro_plus: "archive",
}

export function normalizePlanTier(planTier?: string | null): SubscriptionPlanTier {
  if (!planTier || planTier === "free") return "free"

  switch (planTier) {
    case "explorer":
    case "creator":
    case "archive":
      return planTier
    default:
      return LEGACY_PLAN_TIER_ALIASES[planTier] ?? "free"
  }
}

export function getPlanTranslationKey(planTier?: string | null): SubscriptionPlanTier {
  return normalizePlanTier(planTier)
}

export function isPaidPlan(planTier?: string | null): boolean {
  const normalized = normalizePlanTier(planTier)
  return normalized === "creator" || normalized === "archive"
}

function timestampToMillis(value: unknown): number | null {
  if (!value) return null
  if (value instanceof Date) return value.getTime()
  if (typeof value === "object" && typeof (value as { toMillis?: unknown }).toMillis === "function") {
    return (value as { toMillis: () => number }).toMillis()
  }
  if (typeof value === "object" && typeof (value as { toDate?: unknown }).toDate === "function") {
    return (value as { toDate: () => Date }).toDate().getTime()
  }
  if (typeof value === "string") {
    const parsed = new Date(value).getTime()
    return Number.isNaN(parsed) ? null : parsed
  }
  return null
}

export function getEffectiveSubscriptionFeatures(
  subscription?: Partial<UserSubscription> | null,
): UserSubscriptionFeatures {
  if (subscription?.status !== "active" && subscription?.status !== "trialing") {
    return FREE_SUBSCRIPTION_FEATURES
  }

  const periodEndMillis = timestampToMillis(subscription.currentPeriodEnd)
  if (periodEndMillis !== null && periodEndMillis <= Date.now()) {
    return FREE_SUBSCRIPTION_FEATURES
  }

  // If features is missing entirely, treat as free (preserves reference equality
  // used by isEffectivePaidSubscription). Otherwise merge with free defaults so
  // any missing field (old Firestore records) never yields undefined / NaN in
  // callers that divide by creditTopupRatePerDollar, etc.
  if (!subscription.features) return FREE_SUBSCRIPTION_FEATURES
  return { ...FREE_SUBSCRIPTION_FEATURES, ...subscription.features }
}

export function isEffectivePaidSubscription(subscription?: Partial<UserSubscription> | null): boolean {
  if (!isPaidPlan(subscription?.planTier)) return false
  return getEffectiveSubscriptionFeatures(subscription) !== FREE_SUBSCRIPTION_FEATURES
}

// ─── Date formatting ───────────────────────────────────────────────────────

export function formatResetDate(locale: string, date?: Date | null): string {
  if (!date) return "—"
  return new Intl.DateTimeFormat(locale, { month: "short", day: "numeric" }).format(date)
}
