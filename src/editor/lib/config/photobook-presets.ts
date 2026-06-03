import type { PhotobookMood, PhotobookTexture } from '../types'

export interface PhotobookPreset {
  id: string
  name: string
  /** One-line description shown below the card name in the design catalog. */
  description: string
  mood: PhotobookMood
  texture: PhotobookTexture
  tags?: string[]
}

/**
 * Curated mood + texture pairings.
 *
 * To add a new preset: append an entry here — it will appear in the
 * design catalog automatically.
 */
export const PHOTOBOOK_PRESETS: PhotobookPreset[] = [
  {
    id: 'clean',
    name: 'Clean Slate',
    description: 'Pure, unaltered photos — no colour grade or overlay.',
    mood: 'none',
    texture: 'none',
    tags: ['minimal'],
  },
  {
    id: 'golden-hour',
    name: 'Golden Hour',
    description: 'Rich amber warmth, like a summer sunset.',
    mood: 'golden',
    texture: 'warmth',
    tags: ['warm', 'romantic'],
  },
  {
    id: 'soft-dream',
    name: 'Soft Dream',
    description: 'Airy lifted pastels wrapped in a glowing haze.',
    mood: 'dreamy',
    texture: 'haze',
    tags: ['soft', 'romantic'],
  },
  {
    id: 'noir-film',
    name: 'Noir Film',
    description: 'Timeless black & white with cinematic film grain.',
    mood: 'noir',
    texture: 'grain',
    tags: ['dramatic', 'classic'],
  },
  {
    id: 'editorial',
    name: 'Editorial',
    description: 'Desaturated and framed — precision of a magazine spread.',
    mood: 'muted',
    texture: 'vignette',
    tags: ['minimal', 'classic'],
  },
  {
    id: 'warm-parchment',
    name: 'Warm Parchment',
    description: 'Warm tones over aged paper, like treasured film prints.',
    mood: 'warm',
    texture: 'parchment',
    tags: ['warm', 'classic'],
  },
  {
    id: 'arctic-cool',
    name: 'Arctic',
    description: 'Crisp teal-blue tones with a cool silver sheen.',
    mood: 'cool',
    texture: 'silver',
    tags: ['cool', 'editorial'],
  },
  {
    id: 'lomo-fade',
    name: 'Lomo Fade',
    description: 'Analog film fade with crushed blacks over warm matte paper.',
    mood: 'fade',
    texture: 'matte',
    tags: ['vintage', 'warm'],
  },
  {
    id: 'earthy-canvas',
    name: 'Earthy Canvas',
    description: 'Organic forest-and-sand tones on a rough canvas surface.',
    mood: 'earthy',
    texture: 'canvas',
    tags: ['warm', 'natural'],
  },
  {
    id: 'velvet-dusk',
    name: 'Velvet Dusk',
    description: 'Muted tones with soft light-absorbing depth, late evening mood.',
    mood: 'muted',
    texture: 'velvet',
    tags: ['dramatic', 'minimal'],
  },
  {
    id: 'silver-linen',
    name: 'Silver Linen',
    description: 'Clean cool tones over fine woven linen texture.',
    mood: 'cool',
    texture: 'linen',
    tags: ['cool', 'editorial'],
  },
  {
    id: 'vibrant-summer',
    name: 'Vibrant Summer',
    description: 'Punchy, saturated colours full of energy and life.',
    mood: 'vibrant',
    texture: 'none',
    tags: ['vibrant'],
  },
]

/** Returns the preset whose mood + texture match the current theme settings, or null. */
export function findMatchingPreset(
  mood: PhotobookMood,
  texture: PhotobookTexture,
): PhotobookPreset | null {
  return PHOTOBOOK_PRESETS.find((p) => p.mood === mood && p.texture === texture) ?? null
}
