import type { UserSubscription } from "@/lib/user/user-update.dto"

// ─── Plan display helpers ──────────────────────────────────────────────────

const PLAN_NAMES: Record<string, string> = {
  free: "Free Plan",
  basic: "Basic Plan",
  pro: "Pro Plan",
  pro_plus: "Pro+ Plan",
}

const PLAN_DESCRIPTIONS: Record<string, string> = {
  free: "Perfect for trying out Milestis. Create beautiful memory books and share them with anyone.",
  basic: "Great for personal use. More projects, more storage, and priority exports.",
  pro: "For creators who need full control — custom branding, high-quality exports, and priority support.",
  pro_plus: "The ultimate plan. Everything in Pro plus even more credits and storage.",
}

export function planDisplayName(planTier?: string): string {
  return PLAN_NAMES[planTier ?? "free"] ?? "Free Plan"
}

export function planDescription(planTier?: string): string {
  return PLAN_DESCRIPTIONS[planTier ?? "free"] ?? PLAN_DESCRIPTIONS.free
}

export function isPaidPlan(planTier?: string): boolean {
  return !!planTier && planTier !== "free"
}

// ─── Date formatting ───────────────────────────────────────────────────────

export function formatResetDate(date?: Date | null): string {
  if (!date) return "—"
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" })
}

// ─── Subscription status label ────────────────────────────────────────────

export function subscriptionStatusLabel(sub?: UserSubscription): string {
  if (!sub) return "Free"
  switch (sub.status) {
    case "active":
      return sub.cancelAtPeriodEnd ? "Cancels at period end" : "Active"
    case "trialing":
      return "Trial"
    case "past_due":
      return "Past due"
    case "canceled":
      return "Canceled"
    default:
      return sub.status
  }
}
