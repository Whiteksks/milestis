import { notFound } from "next/navigation"
import { createHash } from "crypto"
import { headers } from "next/headers"
import type { Metadata } from "next"
import { adminDb } from "@/lib/firebase/admin"
import {
  getSlugModePolicy,
  getSlugReservationDocId,
  isSlugMode,
  PUBLISHED_PROJECT_SLUGS_COLLECTION,
} from "@/lib/slug"
import { PublishedView, TokenGateForm } from "./published-view"
import type { ThemeCustomizations } from "@/editor/lib/store/theme"
import type { ThemeCustomDecorations } from "@/editor/lib/types"
import { MODE_REGISTRY } from "@/editor/lib/modes/registry"

interface Props {
  params: Promise<{ slug: string }>
  searchParams: Promise<Record<string, string | string[]>>
}

// --- Lookup helpers ---

async function getPublishedProjectBySlugGlobal(slug: string, mode: "portfolio") {
  const slugSnap = await adminDb
    .collection(PUBLISHED_PROJECT_SLUGS_COLLECTION)
    .doc(getSlugReservationDocId(mode, slug))
    .get()

  if (!slugSnap.exists) return null

  const slugData = slugSnap.data() as { projectId?: string } | undefined
  if (!slugData?.projectId) return null

  const doc = await adminDb.collection("published_projects").doc(slugData.projectId).get()
  if (!doc.exists) return null

  const data = doc.data()
  if (!data || data.isPublished !== true || data.slug !== slug || data.mode !== mode) return null

  return {
    id: doc.id,
    slug: data.slug as string,
    name: data.name as string,
    mode: data.mode as "portfolio",
    accessToken: null as null,
    content: data.content ?? null,
    theme: data.theme ?? null,
    ogImageUrl: (data.ogImageUrl as string | undefined) ?? null,
  }
}

/**
 * Lookup for token-namespace modes (photobook, event).
 * The reservation doc ID is sha256(accessToken), not mode:slug.
 * The middleware cannot distinguish photobook vs event slugs without a DB call,
 * so we do NOT validate against the header mode here — instead we trust the
 * mode stored on the published_projects document itself (token-namespace modes only).
 */
async function getPublishedProjectByToken(slug: string, plainToken: string) {
  const hashedToken = createHash("sha256").update(plainToken).digest("hex")

  const slugSnap = await adminDb
    .collection(PUBLISHED_PROJECT_SLUGS_COLLECTION)
    .doc(hashedToken)
    .get()

  if (!slugSnap.exists) return null

  const slugData = slugSnap.data() as { projectId?: string; slug?: string } | undefined
  if (!slugData?.projectId) return null

  const doc = await adminDb.collection("published_projects").doc(slugData.projectId).get()
  if (!doc.exists) return null

  const data = doc.data()
  // Accept any token-namespace mode; reject non-token-namespace modes (e.g. portfolio)
  const docMode = data?.mode as string | undefined
  if (!data || data.isPublished !== true || !docMode || !['photobook', 'event'].includes(docMode)) return null

  return {
    id: doc.id,
    slug: (data.slug as string | undefined) ?? slug,
    name: data.name as string,
    mode: docMode as "photobook" | "event",
    content: data.content ?? null,
    theme: data.theme ?? null,
    ogImageUrl: (data.ogImageUrl as string | undefined) ?? null,
  }
}

// --- SEO metadata ---

function extractCoverUrlFromContent(
  content: Record<string, unknown> | null,
  mode: string,
): string | null {
  if (!content) return null
  const imageContent = content.imageContent as Record<string, unknown> | undefined
  if (!imageContent) return null
  if (mode === "photobook") {
    const cover = imageContent.cover as { value?: { asset?: { src?: string } } } | undefined
    return cover?.value?.asset?.src ?? null
  }
  if (mode === "portfolio") {
    const hero = imageContent.hero as { value?: { asset?: { src?: string } } } | undefined
    const bio2 = imageContent.bio as { value?: { asset?: { src?: string } } } | undefined
    return hero?.value?.asset?.src ?? bio2?.value?.asset?.src ?? null
  }
  return null
}

export async function generateMetadata({ params, searchParams }: Props): Promise<Metadata> {
  const { slug } = await params
  const reqHeaders = await headers()
  const rawMode = reqHeaders.get("x-milestis-mode")
  if (!isSlugMode(rawMode)) return { title: "Not found" }

  const mode = rawMode
  const policy = getSlugModePolicy(mode)

  if (policy.namespace === "global") {
    const project = await getPublishedProjectBySlugGlobal(slug, mode as "portfolio")
    if (!project) return { title: "Not found" }

    const sectionContent = (project.content as Record<string, unknown> | null)?.sectionContent as Record<string, Record<string, string>> | undefined
    const bio = sectionContent?.bio
    const title = bio?.title || project.name
    const description = bio?.description?.slice(0, 160) || undefined

    // Prefer the pre-generated 1200×630 OG image; fall back to the raw cover
    const ogImageSrc =
      project.ogImageUrl ??
      extractCoverUrlFromContent(project.content as Record<string, unknown> | null, "portfolio")
    const ogImages = ogImageSrc ? [{ url: ogImageSrc }] : []

    return {
      title,
      description,
      openGraph: {
        title,
        description,
        type: 'profile',
        url: `https://${slug}.milestis.site`,
        images: ogImages,
      },
      twitter: {
        card: 'summary_large_image',
        title,
        description,
        ...(ogImageSrc ? { images: [ogImageSrc] } : {}),
      },
    }
  }

  // token-namespace: validate token if present — enrich OG for social sharing
  const { share } = await searchParams
  const tokenString = Array.isArray(share) ? share[0] : share

  if (tokenString) {
    const project = await getPublishedProjectByToken(slug, tokenString)
    if (project) {
      const title = project.name
      const ogImageSrc =
        project.ogImageUrl ??
        extractCoverUrlFromContent(project.content as Record<string, unknown> | null, "photobook")
      const ogImages = ogImageSrc ? [{ url: ogImageSrc }] : []

      return {
        title,
        robots: "noindex",
        openGraph: {
          title,
          images: ogImages,
        },
        twitter: {
          card: 'summary_large_image',
          title,
          ...(ogImageSrc ? { images: [ogImageSrc] } : {}),
        },
      }
    }
  }

  return { robots: "noindex" }
}

// --- Page ---

export default async function SitePage({ params, searchParams }: Props) {
  const { slug } = await params
  const reqHeaders = await headers()
  const rawMode = reqHeaders.get("x-milestis-mode")
  if (!isSlugMode(rawMode)) notFound()

  const mode = rawMode
  const policy = getSlugModePolicy(mode)

  // ── Global-namespace (subdomain) modes ────────────────────────────────
  if (policy.namespace === "global") {
    const project = await getPublishedProjectBySlugGlobal(slug, mode as "portfolio")
    if (!project) notFound()

    const content = project.content ?? {}
    const theme = project.theme ?? {}
    return (
      <PublishedView
        mode={mode}
        templateId={(theme.currentTemplateId as string | undefined) ?? MODE_REGISTRY[mode].defaultTemplateId}
        themeId={(theme.currentTheme as string | undefined) ?? "parchment"}
        themeCustomizations={(theme.themeCustomizations as ThemeCustomizations | undefined) ?? {}}
        customDecorations={(theme.customDecorations as ThemeCustomDecorations[] | undefined) ?? []}
        content={(content.sectionContent ?? {}) as Record<string, unknown>}
        imageContent={(content.imageContent ?? {}) as Record<string, unknown>}
        visibility={(content.sectionVisibility ?? {}) as Record<string, unknown>}
      />
    )
  }

  // ── Token-namespace (path+token) modes ────────────────────────────────
  const { share } = await searchParams
  const tokenString = Array.isArray(share) ? share[0] : share

  // No token in URL → show gate immediately (don't reveal project existence)
  if (!tokenString) {
    return <TokenGateForm slug={slug} />
  }

  const project = await getPublishedProjectByToken(slug, tokenString)
  if (!project) {
    // Token is wrong or project doesn't exist — show gate again
    return <TokenGateForm slug={slug} />
  }

  // Token verified — render project using the mode stored in the document
  // (may differ from the header mode if middleware can't distinguish photobook vs event)
  const content = project.content ?? {}
  const theme = project.theme ?? {}
  return (
    <PublishedView
      mode={project.mode}
      templateId={(theme.currentTemplateId as string | undefined) ?? MODE_REGISTRY[mode].defaultTemplateId}
      themeId={(theme.currentTheme as string | undefined) ?? "parchment"}
      themeCustomizations={(theme.themeCustomizations as ThemeCustomizations | undefined) ?? {}}
      customDecorations={(theme.customDecorations as ThemeCustomDecorations[] | undefined) ?? []}
      content={(content.sectionContent ?? {}) as Record<string, unknown>}
      imageContent={(content.imageContent ?? {}) as Record<string, unknown>}
      visibility={(content.sectionVisibility ?? {}) as Record<string, unknown>}
      projectId={project.id}
    />
  )
}
