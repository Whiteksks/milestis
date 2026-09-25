export type DeviceView = 'desktop' | 'tablet' | 'mobile' | 'fullscreen'

// EditorMode is defined in editor-mode.ts (zero-dep file) — re-exported here for convenience.
export { EDITOR_MODES } from './editor-mode'
export type { EditorMode } from './editor-mode'

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
import type { MenuTemplateId } from '@/editor/modes/menu/template-ids'
import type { PortfolioTemplateId } from '@/editor/modes/portfolio/template-ids'
import type { PhotobookTemplateId } from '@/editor/modes/photobook/template-ids'
import type { EventTemplateId } from '@/editor/modes/event/template-ids'
import type { DecorationAnimation } from './config/decoration-animations'
export type { PortfolioTemplateId, PhotobookTemplateId, EventTemplateId, DecorationAnimation }

// 3. Создаем составной тип
export type TemplateId = PortfolioTemplateId | PhotobookTemplateId | EventTemplateId | MenuTemplateId

// Portfolio background effect types — defined in the portfolio mode, re-exported here for shared consumers.
export type { DepthEffect, RayEffect, TextureEffect, BackgroundLayersTheme, BackgroundScrollMode } from '@/editor/modes/portfolio/content-types'

// Photobook background effect types — defined in the photobook mode, re-exported here for shared consumers.
export type { PhotobookTexture, PhotobookMood } from '@/editor/modes/photobook/content-types'

// Mode-specific content types — defined in their respective mode folders.
// Re-exported here so existing imports from '@/editor/lib/types' keep working.
export type { SectionContent, SectionVisibility, MediaImage } from '@/editor/modes/portfolio/content-types'
export type { PhotobookSectionContent, PhotobookSectionVisibility, PhotobookStoryMoment, PhotobookGalleryPhoto } from '@/editor/modes/photobook/content-types'

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

export type DecorationKind = 'image' | 'bubble'
export type DecorationBubbleStyle = 'soft' | 'glass' | 'memory'

/** Single unified decoration model — used in theme presets, DecorationsConfig, and the editor UI. */
export interface DecorationElement {
  id?: string
  kind?: DecorationKind
  image?: string
  bubbleSeed?: string
  bubbleStyle?: DecorationBubbleStyle
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
