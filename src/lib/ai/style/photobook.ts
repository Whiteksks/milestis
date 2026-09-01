import type { SchemaRequest } from 'firebase/ai'
import { callNarrow } from '../core/gemini'
import { fetchPhotoParts } from '../core/photos'
import type { AiPhotoRef } from '../core/types'
import { PHOTOBOOK_TEMPLATE_IDS, type PhotobookTemplateId } from '@/editor/modes/photobook/template-ids'
import type { Theme } from '@/editor/lib/types'
import type { PhotobookMood, PhotobookTexture } from '@/editor/modes/photobook/content-types'

const THEME_ENUM = ['parchment', 'frost', 'ember', 'obsidian', 'sand', 'noir', 'sage', 'dusk', 'porcelain', 'carbon']
const MOOD_ENUM = ['none', 'warm', 'cool', 'muted', 'fade', 'golden', 'noir', 'vibrant', 'dreamy', 'earthy']
const TEXTURE_ENUM = ['none', 'vignette', 'matte', 'warmth', 'silver', 'linen', 'haze', 'grain', 'canvas', 'velvet', 'parchment']

// Small, single-purpose schema — ALL four fields required, every time. This call decides style
// ONLY, never copy, so there is no risk of it competing with a 30-field mega-schema for the
// model's attention (the old system's core reliability problem — see schema.ts's history of
// propertyOrdering/required patches in /memories/repo/ai-editor-assistant.md).
const SCHEMA: SchemaRequest = {
  type: 'object',
  required: ['templateId', 'currentTheme', 'photobookMood', 'photobookTexture'],
  properties: {
    templateId: {
      type: 'string',
      enum: [...PHOTOBOOK_TEMPLATE_IDS],
      description: 'Layout — pick whichever best fits the photos/occasion. Has NO effect on color.',
    },
    currentTheme: {
      type: 'string',
      enum: THEME_ENUM,
      description: 'Color palette — the ONLY field that controls dark/light/warm/cool. Must match the requested or implied mood.',
    },
    photobookMood: { type: 'string', enum: MOOD_ENUM, description: 'Colour-mood filter — must reinforce currentTheme, never contradict it.' },
    photobookTexture: { type: 'string', enum: TEXTURE_ENUM, description: 'Paper/texture overlay — must reinforce currentTheme, never contradict it.' },
  },
}

const SYSTEM_PROMPT = `
You are a visual-design assistant inside a photobook editor. Your ONLY job this call is to pick the book's style from the photos and the user's request — never write any copy, never mention text content.
Reply with JSON only, matching the schema: templateId, currentTheme, photobookMood, photobookTexture — all four, every time, even if the user only asked about one aspect (the other three must still fit it).

Photobook templates:
- "photobook-memoir"    → family albums, life stories, nostalgic
- "photobook-chronicle" → travel, year-in-review, event documentation
- "photobook-magazine"  → fashion, art, editorial
- "photobook-lumiere"   → weddings, engagements, baby, romance
- "photobook-soleil"    → vacations, birthdays, outdoor adventures

Color palettes: "parchment" warm beige | "frost" cool white | "ember" warm red | "obsidian" deep black | "sand" earthy beige | "noir" black&white | "sage" natural green | "dusk" purple twilight | "porcelain" pure white | "carbon" dark charcoal.
templateId is layout only and has NO effect on color — never rely on it alone to satisfy a color/mood/dark-or-light request, currentTheme is what controls that. Map explicit requests: dark/black → obsidian, noir or carbon; white/bright/light → porcelain, frost or parchment; warm/red → ember; earthy/beige → parchment or sand; cool → frost; green/natural → sage; purple/twilight → dusk.
Always pick photobookMood/photobookTexture that reinforce the same feeling as currentTheme — never leave them mismatched (e.g. a bright airy currentTheme with a "noir" mood).
If the user gave no explicit style preference, infer the best fit yourself from the photos you're shown and the occasion implied by their message — don't default to generic/neutral choices out of caution.
`.trim()

export interface PhotobookStyleInput {
  /** The user's message this turn, plus any relevant framing the caller wants to add
   *  (e.g. "no explicit preference given, infer from photos" for a first-time generation). */
  prompt: string
  language: string
  /** A handful of representative photos (not the whole batch) — this call needs to see the
   *  general look/vibe, not catalog every single photo. */
  photos: AiPhotoRef[]
}

export interface PhotobookStyleResult {
  templateId: PhotobookTemplateId
  currentTheme: Theme
  photobookMood: PhotobookMood
  photobookTexture: PhotobookTexture
}

export async function decidePhotobookStyle(input: PhotobookStyleInput): Promise<PhotobookStyleResult> {
  const fetched = await fetchPhotoParts(input.photos)
  const textPart = { text: `Language: ${input.language}\nUser: ${input.prompt}` }

  const parsed = await callNarrow<PhotobookStyleResult>({
    cacheKey: 'style:photobook',
    systemPrompt: SYSTEM_PROMPT,
    schema: SCHEMA,
    contents: [{ role: 'user', parts: [...fetched.flatMap((f) => f.parts), textPart] }],
  })

  return parsed
}
