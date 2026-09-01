import { getApp } from 'firebase/app'
import { getAI, getGenerativeModel, GoogleAIBackend, ThinkingLevel } from 'firebase/ai'
import type { Content, SchemaRequest } from 'firebase/ai'

// Shared low-level call primitive for every step of the new pipeline (intent classification,
// style decision, per-section content generation). Each step gets its OWN small system prompt +
// schema — this is deliberately NOT a single mega-model doing everything in one shot (that was
// the old architecture's core reliability problem, see /memories/repo/ai-editor-assistant.md).
// Small, narrowly-scoped calls are what make per-call `required` schema fields actually reliable.

export interface NarrowCallOptions {
  /** Cache key for the memoized model instance — one per distinct (systemPrompt, schema) pair,
   *  e.g. 'intent-classifier', 'style:photobook', 'content:photobook:cover'. */
  cacheKey: string
  systemPrompt: string
  schema: SchemaRequest
  contents: Content[]
  /** Defaults to 0.4 — this is a rule-following/formatting task, not creative writing (see old
   *  service.ts notes on why a high default temperature caused instruction-following misses). */
  temperature?: number
  thinkingLevel?: ThinkingLevel
}

const _models = new Map<string, ReturnType<typeof getGenerativeModel>>()

function getModel(opts: NarrowCallOptions) {
  const cached = _models.get(opts.cacheKey)
  if (cached) return cached

  const ai = getAI(getApp(), { backend: new GoogleAIBackend() })
  const model = getGenerativeModel(ai, {
    model: 'gemini-3.7-flash',
    systemInstruction: opts.systemPrompt,
    generationConfig: {
      responseMimeType: 'application/json',
      responseSchema: opts.schema,
      thinkingConfig: { thinkingLevel: opts.thinkingLevel ?? ThinkingLevel.LOW },
      temperature: opts.temperature ?? 0.4,
    },
  })
  _models.set(opts.cacheKey, model)
  return model
}

/** One retry for transient failures (network blip, or a rare malformed/truncated JSON) — never
 *  retries a 429, since resending an already-rate-limited request immediately just makes it worse. */
export async function callNarrow<T = Record<string, unknown>>(opts: NarrowCallOptions): Promise<T> {
  const model = getModel(opts)
  for (let attempt = 1; attempt <= 2; attempt++) {
    try {
      const raw = await model.generateContent({ contents: opts.contents })
      return JSON.parse(raw.response.text()) as T
    } catch (err) {
      const is429 = err instanceof Error && err.message.includes('429')
      if (is429 || attempt === 2) throw err
      console.warn(`[ai] narrow call "${opts.cacheKey}" attempt 1 failed, retrying once`, err)
    }
  }
  throw new Error('unreachable')
}
