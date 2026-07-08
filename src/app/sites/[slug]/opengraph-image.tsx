import { ImageResponse } from 'next/og'
import { headers } from 'next/headers'
import { createHash } from 'crypto'
import { adminDb } from '@/lib/firebase/admin'
import {
  getSlugReservationDocId,
  isSlugMode,
  PUBLISHED_PROJECT_SLUGS_COLLECTION,
} from '@/lib/slug'

export const alt = 'Preview'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'
export const runtime = 'nodejs'

interface Props {
  params: Promise<{ slug: string }>
  searchParams: Promise<Record<string, string | string[]>>
}

function extractCoverUrl(
  content: Record<string, unknown> | null,
  mode: string,
): string | null {
  if (!content) return null
  const imageContent = content.imageContent as Record<string, unknown> | undefined
  if (!imageContent) return null
  if (mode === 'photobook') {
    const cover = imageContent.cover as { value?: { asset?: { src?: string } } } | undefined
    return cover?.value?.asset?.src ?? null
  }
  if (mode === 'portfolio') {
    const hero = imageContent.hero as { value?: { asset?: { src?: string } } } | undefined
    const bio = imageContent.bio as { value?: { asset?: { src?: string } } } | undefined
    return hero?.value?.asset?.src ?? bio?.value?.asset?.src ?? null
  }
  return null
}

async function proxyImage(url: string): Promise<Response | null> {
  try {
    const res = await fetch(url, { signal: AbortSignal.timeout(8_000) })
    if (!res.ok) return null
    const buf = await res.arrayBuffer()
    const mimeType = res.headers.get('content-type') ?? 'image/jpeg'
    return new Response(buf, {
      headers: {
        'Content-Type': mimeType,
        'Cache-Control': 'public, max-age=3600, stale-while-revalidate=86400',
      },
    })
  } catch {
    return null
  }
}

function fallback(): ImageResponse {
  return new ImageResponse(
    <div style={{ display: 'flex', width: '100%', height: '100%', background: '#111' }} />,
    size,
  )
}

export default async function Image({ params, searchParams }: Props) {
  try {
    const { slug } = await params
    const reqHeaders = await headers()
    const rawMode = reqHeaders.get('x-milestis-mode')
    if (!isSlugMode(rawMode)) return fallback()

    let ogImageUrl: string | null = null
    let coverUrl: string | null = null

    if (rawMode === 'portfolio') {
      const slugSnap = await adminDb
        .collection(PUBLISHED_PROJECT_SLUGS_COLLECTION)
        .doc(getSlugReservationDocId('portfolio', slug))
        .get()
      if (!slugSnap.exists) return fallback()
      const { projectId } = slugSnap.data() as { projectId?: string }
      if (!projectId) return fallback()
      const docSnap = await adminDb.collection('published_projects').doc(projectId).get()
      if (!docSnap.exists) return fallback()
      const data = docSnap.data()!
      if (data.isPublished !== true) return fallback()
      ogImageUrl = (data.ogImageUrl as string | undefined) ?? null
      coverUrl = extractCoverUrl(data.content as Record<string, unknown> | null, 'portfolio')
    } else if (rawMode === 'photobook') {
      const { share } = await searchParams
      const tokenString = Array.isArray(share) ? share[0] : share
      if (tokenString) {
        const hashedToken = createHash('sha256').update(tokenString).digest('hex')
        const slugSnap = await adminDb
          .collection(PUBLISHED_PROJECT_SLUGS_COLLECTION)
          .doc(hashedToken)
          .get()
        if (slugSnap.exists) {
          const { projectId } = slugSnap.data() as { projectId?: string }
          if (projectId) {
            const docSnap = await adminDb.collection('published_projects').doc(projectId).get()
            if (docSnap.exists) {
              const data = docSnap.data()!
              if (data.isPublished === true) {
                ogImageUrl = (data.ogImageUrl as string | undefined) ?? null
                coverUrl = extractCoverUrl(
                  data.content as Record<string, unknown> | null,
                  'photobook',
                )
              }
            }
          }
        }
      }
    }

    // 1. Cloud Function pre-generated 1200×630 image — proxy it directly
    if (ogImageUrl) {
      const proxied = await proxyImage(ogImageUrl)
      if (proxied) return proxied
    }

    // 2. Raw cover image — proxy it as-is (better than black box)
    if (coverUrl) {
      const proxied = await proxyImage(coverUrl)
      if (proxied) return proxied
    }
  } catch {
    // Fall through to default
  }

  return fallback()
}

