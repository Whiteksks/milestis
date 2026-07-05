import { NextRequest, NextResponse } from "next/server"
import { getPolarClient } from "@/lib/billing/polar"
import { resolveBillingProductId } from "@/lib/billing/plans"
import { requireAuth } from "@/lib/api/require-auth"
import { adminAuth } from "@/lib/firebase/admin"

export const runtime = "nodejs"

export async function POST(request: NextRequest) {
  // ── 1. Auth: verify session cookie ──────────────────────────────────────
  const auth = await requireAuth(request)
  if (auth.error) return auth.error
  const { uid } = auth

  // ── 2. Validate request body ─────────────────────────────────────────────
  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: "INVALID_JSON" }, { status: 400 })
  }

  const bodyRecord = body !== null && typeof body === "object" ? body as Record<string, unknown> : {}
  const plan = typeof bodyRecord.plan === "string" ? bodyRecord.plan : ""
  const interval = typeof bodyRecord.interval === "string" ? bodyRecord.interval : ""
  const productId = resolveBillingProductId(plan, interval)

  if (!productId) {
    return NextResponse.json({ error: "INVALID_PLAN" }, { status: 400 })
  }

  // ── 3. Create Polar Checkout Session ────────────────────────────────────
  const appUrl = process.env.NEXT_APP_URL ?? request.nextUrl.origin
  const successUrl = new URL("/account/billing?checkout=success", appUrl).toString()

  // Fetch user's email to pre-fill the checkout form.
  // This prevents the user from entering a different email and creating
  // a mismatched Polar customer record.
  let customerEmail: string | undefined
  try {
    const userRecord = await adminAuth.getUser(uid)
    customerEmail = userRecord.email ?? undefined
  } catch {
    // Non-fatal — checkout proceeds without pre-filled email.
  }

  try {
    const polar = getPolarClient()

    const checkout = await polar.checkouts.create({
      products: [productId],
      successUrl,
      ...(customerEmail ? { customerEmail } : {}),
      // uid is injected server-side so the webhook can identify the user.
      // Credits and packId are resolved from the product's own metadata by the webhook.
      metadata: {
        uid,
      },
    })

    return NextResponse.json({ checkoutUrl: checkout.url })
  } catch (err) {
    console.error("[api/billing/checkout] Polar error:", err)
    return NextResponse.json({ error: "CHECKOUT_FAILED" }, { status: 502 })
  }
}
