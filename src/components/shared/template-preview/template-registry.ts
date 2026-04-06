import type { ComponentType } from 'react'
import type { ThemeConfig } from '@/editor/lib/themes'
import type { SectionContent, PhotobookSectionContent } from '@/editor/lib/types'
import { getModeTemplates } from '@/editor/lib/mode-registry'

export type HeroPreviewComponent = ComponentType<{
  theme: ThemeConfig
  sectionContent: SectionContent
}>

export type CoverPreviewComponent = ComponentType<{
  theme: ThemeConfig
  sectionContent: PhotobookSectionContent
  disableAnimations?: boolean
}>

// Derived from the mode registry — previewComponent lives alongside its template def.
// Adding a new template only requires editing portfolio.tsx or photobook.tsx.
export const PORTFOLIO_PREVIEW_REGISTRY: Record<string, HeroPreviewComponent> =
  Object.fromEntries(
    getModeTemplates('portfolio')
      .filter((t) => t.previewComponent != null)
      .map((t) => [t.id, t.previewComponent as HeroPreviewComponent])
  )

export const PHOTOBOOK_PREVIEW_REGISTRY: Record<string, CoverPreviewComponent> =
  Object.fromEntries(
    getModeTemplates('photobook')
      .filter((t) => t.previewComponent != null)
      .map((t) => [t.id, t.previewComponent as CoverPreviewComponent])
  )
