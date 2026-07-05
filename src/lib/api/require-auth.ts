import { type NextRequest, NextResponse } from "next/server"
import { adminAuth } from "@/lib/firebase/admin"

export const SESSION_COOKIE = "milestis_session"

type AuthSuccess = { uid: string; error?: never }
type AuthFailure = { uid?: never; error: NextResponse }
export type AuthResult = AuthSuccess | AuthFailure

function isSameOriginRequest(request: NextRequest): boolean {
  const origin = request.headers.get("origin")
  if (origin) {
    const trustedOrigins = new Set([
      request.nextUrl.origin,
      process.env.NEXT_APP_URL,
    ].filter(Boolean))
    return trustedOrigins.has(origin)
  }

  const fetchSite = request.headers.get("sec-fetch-site")
  if (fetchSite === "cross-site") return false

  return true
}

/**
 * Verifies the session cookie from the request and returns the authenticated uid.
 * Returns a NextResponse error (401) on failure — the caller should return it immediately.
 *
 * Usage:
 *   const auth = await requireAuth(request)
 *   if (auth.error) return auth.error
 *   const { uid } = auth
 */
export async function requireAuth(request: NextRequest): Promise<AuthResult> {
  if (!isSameOriginRequest(request)) {
    return { error: NextResponse.json({ error: "INVALID_ORIGIN" }, { status: 403 }) }
  }

  const sessionCookie = request.cookies.get(SESSION_COOKIE)?.value
  if (!sessionCookie) {
    return { error: NextResponse.json({ error: "UNAUTHENTICATED" }, { status: 401 }) }
  }

  try {
    const decoded = await adminAuth.verifySessionCookie(sessionCookie, true)
    return { uid: decoded.uid }
  } catch {
    return { error: NextResponse.json({ error: "INVALID_SESSION" }, { status: 401 }) }
  }
}
