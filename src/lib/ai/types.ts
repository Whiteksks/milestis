import type { PhotobookTemplateId } from '@/editor/modes/photobook/template-ids'
import type { PortfolioTemplateId } from '@/editor/modes/portfolio/template-ids'
import type { Theme } from '@/editor/lib/types'
import type { PhotobookMood, PhotobookTexture } from '@/editor/modes/photobook/content-types'
import type { DepthEffect, RayEffect, TextureEffect, BackgroundLayersTheme } from '@/editor/modes/portfolio/content-types'

// ─── Request ──────────────────────────────────────────────────────────────────

export type AiChatMode = 'photobook' | 'portfolio'

/** A photo available to the model this turn, tagged with its stable media-library id. */
export interface AiPhotoRef {
  id: string
  url: string
}

export interface AiAgentRequest {
  mode: AiChatMode
  prompt: string
  photos: AiPhotoRef[]
  language: string
  projectId?: string | null
  currentContent?: string
}

export type AiPhotoCaptions = Array<{ photoId: string; caption: string }>

// ─── Photobook changes ────────────────────────────────────────────────────────

export interface AiPhotobookThemeChanges {
  templateId?: PhotobookTemplateId
  currentTheme?: Theme
  photobookMood?: PhotobookMood
  photobookTexture?: PhotobookTexture
}

export interface AiPhotobookContentChanges {
  cover?:        { title?: string; subtitle?: string; date?: string; location?: string; tagline?: string }
  introduction?: { label?: string; title?: string; quote?: string; dedication?: string }
  story?:        { label?: string; title?: string; date?: string; location?: string }
  gallery?:      { label?: string; title?: string; description?: string }
  highlight?:    { label?: string; title?: string; description?: string; quote?: string }
  ending?:       { title?: string; text?: string; date?: string; signature?: string }
}

/** Optional override of ONE of these single-photo slots with a different photo than the one
 *  already auto-placed there (see currentImageAssignments). story/gallery are managed
 *  automatically and are never part of this — omit a field to keep its current photo. */
export interface AiPhotobookImageChanges {
  cover?: string
  introduction?: string
  highlight?: string
  ending?: string
}

export interface AiPhotobookChanges {
  theme?: AiPhotobookThemeChanges
  content?: AiPhotobookContentChanges
  imageAssignments?: AiPhotobookImageChanges
  captions?: AiPhotoCaptions
}

// ─── Portfolio changes ────────────────────────────────────────────────────────

export interface AiPortfolioThemeChanges {
  templateId?: PortfolioTemplateId
  currentTheme?: Theme
  depthEffect?: DepthEffect
  raysEffect?: RayEffect
  textureEffect?: TextureEffect
  backgroundLayersTheme?: BackgroundLayersTheme
}

/** A featured-work project card. `id` is stable across turns — reuse the id already shown
 *  in the current project data when editing an existing card, invent a fresh unique string
 *  only for a brand-new one. `photoId` (optional) assigns a photo to this specific card —
 *  there is no separate imageAssignments.featuredWork field, the photo travels with the card. */
export interface AiPortfolioProjectChange {
  id: string
  title: string
  description: string
  tags?: string[]
  photoId?: string
}

export interface AiPortfolioContentChanges {
  header?:       { title?: string; links?: Array<{ label: string; href: string }> }
  hero?:         { title?: string; subtitle?: string; description?: string }
  bio?:          { title?: string; subtitle?: string; description?: string; achievements?: string[] }
  featuredWork?: { title?: string; subtitle?: string; projects?: AiPortfolioProjectChange[] }
  contact?:      { title?: string; subtitle?: string; description?: string; email?: string }
  footer?:       { copyright?: string }
}

/** Optional override of hero/bio with a different photo than the one already auto-placed
 *  there (see currentImageAssignments) — omit a field to keep its current photo. */
export interface AiPortfolioImageChanges {
  hero?: string
  bio?: string
}

export interface AiPortfolioChanges {
  theme?: AiPortfolioThemeChanges
  content?: AiPortfolioContentChanges
  imageAssignments?: AiPortfolioImageChanges
  captions?: AiPhotoCaptions
}

// ─── Unified response ─────────────────────────────────────────────────────────

export type AiResponse =
  | { mode: 'photobook'; action: 'chat' | 'edit'; message: string; changes?: AiPhotobookChanges }
  | { mode: 'portfolio'; action: 'chat' | 'edit'; message: string; changes?: AiPortfolioChanges }
