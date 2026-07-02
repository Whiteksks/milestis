import { NextRequest, NextResponse } from "next/server"
import { adminDb } from "@/lib/firebase/admin"
import { getPolarClient } from "@/lib/billing/polar"
import { requireAuth } from "@/lib/api/require-auth"

export const runtime = "nodejs"

export async function POST(request: NextRequest) {
  const auth = await requireAuth(request)
  if (auth.error) return auth.error
  const { uid } = auth

  // ── 2. Read subscription data from Firestore (never trust the client) ──
  const userSnap = await adminDb.collection("users").doc(uid).get()
  const subData = userSnap.data()?.subscription
  const polarSubscriptionId = subData?.polarSubscriptionId as string | undefined
  const cancelAtPeriodEnd = subData?.cancelAtPeriodEnd as boolean | undefined

  if (!polarSubscriptionId) {
    return NextResponse.json({ error: "NO_ACTIVE_SUBSCRIPTION" }, { status: 400 })
  }
  if (cancelAtPeriodEnd) {
    return NextResponse.json({ error: "ALREADY_SCHEDULED_FOR_CANCELLATION" }, { status: 409 })
  }

  // ── 3. Schedule cancellation at end of billing period ────────────────────
  // Using update({ cancelAtPeriodEnd: true }) — NOT subscriptions.cancel() —
  // so the user keeps access until the paid period ends.
  // The webhook (subscription.updated) will sync cancelAtPeriodEnd to Firestore.
  try {
    const polar = getPolarClient()
    await polar.subscriptions.update({
      id: polarSubscriptionId,
      subscriptionUpdate: { cancelAtPeriodEnd: true },
    })
    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error("[api/billing/cancel] Polar error:", err)
    return NextResponse.json({ error: "CANCEL_FAILED" }, { status: 502 })
  }
}
