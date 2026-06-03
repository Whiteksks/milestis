import type React from 'react'
import type { SectionContent, SectionVisibility } from './content-types'
import type { PortfolioTemplateProps } from '@/editor/lib/template-types'
import type { ModeRegistryEntry } from '@/editor/lib/modes/types'
import { type PortfolioTemplateId } from './template-ids'
import { WandSparkles } from 'lucide-react'
import {
  createPortfolioSlice,
  defaultPortfolioContent,
  defaultPortfolioImageContent,
  defaultPortfolioVisibility,
} from './store-slice'
import type { PortfolioImageContent } from './image/content'
import { useContentStore } from '@/editor/lib/store/content'

import dynamic from 'next/dynamic'
import { PortfolioTemplateShell } from '@/editor/components/editor/layout/portfolio-template-shell'

// Hero components — lightweight, used for template preview cards
import { BentoHero } from '@/editor/modes/portfolio/templates/sections/hero/bento-hero'
import { EditorialHero } from '@/editor/modes/portfolio/templates/sections/hero/editorial-hero'
import { ElegantHero } from '@/editor/modes/portfolio/templates/sections/hero/elegant-hero'
import { GridHero } from '@/editor/modes/portfolio/templates/sections/hero/grid-hero'
import { MinimalHero } from '@/editor/modes/portfolio/templates/sections/hero/minimal-hero'
import { ShowcaseHero } from '@/editor/modes/portfolio/templates/sections/hero/showcase-hero'
import { LiquidGlassHero } from '@/editor/modes/portfolio/templates/sections/hero/liquid-glass-hero'

const LoadingTemplate = () => (
  <div className="w-full h-full min-h-screen bg-transparent" />
)

// Templates
const MinimalTemplateDesign = dynamic(
  () => import('@/editor/modes/portfolio/templates/minimal-template').then(m => m.MinimalTemplateDesign),
  { loading: LoadingTemplate },
)
const ElegantTemplateDesign = dynamic(
  () => import('@/editor/modes/portfolio/templates/elegant-template').then(m => m.ElegantTemplateDesign),
  { loading: LoadingTemplate },
)

const EditorialTemplateDesign = dynamic(
  () => import('@/editor/modes/portfolio/templates/editorial-template').then(m => m.EditorialTemplateDesign),
  { loading: LoadingTemplate },
)
const GridTemplateDesign = dynamic(
  () => import('@/editor/modes/portfolio/templates/grid-template').then(m => m.GridTemplateDesign),
  { loading: LoadingTemplate },
)
const BentoTemplateDesign = dynamic(
  () => import('@/editor/modes/portfolio/templates/bento-template').then(m => m.BentoTemplateDesign),
  { loading: LoadingTemplate },
)
const ShowcaseTemplateDesign = dynamic(
  () => import('@/editor/modes/portfolio/templates/showcase-template').then(m => m.ShowcaseTemplateDesign),
  { loading: LoadingTemplate },
)

const LiquidGlassTemplateDesign = dynamic(
  () => import('@/editor/modes/portfolio/templates/liquid-glass-template').then(m => m.LiquidGlassTemplateDesign),
  { loading: LoadingTemplate },
)

// Section settings panels — static imports so panels are ready when the drawer opens
import { HeaderSettings } from '@/editor/modes/portfolio/section-settings/header-settings'
import { HeroSettings } from '@/editor/modes/portfolio/section-settings/hero-settings'
import { BioSettings } from '@/editor/modes/portfolio/section-settings/bio-settings'
import { FeaturedWorkSettings } from '@/editor/modes/portfolio/section-settings/featured-work-settings'
import { VideoSettings } from '@/editor/modes/portfolio/section-settings/video-settings'
import { ContactSettings } from '@/editor/modes/portfolio/section-settings/contact-settings'
import { FooterSettings } from '@/editor/modes/portfolio/section-settings/footer-settings'

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
  id: 'portfolio' as const,
  uiConfig: {
    backgroundLabel: 'Background',
    backgroundHint: 'No effects applied',
    backgroundIcon: WandSparkles,
    sectionsTabLabel: 'Sections',
    backgroundCatalogTitle: 'Background Effects',
    backgroundCatalogMobileIcon: WandSparkles,
    backgroundCatalogMobileLabel: 'Background',
    getActiveEffectsCount: (c) =>
      [c.depthEffect, c.raysEffect, c.textureEffect].filter((v) => v && v !== 'none').length,
    resetEffects: (update) =>
      update({
        depthEffect: 'none',
        raysEffect: 'none',
        textureEffect: 'none',
        backgroundLayersTheme: 'dark',
        backgroundScrollMode: 'fixed',
      }),
  },
  createSlice: createPortfolioSlice,
  label: 'Portfolio',
  defaultTemplateId: 'editorial',
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

  extractContent: (store) => ({
    sectionVisibility: store.sectionVisibility,
    sectionContent: store.sectionContent,
    imageContent: store.portfolioImageContent,
  }),

  extractPreviewMeta: (store) => {
    const img = store.portfolioImageContent
    const content = store.sectionContent
    return {
      heroThumbUrl: img.hero?.value.asset.blurDataUrl ?? img.hero?.value.asset.src,
      title: content.hero.title,
      subtitle: content.hero.subtitle,
      aspectRatio: img.hero?.value.presentation?.ratio,
      frameStyle: img.hero?.value.presentation?.frameStyle,
    }
  },

  hydrateStore: (savedContent) => {
    if (savedContent) {
      useContentStore.setState({
        sectionVisibility: savedContent.sectionVisibility as SectionVisibility,
        sectionContent: savedContent.sectionContent as SectionContent,
        portfolioImageContent: (savedContent.imageContent as PortfolioImageContent) ?? defaultPortfolioImageContent,
      })
    } else {
      useContentStore.setState({
        sectionVisibility: defaultPortfolioVisibility,
        sectionContent: defaultPortfolioContent,
        portfolioImageContent: defaultPortfolioImageContent,
      })
    }
  },

  renderPublished: ({ templateId, theme, content, imageContent, visibility, handleAnchorClick }) => {
    const id = templateId as PortfolioTemplateId
    const Design =
      portfolioTemplateComponents[id] ??
      portfolioTemplateComponents.editorial ??
      EditorialTemplateDesign

    return (
      <Design
        theme={theme}
        sectionContent={content as SectionContent}
        imageContent={imageContent as PortfolioTemplateProps['imageContent']}
        sectionVisibility={visibility as SectionVisibility}
        handleAnchorClick={handleAnchorClick}
      />
    )
  },

  visibilitySelector: (s) => s.sectionVisibility,

  toggleSelector: (s) => s.toggleSection,
}
