import { getApp } from 'firebase/app'
import { getAI, getGenerativeModel, GoogleAIBackend, ThinkingLevel } from 'firebase/ai'
import type { Content } from 'firebase/ai'
import { buildSystemPrompt, buildUserMessage } from './prompt'
import { PHOTOBOOK_SCHEMA, PORTFOLIO_SCHEMA } from './schema'
import type { AiAgentRequest, AiChatHistoryEntry, AiResponse } from './types'

// ─── Model ─────────────────────────────────────────────────────────────────────
// One stateless model per mode, memoized (system instruction/schema are fixed per mode, not
// per-project — no need to key by project). Deliberately NOT a persistent `startChat()` session:
// a chat session resends every prior turn's content on each call, including all past inlineData
// image bytes, which grows unbounded the longer an editing session runs — a likely cause of slow/
// hanging turns later in a session even though each individual turn's own photo payload is bounded.
// `currentContent`/`currentImageAssignments` already reconstruct the full project state on every
// turn, so no image history is actually needed; only a short text-only `history` (see below) is
// kept for conversational continuity.
const _models: Partial<Record<AiAgentRequest['mode'], ReturnType<typeof getGenerativeModel>>> = {}

function getModel(mode: AiAgentRequest['mode']) {
  const cached = _models[mode]
  if (cached) return cached

  const ai = getAI(getApp(), { backend: new GoogleAIBackend() })
  const model = getGenerativeModel(ai, {
    model: 'gemini-3.7-flash',
    systemInstruction: buildSystemPrompt(mode),
    generationConfig: {
      responseMimeType: 'application/json',
      responseSchema: mode === 'photobook' ? PHOTOBOOK_SCHEMA : PORTFOLIO_SCHEMA,
      // Keep reasoning shallow — this task is light captioning/copy, not complex problem-solving,
      // and a heavy thinking budget was eating into response time on multi-photo turns
      thinkingConfig: { thinkingLevel: ThinkingLevel.LOW },
      // Lower than the API default — this is a rule-following/formatting task (obey prompt.ts's many
      // paired-field/required-section rules), not creative writing, and a high default temperature was
      // a likely contributor to reported "ignores half the instructions" behavior (e.g. pairing
      // templateId with currentTheme).
      temperature: 0.4,
    },
  })
  _models[mode] = model
  return model
}

// Only the last few turns, text only — enough for "make it shorter"-style follow-ups without
// reintroducing unbounded growth. Keep in sync with any UI expectation of chat continuity depth.
const MAX_HISTORY_TURNS = 6

function buildHistory(history: AiChatHistoryEntry[] | undefined): Content[] {
  if (!history || history.length === 0) return []
  return history.slice(-MAX_HISTORY_TURNS).map((m) => ({
    role: m.role === 'assistant' ? 'model' : 'user',
    parts: [{ text: m.content }],
  }))
}

// ─── Helpers ───────────────────────────────────────────────────────────────────

async function fetchAsBase64(url: string): Promise<{ mimeType: string; data: string }> {
  // Timeout so one stuck photo fetch can't stall the whole turn forever — the caller already
  // wraps this in a per-photo try/catch and just drops the photo on failure.
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

// ─── Main ─────────────────────────────────────────────────────────────────────

export async function sendMessage(request: AiAgentRequest): Promise<AiResponse> {
  const { mode, prompt, photos, language, currentContent, isBlankProject, history } = request
  const model = getModel(mode)

  // Label each image with its stable id so the model can reference it by id, never by position.
  // Fetched independently per photo so one bad URL/network blip (more likely the more photos are
  // attached at once) only drops that photo instead of failing the whole turn via Promise.all.
  const fetched = await Promise.all(
    photos.map(async (photo) => {
      try {
        const { mimeType, data } = await fetchAsBase64(photo.url)
        return { id: photo.id, parts: [{ text: `Photo ${photo.id}:` }, { inlineData: { mimeType, data } }] }
      } catch (err) {
        console.warn(`[ai] skipping photo ${photo.id}, failed to fetch/encode`, err)
        return null
      }
    }),
  )
  const sent = fetched.filter((r): r is NonNullable<typeof r> => r !== null)
  const photoParts = sent.flatMap((r) => r.parts)

  const textPart = { text: buildUserMessage(prompt, sent.map((r) => r.id), language, currentContent, isBlankProject) }

  const contents: Content[] = [...buildHistory(history), { role: 'user', parts: [...photoParts, textPart] }]
  const parsed = await generateWithRetry(model, contents)
  return { mode, ...parsed } as AiResponse
}

// One retry for transient failures (network blip, or the rare malformed/truncated JSON despite
// the constrained schema) — never retries a 429, since resending an already-rate-limited request
// immediately just makes it worse.
async function generateWithRetry(model: ReturnType<typeof getGenerativeModel>, contents: Content[]): Promise<Record<string, unknown>> {
  for (let attempt = 1; attempt <= 2; attempt++) {
    try {
      const raw = await model.generateContent({ contents })
      return JSON.parse(raw.response.text())
    } catch (err) {
      const is429 = err instanceof Error && err.message.includes('429')
      if (is429 || attempt === 2) throw err
      console.warn('[ai] generateContent attempt 1 failed, retrying once', err)
    }
  }
  // Unreachable, but keeps TypeScript happy about the loop always returning/throwing.
  throw new Error('unreachable')
}


