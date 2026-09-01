import type { SchemaRequest } from 'firebase/ai'
import { callNarrow } from '../core/gemini'
import { fetchPhotoParts } from '../core/photos'
import type { AiPhotoRef } from '../core/types'

// ─── Why this file exists ───────────────────────────────────────────────────
// One small, fully-`required` schema PER SECTION instead of one mega-schema covering all six
// sections at once — the old system's `schema.ts` needed `propertyOrdering` + hard `required` on
// the whole `content` object just to stop the model silently dropping highlight/ending (see
// /memories/repo/ai-editor-assistant.md). A 4-6 field schema has nothing to drop. The orchestrator
// (later phase) only calls the sections actually in scope for a turn — so there is no need for the
// old "echo back sections you weren't asked about" instruction either, sections outside scope are
// simply never called.

export const PHOTOBOOK_SECTION_KEYS = ['cover', 'introduction', 'story', 'gallery', 'highlight', 'ending'] as const
export type PhotobookSectionKey = (typeof PHOTOBOOK_SECTION_KEYS)[number]

const COMMON_RULES = `
Reply with JSON only, matching the schema exactly — every field listed is required in your response.
For each field: if "Current value" below already holds real text and the user's request doesn't call for changing it, return that exact same value unchanged — never invent a different value for a field outside the scope of this request. If a field is empty ("") and is in scope for this request (or nothing has been written here yet), write real, evocative, meaningful content for it — never a generic placeholder.
Write in the language given. Sound human and personal — never mention the app or platform name.
Every field has its own character budget (given in its description) — this is enforced, text past it gets cut off before it ever reaches the project. Aim comfortably UNDER the budget, never right at or over it — a short, well-crafted line beats a long one that gets truncated.
`.trim()

const CAPTION_FIELD: SchemaRequest = { type: 'string', description: 'One short line about this specific photo, max ~200 characters.' }

interface FlatSectionConfig {
  key: string
  guidance: string
  fields: Record<string, SchemaRequest>
}

async function generateFlatSection(
  config: FlatSectionConfig,
  input: { prompt: string; language: string; current: Record<string, string | undefined>; photo?: AiPhotoRef },
): Promise<Record<string, string>> {
  const fieldNames = Object.keys(config.fields)
  const properties: Record<string, SchemaRequest> = { ...config.fields }
  const required = [...fieldNames]
  if (input.photo) {
    properties.caption = CAPTION_FIELD
    required.push('caption')
  }
  const schema: SchemaRequest = { type: 'object', required, properties }

  const currentLines = fieldNames.map((f) => `${f}: ${JSON.stringify(input.current[f] ?? '')}`).join('\n')
  const systemPrompt = `${config.guidance}\n\n${COMMON_RULES}`
  const userText = [`Language: ${input.language}`, `Current value(s):`, currentLines, ``, `User: ${input.prompt}`].join('\n')

  const fetched = input.photo ? await fetchPhotoParts([input.photo]) : []
  const contents = [{ role: 'user' as const, parts: [...fetched.flatMap((f) => f.parts), { text: userText }] }]

  return callNarrow<Record<string, string>>({ cacheKey: `content:photobook:${config.key}`, systemPrompt, schema, contents })
}

// ─── Cover ──────────────────────────────────────────────────────────────────

export interface PhotobookCoverInput {
  prompt: string
  language: string
  current: { title?: string; subtitle?: string; date?: string; location?: string; tagline?: string }
  photo?: AiPhotoRef
}
export interface PhotobookCoverResult {
  title: string; subtitle: string; date: string; location: string; tagline: string; caption?: string
}
export async function generatePhotobookCover(input: PhotobookCoverInput): Promise<PhotobookCoverResult> {
  return generateFlatSection({
    key: 'cover',
    guidance: 'This is the COVER — the opening page: the single most striking, representative photo, with a short title/subtitle/date/location/tagline.',
    fields: {
      title:    { type: 'string', description: 'Short striking title, max ~60 characters. Never a paragraph — long text belongs elsewhere.' },
      subtitle: { type: 'string', description: 'One supporting line, max ~80 characters.' },
      date:     { type: 'string', description: 'Max ~40 characters, e.g. "March 2026".' },
      location: { type: 'string', description: 'Max ~80 characters.' },
      tagline:  { type: 'string', description: 'Very short motto, max ~100 characters.' },
    },
  }, input) as unknown as Promise<PhotobookCoverResult>
}

// ─── Introduction ───────────────────────────────────────────────────────────

export interface PhotobookIntroductionInput {
  prompt: string
  language: string
  current: { label?: string; title?: string; quote?: string; dedication?: string }
  photo?: AiPhotoRef
}
export interface PhotobookIntroductionResult {
  label: string; title: string; quote: string; dedication: string; caption?: string
}
export async function generatePhotobookIntroduction(input: PhotobookIntroductionInput): Promise<PhotobookIntroductionResult> {
  return generateFlatSection({
    key: 'introduction',
    guidance: 'This is the INTRODUCTION — sets the scene right after the cover, with one meaningful photo.',
    fields: {
      label:      { type: 'string', description: 'Small eyebrow label, max ~50 characters.' },
      title:      { type: 'string', description: 'Heading, max ~60 characters.' },
      quote:      { type: 'string', description: 'Short quote/epigraph, max ~150 characters.' },
      dedication: { type: 'string', description: 'The longer-text field for this section. Aim for ~150-250 characters; hard cap 400, text past that gets cut off.' },
    },
  }, input) as unknown as Promise<PhotobookIntroductionResult>
}

// ─── Gallery (no photos — pure bulk filler, section text only) ─────────────

export interface PhotobookGalleryInput {
  prompt: string
  language: string
  current: { label?: string; title?: string; description?: string }
}
export interface PhotobookGalleryResult { label: string; title: string; description: string }
export async function generatePhotobookGallery(input: PhotobookGalleryInput): Promise<PhotobookGalleryResult> {
  return generateFlatSection({
    key: 'gallery',
    guidance: 'This is the GALLERY — a supplementary bulk grid of photos you do not see individually; write only the section-level label/title/description covering them as a group.',
    fields: {
      label:       { type: 'string', description: 'Small eyebrow label, max ~50 characters.' },
      title:       { type: 'string', description: 'Section heading, max ~60 characters.' },
      description: { type: 'string', description: 'The longer-text field for this section. Aim for ~100-180 characters; hard cap 300, text past that gets cut off.' },
    },
  }, input) as unknown as Promise<PhotobookGalleryResult>
}

// ─── Highlight ──────────────────────────────────────────────────────────────

export interface PhotobookHighlightInput {
  prompt: string
  language: string
  current: { label?: string; title?: string; description?: string; quote?: string }
  photo?: AiPhotoRef
}
export interface PhotobookHighlightResult {
  label: string; title: string; description: string; quote: string; caption?: string
}
export async function generatePhotobookHighlight(input: PhotobookHighlightInput): Promise<PhotobookHighlightResult> {
  return generateFlatSection({
    key: 'highlight',
    guidance: 'This is the HIGHLIGHT — the single defining/most memorable photo of the book, given its own emphasis.',
    fields: {
      label:       { type: 'string', description: 'Small eyebrow label, max ~50 characters.' },
      title:       { type: 'string', description: 'Heading, max ~60 characters.' },
      description: { type: 'string', description: 'The longer-text field for this section. Aim for ~100-180 characters; hard cap 300, text past that gets cut off.' },
      quote:       { type: 'string', description: 'Short quote, max ~150 characters.' },
    },
  }, input) as unknown as Promise<PhotobookHighlightResult>
}

// ─── Ending ─────────────────────────────────────────────────────────────────

export interface PhotobookEndingInput {
  prompt: string
  language: string
  current: { title?: string; text?: string; date?: string; signature?: string }
  photo?: AiPhotoRef
}
export interface PhotobookEndingResult {
  title: string; text: string; date: string; signature: string; caption?: string
}
export async function generatePhotobookEnding(input: PhotobookEndingInput): Promise<PhotobookEndingResult> {
  return generateFlatSection({
    key: 'ending',
    guidance: 'This is the ENDING — the closing page and its fitting farewell photo.',
    fields: {
      title:     { type: 'string', description: 'Heading, max ~60 characters.' },
      text:      { type: 'string', description: 'The longer-text field for this section (closing/farewell paragraph). Aim for ~100-180 characters; hard cap 300, text past that gets cut off.' },
      date:      { type: 'string', description: 'Max ~40 characters.' },
      signature: { type: 'string', description: 'Max ~60 characters.' },
    },
  }, input) as unknown as Promise<PhotobookEndingResult>
}

// ─── Story (variable-length sequence — the one non-"flat" section) ────────
// Every story photo is individually narrated, so this needs one caption per photo id, not a
// single flat object. `minItems`/`maxItems` (real supported SchemaRequest fields, unlike
// `maxLength` on strings — see the memory notes) are set to the exact photo count so the model
// cannot silently emit fewer captions than photos.

export interface PhotobookStoryInput {
  prompt: string
  language: string
  current: { label?: string; title?: string; date?: string; location?: string }
  /** Every photo currently placed in the story sequence, in order. */
  storyPhotos: AiPhotoRef[]
}
export interface PhotobookStoryResult {
  label: string
  title: string
  date: string
  location: string
  moments: Array<{ photoId: string; caption: string }>
}

export async function generatePhotobookStory(input: PhotobookStoryInput): Promise<PhotobookStoryResult> {
  const photoIds = input.storyPhotos.map((p) => p.id)
  const properties: Record<string, SchemaRequest> = {
    label:    { type: 'string', description: 'Small eyebrow label for the whole story section, max ~50 characters.' },
    title:    { type: 'string', description: 'Section heading, max ~60 characters.' },
    date:     { type: 'string', description: 'Max ~40 characters.' },
    location: { type: 'string', description: 'Max ~80 characters.' },
  }
  const required = ['label', 'title', 'date', 'location']

  if (photoIds.length > 0) {
    properties.moments = {
      type: 'array',
      minItems: photoIds.length,
      maxItems: photoIds.length,
      description: `Exactly one entry per photo id — must cover every id in: ${photoIds.join(', ')}, no more, no fewer.`,
      items: {
        type: 'object',
        required: ['photoId', 'caption'],
        properties: {
          photoId: { type: 'string', enum: photoIds },
          caption: { type: 'string', description: 'One short line narrating this specific moment, max ~200 characters.' },
        },
      },
    }
    required.push('moments')
  }

  const schema: SchemaRequest = { type: 'object', required, properties }
  const systemPrompt = `This is the STORY — an individually-narrated sequence of moments, one caption per photo, plus a section-level label/title/date/location.\n\n${COMMON_RULES}`
  const currentLines = Object.entries(input.current).map(([k, v]) => `${k}: ${JSON.stringify(v ?? '')}`).join('\n')
  const userText = [`Language: ${input.language}`, `Current value(s):`, currentLines, ``, `User: ${input.prompt}`].join('\n')

  const fetched = await fetchPhotoParts(input.storyPhotos)
  const contents = [{ role: 'user' as const, parts: [...fetched.flatMap((f) => f.parts), { text: userText }] }]

  const parsed = await callNarrow<PhotobookStoryResult>({ cacheKey: 'content:photobook:story', systemPrompt, schema, contents })
  return { ...parsed, moments: parsed.moments ?? [] }
}
