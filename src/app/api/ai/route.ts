import { NextResponse, type NextRequest } from 'next/server'
import { requireAuth } from '@/lib/api/require-auth'
import { adminDb } from '@/lib/firebase/admin'
import { aiTasks } from '@/lib/ai/server/tasks'
import { readAiRequest, taskMatchesMode } from '@/lib/ai/server/request'
import { createPhotoResolver, reserveAiRequest } from '@/lib/ai/server/access'
import { aiRequestContext } from '@/lib/ai/server/context'
import { AiServiceError } from '@/lib/ai/server/openai'

export const runtime = 'nodejs'
export const maxDuration = 120

export async function POST(request: NextRequest) {
  const auth = await requireAuth(request)
  if (auth.error) return auth.error
  try {
    const { projectId, task, input } = await readAiRequest(request)
    const project = (await adminDb.collection('projects').doc(projectId).get()).data()
    if (!project || project.ownerId !== auth.uid || project.status === 'deleted') throw new AiServiceError('AI_PROJECT_UNAVAILABLE', 403)
    if (!taskMatchesMode(task, project.mode)) throw new AiServiceError('AI_INVALID_REQUEST', 400)
    if (!process.env.OPENAI_API_KEY) throw new AiServiceError('AI_NOT_CONFIGURED', 503)
    // Chat limits apply independently of subscription tier.
    await reserveAiRequest(auth.uid)
    const signal = AbortSignal.any([request.signal, AbortSignal.timeout(110_000)])
    const result = await aiRequestContext.run({ signal, resolvePhoto: createPhotoResolver(auth.uid, projectId, task === 'generateMenu') },
      () => (aiTasks[task] as (input: unknown) => Promise<unknown>)(input))
    return NextResponse.json({ result }, { headers: { 'Cache-Control': 'no-store' } })
  } catch (error) {
    if (error instanceof AiServiceError) return NextResponse.json({ error: error.message }, { status: error.status })
    if (error instanceof Error && ['AbortError', 'TimeoutError'].includes(error.name)) {
      return NextResponse.json({ error: 'AI_TIMEOUT' }, { status: 504 })
    }
    console.error('[ai] Request failed', { type: error instanceof Error ? error.name : 'unknown' })
    return NextResponse.json({ error: 'AI_REQUEST_FAILED' }, { status: 500 })
  }
}
