import type { DecorationsConfig, Theme } from './types'

// --- Registry of decoration presets keyed by preset id ---
export const decorationPresets: Record<string, DecorationsConfig & { id: string; name?: string }> = {
  'vellum-default': {
    id: 'vellum-default',
    name: 'Vellum Vintage Preset',
    description: 'Soft, classic ornamentation with a paper-like feel.',
    tags: ['classic', 'elegant'],
    animation: 'none',
    elements: []
  },
  'nordic-default': {
    id: 'nordic-default',
    name: 'Nordic Minimal Preset',
    description: 'Clean geometry and calm spacing — minimal & modern.',
    tags: ['minimal', 'modern'],
    animation: 'none',
    elements: []
  },
  'midnight-default': {
    id: 'midnight-default',
    name: 'Midnight Neon Preset',
    description: 'Bold accents and lively motion for night-style themes.',
    tags: ['modern', 'dark'],
    animation: 'none',
    elements: []
  },
  'sunset-default': {
    id: 'sunset-default',
    name: 'Sunset Warm Preset',
    description: 'Warm tones and gentle overlays for a cozy look.',
    tags: ['warm', 'elegant'],
    animation: 'none',
    elements: []
  },
  'ocean-default': {
    id: 'ocean-default',
    name: 'Ocean Professional Preset',
    description: 'Professional and balanced — great for portfolios.',
    tags: ['professional', 'modern'],
    animation: 'none',
    elements: []
  },
  'royal-default': {
    id: 'royal-default',
    name: 'Royal Classic Preset',
    description: 'Elegant, high-contrast details with a premium vibe.',
    tags: ['classic', 'elegant'],
    animation: 'none',
    elements: []
  },
  'glass-default': {
    id: 'glass-default',
    name: 'Glass Frost Preset',
    description: 'Glossy, airy decoration style for glassy UI themes.',
    tags: ['modern', 'glass'],
    animation: 'none',
    elements: []
  },
  'mono-default': {
    id: 'mono-default',
    name: 'Mono Noir Preset',
    description: 'Monochrome details for a sharp, editorial look.',
    tags: ['minimal', 'monochrome'],
    animation: 'none',
    elements: []
  },
  'floral-default': {
    id: 'floral-default',
    name: 'Floral Bloom Preset',
    description: 'Light floral patterning — subtle and romantic.',
    tags: ['floral', 'elegant'],
    animation: 'none',
    elements: []
  }
}

// Map theme -> default preset id (optional)
export const themeToPreset: Partial<Record<Theme, string>> = {
  'vellum-vintage': 'vellum-default',
  'nordic-light': 'nordic-default',
  'midnight-neon': 'midnight-default',
  'sunset-warm': 'sunset-default',
  'ocean-pro': 'ocean-default',
  'royal-classic': 'royal-default',
  'glass-frost': 'glass-default',
  'mono-noir': 'mono-default',
  'floral-bloom': 'floral-default'
}

export const getDecorations = (themeId?: Theme): DecorationsConfig => {
  if (!themeId) return {}
  const presetId = themeToPreset[themeId]
  if (!presetId) return {}
  return decorationPresets[presetId] || {}
}

export const getDecorationById = (id?: string): DecorationsConfig | undefined => {
  if (!id) return undefined
  return decorationPresets[id]
}

export default decorationPresets
