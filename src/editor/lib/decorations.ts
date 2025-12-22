import type { DecorationsConfig, Theme } from './types'

// --- Registry of decoration presets keyed by preset id ---
export const decorationPresets: Record<string, DecorationsConfig & { id: string; name?: string }> = {
  'vellum-default': {
    id: 'vellum-default',
    name: 'Vellum Vintage Preset',
    backgroundImage: { url: 'https://images.wallpapersden.com/image/download/lonely-anime-girl_bGltbWWUmZqaraWkpJRobWllrWdma2U.jpg', opacity: 0.1, type: 'fixed' },
    animation: 'fade',
    elements: []
  },
  'nordic-default': {
    id: 'nordic-default',
    name: 'Nordic Minimal Preset',
    animation: 'fade',
    elements: []
  },
  'midnight-default': {
    id: 'midnight-default',
    name: 'Midnight Neon Preset',
    animation: 'slide-up',
    elements: []
  },
  'sunset-default': {
    id: 'sunset-default',
    name: 'Sunset Warm Preset',
    animation: 'fade',
    elements: []
  },
  'ocean-default': {
    id: 'ocean-default',
    name: 'Ocean Professional Preset',
    animation: 'fade',
    elements: []
  },
  'royal-default': {
    id: 'royal-default',
    name: 'Royal Classic Preset',
    backgroundImage: { url: 'https://i.pinimg.com/originals/65/ee/ff/65eeff4c209bf9c7badcd8a688136363.jpg', opacity: 0.05, type: 'fixed' },
    animation: 'fade',
    elements: []
  },
  'glass-default': {
    id: 'glass-default',
    name: 'Glass Frost Preset',
    animation: 'fade',
    elements: []
  },
  'mono-default': {
    id: 'mono-default',
    name: 'Mono Noir Preset',
    animation: 'none',
    elements: []
  },
  'floral-default': {
    id: 'floral-default',
    name: 'Floral Bloom Preset',
    backgroundImage: { url: '/decor/floral-pattern.png', opacity: 0.1, type: 'scroll' },
    animation: 'fade',
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

export const getDecorationById = (id?: string): DecorationsConfig | {} => {
  if (!id) return {}
  return decorationPresets[id] || {}
}

export default decorationPresets
