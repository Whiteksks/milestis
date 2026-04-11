import { notFound } from "next/navigation"
import { createHash } from "crypto"
import type { Metadata } from "next"
import { adminDb } from "@/lib/firebase/admin"
import { PublishedPortfolioView, PublishedPhotobookView, TokenGateForm } from "./published-view"

interface Props {
  params: Promise<{ slug: string }>
  searchParams: Promise<Record<string, string | string[]>>
}

// --- Lookup by slug (Firestore query) ---

async function getPublishedProjectBySlug(slug: string) {
  const snap = await adminDb
    .collection("published_projects")
    .where("slug", "==", slug)
    .limit(1)
    .get()

  if (snap.empty) return null

  const doc = snap.docs[0]
  const data = doc.data()

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
  const project = await getPublishedProjectBySlug(slug)

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
  const project = await getPublishedProjectBySlug(slug)

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
      <PublishedPortfolioView
        templateId={(theme.currentTemplateId as string | undefined) ?? "minimal"}
        themeId={(theme.currentTheme as string | undefined) ?? "parchment"}
        sectionContent={content.sectionContent ?? {}}
        sectionVisibility={content.sectionVisibility ?? {}}
      />
    )
  }

  // Photobook (token already verified above)
  if (project.mode === "photobook") {
    const content = project.content ?? {}
    const theme = project.theme ?? {}
    return (
      <PublishedPhotobookView
        templateId={(theme.currentTemplateId as string | undefined) ?? "photobook-memoir"}
        themeId={(theme.currentTheme as string | undefined) ?? "parchment"}
        sectionContent={content.sectionContent ?? {}}
        sectionVisibility={content.sectionVisibility ?? {}}
      />
    )
  }
}
