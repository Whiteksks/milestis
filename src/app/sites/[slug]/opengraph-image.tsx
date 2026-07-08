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
 * Satori does not reliably fetch Firebase Storage URLs on its own
 * (no redirect-follow, no proper Accept headers). Pre-fetching server-side
 * and handing Satori a data URL is the only reliable approach.
 * 5 s timeout so a slow Storage response never hangs the whole route.
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

// ─── Data fetchers ──────────────────────────────────────────────────────────────

type ImageSlot = { value?: { asset?: { src?: string } } }
type ImageMap = Record<string, ImageSlot | undefined>

type OgData = { name: string; imageUrl: string | null }

async function fetchPortfolio(slug: string): Promise<OgData | null> {
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

async function fetchPhotobook(slug: string): Promise<OgData | null> {
  // Photobook slugs live directly on published_projects — no slug-reservation lookup needed
  const snap = await adminDb
    .collection('published_projects')
    .where('slug', '==', slug)
    .where('mode', '==', 'photobook')
    .limit(1)
    .get()

  if (snap.empty) return null
  const data = snap.docs[0].data()
  const images = ((data.content as Record<string, unknown>)?.imageContent ?? {}) as ImageMap

  return {
    name: data.name as string,
    imageUrl: images.cover?.value?.asset?.src || null,
  }
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

    // Try portfolio first, then photobook
    const data = await fetchPortfolio(slug) ?? await fetchPhotobook(slug)
    if (data) {
      const imageUrl = data.imageUrl ? await toDataUrl(data.imageUrl) : null
      return new ImageResponse(
        <OgLayout title={data.name} imageUrl={imageUrl} />,
        size,
      )
    }
  } catch {
    // Never let this route return non-PNG — crawlers would ignore og:image entirely
  }

  // Fallback — always return a valid PNG so the og:image URL never 404s/500s
  return new ImageResponse(FALLBACK, size)
}

