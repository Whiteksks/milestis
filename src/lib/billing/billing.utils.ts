import type { SubscriptionPlanTier } from "@/lib/user/user-update.dto"

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
  return normalizePlanTier(planTier) !== "free"
}

// ─── Date formatting ───────────────────────────────────────────────────────

export function formatResetDate(locale: string, date?: Date | null): string {
  if (!date) return "—"
  return new Intl.DateTimeFormat(locale, { month: "short", day: "numeric" }).format(date)
}
