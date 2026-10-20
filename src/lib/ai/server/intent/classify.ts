import 'server-only'
import type { AiSchema } from '../../core/schema'
import { callNarrow } from '../openai'
import type { AiIntent, AiIntentKind } from '../../core/types'

const INTENT_SCHEMA: AiSchema = {
  type: 'object',
  required: ['kind'],
  properties: {
    kind: { type: 'string', enum: ['generate_all', 'edit_section', 'edit_theme', 'chat'] },
    sections: {
      type: 'array',
      items: { type: 'string' },
      description: 'ONLY for kind="edit_section": the exact section key(s), copied verbatim from "Valid section keys" in the message, that the user wants changed. Never invent a key not in that list. Omit for every other kind.',
    },
  },
}

const SYSTEM_PROMPT = `
You are a routing classifier inside a photo-project editor (photobook/portfolio). Decide ONLY what the user wants to happen this message — never write any content yourself, never decide style, just classify.
Reply with JSON only: { "kind": "...", "sections"?: [...] }

- "generate_all": user wants the whole project (style + every section's text) created or entirely redone. Triggers: first-ever generation on a blank project, or explicit broad requests like "redo everything", "start over", "переведи всё", "обнови весь текст", "rewrite everything" — treat any phrasing meaning all/everything/the whole thing this way.
- "edit_theme": user wants ONLY the look/style/palette/mood/template changed (e.g. "make it darker", "use a different template", "change the color scheme") — no text/content changes implied.
- "edit_section": user wants ONLY specific named part(s) of the project changed (e.g. "rewrite the ending", "change the gallery title", "fix the highlight text"). Set "sections" to the exact matching key(s) from "Valid section keys" given in the message.
- "chat": a question, greeting, or anything with no actionable content/style change requested.

When the message names a specific part of the project, prefer "edit_section" over "generate_all" even if the wording sounds broad ("change the text" while only one section is named still means edit_section for that section). Only use "generate_all" when the user clearly means the ENTIRE project, or on a first-time blank-project generation.
`.trim()

export interface ClassifyIntentInput {
  prompt: string
  language: string
  /** Valid section keys for the current mode, e.g. ['cover','introduction','story','gallery','highlight','ending']. */
  sectionKeys: string[]
  /** True if nothing has ever been placed/generated in this project before this turn. */
  isBlankProject: boolean
  /** True if the user attached new photos this turn. */
  hasNewPhotos: boolean
}

const VALID_KINDS: readonly AiIntentKind[] = ['generate_all', 'edit_section', 'edit_theme', 'chat']

/** An empty prompt with the first photos starts generation without a classifier request. */
function classifyDeterministic(input: ClassifyIntentInput): AiIntent | null {
  if (input.isBlankProject && input.hasNewPhotos && !input.prompt.trim()) return { kind: 'generate_all' }
  return null
}

export async function classifyIntent(input: ClassifyIntentInput): Promise<AiIntent> {
  const shortcut = classifyDeterministic(input)
  if (shortcut) return shortcut

  const userText = [
    `Language: ${input.language}`,
    `Valid section keys: ${input.sectionKeys.join(', ')}`,
    `Project status: ${input.isBlankProject ? 'BLANK — nothing written/placed yet' : 'has existing content'}`,
    input.hasNewPhotos ? 'New photos were just attached this message.' : '',
    `User: ${input.prompt}`,
  ].filter(Boolean).join('\n')

  const parsed = await callNarrow<{ kind: string; sections?: string[] }>({
    cacheKey: 'intent-classifier',
    systemPrompt: SYSTEM_PROMPT,
    schema: INTENT_SCHEMA,
    contents: [{ role: 'user', parts: [{ text: userText }] }],
  })

  const kind: AiIntentKind = (VALID_KINDS as readonly string[]).includes(parsed.kind) ? (parsed.kind as AiIntentKind) : 'chat'
  if (kind !== 'edit_section') return { kind }

  const sections = (parsed.sections ?? []).filter((s) => input.sectionKeys.includes(s))
  // A resolved-empty edit_section is meaningless — fall back rather than applying to nothing.
  if (sections.length === 0) return input.isBlankProject ? { kind: 'generate_all' } : { kind: 'chat' }
  return { kind: 'edit_section', sections }
}
