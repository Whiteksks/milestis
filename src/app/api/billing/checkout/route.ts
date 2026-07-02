import { NextRequest, NextResponse } from "next/server"
import { getPolarClient } from "@/lib/billing/polar"
import { requireAuth } from "@/lib/api/require-auth"

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

  const productId =
    body !== null &&
    typeof body === "object" &&
    "productId" in body &&
    typeof (body as Record<string, unknown>).productId === "string"
      ? (body as Record<string, unknown>).productId as string
      : null

  if (!productId) {
    return NextResponse.json({ error: "PRODUCT_ID_REQUIRED" }, { status: 400 })
  }

  // ── 3. Create Polar Checkout Session ────────────────────────────────────
  const successUrl = new URL("/account/billing?checkout=success", request.nextUrl.origin).toString()

  try {
    const polar = getPolarClient()

    const checkout = await polar.checkouts.create({
      products: [productId],
      successUrl,
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
