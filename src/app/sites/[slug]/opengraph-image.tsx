import { ImageResponse } from 'next/og'
import { headers } from 'next/headers'
import { adminDb } from '@/lib/firebase/admin'
import { PUBLISHED_PROJECT_SLUGS_COLLECTION } from '@/lib/slug'

export const alt = 'Preview'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'
export const runtime = 'nodejs'

// ─── Helpers ──────────────────────────────────────────────────────────────────

/**
 * Satori cannot reliably fetch Firebase Storage URLs on its own
 * (no redirect-follow, no proper Accept headers). Pre-fetch server-side
 * and hand Satori a data URL instead.
 */
async function toDataUrl(url: string): Promise<string | null> {
  try {
    const res = await fetch(url, { signal: AbortSignal.timeout(5_000) })
    if (!res.ok) return null
    const mime = res.headers.get('content-type') ?? 'image/jpeg'
    if (!mime.startsWith('image/')) return null
    const buf = await res.arrayBuffer()
    return `data:${mime};base64,${Buffer.from(buf).toString('base64')}`
  } catch {
    return null
  }
}

// ─── Data fetchers ────────────────────────────────────────────────────────────

type ImageSlot = { value?: { asset?: { src?: string } } }
type ImageMap = Record<string, ImageSlot | undefined>

async function fetchPortfolioImageUrl(slug: string): Promise<string | null> {
  const slugSnap = await adminDb
    .collection(PUBLISHED_PROJECT_SLUGS_COLLECTION)
    .doc(slug)
    .get()

  const projectId = (slugSnap.data() as { projectId?: string } | undefined)?.projectId
  if (!projectId) return null

  const doc = await adminDb.collection('published_projects').doc(projectId).get()
  if (!doc.exists) return null

  const images = ((doc.data()!.content as Record<string, unknown>)?.imageContent ?? {}) as ImageMap
  return images.hero?.value?.asset?.src || images.bio?.value?.asset?.src || null
}

async function fetchPhotobookImageUrl(slug: string): Promise<string | null> {
  // Photobook slug reservations are keyed by hashed token, not by slug.
  // Query published_projects directly by slug + mode (composite index already exists).
  // isPublished is checked in code to avoid needing a triple-field index.
  const snap = await adminDb
    .collection('published_projects')
    .where('slug', '==', slug)
    .where('mode', '==', 'photobook')
    .limit(1)
    .get()

  if (snap.empty) return null

  const data = snap.docs[0].data()
  if (data.isPublished !== true) return null

  const images = ((data.content as Record<string, unknown>)?.imageContent ?? {}) as ImageMap
  return images.cover?.value?.asset?.src || images.hero?.value?.asset?.src || null
}

// ─── Route handler ────────────────────────────────────────────────────────────

interface Props {
  params: Promise<{ slug: string }>
}

const FALLBACK = (
  <div style={{ display: 'flex', width: '100%', height: '100%', background: '#111' }} />
)

export default async function Image({ params }: Props) {
  try {
    const { slug } = await params
    const reqHeaders = await headers()
    const mode = reqHeaders.get('x-milestis-mode')

    let storageUrl: string | null = null
    if (mode === 'portfolio') {
      storageUrl = await fetchPortfolioImageUrl(slug)
    } else if (mode === 'photobook') {
      storageUrl = await fetchPhotobookImageUrl(slug)
    }

    if (storageUrl) {
      const dataUrl = await toDataUrl(storageUrl)
      if (dataUrl) {
        return new ImageResponse(
          <div style={{ display: 'flex', width: '100%', height: '100%' }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={dataUrl}
              alt=""
              style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center top' }}
            />
          </div>,
          size,
        )
      }
    }
  } catch {
    // Never let this route return non-PNG — crawlers would ignore og:image entirely
  }

  return new ImageResponse(FALLBACK, size)
}

