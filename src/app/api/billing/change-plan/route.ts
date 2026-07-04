import { NextRequest, NextResponse } from "next/server"
import { adminDb } from "@/lib/firebase/admin"
import { getPolarClient } from "@/lib/billing/polar"
import { resolveBillingProductId } from "@/lib/billing/plans"
import { requireAuth } from "@/lib/api/require-auth"

export const runtime = "nodejs"

const VALID_PLANS = new Set(["creator", "archive"])
const VALID_INTERVALS = new Set(["month", "year"])

// Higher number = higher tier. Used to distinguish upgrade vs downgrade.
const TIER_RANK: Record<string, number> = {
  free: 0,
  explorer: 0,
  creator: 1,
  archive: 2,
}

export async function POST(request: NextRequest) {
  const auth = await requireAuth(request)
  if (auth.error) return auth.error
  const { uid } = auth

  let body: unknown
  try { body = await request.json() } catch {
    return NextResponse.json({ error: "INVALID_JSON" }, { status: 400 })
  }

  const b = body as Record<string, unknown>
  const targetPlan = typeof b?.targetPlan === "string" ? b.targetPlan : null
  const interval   = typeof b?.interval   === "string" ? b.interval   : null

  if (!targetPlan || !VALID_PLANS.has(targetPlan)) {
    return NextResponse.json({ error: "INVALID_TARGET_PLAN" }, { status: 400 })
  }
  if (!interval || !VALID_INTERVALS.has(interval)) {
    return NextResponse.json({ error: "INVALID_INTERVAL" }, { status: 400 })
  }

  const userSnap = await adminDb.collection("users").doc(uid).get()
  const subData = userSnap.data()?.subscription as Record<string, unknown> | undefined
  const polarSubscriptionId = subData?.polarSubscriptionId as string | undefined
  const currentTier = subData?.planTier as string | undefined
  const currentProductId = subData?.polarProductId as string | undefined

  if (!polarSubscriptionId) {
    return NextResponse.json({ error: "NO_ACTIVE_SUBSCRIPTION" }, { status: 400 })
  }

  const productId = resolveBillingProductId(targetPlan, interval)
  if (!productId) {
    return NextResponse.json({ error: "PRODUCT_NOT_CONFIGURED" }, { status: 500 })
  }

  if (productId === currentProductId) {
    return NextResponse.json({ error: "ALREADY_ON_THIS_PLAN" }, { status: 409 })
  }

  // Upgrade → immediate with proration (user pays the difference now).
  // Downgrade → deferred to next billing period (user keeps current access until period ends).
  const isUpgrade = (TIER_RANK[targetPlan] ?? 0) > (TIER_RANK[currentTier ?? "free"] ?? 0)
  const prorationBehavior = isUpgrade ? "prorate" : "next_period"

  try {
    const polar = getPolarClient()
    await polar.subscriptions.update({
      id: polarSubscriptionId,
      subscriptionUpdate: { productId, prorationBehavior },
    })
    return NextResponse.json({ ok: true, prorationBehavior })
  } catch (err) {
    console.error("[api/billing/change-plan] Polar error:", err)
    return NextResponse.json({ error: "CHANGE_PLAN_FAILED" }, { status: 502 })
  }
}
