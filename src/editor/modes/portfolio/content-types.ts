/** Portfolio-specific content and visibility types.
 *  Defined here so the mode is fully self-contained. */

// ─── Background effect types (portfolio-only) ─────────────────────────────
export type DepthEffect = 'none' | 'radial-glow' | 'vignette' | 'ambient-blobs' | 'asymmetric-light' | 'aurora' | 'horizon'
export type RayEffect = 'none' | 'diagonal-rays' | 'conic-rays' | 'soft-streaks' | 'lens-flare' | 'caustics' | 'god-rays' | 'prism'
export type TextureEffect = 'none' | 'grain' | 'dots' | 'lines' | 'grid' | 'halftone' | 'scanlines' | 'diamond-grid' | 'woven'
export type BackgroundLayersTheme = 'dark' | 'light'
export type BackgroundScrollMode = 'fixed' | 'scroll'

// ─── Content & visibility types ───────────────────────────────────────────

export interface MediaImage {
  id: string
  url: string
  name: string
  uploadedAt: Date
}

export interface SectionContent {
  header: {
    title: string
    links: Array<{ label: string; href: string }>
  }
  hero: {
    title: string
    subtitle: string
    description: string
  }
  bio: {
    title: string
    subtitle?: string
    description: string
    achievements?: string[]
  }
  featuredWork: {
    title: string
    subtitle?: string
    projects: Array<{
      id: string
      title: string
      description: string
      tags?: string[]
    }>
  }
  video: {
    title: string
    subtitle?: string
    description: string
    videoUrl: string
  }
  contact: {
    title: string
    subtitle?: string
    description: string
    email: string
  }
  footer: {
    copyright: string
    socialLinks?: Array<{ icon: string; href: string }>
  }
}

/** Derived automatically — adding a key to SectionContent adds show<Key> here. */
export type SectionVisibility = {
  [K in keyof SectionContent as `show${Capitalize<string & K>}`]: boolean
}
