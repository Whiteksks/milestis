import { ImageResponse } from 'next/og'
import { adminDb } from '@/lib/firebase/admin'
import { getSlugReservationDocId, PUBLISHED_PROJECT_SLUGS_COLLECTION } from '@/lib/slug'

export const alt = 'Portfolio preview'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'
export const runtime = 'nodejs'

// ─── Layout ───────────────────────────────────────────────────────────────────

function OgLayout({ imageUrl, title }: { imageUrl: string | null; title?: string }) {
  return (
    <div style={{ display: 'flex', position: 'relative', width: '100%', height: '100%', background: '#0a0a0a' }}>
      {imageUrl && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={imageUrl}
          alt=""
          style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center top' }}
        />
      )}

      {title && (
        <>
          {/* Gradient so title is readable over any photo */}
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.08) 55%, transparent 100%)' }} />
          <div style={{ position: 'absolute', bottom: 72, left: 80, right: 80, display: 'flex' }}>
            <span style={{ color: 'white', fontSize: 68, fontWeight: 700, lineHeight: 1.1, letterSpacing: '-1px' }}>
              {title}
            </span>
          </div>
        </>
      )}
    </div>
  )
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

/**
 * Satori (used by ImageResponse) cannot reliably fetch external images via URL.
 * Pre-fetching as a base64 data URL avoids CORS / redirect failures at render time.
 */
async function fetchImageAsDataUrl(url: string): Promise<string | null> {
  try {
    const res = await fetch(url)
    if (!res.ok) return null
    const buffer = await res.arrayBuffer()
    const base64 = Buffer.from(buffer).toString('base64')
    const contentType = res.headers.get('content-type') ?? 'image/jpeg'
    return `data:${contentType};base64,${base64}`
  } catch {
    return null
  }
}

// ─── Data fetcher (portfolio only) ────────────────────────────────────────────

type ImageSlot = { value?: { asset?: { src?: string } } }
type ImageMap = Record<string, ImageSlot | undefined>

async function fetchPortfolio(slug: string): Promise<{ name: string; imageUrl: string | null } | null> {
  const slugSnap = await adminDb
    .collection(PUBLISHED_PROJECT_SLUGS_COLLECTION)
    .doc(getSlugReservationDocId('portfolio', slug))
    .get()

  const projectId = (slugSnap.data() as { projectId?: string } | undefined)?.projectId
  if (!projectId) return null

  const doc = await adminDb.collection('published_projects').doc(projectId).get()
  if (!doc.exists) return null

  const data = doc.data()!
  const images = ((data.content as Record<string, unknown>)?.imageContent ?? {}) as ImageMap

  return {
    name: data.name as string,
    imageUrl: images.hero?.value?.asset?.src || images.bio?.value?.asset?.src || null,
  }
}

// ─── Route handler ────────────────────────────────────────────────────────────

interface Props {
  params: Promise<{ slug: string }>
}

export default async function Image({ params }: Props) {
  const { slug } = await params

  // Portfolio only — photobooks get their OG image via generateMetadata (token-gated)
  const portfolio = await fetchPortfolio(slug)
  if (portfolio) {
    const imageDataUrl = portfolio.imageUrl ? await fetchImageAsDataUrl(portfolio.imageUrl) : null
    return new ImageResponse(<OgLayout title={portfolio.name} imageUrl={imageDataUrl} />, size)
  }

  // Fallback — dark canvas so the route always returns a valid PNG
  return new ImageResponse(
    <div style={{ display: 'flex', width: '100%', height: '100%', background: '#111' }} />,
    size,
  )
}

