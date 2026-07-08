import { ImageResponse } from 'takumi-js/response'
import { adminDb } from '@/lib/firebase/admin'
import { getSlugReservationDocId, PUBLISHED_PROJECT_SLUGS_COLLECTION } from '@/lib/slug'

export const alt = 'Portfolio preview'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'
export const runtime = 'nodejs'

interface Props {
  params: Promise<{ slug: string }>
}

export default async function Image({ params }: Props) {
  const { slug } = await params

  const slugSnap = await adminDb
    .collection(PUBLISHED_PROJECT_SLUGS_COLLECTION)
    .doc(getSlugReservationDocId('portfolio', slug))
    .get()

  const projectId = (slugSnap.data() as { projectId?: string } | undefined)?.projectId
  const doc = projectId
    ? await adminDb.collection('published_projects').doc(projectId).get()
    : null
  const data = doc?.data()

  type Sections = Record<string, Record<string, string | undefined> | undefined>
  type Images = Record<string, { value?: { asset?: { src?: string } } } | undefined>

  const sections = ((data?.content as Record<string, unknown>)?.sectionContent ?? {}) as Sections
  const images = ((data?.content as Record<string, unknown>)?.imageContent ?? {}) as Images

  // Prefer the visible section titles over the internal project name
  const title = sections.hero?.title || sections.bio?.title || null
  const subtitle = sections.bio?.subtitle || null
  const imageUrl = images.hero?.value?.asset?.src || images.bio?.value?.asset?.src || null

  const DARK = '#0d0d0d'

  return new ImageResponse(
    (
      <div tw="flex w-full h-full" style={{ background: DARK }}>
        {/* Hero / bio cover photo */}
        {imageUrl && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={imageUrl}
            alt=""
            tw="absolute inset-0 w-full h-full"
            style={{ objectFit: 'cover', objectPosition: 'center top' }}
          />
        )}

        {/* Gradient so text is readable over any photo */}
        <div
          tw="absolute inset-0"
          style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.1) 60%, transparent 100%)' }}
        />

        {/* Title + subtitle */}
        {title && (
          <div
            style={{ position: 'absolute', bottom: 64, left: 80, right: 80, display: 'flex', flexDirection: 'column' }}
          >
            <span tw="text-white font-bold" style={{ fontSize: 68, lineHeight: 1.1, letterSpacing: '-1px' }}>
              {title}
            </span>
            {subtitle && (
              <span style={{ fontSize: 28, color: 'rgba(255,255,255,0.55)', marginTop: 12 }}>
                {subtitle}
              </span>
            )}
          </div>
        )}
      </div>
    ),
    size,
  )
}
