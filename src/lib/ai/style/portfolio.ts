import type { SchemaRequest } from 'firebase/ai'
import { callNarrow } from '../core/gemini'
import { fetchPhotoParts } from '../core/photos'
import type { AiPhotoRef } from '../core/types'
import { PORTFOLIO_TEMPLATE_IDS, type PortfolioTemplateId } from '@/editor/modes/portfolio/template-ids'
import type { Theme } from '@/editor/lib/types'
import type { DepthEffect, RayEffect, TextureEffect, BackgroundLayersTheme } from '@/editor/modes/portfolio/content-types'

const THEME_ENUM = ['parchment', 'frost', 'ember', 'obsidian', 'sand', 'noir', 'sage', 'dusk', 'porcelain', 'carbon']
const DEPTH_ENUM = ['none', 'radial-glow', 'vignette', 'ambient-blobs', 'asymmetric-light', 'aurora', 'horizon']
const RAYS_ENUM = ['none', 'diagonal-rays', 'conic-rays', 'soft-streaks', 'lens-flare', 'caustics', 'god-rays', 'prism']
const TEXTURE_ENUM = ['none', 'grain', 'dots', 'lines', 'grid', 'halftone', 'scanlines', 'diamond-grid', 'woven']
const BG_ENUM = ['dark', 'light']

// Same reasoning as style/photobook.ts — one small, fully-required schema, style decisions only.
const SCHEMA: SchemaRequest = {
  type: 'object',
  required: ['templateId', 'currentTheme', 'depthEffect', 'raysEffect', 'textureEffect', 'backgroundLayersTheme'],
  properties: {
    templateId: {
      type: 'string',
      enum: [...PORTFOLIO_TEMPLATE_IDS],
      description: 'Layout — pick whichever best fits the discipline/occasion. Has NO effect on color.',
    },
    currentTheme: {
      type: 'string',
      enum: THEME_ENUM,
      description: 'Color palette — the ONLY field that controls dark/light/warm/cool. Must match the requested or implied mood.',
    },
    depthEffect: { type: 'string', enum: DEPTH_ENUM, description: 'Background depth effect — must reinforce currentTheme, never contradict it.' },
    raysEffect: { type: 'string', enum: RAYS_ENUM, description: 'Background ray/light effect — must reinforce currentTheme, never contradict it.' },
    textureEffect: { type: 'string', enum: TEXTURE_ENUM, description: 'Background texture overlay — must reinforce currentTheme, never contradict it.' },
    backgroundLayersTheme: { type: 'string', enum: BG_ENUM, description: 'Base dark/light mode for background layers — should agree with currentTheme (a dark currentTheme pairs with "dark", a light one with "light").' },
  },
}

const SYSTEM_PROMPT = `
You are a visual-design assistant inside a portfolio-site editor. Your ONLY job this call is to pick the site's style from the photos and the user's request — never write any copy, never mention text content.
Reply with JSON only, matching the schema: templateId, currentTheme, depthEffect, raysEffect, textureEffect, backgroundLayersTheme — all six, every time, even if the user only asked about one aspect (the rest must still fit it).

Portfolio templates:
- "editorial"    → photographers, visual artists, dark dramatic
- "minimal"      → designers, developers, clean simplicity
- "elegant"      → luxury, fashion, beauty, architecture
- "grid"         → image-heavy, photographers, illustrators
- "bento"        → creative multi-discipline, asymmetric
- "showcase"     → product design, UX, large hero visuals
- "liquid-glass" → tech, SaaS, glassmorphism

Color palettes: "parchment" warm beige | "frost" cool white | "ember" warm red | "obsidian" deep black | "sand" earthy beige | "noir" black&white | "sage" natural green | "dusk" purple twilight | "porcelain" pure white | "carbon" dark charcoal.
templateId is layout only and has NO effect on color — never rely on it alone to satisfy a color/mood/dark-or-light request, currentTheme is what controls that. Map explicit requests: dark/black → obsidian, noir or carbon; white/bright/light → porcelain, frost or parchment; warm/red → ember; earthy/beige → parchment or sand; cool → frost; green/natural → sage; purple/twilight → dusk.
Always pick depthEffect/raysEffect/textureEffect/backgroundLayersTheme that reinforce the same feeling as currentTheme — never leave them mismatched (e.g. a bright porcelain currentTheme with backgroundLayersTheme "dark").
If the user gave no explicit style preference, infer the best fit yourself from the photos you're shown and the discipline implied by their message — don't default to generic/neutral choices out of caution.
`.trim()

export interface PortfolioStyleInput {
  prompt: string
  language: string
  photos: AiPhotoRef[]
}

export interface PortfolioStyleResult {
  templateId: PortfolioTemplateId
  currentTheme: Theme
  depthEffect: DepthEffect
  raysEffect: RayEffect
  textureEffect: TextureEffect
  backgroundLayersTheme: BackgroundLayersTheme
}

export async function decidePortfolioStyle(input: PortfolioStyleInput): Promise<PortfolioStyleResult> {
  const fetched = await fetchPhotoParts(input.photos)
  const textPart = { text: `Language: ${input.language}\nUser: ${input.prompt}` }

  const parsed = await callNarrow<PortfolioStyleResult>({
    cacheKey: 'style:portfolio',
    systemPrompt: SYSTEM_PROMPT,
    schema: SCHEMA,
    contents: [{ role: 'user', parts: [...fetched.flatMap((f) => f.parts), textPart] }],
  })

  return parsed
}
