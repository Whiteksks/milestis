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
const ClassicTemplateDesign = dynamic(
  () => import('@/editor/components/templates/portfolio/classic-template').then(m => m.ClassicTemplateDesign),
  { loading: LoadingTemplate },
)
const MinimalTemplateDesign = dynamic(
  () => import('@/editor/components/templates/portfolio/minimal-template').then(m => m.MinimalTemplateDesign),
  { loading: LoadingTemplate },
)
const ElegantTemplateDesign = dynamic(
  () => import('@/editor/components/templates/portfolio/elegant-template').then(m => m.ElegantTemplateDesign),
  { loading: LoadingTemplate },
)
const ModernParallaxTemplate = dynamic(
  () => import('@/editor/components/templates/portfolio/modern-template').then(m => m.ModernParallaxTemplate),
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
  classic: ClassicTemplateDesign,
  minimal: MinimalTemplateDesign,
  elegant: ElegantTemplateDesign,
  modern: ModernParallaxTemplate,
  editorial: EditorialTemplateDesign,
  grid: GridTemplateDesign,
  bento: BentoTemplateDesign,
}

export const portfolioMode: ModeRegistryEntry<keyof SectionVisibility> = {
  label: 'Portfolio',
  templates: [
    { id: 'classic', name: 'Classic', tags: ['classic', 'elegant'] },
    { id: 'minimal', name: 'Minimal', tags: ['minimal'] },
    { id: 'elegant', name: 'Elegant', tags: ['elegant'] },
    { id: 'modern', name: 'Modern', tags: ['modern'] },
    { id: 'editorial', name: 'Editorial', tags: ['editorial', 'magazine'] },
    { id: 'grid', name: 'Grid', tags: ['grid', 'structured'] },
    { id: 'bento', name: 'Bento', tags: ['bento', 'modern'] },
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
  getSettingsComponent: (sectionId) => {
    switch (sectionId) {
      case 'header': return HeaderSettings
      case 'hero': return HeroSettings
      case 'bio': return BioSettings
      case 'featuredWork': return FeaturedWorkSettings
      case 'video': return VideoSettings
      case 'contact': return ContactSettings
      case 'footer': return FooterSettings
      default: return null
    }
  },
  canvasDataSelector: () => ({}),  // PortfolioTemplateShell reads its own data from the store

  renderCanvas: ({ templateId }) => {
    const id = templateId as PortfolioTemplateId
    const Design =
      portfolioTemplateComponents[id] ??
      portfolioTemplateComponents.classic ??
      ClassicTemplateDesign

    return <PortfolioTemplateShell Design={Design} />
  },

  visibilitySelector: (s) => s.sectionVisibility,

  toggleSelector: (s) => s.toggleSection,
}
