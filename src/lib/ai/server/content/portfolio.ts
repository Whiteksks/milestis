import 'server-only'
import type { AiSchema } from '../../core/schema'
import { callNarrow } from '../openai'
import { fetchPhotoParts } from '../photos'
import type { AiPhotoRef } from '../../core/types'

// Same reasoning as content/photobook.ts — one small, fully-`required` schema per section
// instead of one mega-schema for the whole portfolio.

export const PORTFOLIO_SECTION_KEYS = ['header', 'hero', 'bio', 'featuredWork', 'contact', 'footer'] as const
export type PortfolioSectionKey = (typeof PORTFOLIO_SECTION_KEYS)[number]

const COMMON_RULES = `
Reply with JSON only, matching the schema exactly — every field listed is required in your response.
For each field: if "Current value" below already holds real text and the user's request doesn't call for changing it, return that exact same value unchanged — never invent a different value for a field outside the scope of this request. If a field is empty ("") and is in scope for this request (or nothing has been written here yet), write real, evocative, meaningful content for it — never a generic placeholder.
Write in the language given. Sound human and personal — never mention the app or platform name.
Every field has its own character budget (given in its description) — this is enforced, text past it gets cut off before it ever reaches the project. Aim comfortably UNDER the budget, never right at or over it — a short, well-crafted line beats a long one that gets truncated.
`.trim()

const CAPTION_FIELD: AiSchema = { type: 'string', description: 'One short line about this specific photo, max ~200 characters.' }

interface FlatSectionConfig {
  key: string
  guidance: string
  fields: Record<string, AiSchema>
}

async function generateFlatSection(
  config: FlatSectionConfig,
  input: { prompt: string; language: string; current: Record<string, unknown>; photo?: AiPhotoRef },
): Promise<Record<string, unknown>> {
  const fieldNames = Object.keys(config.fields)
  const properties: Record<string, AiSchema> = { ...config.fields }
  const required = [...fieldNames]
  if (input.photo) {
    properties.caption = CAPTION_FIELD
    required.push('caption')
  }
  const schema: AiSchema = { type: 'object', required, properties }

  const currentLines = fieldNames.map((f) => `${f}: ${JSON.stringify(input.current[f] ?? '')}`).join('\n')
  const systemPrompt = `${config.guidance}\n\n${COMMON_RULES}`
  const userText = [`Language: ${input.language}`, `Current value(s):`, currentLines, ``, `User: ${input.prompt}`].join('\n')

  const fetched = input.photo ? await fetchPhotoParts([input.photo]) : []
  const contents = [{ role: 'user' as const, parts: [...fetched.flatMap((f) => f.parts), { text: userText }] }]

  return callNarrow<Record<string, unknown>>({ cacheKey: `content:portfolio:${config.key}`, systemPrompt, schema, contents })
}

// ─── Header ─────────────────────────────────────────────────────────────────

export interface PortfolioHeaderInput {
  prompt: string
  language: string
  current: { title?: string }
}
export interface PortfolioHeaderResult { title: string }
export async function generatePortfolioHeader(input: PortfolioHeaderInput): Promise<PortfolioHeaderResult> {
  return generateFlatSection({
    key: 'header',
    guidance: 'This is the HEADER — just the brand/name shown in the site navigation.',
    fields: { title: { type: 'string', description: 'Brand/name shown in the nav, max ~60 characters.' } },
  }, input) as unknown as Promise<PortfolioHeaderResult>
}

// ─── Hero ───────────────────────────────────────────────────────────────────

export interface PortfolioHeroInput {
  prompt: string
  language: string
  current: { title?: string; subtitle?: string; description?: string }
  photo?: AiPhotoRef
}
export interface PortfolioHeroResult { title: string; subtitle: string; description: string; caption?: string }
export async function generatePortfolioHero(input: PortfolioHeroInput): Promise<PortfolioHeroResult> {
  return generateFlatSection({
    key: 'hero',
    guidance: 'This is the HERO — the site\'s large opening statement, with its single large hero photo.',
    fields: {
      title:       { type: 'string', description: 'Short striking headline, max ~60 characters. Never a paragraph — long text belongs in description.' },
      subtitle:    { type: 'string', description: 'One supporting line, max ~80 characters.' },
      description: { type: 'string', description: 'The longer-text field for this section. Aim for ~100-180 characters; hard cap 300, text past that gets cut off.' },
    },
  }, input) as unknown as Promise<PortfolioHeroResult>
}

// ─── Bio ────────────────────────────────────────────────────────────────────

export interface PortfolioBioInput {
  prompt: string
  language: string
  current: { title?: string; subtitle?: string; description?: string; achievements?: string[] }
  photo?: AiPhotoRef
}
export interface PortfolioBioResult { title: string; subtitle: string; description: string; achievements: string[]; caption?: string }
export async function generatePortfolioBio(input: PortfolioBioInput): Promise<PortfolioBioResult> {
  const result = await generateFlatSection({
    key: 'bio',
    guidance: 'This is the BIO — the "about" section, with a portrait/headshot photo.',
    fields: {
      title:        { type: 'string', description: 'Heading, max ~60 characters.' },
      subtitle:     { type: 'string', description: 'One supporting line, max ~80 characters.' },
      description:  { type: 'string', description: 'The bio paragraph itself — the longer-text field for this section. Aim for ~150-250 characters; hard cap 400, text past that gets cut off.' },
      achievements: { type: 'array', items: { type: 'string', description: 'Short line, max ~100 characters.' }, description: 'Up to a handful of short achievement/credential lines.' },
    },
  }, { ...input, current: { ...input.current, achievements: input.current.achievements ?? [] } })
  return { ...result, achievements: (result.achievements as string[] | undefined) ?? [] } as PortfolioBioResult
}

// ─── Contact ────────────────────────────────────────────────────────────────

export interface PortfolioContactInput {
  prompt: string
  language: string
  current: { title?: string; subtitle?: string; description?: string; email?: string }
}
export interface PortfolioContactResult { title: string; subtitle: string; description: string; email: string }
export async function generatePortfolioContact(input: PortfolioContactInput): Promise<PortfolioContactResult> {
  return generateFlatSection({
    key: 'contact',
    guidance: 'This is the CONTACT section — an invitation to get in touch.',
    fields: {
      title:       { type: 'string', description: 'Heading, max ~60 characters.' },
      subtitle:    { type: 'string', description: 'One supporting line, max ~80 characters.' },
      description: { type: 'string', description: 'The longer-text field for this section. Aim for ~100-180 characters; hard cap 300, text past that gets cut off.' },
      email:       { type: 'string', description: 'Max ~100 characters. Keep the existing address unchanged unless the user explicitly gives a new one.' },
    },
  }, input) as unknown as Promise<PortfolioContactResult>
}

// ─── Footer ─────────────────────────────────────────────────────────────────

export interface PortfolioFooterInput {
  prompt: string
  language: string
  current: { copyright?: string }
}
export interface PortfolioFooterResult { copyright: string }
export async function generatePortfolioFooter(input: PortfolioFooterInput): Promise<PortfolioFooterResult> {
  return generateFlatSection({
    key: 'footer',
    guidance: 'This is the FOOTER — just the copyright line.',
    fields: { copyright: { type: 'string', description: 'Max ~120 characters.' } },
  }, input) as unknown as Promise<PortfolioFooterResult>
}

// Existing cards retain their IDs; the apply layer reconciles IDs and duplicate photo claims.

export interface PortfolioFeaturedWorkInput {
  prompt: string
  language: string
  current: { title?: string; subtitle?: string }
  /** Cards that already exist — reuse their id when editing, omit only if the user asked to remove one. */
  existingProjects: Array<{ id: string; title: string; description: string; tags?: string[] }>
  /** Newly attached photos not used for hero/bio — every one becomes its own card (new or merged
   *  into an existing one), and every one gets its own vision pass. */
  newPhotos: AiPhotoRef[]
}
export interface PortfolioFeaturedWorkResult {
  title: string
  subtitle: string
  projects: Array<{ id: string; title: string; description: string; tags?: string[]; photoId?: string }>
}

export async function generatePortfolioFeaturedWork(input: PortfolioFeaturedWorkInput): Promise<PortfolioFeaturedWorkResult> {
  const schema: AiSchema = {
    type: 'object',
    required: ['title', 'subtitle', 'projects'],
    properties: {
      title:    { type: 'string', description: 'Section heading, max ~60 characters.' },
      subtitle: { type: 'string', description: 'One supporting line, max ~80 characters.' },
      projects: {
        type: 'array',
        description: 'One card per project. Every id listed under "New photo ids" must be used as exactly one card\'s photoId.',
        items: {
          type: 'object',
          required: ['id', 'title', 'description'],
          properties: {
            id:          { type: 'string', description: 'Reuse the exact id shown under "Existing cards" when editing one; invent a fresh unique string only for a brand-new card.' },
            title:       { type: 'string', description: 'Max ~60 characters.' },
            description: { type: 'string', description: 'The longer-text field on this card. Aim for ~80-140 characters; hard cap 200, text past that gets cut off.' },
            tags:        { type: 'array', items: { type: 'string' } },
            photoId:     { type: 'string', description: 'One of the ids under "New photo ids" — omit if this card keeps no new photo.' },
          },
        },
      },
    },
  }

  const systemPrompt = `This is FEATURED WORK — the project/case-study cards, each with its own title/description/tags and (optionally) a photo.\n\n${COMMON_RULES}`
  const existingLines = input.existingProjects.length > 0
    ? input.existingProjects.map((p) => `- id=${p.id} title=${JSON.stringify(p.title)} description=${JSON.stringify(p.description)}`).join('\n')
    : '(none yet)'
  const newPhotoIds = input.newPhotos.map((p) => p.id)
  const userText = [
    `Language: ${input.language}`,
    `Current section title: ${JSON.stringify(input.current.title ?? '')}`,
    `Current section subtitle: ${JSON.stringify(input.current.subtitle ?? '')}`,
    `Existing cards:`,
    existingLines,
    `New photo ids: ${newPhotoIds.length > 0 ? newPhotoIds.join(', ') : '(none)'}`,
    ``,
    `User: ${input.prompt}`,
  ].join('\n')

  const fetched = await fetchPhotoParts(input.newPhotos)
  const contents = [{ role: 'user' as const, parts: [...fetched.flatMap((f) => f.parts), { text: userText }] }]

  const parsed = await callNarrow<PortfolioFeaturedWorkResult>({ cacheKey: 'content:portfolio:featuredWork', systemPrompt, schema, contents })
  return { ...parsed, projects: parsed.projects ?? [] }
}
