import type { AiTasks } from './server/tasks'

export interface AiRequestOptions { projectId: string; signal?: AbortSignal }
export async function requestAi<K extends keyof AiTasks>(
  task: K, input: Parameters<AiTasks[K]>[0], options: AiRequestOptions,
): Promise<Awaited<ReturnType<AiTasks[K]>>> {
  const response = await fetch('/api/ai', {
    method: 'POST', credentials: 'same-origin', signal: options.signal,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ projectId: options.projectId, task, input }),
  })
  const data = await response.json()
  if (!response.ok) throw new Error(`${data.error ?? 'AI_REQUEST_FAILED'}${response.status === 429 ? ' 429' : ''}`)
  return data.result
}
