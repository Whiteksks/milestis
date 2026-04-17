import { NextRequest, NextResponse } from "next/server"
import { adminDb } from "@/lib/firebase/admin"

// Portfolio slugs must be unique within the portfolio namespace (they become subdomains).
// Photobook slugs must be unique within the photobook namespace (they become URL paths).
// The two namespaces are independent — a portfolio and a photobook can share the same slug.
// Publish slugs are capped to 24 chars to match the editor UI and server publish validation.

const SLUG_REGEX = /^[a-z0-9]([a-z0-9-]*[a-z0-9])?$/
const PUBLISHED_PROJECT_SLUGS_COLLECTION = "published_project_slugs"

function getPublishedSlugReservationDocId(mode: string, slug: string) {
  return `${mode}:${slug}`
}

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl
  const slug = searchParams.get("slug") ?? ""
  const excludeProjectId = searchParams.get("excludeProjectId") ?? ""
  const mode = searchParams.get("mode") ?? "portfolio"

  if (!slug || slug.length < 3 || slug.length > 24 || !SLUG_REGEX.test(slug)) {
    return NextResponse.json({ available: false, error: "INVALID_SLUG" })
  }

  if (mode !== "portfolio" && mode !== "photobook") {
    return NextResponse.json({ available: false, error: "INVALID_MODE" })
  }

  try {
    const snap = await adminDb
      .collection(PUBLISHED_PROJECT_SLUGS_COLLECTION)
      .doc(getPublishedSlugReservationDocId(mode, slug))
      .get()

    const takenByOther = snap.exists() && snap.data()?.projectId !== excludeProjectId
    return NextResponse.json({ available: !takenByOther })
  } catch {
    return NextResponse.json({ available: false, error: "SERVER_ERROR" }, { status: 500 })
  }
}
