import { getBillingProducts } from '@/config/server'

export function resolveBillingProductId(plan: string, interval: string): string | null {
  if ((plan !== "creator" && plan !== "archive") || (interval !== "month" && interval !== "year")) {
    return null
  }
  return getBillingProducts()[plan][interval]
}
