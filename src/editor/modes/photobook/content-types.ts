/** Photobook-specific content and visibility types.
 *  Defined here so the mode is fully self-contained. */

// ─── Background effect types (photobook-only) ─────────────────────────────
export type PhotobookTexture = 'none' | 'vignette' | 'matte' | 'warmth' | 'silver' | 'linen' | 'haze' | 'grain' | 'canvas' | 'velvet' | 'parchment'
export type PhotobookMood = 'none' | 'warm' | 'cool' | 'muted' | 'fade' | 'golden' | 'noir' | 'vibrant' | 'dreamy' | 'earthy'

// ─── Content & visibility types ───────────────────────────────────────────

export interface PhotobookStoryMoment {
  id: string
  label?: string
  caption?: string
  description?: string
}

export interface PhotobookGalleryPhoto {
  id: string
  caption?: string
}

export interface PhotobookSectionContent {
  cover: {
    title: string
    subtitle?: string
    date?: string
    location?: string
    tagline?: string
  }
  introduction: {
    label?: string
    title?: string
    quote?: string
    dedication?: string
  }
  story: {
    label?: string
    title?: string
    date?: string
    location?: string
    moments?: PhotobookStoryMoment[]
  }
  gallery: {
    label?: string
    title?: string
    description?: string
    photos?: PhotobookGalleryPhoto[]
  }
  highlight: {
    label?: string
    title?: string
    description?: string
    quote?: string
    videoUrl?: string
  }
  ending: {
    title?: string
    label?: string
    text?: string
    date?: string
    signature?: string
  }
}

/** Derived automatically — adding a key to PhotobookSectionContent adds show<Key> here. */
export type PhotobookSectionVisibility = {
  [K in keyof PhotobookSectionContent as `show${Capitalize<string & K>}`]: boolean
}
