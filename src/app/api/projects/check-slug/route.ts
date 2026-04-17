import { NextRequest, NextResponse } from "next/server"
import { adminDb } from "@/lib/firebase/admin"
import {
  getSlugReservationDocId,
  getSlugValidationError,
  isSlugMode,
  normalizeSlug,
  PUBLISHED_PROJECT_SLUGS_COLLECTION,
} from "@/lib/slug"

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl
  const slug = normalizeSlug(searchParams.get("slug") ?? "")
  const excludeProjectId = searchParams.get("excludeProjectId") ?? ""
  const rawMode = searchParams.get("mode") ?? "portfolio"

  if (getSlugValidationError(slug)) {
    return NextResponse.json({ available: false, error: "INVALID_SLUG" })
  }

  if (!isSlugMode(rawMode)) {
    return NextResponse.json({ available: false, error: "INVALID_MODE" })
  }

  try {
    const snap = await adminDb
      .collection(PUBLISHED_PROJECT_SLUGS_COLLECTION)
      .doc(getSlugReservationDocId(rawMode, slug))
      .get()

    const takenByOther = snap.exists && snap.data()?.projectId !== excludeProjectId
    return NextResponse.json({ available: !takenByOther })
  } catch {
    return NextResponse.json({ available: false, error: "SERVER_ERROR" }, { status: 500 })
  }
}
