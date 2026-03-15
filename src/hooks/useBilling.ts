import { useShallow } from "zustand/react/shallow"
import { useUserStore } from "@/hooks/useUserStore"
import {
  planDisplayName,
  planDescription,
  isPaidPlan,
  formatResetDate,
  subscriptionStatusLabel,
} from "@/lib/billing/billing.utils"

export interface BillingCreditsData {
  monthly: { used: number; total: number; resetDate: string }
  bonus: { amount: number }
  purchased: { amount: number }
}

export function useBilling() {
  const { profile, loading } = useUserStore(
    useShallow((s) => ({ profile: s.profile, loading: s.loading }))
  )

  const subscription = profile?.subscription ?? null
  const balance = profile?.balance ?? null

  // ─── Credits ──────────────────────────────────────────────────────────────
  // balance.subscription = remaining subscription/monthly credits
  // We show it as the "total" with 0 used since the separate "used" count
  // is not stored client-side (it lives in Firestore statsfor totalCreditsSpent).
  const creditsData: BillingCreditsData | null = balance
    ? {
        monthly: {
          used: 0,
          total: balance.subscription,
          resetDate: formatResetDate(subscription?.currentPeriodEnd),
        },
        bonus: { amount: balance.bonus },
        purchased: { amount: balance.purchased },
      }
    : null

  // ─── Plan ─────────────────────────────────────────────────────────────────
  const planTier = subscription?.planTier
  const planName = planDisplayName(planTier)
  const planDesc = planDescription(planTier)
  const isPro = isPaidPlan(planTier)
  const statusLabel = subscriptionStatusLabel(subscription ?? undefined)

  return {
    loading,
    subscription,
    balance,
    creditsData,
    planName,
    planDesc,
    isPro,
    statusLabel,
  }
}
