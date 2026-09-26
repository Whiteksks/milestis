import 'server-only'
import { strictSchema, readAiResult, type AiContent, type AiSchema } from '../core/schema'
import { aiRequestContext } from './context'

export class AiServiceError extends Error {
  constructor(message: string, public readonly status = 502) { super(message) }
}

export interface NarrowCallOptions {
  cacheKey: string
  systemPrompt: string
  schema: AiSchema
  contents: AiContent[]
}

export async function callNarrow<T = Record<string, unknown>>(options: NarrowCallOptions): Promise<T> {
  const apiKey = process.env.OPENAI_API_KEY
  if (!apiKey) throw new AiServiceError('AI_NOT_CONFIGURED', 503)
  const signal = aiRequestContext.getStore()?.signal ?? AbortSignal.timeout(110_000)
  const response = await fetch('https://api.openai.com/v1/responses', {
    method: 'POST', signal,
    headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: 'gpt-6-sol',
      store: false,
      reasoning: { effort: 'low' },
      max_output_tokens: 24000,
      instructions: options.systemPrompt,
      input: options.contents.map(({ role, parts }) => ({
        role,
        content: parts.map((part) => 'text' in part
          ? { type: role === 'assistant' ? 'output_text' : 'input_text', text: part.text }
          : { type: 'input_image', image_url: part.imageUrl, detail: 'auto' }),
      })),
      text: { format: { type: 'json_schema', name: options.cacheKey.replace(/[^a-zA-Z0-9_-]/g, '_'), strict: true, schema: strictSchema(options.schema) } },
    }),
  })
  if (!response.ok) {
    // Do not send provider details, prompts or credentials to the browser/logs.
    console.warn('[ai] OpenAI request failed', { status: response.status, requestId: response.headers.get('x-request-id') })
    throw new AiServiceError(response.status === 429 ? 'AI_RATE_LIMIT' : 'AI_PROVIDER_ERROR', response.status === 429 ? 429 : 502)
  }
  const result = await response.json() as {
    status?: string
    output?: Array<{ type: string; content?: Array<{ type: string; text?: string }> }>
  }
  if (result.status !== 'completed') throw new AiServiceError('AI_INCOMPLETE_RESPONSE')
  const parts = result.output?.filter((item) => item.type === 'message').flatMap((item) => item.content ?? []) ?? []
  if (parts.some((part) => part.type === 'refusal')) throw new AiServiceError('AI_REFUSED', 422)
  const text = parts.filter((part) => part.type === 'output_text').map((part) => part.text ?? '').join('')
  try { return readAiResult(options.schema, JSON.parse(text)) as T }
  catch { throw new AiServiceError('AI_INVALID_RESPONSE') }
}
