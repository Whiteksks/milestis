import type { ComponentType } from 'react'
import type { ThemeConfig } from '@/editor/lib/themes'
import type { SectionContent, PhotobookSectionContent } from '@/editor/lib/types'

import { BentoHero } from '@/editor/components/templates/portfolio/sections/hero/bento-hero'
import { EditorialHero } from '@/editor/components/templates/portfolio/sections/hero/editorial-hero'
import { ElegantHero } from '@/editor/components/templates/portfolio/sections/hero/elegant-hero'
import { GridHero } from '@/editor/components/templates/portfolio/sections/hero/grid-hero'
import { MinimalHero } from '@/editor/components/templates/portfolio/sections/hero/minimal-hero'
import { ShowcaseHero } from '@/editor/components/templates/portfolio/sections/hero/showcase-hero'
import { LiquidGlassHero } from '@/editor/components/templates/portfolio/sections/hero/liquid-glass-hero'

import { CoverChronicle } from '@/editor/components/templates/photobook/sections/cover/cover-chronicle'
import { CoverLumiere } from '@/editor/components/templates/photobook/sections/cover/cover-lumiere'
import { CoverMagazine } from '@/editor/components/templates/photobook/sections/cover/cover-magazine'
import { CoverMemoir } from '@/editor/components/templates/photobook/sections/cover/cover-memoir'

export type HeroPreviewComponent = ComponentType<{
  theme: ThemeConfig
  sectionContent: SectionContent
  disableAnimations?: boolean
}>

export type CoverPreviewComponent = ComponentType<{
  theme: ThemeConfig
  sectionContent: PhotobookSectionContent
  disableAnimations?: boolean
}>

export const PORTFOLIO_PREVIEW_REGISTRY: Record<string, HeroPreviewComponent> = {
  bento: BentoHero,
  editorial: EditorialHero,
  elegant: ElegantHero,
  grid: GridHero,
  minimal: MinimalHero,
  showcase: ShowcaseHero,
  'liquid-glass': LiquidGlassHero,
}

export const PHOTOBOOK_PREVIEW_REGISTRY: Record<string, CoverPreviewComponent> = {
  'photobook-memoir': CoverMemoir,
  'photobook-chronicle': CoverChronicle,
  'photobook-magazine': CoverMagazine,
  'photobook-lumiere': CoverLumiere,
}
