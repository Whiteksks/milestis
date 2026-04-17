import { notFound } from "next/navigation"
import { createHash } from "crypto"
import { headers } from "next/headers"
import type { Metadata } from "next"
import { adminDb } from "@/lib/firebase/admin"
import { PublishedView, TokenGateForm } from "./published-view"
import type { ThemeCustomizations } from "@/editor/lib/store-theme"
import type { ThemeCustomDecorations } from "@/editor/lib/types"

const PUBLISHED_PROJECT_SLUGS_COLLECTION = "published_project_slugs"

function getPublishedSlugReservationDocId(mode: "portfolio" | "photobook", slug: string) {
  return `${mode}:${slug}`
}

interface Props {
  params: Promise<{ slug: string }>
  searchParams: Promise<Record<string, string | string[]>>
}

// --- Lookup by slug + mode (slug reservation -> published project) ---

async function getPublishedProjectBySlug(slug: string, mode: "portfolio" | "photobook") {
  const slugSnap = await adminDb
    .collection(PUBLISHED_PROJECT_SLUGS_COLLECTION)
    .doc(getPublishedSlugReservationDocId(mode, slug))
    .get()

  if (!slugSnap.exists) return null

  const slugData = slugSnap.data() as { projectId?: string } | undefined
  if (!slugData?.projectId) return null

  const doc = await adminDb.collection("published_projects").doc(slugData.projectId).get()
  if (!doc.exists) return null

  const data = doc.data()
  if (!data || data.isPublished !== true || data.slug !== slug || data.mode !== mode) {
    return null
  }

  return {
    id: doc.id,
    slug: data.slug as string,
    name: data.name as string,
    mode: data.mode as "portfolio" | "photobook",
    accessToken: (data.accessToken as string | undefined) ?? null,
    content: data.content ?? null,
    theme: data.theme ?? null,
  }
}

function verifyToken(incoming: string, stored: string): boolean {
  const hashed = createHash("sha256").update(incoming).digest("hex")
  return hashed === stored
}

// --- SEO metadata ---

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const reqHeaders = await headers()
  const mode = (reqHeaders.get('x-milestis-mode') ?? 'portfolio') as "portfolio" | "photobook"
  const project = await getPublishedProjectBySlug(slug, mode)

  if (!project) return { title: "Not found" }

  // No rich metadata for token-protected photobooks
  if (project.mode === "photobook") {
    return { title: project.name, robots: "noindex" }
  }

  return { title: project.name }
}

// --- Page ---

export default async function SitePage({ params, searchParams }: Props) {
  const { slug } = await params
  const reqHeaders = await headers()
  const mode = (reqHeaders.get('x-milestis-mode') ?? 'portfolio') as "portfolio" | "photobook"
  const project = await getPublishedProjectBySlug(slug, mode)

  if (!project) notFound()

  // Token gate for photobooks
  if (project.mode === "photobook" && project.accessToken) {
    const { token } = await searchParams
    const tokenString = Array.isArray(token) ? token[0] : token
    if (!tokenString || !verifyToken(tokenString, project.accessToken)) {
      return <TokenGateForm slug={slug} />
    }
  }

  // Portfolio rendering
  if (project.mode === "portfolio") {
    const content = project.content ?? {}
    const theme = project.theme ?? {}
    return (
      <PublishedView
        mode="portfolio"
        templateId={(theme.currentTemplateId as string | undefined) ?? "minimal"}
        themeId={(theme.currentTheme as string | undefined) ?? "parchment"}
        themeCustomizations={(theme.themeCustomizations as ThemeCustomizations | undefined) ?? {}}
        customDecorations={(theme.customDecorations as ThemeCustomDecorations[] | undefined) ?? []}
        content={(content.sectionContent ?? {}) as Record<string, unknown>}
        visibility={(content.sectionVisibility ?? {}) as Record<string, unknown>}
      />
    )
  }

  // Photobook (token already verified above)
  if (project.mode === "photobook") {
    const content = project.content ?? {}
    const theme = project.theme ?? {}
    return (
      <PublishedView
        mode="photobook"
        templateId={(theme.currentTemplateId as string | undefined) ?? "photobook-memoir"}
        themeId={(theme.currentTheme as string | undefined) ?? "parchment"}
        themeCustomizations={(theme.themeCustomizations as ThemeCustomizations | undefined) ?? {}}
        customDecorations={(theme.customDecorations as ThemeCustomDecorations[] | undefined) ?? []}
        content={(content.sectionContent ?? {}) as Record<string, unknown>}
        visibility={(content.sectionVisibility ?? {}) as Record<string, unknown>}
      />
    )
  }
}
