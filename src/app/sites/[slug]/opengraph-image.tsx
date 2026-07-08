import { ImageResponse } from 'takumi-js/response'
import { adminDb } from '@/lib/firebase/admin'
import { getSlugReservationDocId, PUBLISHED_PROJECT_SLUGS_COLLECTION } from '@/lib/slug'

export const alt = 'Portfolio preview'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'
export const runtime = 'nodejs'

// ─── OG layout config (extend for future per-user customization) ─────────────
interface OgLayoutConfig {
  /** Bottom gradient opacity (0–1). Default 0.7. */
  overlayOpacity?: number
  /** Show milestis watermark. Default true. */
  showBadge?: boolean
}

// ─── Shared layout component ─────────────────────────────────────────────────

type OgLayoutProps = {
  imageUrl: string | null
  title?: string
  config?: OgLayoutConfig
}

function OgLayout({ imageUrl, title, config = {} }: OgLayoutProps) {
  const { overlayOpacity = 0.7, showBadge = true } = config

  return (
    <div
      style={{
        display: 'flex',
        width: '100%',
        height: '100%',
        position: 'relative',
        background: '#0a0a0a',
      }}
    >
      {/* Background photo */}
      {imageUrl && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={imageUrl}
          alt=""
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            objectPosition: 'center top',
          }}
        />
      )}

      {/* Gradient overlay — only when there is a title to read */}
      {title && (
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            background: `linear-gradient(to top, rgba(0,0,0,${overlayOpacity}) 0%, rgba(0,0,0,0.08) 55%, transparent 100%)`,
          }}
        />
      )}

      {/* Title — portfolio only */}
      {title && (
        <div
          style={{
            position: 'absolute',
            bottom: 72,
            left: 80,
            right: 80,
            display: 'flex',
          }}
        >
          <span
            style={{
              color: 'white',
              fontSize: 68,
              fontWeight: 700,
              lineHeight: 1.1,
              letterSpacing: '-1px',
            }}
          >
            {title}
          </span>
        </div>
      )}

      {/* Milestis watermark — portfolio only */}
      {title && showBadge && (
        <span
          style={{
            position: 'absolute',
            bottom: 32,
            right: 48,
            fontSize: 18,
            color: 'rgba(255,255,255,0.3)',
            letterSpacing: '1px',
          }}
        >
          milestis.site
        </span>
      )}
    </div>
  )
}

// ─── Data fetchers ────────────────────────────────────────────────────────────

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
    imageUrl:
      images.hero?.value?.asset?.src ||
      images.bio?.value?.asset?.src ||
      null,
  }
}

async function fetchPhotobook(slug: string): Promise<{ imageUrl: string | null } | null> {
  // Photobooks use token-based reservations — look up by slug + mode directly.
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
    imageUrl: images.cover?.value?.asset?.src || null,
  }
}

// ─── Route handler ────────────────────────────────────────────────────────────

interface Props {
  params: Promise<{ slug: string }>
}

export default async function Image({ params }: Props) {
  const { slug } = await params

  // Portfolio: title + photo
  const portfolio = await fetchPortfolio(slug)
  if (portfolio) {
    return new ImageResponse(
      <OgLayout title={portfolio.name} imageUrl={portfolio.imageUrl} />,
      size,
    )
  }

  // Photobook: photo only (private link — no title exposed)
  const photobook = await fetchPhotobook(slug)
  if (photobook?.imageUrl) {
    return new ImageResponse(
      <OgLayout imageUrl={photobook.imageUrl} />,
      size,
    )
  }

  // Fallback — dark canvas so route always returns a valid PNG
  return new ImageResponse(
    <div style={{ display: 'flex', width: '100%', height: '100%', background: '#111' }} />,
    size,
  )
}
