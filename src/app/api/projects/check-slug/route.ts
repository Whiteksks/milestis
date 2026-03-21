import { NextRequest, NextResponse } from "next/server"
import { adminDb } from "@/lib/firebase/admin"

// Portfolio slugs must be globally unique (they become subdomains).
// Photobook slugs have no uniqueness requirement (access token provides isolation).

const SLUG_REGEX = /^[a-z0-9]([a-z0-9-]*[a-z0-9])?$/

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl
  const slug = searchParams.get("slug") ?? ""
  const excludeProjectId = searchParams.get("excludeProjectId") ?? ""

  if (!slug || slug.length < 3 || slug.length > 63 || !SLUG_REGEX.test(slug)) {
    return NextResponse.json({ available: false, error: "INVALID_SLUG" })
  }

  try {
    const snap = await adminDb
      .collection("published_projects")
      .where("slug", "==", slug)
      .limit(2)
      .get()

    const takenByOther = snap.docs.some((doc) => doc.id !== excludeProjectId)
    return NextResponse.json({ available: !takenByOther })
  } catch {
    return NextResponse.json({ available: false, error: "SERVER_ERROR" }, { status: 500 })
  }
}
