export type DeviceView = 'desktop' | 'tablet' | 'mobile' | 'fullscreen'

export const THEMES = {
  parchment: 'parchment',
  frost: 'frost',
  ember: 'ember',
  obsidian: 'obsidian',
  sand: 'sand',
  noir: 'noir',
  sage: 'sage',
  dusk: 'dusk',
  porcelain: 'porcelain',
  carbon: 'carbon',
} as const

export type Theme = (typeof THEMES)[keyof typeof THEMES]

export const EDITOR_MODES = {
  portfolio: 'portfolio',
  photobook: 'photobook',
} as const

export type EditorMode = (typeof EDITOR_MODES)[keyof typeof EDITOR_MODES]

export const FRAME_STYLES = {
  none: 'none',
  soft: 'soft',
  squircle: 'squircle',
  organic: 'organic',
  organicB: 'organic-b',
  borderBold: 'border-bold',
  passepartout: 'passepartout',
  circle: 'circle',
  borderDark: 'border-dark',
  arch: 'arch',
  newspaper: 'newspaper',
  diamond: 'diamond',
} as const

export type FrameStyle = (typeof FRAME_STYLES)[keyof typeof FRAME_STYLES]

export type FrameStyleCategory = 'shape' | 'border'

export const ASPECT_RATIOS = {
  square: 'square',
  portrait: 'portrait',
  poster: 'poster',
  wide: 'wide',
  cinematic: 'cinematic',
} as const

export type AspectRatio = (typeof ASPECT_RATIOS)[keyof typeof ASPECT_RATIOS]

/** TemplateId is derived automatically from each mode's ID list.
 *  To add a new template — edit modes/portfolio-ids.ts or modes/photobook-ids.ts.
 *  Never edit this line directly. */
import type { PortfolioTemplateId } from './modes/portfolio-ids'
import type { PhotobookTemplateId } from './modes/photobook-ids'
import type { DecorationAnimation } from './decoration-animations'
export type { PortfolioTemplateId, PhotobookTemplateId, DecorationAnimation }

// 3. Создаем составной тип
export type TemplateId = PortfolioTemplateId | PhotobookTemplateId

export type DepthEffect = 'none' | 'radial-glow' | 'vignette' | 'ambient-blobs' | 'asymmetric-light' | 'aurora' | 'horizon'
export type RayEffect = 'none' | 'diagonal-rays' | 'conic-rays' | 'soft-streaks' | 'lens-flare' | 'caustics' | 'god-rays' | 'prism'
export type TextureEffect = 'none' | 'grain' | 'dots' | 'lines' | 'grid' | 'halftone' | 'scanlines' | 'diamond-grid' | 'woven'
export type BackgroundLayersTheme = 'dark' | 'light'
export type BackgroundScrollMode = 'fixed' | 'scroll'

/** Photobook-specific decorative overlays */
export type PhotobookTexture = 'none' | 'vignette' | 'matte' | 'warmth' | 'silver' | 'linen' | 'haze' | 'grain' | 'canvas' | 'velvet'| 'parchment' 
export type PhotobookMood = 'none' | 'warm' | 'cool' | 'muted' | 'fade' | 'golden' | 'noir' | 'vibrant' | 'dreamy' | 'earthy'

/** Derived automatically from SectionContent — adding a key there adds show<Key> here. */
export type SectionVisibility = {
  [K in keyof SectionContent as `show${Capitalize<string & K>}`]: boolean
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
    image?: string
    heroThumb?: string
    aspectRatio?: AspectRatio
    frameStyle?: FrameStyle
    cropData?: import('./crop-data').ImageCropData
  }
  bio: {
    title: string
    subtitle?: string
    description: string
    image?: string
    aspectRatio?: AspectRatio
    frameStyle?: FrameStyle
    cropData?: import('./crop-data').ImageCropData
    achievements?: string[]
  }
  featuredWork: {
    title: string
    subtitle?: string
    projects: Array<{
      id: string
      title: string
      description: string
      image: string
      tags?: string[]
      aspectRatio?: AspectRatio
      frameStyle?: FrameStyle
      cropData?: import('./crop-data').ImageCropData
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

export interface MediaImage {
  id: string
  url: string
  name: string
  uploadedAt: Date
}

export interface DecorationPosition {
  top?: string
  bottom?: string
  left?: string
  right?: string
}

export interface DecorationTransform {
  flipX?: boolean
  flipY?: boolean
}

/** Single unified decoration model — used in theme presets, DecorationsConfig, and the editor UI. */
export interface DecorationElement {
  id?: string
  image: string
  position?: DecorationPosition
  size?: 'small' | 'medium' | 'large' | 'xlarge'
  scale?: number
  opacity?: number
  zIndex?: number
  responsiveScale?: boolean
  transform?: DecorationTransform
  /** Aspect ratio (width/height), can be computed from image */
  aspectRatio?: number
  /** Optional custom name for the decoration */
  name?: string
  /**
   * When set, `position` is interpreted as a percentage relative to this section's
   * bounding box (identified by `data-section-id` attribute) rather than the canvas
   * root. This keeps the decoration visually anchored to the section across device
   * views even when section heights differ between breakpoints.
   */
  sectionId?: string
  /**
   * When true the stored `top`/`left` percentages refer to the CENTER of the
   * element rather than its top-left corner.  Render applies
   * `calc(X% - size/2)` so the center stays proportionally anchored even
   * when the canvas narrows on mobile.  Experimental.
   */
  anchorPosition?: boolean
}

export type DecorationUpdatePayload = Partial<Omit<DecorationElement, 'id'>>

/** User-added decoration stored in ThemeStore — always has id and opacity. */
export type ThemeCustomDecorations = DecorationElement & { id: string; opacity: number }

export interface DecorationsConfig {
  id?: string
  name?: string
  description?: string
  tags?: string[]
  animation?: DecorationAnimation
  elements?: DecorationElement[]
}


/** Derived automatically from PhotobookSectionContent — adding a key there adds show<Key> here. */
export type PhotobookSectionVisibility = {
  [K in keyof PhotobookSectionContent as `show${Capitalize<string & K>}`]: boolean
}

export interface PhotoBlock {
  id: string
  image: string
  thumbUrl?: string
  label?: string
  caption?: string
  description?: string
  imageSettings: Array<{
    aspectRatio?: AspectRatio
    frameStyle?: FrameStyle
    cropData?: import('./crop-data').ImageCropData
  }>
}


// Section content model for Photobook mode
export interface PhotobookSectionContent {
  cover: {
    title: string
    subtitle?: string
    date?: string
    location?: string
    tagline?: string
    images?: PhotoBlock
  }

  introduction: {
    label?: string
    title?: string
    quote?: string
    dedication?: string
    images?: PhotoBlock
  }

  story: {
    label?: string
    title?: string
    date?: string
    location?: string
    images?: PhotoBlock[]
  }

  gallery: {
    label?: string
    title?: string
    description?: string
    images?: PhotoBlock[]
  }

  highlight: {
    label?: string
    title?: string
    description?: string
    quote?: string
    images?: PhotoBlock
    videoUrl?: string
  }

  ending: {
    title?: string
    label?: string
    text?: string
    date?: string
    signature?: string
    images?: PhotoBlock
  }
}
