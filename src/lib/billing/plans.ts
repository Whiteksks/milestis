export type BillingPlan = "creator" | "archive"
export type BillingInterval = "month" | "year"

const PRODUCT_IDS: Record<BillingPlan, Record<BillingInterval, string | undefined>> = {
  creator: {
    month: process.env.NEXT_PUBLIC_POLAR_PRODUCT_CREATOR_MONTHLY,
    year: process.env.NEXT_PUBLIC_POLAR_PRODUCT_CREATOR_YEARLY,
  },
  archive: {
    month: process.env.NEXT_PUBLIC_POLAR_PRODUCT_ARCHIVE_MONTHLY,
    year: process.env.NEXT_PUBLIC_POLAR_PRODUCT_ARCHIVE_YEARLY,
  },
}

export function resolveBillingProductId(plan: string, interval: string): string | null {
  if ((plan !== "creator" && plan !== "archive") || (interval !== "month" && interval !== "year")) {
    return null
  }
  return PRODUCT_IDS[plan][interval] ?? null
}