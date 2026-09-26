import 'server-only'
import type { AiPart } from '../core/schema'
import type { AiPhotoRef } from '../core/types'
import { aiRequestContext } from './context'

/** URLs come from the authorized project media records, never from the request payload. */
export async function fetchPhotoParts(photos: AiPhotoRef[]): Promise<Array<{ id: string; parts: AiPart[] }>> {
  const context = aiRequestContext.getStore()
  if (!context) throw new Error('AI_REQUEST_CONTEXT_MISSING')
  return Promise.all(photos.map(async ({ id }) => ({
    id, parts: [{ text: `Photo ${id}:` }, { imageUrl: await context.resolvePhoto(id) }],
  })))
}
