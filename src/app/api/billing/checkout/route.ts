import { NextRequest, NextResponse } from "next/server"
import { getPolarClient } from "@/lib/billing/polar"
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
