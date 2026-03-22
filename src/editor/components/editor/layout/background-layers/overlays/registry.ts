/**
 * Single source of truth for all photobook mood and texture options.
 *
 * To add a new option:
 *  1. Add the id to PhotobookMood / PhotobookTexture in @/editor/lib/types
 *  2. Add the CSS definition to TEXTURES / getMoodFilter in photobook-overlay.tsx
 *  3. Add the label entry below — it will appear in the sidebar automatically
 */

export interface PhotobookOption {
  id: string
  label: string
}

// ─── Colour Mood options ───────────────────────────────────────────────────

export const MOOD_OPTIONS: PhotobookOption[] = [
  { id: 'none',    label: 'None' },
  { id: 'warm',    label: 'Warm' },
  { id: 'golden',  label: 'Golden' },
  { id: 'cool',    label: 'Cool' },
  { id: 'muted',   label: 'Muted' },
  { id: 'fade',    label: 'Fade' },
  { id: 'noir',    label: 'Noir' },
  { id: 'vibrant', label: 'Vibrant' },
  { id: 'dreamy',  label: 'Dreamy' },
  { id: 'earthy',  label: 'Earthy' },
]

// ─── Photo Overlay options ─────────────────────────────────────────────────

export const TEXTURE_OPTIONS: PhotobookOption[] = [
  { id: 'none',      label: 'None' },
  { id: 'vignette',  label: 'Vignette' },
  { id: 'matte',     label: 'Matte' },
  { id: 'warmth',    label: 'Warmth' },
  { id: 'silver',    label: 'Silver' },
  { id: 'linen',     label: 'Linen' },
  { id: 'haze',      label: 'Haze' },
  { id: 'grain',     label: 'Grain' },
  { id: 'canvas',    label: 'Canvas' },
  { id: 'velvet',    label: 'Velvet' },
  { id: 'dust',      label: 'Dust' },
  { id: 'parchment', label: 'Parchment' },
]
