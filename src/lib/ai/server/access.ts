import 'server-only'
import { adminDb } from '@/lib/firebase/admin'
import { AiServiceError } from './openai'
import { isAiId } from './request'

/** Shared across instances. Each reservation counts one bounded model call. */
export async function reserveAiRequest(uid: string) {
  const now = Date.now()
  const day = new Date(now).toISOString().slice(0, 10)
  const minute = Math.floor(now / 60_000)
  const ref = adminDb.collection('aiUsage').doc(uid)
  await adminDb.runTransaction(async (transaction) => {
    const old = (await transaction.get(ref)).data()
    const dayCount = old?.day === day ? Number(old.dayCount) || 0 : 0
    const minuteCount = old?.minute === minute ? Number(old.minuteCount) || 0 : 0
    if (dayCount >= 120) throw new AiServiceError('AI_DAILY_LIMIT', 429)
    if (minuteCount >= 30) throw new AiServiceError('AI_RATE_LIMIT', 429)
    transaction.set(ref, { day, minute, dayCount: dayCount + 1, minuteCount: minuteCount + 1 })
  })
}

export function createPhotoResolver(uid: string, projectId: string, readMenuPhotos: boolean | 'middle' = false) {
  const cache = new Map<string, Promise<string>>()
  return (id: string): Promise<string> => {
    if (!isAiId(id)) throw new AiServiceError('AI_INVALID_REQUEST', 400)
    const previous = cache.get(id)
    if (previous) return previous
    const promise = (async () => {
      const photo = (await adminDb.collection('images').doc(id).get()).data()
      if (!photo || photo.ownerId !== uid || photo.projectId !== projectId) throw new AiServiceError('AI_PHOTO_UNAVAILABLE', 403)
      const source = readMenuPhotos === 'middle'
        ? photo.urls?.middle ?? photo.urls?.full ?? photo.urls?.thumb
        : readMenuPhotos
        ? photo.urls?.full ?? photo.urls?.middle ?? photo.urls?.thumb
        : photo.urls?.thumb ?? photo.urls?.middle ?? photo.urls?.full
      let url: URL
      try { url = new URL(source) } catch { throw new AiServiceError('AI_PHOTO_UNAVAILABLE', 400) }
      if (url.protocol !== 'https:' || url.username || url.password || url.port ||
        !['firebasestorage.googleapis.com', 'storage.googleapis.com', 'images.unsplash.com'].includes(url.hostname)) {
        throw new AiServiceError('AI_PHOTO_UNAVAILABLE', 400)
      }
      return url.href
    })()
    cache.set(id, promise)
    return promise
  }
}
