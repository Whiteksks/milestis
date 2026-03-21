import { notFound } from "next/navigation"
import type { Metadata } from "next"
import { adminDb } from "@/lib/firebase/admin"

interface Props {
  params: Promise<{ projectId: string }>
}

// ─── Данные проекта из Firestore (серверная сторона) ──────────────────────

async function getPublishedProject(projectId: string) {
  const snap = await adminDb.doc(`published_projects/${projectId}`).get()

  if (!snap.exists) return null

  const data = snap.data()!

  return {
    id: projectId,
    name: data.name as string,
    mode: data.mode as "portfolio" | "photobook",
    content: data.content ?? null,
    theme: data.theme ?? null,
    preview: data.preview ?? null,
  }
}

// ─── SEO метаданные ───────────────────────────────────────────────────────

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { projectId } = await params
  const project = await getPublishedProject(projectId)

  if (!project) return { title: "Not found" }

  const title = project.preview?.title ?? project.name
  const description = project.preview?.subtitle ?? undefined

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: project.preview?.heroImageUrl
        ? [{ url: project.preview.heroImageUrl }]
        : [],
    },
  }
}

// ─── Страница ─────────────────────────────────────────────────────────────

export default async function SitePage({ params }: Props) {
  const { projectId } = await params
  const project = await getPublishedProject(projectId)

  if (!project) notFound()

  return (
    <main>
      {/* TODO: рендер portfolio / photobook по project.mode, project.content, project.theme */}
      <pre className="p-8 text-xs opacity-50">
        {JSON.stringify({ id: project.id, mode: project.mode, preview: project.preview }, null, 2)}
      </pre>
    </main>
  )
}
