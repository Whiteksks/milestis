import type { Content } from 'firebase/ai'
import type { AiPhotoRef } from './types'

async function fetchAsBase64(url: string): Promise<{ mimeType: string; data: string }> {
  // Timeout so one stuck photo fetch can't stall the whole call forever.
  const res = await fetch(url, { signal: AbortSignal.timeout(15000) })
  const blob = await res.blob()
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => {
      const dataUrl = reader.result as string
      resolve({ mimeType: blob.type || 'image/jpeg', data: dataUrl.split(',')[1] })
    }
    reader.onerror = reject
    reader.readAsDataURL(blob)
  })
}

export interface FetchedPhoto {
  id: string
  parts: NonNullable<Content['parts']>
}

/** Fetches+encodes each photo independently (per-photo try/catch, 15s timeout) so one bad
 *  URL/flaky network blip only drops that one photo instead of failing the whole call — matters
 *  most at 20-30+ photos where the odds of at least one bad fetch go up. Labels each image with
 *  its stable id so the model can reference it by id, never by position. Every narrow call
 *  (style/section generation) that needs vision uses this — single shared implementation instead
 *  of each call site reinventing fetch/retry/labeling. */
export async function fetchPhotoParts(photos: AiPhotoRef[]): Promise<FetchedPhoto[]> {
  const fetched = await Promise.all(
    photos.map(async (photo): Promise<FetchedPhoto | null> => {
      try {
        const { mimeType, data } = await fetchAsBase64(photo.url)
        return { id: photo.id, parts: [{ text: `Photo ${photo.id}:` }, { inlineData: { mimeType, data } }] }
      } catch (err) {
        console.warn(`[ai] skipping photo ${photo.id}, failed to fetch/encode`, err)
        return null
      }
    }),
  )
  return fetched.filter((r): r is FetchedPhoto => r !== null)
}
