import type React from 'react'
import type { SectionVisibility } from '@/editor/lib/types'
import type { PortfolioTemplateProps } from '@/editor/lib/template-types'
import type { ModeRegistryEntry } from './types'
import { type PortfolioTemplateId } from './portfolio-ids'

import dynamic from 'next/dynamic'
import { PortfolioTemplateShell } from '@/editor/components/editor/layout/portfolio-template-shell'

// Hero components — lightweight, used for template preview cards
import { BentoHero } from '@/editor/components/templates/portfolio/sections/hero/bento-hero'
import { EditorialHero } from '@/editor/components/templates/portfolio/sections/hero/editorial-hero'
import { ElegantHero } from '@/editor/components/templates/portfolio/sections/hero/elegant-hero'
import { GridHero } from '@/editor/components/templates/portfolio/sections/hero/grid-hero'
import { MinimalHero } from '@/editor/components/templates/portfolio/sections/hero/minimal-hero'
import { ShowcaseHero } from '@/editor/components/templates/portfolio/sections/hero/showcase-hero'
import { LiquidGlassHero } from '@/editor/components/templates/portfolio/sections/hero/liquid-glass-hero'

const LoadingTemplate = () => (
  <div className="w-full h-full min-h-screen bg-transparent" />
)

// Templates
const MinimalTemplateDesign = dynamic(
  () => import('@/editor/components/templates/portfolio/minimal-template').then(m => m.MinimalTemplateDesign),
  { loading: LoadingTemplate },
)
const ElegantTemplateDesign = dynamic(
  () => import('@/editor/components/templates/portfolio/elegant-template').then(m => m.ElegantTemplateDesign),
  { loading: LoadingTemplate },
)

const EditorialTemplateDesign = dynamic(
  () => import('@/editor/components/templates/portfolio/editorial-template').then(m => m.EditorialTemplateDesign),
  { loading: LoadingTemplate },
)
const GridTemplateDesign = dynamic(
  () => import('@/editor/components/templates/portfolio/grid-template').then(m => m.GridTemplateDesign),
  { loading: LoadingTemplate },
)
const BentoTemplateDesign = dynamic(
  () => import('@/editor/components/templates/portfolio/bento-template').then(m => m.BentoTemplateDesign),
  { loading: LoadingTemplate },
)
const ShowcaseTemplateDesign = dynamic(
  () => import('@/editor/components/templates/portfolio/showcase-template').then(m => m.ShowcaseTemplateDesign),
  { loading: LoadingTemplate },
)

const LiquidGlassTemplateDesign = dynamic(
  () => import('@/editor/components/templates/portfolio/liquid-glass-template').then(m => m.LiquidGlassTemplateDesign),
  { loading: LoadingTemplate },
)

// Section settings panels — static imports so panels are ready when the drawer opens
import { HeaderSettings } from '@/editor/components/editor/section-settings/portfolio/header-settings'
import { HeroSettings } from '@/editor/components/editor/section-settings/portfolio/hero-settings'
import { BioSettings } from '@/editor/components/editor/section-settings/portfolio/bio-settings'
import { FeaturedWorkSettings } from '@/editor/components/editor/section-settings/portfolio/featured-work-settings'
import { VideoSettings } from '@/editor/components/editor/section-settings/portfolio/video-settings'
import { ContactSettings } from '@/editor/components/editor/section-settings/portfolio/contact-settings'
import { FooterSettings } from '@/editor/components/editor/section-settings/portfolio/footer-settings'

const portfolioTemplateComponents: Partial<
  Record<PortfolioTemplateId, React.ComponentType<PortfolioTemplateProps>>
> = {
  editorial: EditorialTemplateDesign,
  minimal: MinimalTemplateDesign,
  elegant: ElegantTemplateDesign,
  grid: GridTemplateDesign,
  bento: BentoTemplateDesign,
  showcase: ShowcaseTemplateDesign,
  'liquid-glass': LiquidGlassTemplateDesign,
}

// Maps section id → settings panel. Add entry here when adding a new section.
const PORTFOLIO_SETTINGS_MAP: Record<string, React.ComponentType> = {
  header:       HeaderSettings,
  hero:         HeroSettings,
  bio:          BioSettings,
  featuredWork: FeaturedWorkSettings,
  video:        VideoSettings,
  contact:      ContactSettings,
  footer:       FooterSettings,
}

export const portfolioMode: ModeRegistryEntry<keyof SectionVisibility> = {
  label: 'Portfolio',
  templates: [
    { id: 'editorial', name: 'Editorial', tags: ['Classic', 'Modern'], previewComponent: EditorialHero },
    { id: 'minimal', name: 'Minimal', tags: ['Clean', 'Classic'], previewComponent: MinimalHero },
    { id: 'elegant', name: 'Elegant', tags: ['Clean', 'Classic'], previewComponent: ElegantHero },
    { id: 'grid', name: 'Grid', tags: ['Structured', 'Clean'], previewComponent: GridHero },
    { id: 'bento', name: 'Bento', tags: ['Structured', 'Modern'], previewComponent: BentoHero },
    { id: 'showcase', name: 'Showcase', tags: ['Modern', 'Visual'], previewComponent: ShowcaseHero },
    { id: 'liquid-glass', name: 'Liquid Glass', tags: ['Modern', 'Visual'], previewComponent: LiquidGlassHero },
  ],
  sections: [
    { id: 'header', name: 'Header', toggleKey: 'showHeader' },
    { id: 'hero', name: 'Hero Section', toggleKey: 'showHero' },
    { id: 'bio', name: 'Bio / About', toggleKey: 'showBio' },
    { id: 'featuredWork', name: 'Featured Work', toggleKey: 'showFeaturedWork' },
    { id: 'video', name: 'Video Section', toggleKey: 'showVideo' },
    { id: 'contact', name: 'Contact Form', toggleKey: 'showContact' },
    { id: 'footer', name: 'Footer', toggleKey: 'showFooter' },
  ],
  defaultActiveSectionId: 'hero',
  getSettingsComponent: (sectionId) => PORTFOLIO_SETTINGS_MAP[sectionId] ?? null,
  canvasDataSelector: () => ({}),  // PortfolioTemplateShell reads its own data from the store

  renderCanvas: ({ templateId }) => {
    const id = templateId as PortfolioTemplateId
    const Design =
      portfolioTemplateComponents[id] ??
      portfolioTemplateComponents.editorial ??
      EditorialTemplateDesign

    return <PortfolioTemplateShell Design={Design} />
  },

  visibilitySelector: (s) => s.sectionVisibility,

  toggleSelector: (s) => s.toggleSection,
}
