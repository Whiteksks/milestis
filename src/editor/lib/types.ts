export type DeviceView = 'desktop' | 'tablet' | 'mobile' | 'fullscreen'

export const THEMES = {
  vellumVintage: 'vellum-vintage',
  nordicLight: 'nordic-light',
  midnightNeon: 'midnight-neon',
  sunsetWarm: 'sunset-warm',
  oceanPro: 'ocean-pro',
  royalClassic: 'royal-classic',
  glassmorphism: 'glass-frost',
  monochromeMinimal: 'mono-noir',
  floralBloom: 'floral-bloom',
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
  organic: 'organic',
  polaroid: 'polaroid',
  gallery: 'gallery',
  film: 'film',
  shadowSoft: 'shadow-soft',
  shadowStrong: 'shadow-strong',
  borderThin: 'border-thin',
  borderBold: 'border-bold',
  roundedXl: 'rounded-xl',
  circle: 'circle',
} as const

export type FrameStyle = (typeof FRAME_STYLES)[keyof typeof FRAME_STYLES]

export const ASPECT_RATIOS = {
  square: 'square',
  portrait: 'portrait',
  landscape: 'landscape',
} as const

export type AspectRatio = (typeof ASPECT_RATIOS)[keyof typeof ASPECT_RATIOS]

export const TEMPLATE_IDS = {
  classic: 'classic',
  minimal: 'minimal',
  elegant: 'elegant',
  modern: 'modern',
  photobookClassic: 'photobook-classic',
  photobookCircle: 'photobook-circle',
  photobookMagazine: 'photobook-magazine',
  photobookPolaroid: 'photobook-polaroid',
  photobookSplit: 'photobook-split',
  photobookVertical: 'photobook-vertical',
  weddingTimeline: 'wedding-timeline',
  masonry: 'masonry',
} as const

export type TemplateId = (typeof TEMPLATE_IDS)[keyof typeof TEMPLATE_IDS]

export type BackgroundImageType = 'fixed' | 'scroll' | 'parallax' | 'pattern'
export type DecorationAnimation = 'none' | 'fade' | 'slide-up' | 'slide-down'

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
  }
  bio: {
    title: string
    subtitle?: string
    description: string
    image?: string
    imageAspectRatio?: AspectRatio
    imageFrameStyle?: FrameStyle
    achievements?: string[]
  }
  featuredWork: {
    title: string
    subtitle?: string
    projects: Array<{
      title: string
      description: string
      image: string
      tags?: string[]
      aspectRatio?: AspectRatio
      frameStyle?: FrameStyle
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
    phone?: string
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
}

export type DecorationUpdatePayload = Partial<Omit<DecorationElement, 'id'>>

/** User-added decoration stored in ThemeStore — always has id and opacity. */
export type ThemeCustomDecorations = DecorationElement & { id: string; opacity: number }

export interface DecorationsConfig {
  id?: string
  name?: string
  description?: string
  tags?: string[]
  backgroundImage?: {
    url: string
    opacity?: number
    type?: BackgroundImageType
  }
  animation?: DecorationAnimation
  elements?: DecorationElement[]
}


/** Derived automatically from PhotobookSectionContent — adding a key there adds show<Key> here. */
export type PhotobookSectionVisibility = {
  [K in keyof PhotobookSectionContent as `show${Capitalize<string & K>}`]: boolean
}

export interface PhotobookSlot {
  id: string
  label?: string
  images: string[]
  caption?: string
  imageSettings: Array<{
    aspectRatio?: AspectRatio
    frameStyle?: FrameStyle
  }>
}

export interface PhotoBlock {
  id: string
  image: string
  caption?: string
  imageSettings: Array<{
    aspectRatio?: AspectRatio
    frameStyle?: FrameStyle
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
    title?: string
    quote?: string
    dedication?: string
    images?: PhotoBlock
  }

  story: {
    title?: string
    date?: string
    location?: string
    paragraphs?: string[]
    images?: PhotobookSlot[]
  }

  gallery: {
    title?: string
    description?: string
    images?: PhotoBlock[]
  }

  highlight: {
    title?: string
    description?: string
    quote?: string
    images?: PhotoBlock
    videoUrl?: string
  }

  ending: {
    text?: string
    date?: string
    signature?: string
    images?: PhotoBlock
  }
}
