import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/firebase/firebase"
import { collection, query, where, limit, getDocs } from "firebase/firestore"

// Portfolio slugs must be globally unique (they become subdomains).
// Photobook slugs have no uniqueness requirement (access token provides isolation).
// 63 chars = DNS RFC 1035 hard limit for a single label.

const SLUG_REGEX = /^[a-z0-9]([a-z0-9-]*[a-z0-9])?$/

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl
  const slug = searchParams.get("slug") ?? ""
  const excludeProjectId = searchParams.get("excludeProjectId") ?? ""

  if (!slug || slug.length < 3 || slug.length > 63 || !SLUG_REGEX.test(slug)) {
    return NextResponse.json({ available: false, error: "INVALID_SLUG" })
  }

  try {
    const snap = await getDocs(
      query(collection(db, "published_projects"), where("slug", "==", slug), limit(2)),
    )

    const takenByOther = snap.docs.some((doc) => doc.id !== excludeProjectId)
    return NextResponse.json({ available: !takenByOther })
  } catch {
    return NextResponse.json({ available: false, error: "SERVER_ERROR" }, { status: 500 })
  }
}
