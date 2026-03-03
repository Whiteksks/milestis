import type React from 'react'
import type { SectionVisibility } from '@/editor/lib/types'
import type { PortfolioTemplateProps } from '@/editor/lib/template-types'
import type { ModeRegistryEntry } from './types'
import { type PortfolioTemplateId } from './portfolio-ids'

import dynamic from 'next/dynamic'
import { PortfolioTemplateShell } from '@/editor/components/editor/layout/portfolio-template-shell'

const LoadingTemplate = () => (
  <div className="w-full h-full min-h-[50vh] bg-slate-50 animate-pulse rounded-lg" />
)
const LoadingSettings = () => null

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

// Section settings panels
const HeaderSettings = dynamic(
  () => import('@/editor/components/editor/section-settings/portfolio/header-settings').then(m => m.HeaderSettings),
  { loading: LoadingSettings },
)
const HeroSettings = dynamic(
  () => import('@/editor/components/editor/section-settings/portfolio/hero-settings').then(m => m.HeroSettings),
  { loading: LoadingSettings },
)
const BioSettings = dynamic(
  () => import('@/editor/components/editor/section-settings/portfolio/bio-settings').then(m => m.BioSettings),
  { loading: LoadingSettings },
)
const FeaturedWorkSettings = dynamic(
  () => import('@/editor/components/editor/section-settings/portfolio/featured-work-settings').then(m => m.FeaturedWorkSettings),
  { loading: LoadingSettings },
)
const VideoSettings = dynamic(
  () => import('@/editor/components/editor/section-settings/portfolio/video-settings').then(m => m.VideoSettings),
  { loading: LoadingSettings },
)
const ContactSettings = dynamic(
  () => import('@/editor/components/editor/section-settings/portfolio/contact-settings').then(m => m.ContactSettings),
  { loading: LoadingSettings },
)
const FooterSettings = dynamic(
  () => import('@/editor/components/editor/section-settings/portfolio/footer-settings').then(m => m.FooterSettings),
  { loading: LoadingSettings },
)

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
    { id: 'editorial', name: 'Editorial', tags: ['editorial', 'magazine'] },
    { id: 'minimal', name: 'Minimal', tags: ['minimal'] },
    { id: 'elegant', name: 'Elegant', tags: ['elegant'] },
    { id: 'grid', name: 'Grid', tags: ['grid', 'structured'] },
    { id: 'bento', name: 'Bento', tags: ['bento', 'modern'] },
    { id: 'showcase', name: 'Showcase', tags: ['showcase', 'bold', 'cinematic'] },
    { id: 'liquid-glass', name: 'Liquid Glass', tags: ['glass', 'modern', 'dark'] },
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
