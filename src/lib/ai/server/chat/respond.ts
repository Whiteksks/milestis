import 'server-only'
import type { AiSchema } from '../../core/schema'
import { callNarrow } from '../openai'
import type { AiChatMode } from '../../core/types'

// The intent classifier (../intent/classify.ts) only routes — it never produces user-facing text.
// A pure 'chat' turn (question/clarification, no changes) still needs an actual reply, and unlike
// the confirmation messages for generate/edit turns (built deterministically in the UI layer from
// what was actually applied — see pipeline/orchestrator.ts), free-form conversation genuinely
// needs its own small model call.

const SCHEMA: AiSchema = { type: 'object', required: ['message'], properties: { message: { type: 'string' } } }

const SYSTEM_PROMPT = `
You are a friendly assistant inside a photo-project editor (photobook/portfolio creation tool).
The user's message this turn needs a conversational reply only — no content or style changes are being made.
Reply with JSON only: { "message": "..." }
Always reply in the same language as the user. Keep it warm and brief (2-3 sentences), and guide them toward something concrete they can ask for next — e.g. "attach your photos and tell me the occasion, and I'll build the whole thing" or "tell me which section you'd like changed". Never mention the app or platform name.
`.trim()

export interface ChatReplyInput {
  prompt: string
  language: string
  mode: AiChatMode
}

export async function generateChatReply(input: ChatReplyInput): Promise<string> {
  const userText = `Language: ${input.language}\nContext: ${input.mode} editor\nUser: ${input.prompt}`
  const parsed = await callNarrow<{ message: string }>({
    cacheKey: `chat:${input.mode}`,
    systemPrompt: SYSTEM_PROMPT,
    schema: SCHEMA,
    contents: [{ role: 'user', parts: [{ text: userText }] }],
  })
  return parsed.message
}
