import { NextRequest, NextResponse } from "next/server"

import { adminAuth } from "@/lib/firebase/admin"

export const runtime = "nodejs"

const SESSION_COOKIE = "milestis_session"
const SESSION_EXPIRES_MS = 5 * 24 * 60 * 60 * 1000

function buildSessionCookie(response: NextResponse, value: string, maxAgeSeconds: number) {
  response.cookies.set({
    name: SESSION_COOKIE,
    value,
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: maxAgeSeconds,
  })

  return response
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const idToken = typeof body?.idToken === "string" ? body.idToken : ""

    if (!idToken) {
      return NextResponse.json({ error: "ID_TOKEN_REQUIRED" }, { status: 400 })
    }

    await adminAuth.verifyIdToken(idToken)
    const sessionCookie = await adminAuth.createSessionCookie(idToken, {
      expiresIn: SESSION_EXPIRES_MS,
    })

    return buildSessionCookie(
      NextResponse.json({ ok: true }),
      sessionCookie,
      Math.floor(SESSION_EXPIRES_MS / 1000),
    )
  } catch (error) {
    console.error('[api/auth/session] Failed to create session cookie:', error)
    return NextResponse.json({ error: "INVALID_OR_EXPIRED_TOKEN" }, { status: 401 })
  }
}

export async function DELETE() {
  return buildSessionCookie(NextResponse.json({ ok: true }), "", 0)
}