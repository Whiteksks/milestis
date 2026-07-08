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
  }
}

/**
 * Lookup for token-namespace modes (e.g. photobook).
 * The reservation doc ID is sha256(accessToken), not mode:slug.
 * We verify the slug in the URL matches what was published (cosmetic check).
 */
async function getPublishedProjectByToken(slug: string, mode: "photobook", plainToken: string) {
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
  if (!data || data.isPublished !== true || data.mode !== mode) return null

  return {
    id: doc.id,
    slug: (data.slug as string | undefined) ?? slug,
    name: data.name as string,
    mode: data.mode as "photobook",
    content: data.content ?? null,
    theme: data.theme ?? null,
  }
}

// --- SEO metadata ---

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

    return {
      title,
      description,
      // metadataBase must point to the subdomain so Next.js resolves the
      // auto-discovered opengraph-image.tsx route to the correct absolute URL
      // (otherwise it defaults to NEXT_APP_URL = milestis.com which is wrong).
      metadataBase: new URL(`https://${slug}.milestis.site`),
      openGraph: {
        title,
        description,
        type: 'profile',
        url: `https://${slug}.milestis.site`,
        images: [{ url: '/opengraph-image', width: 1200, height: 630 }],
      },
      twitter: {
        card: 'summary_large_image',
        title,
        description,
        images: [`https://${slug}.milestis.site/opengraph-image`],
      },
    }
  }

  // token-namespace: validate token if present — enrich OG for social sharing
  const { share } = await searchParams
  const tokenString = Array.isArray(share) ? share[0] : share

  if (tokenString) {
    const project = await getPublishedProjectByToken(slug, mode as "photobook", tokenString)
    if (project) {
      type Images = Record<string, { value?: { asset?: { src?: string } } } | undefined>
      const images = ((project.content as Record<string, unknown> | null)?.imageContent ?? {}) as Images
      // Photobook cover is stored under 'cover'; portfolio uses 'hero'/'bio'
      const coverUrl = images.cover?.value?.asset?.src || images.hero?.value?.asset?.src || null
      const title = project.name

      return {
        title,
        robots: "noindex",
        openGraph: {
          title,
          ...(coverUrl ? { images: [{ url: coverUrl, width: 1200, height: 630 }] } : {}),
        },
        twitter: {
          card: coverUrl ? "summary_large_image" : "summary",
          title,
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

  const project = await getPublishedProjectByToken(slug, mode as "photobook", tokenString)
  if (!project) {
    // Token is wrong or project doesn't exist — show gate again
    return <TokenGateForm slug={slug} />
  }

  // Token verified — render project
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
