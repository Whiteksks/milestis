import type { ComponentType } from 'react'
import type { ThemeConfig } from '@/editor/lib/config/themes'
import type { SectionContent, PhotobookSectionContent } from '@/editor/lib/types'
import type { PortfolioImageContent } from '@/editor/modes/portfolio/image/content'
import type { PhotobookImageContent } from '@/editor/modes/photobook/image/content'
import { MODE_REGISTRY } from '@/editor/lib/modes'

export type HeroPreviewComponent = ComponentType<{
  theme: ThemeConfig
  sectionContent: SectionContent
  imageContent?: PortfolioImageContent
}>

export type CoverPreviewComponent = ComponentType<{
  theme: ThemeConfig
  sectionContent: PhotobookSectionContent
  imageContent?: PhotobookImageContent
  disableAnimations?: boolean
}>

// Event preview components are self-contained — no data props needed.
export type EventPreviewComponent = ComponentType

// Derived from the mode registry — previewComponent lives alongside its template def.
// Adding a new template only requires editing portfolio.tsx or photobook.tsx.
export const PORTFOLIO_PREVIEW_REGISTRY: Record<string, HeroPreviewComponent> =
  Object.fromEntries(
    MODE_REGISTRY.portfolio.templates
      .filter((t) => t.previewComponent != null)
      .map((t) => [t.id, t.previewComponent as HeroPreviewComponent])
  )

export const PHOTOBOOK_PREVIEW_REGISTRY: Record<string, CoverPreviewComponent> =
  Object.fromEntries(
    MODE_REGISTRY.photobook.templates
      .filter((t) => t.previewComponent != null)
      .map((t) => [t.id, t.previewComponent as CoverPreviewComponent])
  )

export const EVENT_PREVIEW_REGISTRY: Record<string, EventPreviewComponent> =
  Object.fromEntries(
    MODE_REGISTRY.event.templates
      .filter((t) => t.previewComponent != null)
      .map((t) => [t.id, t.previewComponent as EventPreviewComponent])
  )
