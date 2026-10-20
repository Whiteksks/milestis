import { NextResponse, type NextRequest } from 'next/server'
import { requireAuth } from '@/lib/api/require-auth'
import { adminDb } from '@/lib/firebase/admin'
import { createPhotoResolver } from '@/lib/ai/server/access'
import { isAiId } from '@/lib/ai/server/request'
import { AiServiceError } from '@/lib/ai/server/openai'
import { enhanceFoodPhoto, readImageBytes } from '@/lib/ai/server/enhance-photo'
import { isFoodPhotoStyle } from '@/lib/ai/menu/photo-styles'

export const runtime = 'nodejs'
export const maxDuration = 180

export async function POST(request: NextRequest) {
  const auth = await requireAuth(request)
  if (auth.error) return auth.error
  try {
    let input: { projectId?: unknown; photoId?: unknown; style?: unknown }
    try {
      const bytes = await readImageBytes(new Response(request.body), 4096)
      input = JSON.parse(bytes.toString('utf8'))
    } catch { throw new AiServiceError('AI_INVALID_REQUEST', 400) }
    if (!input || !isAiId(input.projectId) || !isAiId(input.photoId) || !isFoodPhotoStyle(input.style)) throw new AiServiceError('AI_INVALID_REQUEST', 400)
    const project = (await adminDb.collection('projects').doc(input.projectId).get()).data()
    if (!project || project.ownerId !== auth.uid || project.status === 'deleted' || project.mode !== 'menu') {
      throw new AiServiceError('AI_PROJECT_UNAVAILABLE', 403)
    }
    // Access is based on ownership; this endpoint has no subscription or per-user quota gate.
    const source = await createPhotoResolver(auth.uid, input.projectId, 'middle')(input.photoId)
    const signal = AbortSignal.any([request.signal, AbortSignal.timeout(170_000)])
    const image = await enhanceFoodPhoto(source, input.style, signal)
    return new Response(new Uint8Array(image), { headers: {
      'Content-Type': 'image/webp', 'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff',
    } })
  } catch (error) {
    if (error instanceof AiServiceError) return NextResponse.json({ error: error.message }, { status: error.status })
    if (error instanceof Error && ['AbortError', 'TimeoutError'].includes(error.name)) {
      return NextResponse.json({ error: 'AI_TIMEOUT' }, { status: 504 })
    }
    console.error('[ai-photo] Request failed', { type: error instanceof Error ? error.name : 'unknown' })
    return NextResponse.json({ error: 'AI_REQUEST_FAILED' }, { status: 500 })
  }
}
