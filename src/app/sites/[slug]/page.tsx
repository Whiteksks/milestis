import { notFound } from "next/navigation"
import { createHash } from "crypto"
import type { Metadata } from "next"
import { adminDb } from "@/lib/firebase/admin"

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
      // Show a token entry form instead of a blank 404
      return (
        <main className="flex min-h-screen flex-col items-center justify-center bg-white px-4">
          <div className="w-full max-w-sm text-center">
            <h1 className="text-2xl font-semibold text-gray-900 mb-2">{project.name}</h1>
            <p className="text-gray-500 mb-6 text-sm">This photobook is private. Enter the access token to view it.</p>
            <form method="GET" className="flex flex-col gap-3">
              <input
                name="token"
                type="text"
                placeholder="Access token"
                autoComplete="off"
                className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-400"
              />
              <button
                type="submit"
                className="w-full rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-700 transition-colors"
              >
                Open photobook
              </button>
              {tokenString && (
                <p className="text-red-500 text-xs mt-1">Invalid token. Please check and try again.</p>
              )}
            </form>
          </div>
        </main>
      )
    }
  }

  return (
    <main>
      {/* TODO: render portfolio / photobook by project.mode, project.content, project.theme */}
      <pre className="p-8 text-xs opacity-50">
        {JSON.stringify({ id: project.id, slug: project.slug, mode: project.mode }, null, 2)}
      </pre>
    </main>
  )
}
