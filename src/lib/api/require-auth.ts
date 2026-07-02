import { type NextRequest, NextResponse } from "next/server"
import { adminAuth } from "@/lib/firebase/admin"

export const SESSION_COOKIE = "milestis_session"

type AuthSuccess = { uid: string; error?: never }
type AuthFailure = { uid?: never; error: NextResponse }
export type AuthResult = AuthSuccess | AuthFailure

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
