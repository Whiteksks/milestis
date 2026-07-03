import { NextRequest, NextResponse } from "next/server"
import { getPolarClient } from "@/lib/billing/polar"
import { requireAuth } from "@/lib/api/require-auth"
import { adminDb } from "@/lib/firebase/admin"

export const runtime = "nodejs"

const MIN_CREDITS = 50
const MAX_CREDITS = 1000

export async function POST(request: NextRequest) {
  // ── 1. Auth ─────────────────────────────────────────────────────────────
  const auth = await requireAuth(request)
  if (auth.error) return auth.error
  const { uid } = auth

  // ── 2. Parse & validate body ─────────────────────────────────────────────
  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: "INVALID_JSON" }, { status: 400 })
  }

  const rawCredits =
    body !== null && typeof body === "object" && "credits" in body
      ? (body as Record<string, unknown>).credits
      : null

  if (
    typeof rawCredits !== "number" ||
    !Number.isInteger(rawCredits) ||
    rawCredits < MIN_CREDITS ||
    rawCredits > MAX_CREDITS
  ) {
    return NextResponse.json(
      { error: "INVALID_CREDITS", min: MIN_CREDITS, max: MAX_CREDITS },
      { status: 400 },
    )
  }
  const credits = rawCredits

  // ── 3. Read user's credit rate from Firestore (never trust client) ───────
  // Rate is determined by subscription tier:
  //   free / explorer → 1 credit / $1
  //   creator / archive → 5 credits / $1
  const userSnap = await adminDb.collection("users").doc(uid).get()
  if (!userSnap.exists) {
    return NextResponse.json({ error: "USER_NOT_FOUND" }, { status: 404 })
  }
  const userData = userSnap.data()!
  const ratePerDollar: number =
    userData.subscription?.features?.creditTopupRatePerDollar ?? 1
  const userEmail: string | undefined = userData.email ?? undefined
  const polarCustomerId: string | undefined = userData.subscription?.polarCustomerId ?? undefined

  // ── 4. Calculate price ──────────────────────────────────────────────────
  // amountCents = credits / ratePerDollar * 100  (in US cents)
  const amountCents = Math.round((credits / ratePerDollar) * 100)

  // ── 5. Create Polar ad-hoc checkout ─────────────────────────────────────
  // The product must be configured as "Custom amount" in the Polar dashboard.
  // Set POLAR_CREDITS_PRODUCT_ID in apphosting.yaml / .env.local.
  const productId = process.env.POLAR_CREDITS_PRODUCT_ID
  if (!productId) {
    console.error("[api/billing/buy-credits] POLAR_CREDITS_PRODUCT_ID is not set")
    return NextResponse.json({ error: "CREDITS_PRODUCT_NOT_CONFIGURED" }, { status: 500 })
  }

  const successUrl = new URL(
    "/account/billing?checkout=success&type=credits",
    request.nextUrl.origin,
  ).toString()

  try {
    const polar = getPolarClient()

    const checkout = await polar.checkouts.create({
      products: [productId],
      // Override the price with the dynamically computed amount.
      // Requires the Polar product to have "Custom amount" / flexible pricing enabled.
      amount: amountCents,
      successUrl,
      ...(userEmail ? { customerEmail: userEmail } : {}),
      // Pass customerId so Polar pre-fills the customer's saved payment method.
      ...(polarCustomerId ? { customerId: polarCustomerId } : {}),
      // uid + ratePerDollar are read by the webhookPolar function (order.created event).
      // Credits are computed from order.totalAmount * ratePerDollar in the webhook
      // so the user cannot gain extra credits by altering the checkout amount.
      metadata: {
        uid,
        ratePerDollar,
      },
    })

    return NextResponse.json({
      checkoutUrl: checkout.url,
      amountCents,
      ratePerDollar,
    })
  } catch (err) {
    console.error("[api/billing/buy-credits] Polar error:", err)
    return NextResponse.json({ error: "CHECKOUT_FAILED" }, { status: 502 })
  }
}
