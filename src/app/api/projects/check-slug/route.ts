import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/firebase/firebase"
import { doc, getDoc } from "firebase/firestore"
import {
  getSlugModePolicy,
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

  // Token-namespace modes don't reserve by slug — slug is cosmetic, always available
  const policy = getSlugModePolicy(rawMode)
  if (policy.namespace === "token") {
    return NextResponse.json({ available: true })
  }

  try {
    const snap = await getDoc(
      doc(db, PUBLISHED_PROJECT_SLUGS_COLLECTION, getSlugReservationDocId(rawMode, slug)),
    )

    const takenByOther = snap.exists() && snap.data()?.projectId !== excludeProjectId
    return NextResponse.json({ available: !takenByOther })
  } catch {
    return NextResponse.json({ available: false, error: "SERVER_ERROR" }, { status: 500 })
  }
}
