import { NextRequest, NextResponse } from "next/server"
import { adminDb } from "@/lib/firebase/admin"
import { requireAuth } from "@/lib/api/require-auth"

export const runtime = "nodejs"

// Best-effort save used only as a fallback for tab-close/refresh on iOS Safari, where the
// normal client Firestore SDK write is frequently killed mid-flight before it reaches the
// network. Sent via navigator.sendBeacon, which the browser guarantees to deliver even as
// the page unloads. Writes the same { theme, content } shape as the regular save path.
export async function POST(request: NextRequest) {
  const auth = await requireAuth(request)
  if (auth.error) return auth.error
  const { uid } = auth

  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: "INVALID_JSON" }, { status: 400 })
  }

  const bodyRecord = body !== null && typeof body === "object" ? (body as Record<string, unknown>) : {}
  const projectId = typeof bodyRecord.projectId === "string" ? bodyRecord.projectId.trim() : ""
  const theme = bodyRecord.theme
  const content = bodyRecord.content

  if (!projectId || theme === undefined || content === undefined) {
    return NextResponse.json({ error: "INVALID_PAYLOAD" }, { status: 400 })
  }

  try {
    const projectSnap = await adminDb.collection("projects").doc(projectId).get()
    if (!projectSnap.exists) {
      return NextResponse.json({ error: "NOT_FOUND" }, { status: 404 })
    }
    if (projectSnap.data()?.ownerId !== uid) {
      return NextResponse.json({ error: "FORBIDDEN" }, { status: 403 })
    }

    await adminDb
      .collection("projects")
      .doc(projectId)
      .collection("data")
      .doc("content")
      .set({ theme, content })

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error("[api/projects/beacon-save] Failed to save:", err)
    return NextResponse.json({ error: "SERVER_ERROR" }, { status: 500 })
  }
}
