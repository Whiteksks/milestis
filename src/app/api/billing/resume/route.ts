import { NextRequest, NextResponse } from "next/server"
import { adminDb } from "@/lib/firebase/admin"
import { getPolarClient } from "@/lib/billing/polar"
import { requireAuth } from "@/lib/api/require-auth"

export const runtime = "nodejs"

export async function POST(request: NextRequest) {
  const auth = await requireAuth(request)
  if (auth.error) return auth.error
  const { uid } = auth

  // ── 2. Read polarSubscriptionId from Firestore (never trust the client) ──
  const userSnap = await adminDb.collection("users").doc(uid).get()
  const data = userSnap.data()
  const polarSubscriptionId = data?.subscription?.polarSubscriptionId as string | undefined
  const cancelAtPeriodEnd = data?.subscription?.cancelAtPeriodEnd as boolean | undefined

  if (!polarSubscriptionId) {
    return NextResponse.json({ error: "NO_ACTIVE_SUBSCRIPTION" }, { status: 400 })
  }

  if (!cancelAtPeriodEnd) {
    return NextResponse.json({ error: "SUBSCRIPTION_NOT_SCHEDULED_FOR_CANCELLATION" }, { status: 400 })
  }

  // ── 3. Resume via Polar API (revoke scheduled cancellation) ──────────────
  try {
    const polar = getPolarClient()
    await polar.subscriptions.update({
      id: polarSubscriptionId,
      subscriptionUpdate: { cancelAtPeriodEnd: false },
    })
    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error("[api/billing/resume] Polar error:", err)
    return NextResponse.json({ error: "RESUME_FAILED" }, { status: 502 })
  }
}
