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
    backgroundLabelKey: 'editor.portfolio.ui.backgroundLabel',
    backgroundHintKey: 'editor.portfolio.ui.backgroundHint',
    backgroundIcon: WandSparkles,
    sectionsTabLabelKey: 'editor.portfolio.ui.sectionsTabLabel',
    backgroundCatalogTitleKey: 'editor.portfolio.ui.backgroundCatalogTitle',
    backgroundCatalogMobileIcon: WandSparkles,
    backgroundCatalogMobileLabelKey: 'editor.portfolio.ui.backgroundCatalogMobileLabel',
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
    {
      id: 'editorial',
      nameKey: 'editor.portfolio.templates.editorial.name',
      tagKeys: ['editor.portfolio.tags.classic', 'editor.portfolio.tags.modern'],
      previewComponent: EditorialHero,
    },
    {
      id: 'minimal',
      nameKey: 'editor.portfolio.templates.minimal.name',
      tagKeys: ['editor.portfolio.tags.clean', 'editor.portfolio.tags.classic'],
      previewComponent: MinimalHero,
    },
    {
      id: 'elegant',
      nameKey: 'editor.portfolio.templates.elegant.name',
      tagKeys: ['editor.portfolio.tags.clean', 'editor.portfolio.tags.classic'],
      previewComponent: ElegantHero,
    },
    {
      id: 'grid',
      nameKey: 'editor.portfolio.templates.grid.name',
      tagKeys: ['editor.portfolio.tags.structured', 'editor.portfolio.tags.clean'],
      previewComponent: GridHero,
    },
    {
      id: 'bento',
      nameKey: 'editor.portfolio.templates.bento.name',
      tagKeys: ['editor.portfolio.tags.structured', 'editor.portfolio.tags.modern'],
      previewComponent: BentoHero,
    },
    {
      id: 'showcase',
      nameKey: 'editor.portfolio.templates.showcase.name',
      tagKeys: ['editor.portfolio.tags.modern', 'editor.portfolio.tags.visual'],
      previewComponent: ShowcaseHero,
    },
    {
      id: 'liquid-glass',
      nameKey: 'editor.portfolio.templates.liquidGlass.name',
      tagKeys: ['editor.portfolio.tags.modern', 'editor.portfolio.tags.visual'],
      previewComponent: LiquidGlassHero,
    },
  ],
  sections: [
    { id: 'header', nameKey: 'editor.portfolio.sections.header', toggleKey: 'showHeader' },
    { id: 'hero', nameKey: 'editor.portfolio.sections.hero', toggleKey: 'showHero' },
    { id: 'bio', nameKey: 'editor.portfolio.sections.bio', toggleKey: 'showBio' },
    { id: 'featuredWork', nameKey: 'editor.portfolio.sections.featuredWork', toggleKey: 'showFeaturedWork' },
    { id: 'video', nameKey: 'editor.portfolio.sections.video', toggleKey: 'showVideo' },
    { id: 'contact', nameKey: 'editor.portfolio.sections.contact', toggleKey: 'showContact' },
    { id: 'footer', nameKey: 'editor.portfolio.sections.footer', toggleKey: 'showFooter' },
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
