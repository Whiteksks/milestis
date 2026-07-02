import { NextRequest, NextResponse } from "next/server"
import { adminDb } from "@/lib/firebase/admin"
import { getPolarClient } from "@/lib/billing/polar"
import { requireAuth } from "@/lib/api/require-auth"

export const runtime = "nodejs"

export async function POST(request: NextRequest) {
  const auth = await requireAuth(request)
  if (auth.error) return auth.error
  const { uid } = auth

  // ── 2. Read polarCustomerId from Firestore (never trust the client) ──────
  const userSnap = await adminDb.collection("users").doc(uid).get()
  const polarCustomerId = userSnap.data()?.subscription?.polarCustomerId as string | undefined

  if (!polarCustomerId) {
    return NextResponse.json({ error: "NO_CUSTOMER_ID" }, { status: 400 })
  }

  // ── 3. Create a Polar Customer Session → get portal URL ──────────────────
  try {
    const polar = getPolarClient()
    const session = await polar.customerSessions.create({
      customerId: polarCustomerId,
    })
    return NextResponse.json({ portalUrl: session.customerPortalUrl })
  } catch (err) {
    console.error("[api/billing/portal] Polar error:", err)
    return NextResponse.json({ error: "PORTAL_FAILED" }, { status: 502 })
  }
}
