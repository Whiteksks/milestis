import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/firebase/firebase"
import { collection, query, where, limit, getDocs } from "firebase/firestore"

// Portfolio slugs must be unique within the portfolio namespace (they become subdomains).
// Photobook slugs must be unique within the photobook namespace (they become URL paths).
// The two namespaces are independent — a portfolio and a photobook can share the same slug.
// 63 chars = DNS RFC 1035 hard limit for a single label.

const SLUG_REGEX = /^[a-z0-9]([a-z0-9-]*[a-z0-9])?$/

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl
  const slug = searchParams.get("slug") ?? ""
  const excludeProjectId = searchParams.get("excludeProjectId") ?? ""
  const mode = searchParams.get("mode") ?? "portfolio"

  if (!slug || slug.length < 3 || slug.length > 63 || !SLUG_REGEX.test(slug)) {
    return NextResponse.json({ available: false, error: "INVALID_SLUG" })
  }

  if (mode !== "portfolio" && mode !== "photobook") {
    return NextResponse.json({ available: false, error: "INVALID_MODE" })
  }

  try {
    const snap = await getDocs(
      query(
        collection(db, "published_projects"),
        where("slug", "==", slug),
        where("mode", "==", mode),
        limit(2),
      ),
    )

    const takenByOther = snap.docs.some((doc) => doc.id !== excludeProjectId)
    return NextResponse.json({ available: !takenByOther })
  } catch {
    return NextResponse.json({ available: false, error: "SERVER_ERROR" }, { status: 500 })
  }
}
