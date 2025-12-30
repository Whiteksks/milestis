import type { ThemeConfig } from '@/editor/lib/themes'
import type {
  EditorMode,
  FrameStyle,
  PhotobookSectionContent,
  PhotobookSectionVisibility,
  SectionVisibility,
  TemplateId,
} from '@/editor/lib/types'
import type { PhotobookTemplateProps, PortfolioTemplateProps } from '@/editor/lib/template-types'

import type React from 'react'
import dynamic from 'next/dynamic'

const LoadingTemplate = () => <div className="w-full h-full min-h-[50vh] bg-slate-50 animate-pulse rounded-lg" />

// Portfolio templates
const ClassicTemplateDesign = dynamic(() => import('@/editor/components/templates/portfolio/classic-template').then(m => m.ClassicTemplateDesign), { loading: LoadingTemplate })
const MinimalTemplateDesign = dynamic(() => import('@/editor/components/templates/portfolio/minimal-template').then(m => m.MinimalTemplateDesign), { loading: LoadingTemplate })
const ElegantTemplateDesign = dynamic(() => import('@/editor/components/templates/portfolio/elegant-template').then(m => m.ElegantTemplateDesign), { loading: LoadingTemplate })
const ModernParallaxTemplate = dynamic(() => import('@/editor/components/templates/portfolio/modern-template').then(m => m.ModernParallaxTemplate), { loading: LoadingTemplate })

// Photobook templates
const PhotobookTimelineTemplate = dynamic(() => import('@/editor/components/templates/photobook/photobook-timeline').then(m => m.PhotobookTimelineTemplate), { loading: LoadingTemplate })
const PhotobookMasonryTemplate = dynamic(() => import('@/editor/components/templates/photobook/photobook-masonry'), { loading: LoadingTemplate })
const TemplateClassic = dynamic(() => import('@/editor/components/templates/photobook/template-classic').then(m => m.TemplateClassic), { loading: LoadingTemplate })
const TemplateCircle = dynamic(() => import('@/editor/components/templates/photobook/template-circle').then(m => m.TemplateCircle), { loading: LoadingTemplate })
const TemplateMagazine = dynamic(() => import('@/editor/components/templates/photobook/template-magazine').then(m => m.TemplateMagazine), { loading: LoadingTemplate })
const TemplatePolaroid = dynamic(() => import('@/editor/components/templates/photobook/template-polaroid').then(m => m.TemplatePolaroid), { loading: LoadingTemplate })
const TemplateSplit = dynamic(() => import('@/editor/components/templates/photobook/template-split').then(m => m.TemplateSplit), { loading: LoadingTemplate })
const TemplateVertical = dynamic(() => import('@/editor/components/templates/photobook/template-vertical').then(m => m.TemplateVertical), { loading: LoadingTemplate })

// Canvas wrappers
import { PortfolioTemplateShell } from '@/editor/components/editor/layout/portfolio-template-shell'

// Section settings panels (Sidebar + SettingsContent)
import { HeaderSettings } from '@/editor/components/editor/section-settings/portfolio/header-settings'
import { HeroSettings } from '@/editor/components/editor/section-settings/portfolio/hero-settings'
import { BioSettings } from '@/editor/components/editor/section-settings/portfolio/bio-settings'
import { FeaturedWorkSettings } from '@/editor/components/editor/section-settings/portfolio/featured-work-settings'
import { VideoSettings } from '@/editor/components/editor/section-settings/portfolio/video-settings'
import { ContactSettings } from '@/editor/components/editor/section-settings/portfolio/contact-settings'
import { FooterSettings } from '@/editor/components/editor/section-settings/portfolio/footer-settings'

import PhotobookCoverSettings from '@/editor/components/editor/section-settings/photobook/cover-settings'
import PhotobookIntroductionSettings from '@/editor/components/editor/section-settings/photobook/introduction-settings'
import PhotobookStorySettings from '@/editor/components/editor/section-settings/photobook/story-settings'
import PhotobookGallerySettings from '@/editor/components/editor/section-settings/photobook/gallery-settings'
import PhotobookHighlightSettings from '@/editor/components/editor/section-settings/photobook/highlight-settings'
import PhotobookEndingSettings from '@/editor/components/editor/section-settings/photobook/ending-settings'

type TemplateDef = {
  id: TemplateId
  name: string
  description?: string
  thumbnail?: string
  tags?: string[]
}

type SectionDef = {
  id: string
  name: string
  toggleKey: string
}

type ModeRegistryEntry = {
  label: string
  templates: TemplateDef[]
  sections: SectionDef[]
  defaultActiveSectionId: string

  getSettingsComponent: (sectionId: string) => React.ComponentType | null

  renderCanvas: (args: {
    templateId: TemplateId
    theme: ThemeConfig
    frameStyle: FrameStyle
    photobookSectionContent: PhotobookSectionContent
    photobookSectionVisibility: PhotobookSectionVisibility
  }) => React.ReactNode

  getSectionVisible: (args: {
    section: SectionDef
    portfolioVisibility: SectionVisibility
    photobookVisibility: PhotobookSectionVisibility
  }) => boolean

  toggleSection: (args: {
    toggleKey: string
    portfolioVisibility: SectionVisibility
    photobookVisibility: PhotobookSectionVisibility
    togglePortfolio: (section: keyof SectionVisibility) => void
    togglePhotobook: (section: keyof PhotobookSectionVisibility) => void
  }) => void
}

const portfolioTemplateComponents: Partial<
  Record<TemplateId, React.ComponentType<PortfolioTemplateProps>>
> = {
  classic: ClassicTemplateDesign,
  minimal: MinimalTemplateDesign,
  elegant: ElegantTemplateDesign,
  modern: ModernParallaxTemplate,
}

const photobookTemplateComponents: Partial<
  Record<TemplateId, React.ComponentType<PhotobookTemplateProps>>
> = {
  'wedding-timeline': PhotobookTimelineTemplate,
  masonry: PhotobookMasonryTemplate,
  'photobook-classic': TemplateClassic,
  'photobook-circle': TemplateCircle,
  'photobook-magazine': TemplateMagazine,
  'photobook-polaroid': TemplatePolaroid,
  'photobook-split': TemplateSplit,
  'photobook-vertical': TemplateVertical,
}

export const MODE_REGISTRY: Record<EditorMode, ModeRegistryEntry> = {
  portfolio: {
    label: 'Portfolio',
    templates: [
      { id: 'classic', name: 'Classic' },
      { id: 'minimal', name: 'Minimal' },
      { id: 'elegant', name: 'Elegant' },
      { id: 'modern', name: 'Modern' },
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
        case 'header':
          return HeaderSettings
        case 'hero':
          return HeroSettings
        case 'bio':
          return BioSettings
        case 'featuredWork':
          return FeaturedWorkSettings
        case 'video':
          return VideoSettings
        case 'contact':
          return ContactSettings
        case 'footer':
          return FooterSettings
        default:
          return null
      }
    },
    renderCanvas: ({ templateId }) => {
      const Design =
        portfolioTemplateComponents[templateId] ??
        portfolioTemplateComponents.classic ??
        ClassicTemplateDesign

      return <PortfolioTemplateShell Design={Design} />
    },
    getSectionVisible: ({ section, portfolioVisibility }) => {
      return Boolean((portfolioVisibility as unknown as Record<string, boolean>)[section.toggleKey])
    },
    toggleSection: ({ toggleKey, togglePortfolio }) => {
      togglePortfolio(toggleKey as keyof SectionVisibility)
    },
  },

  photobook: {
    label: 'Photobook',
    templates: [
      { id: 'wedding-timeline', name: 'Photobook Timeline' },
      { id: 'masonry', name: 'Photobook Masonry' },
      { id: 'photobook-classic', name: 'Photobook Classic' },
      { id: 'photobook-circle', name: 'Photobook Circle' },
      { id: 'photobook-magazine', name: 'Photobook Magazine' },
      { id: 'photobook-polaroid', name: 'Photobook Polaroid' },
      { id: 'photobook-split', name: 'Photobook Split' },
      { id: 'photobook-vertical', name: 'Photobook Vertical' },
    ],
    sections: [
      { id: 'cover', name: 'Cover', toggleKey: 'showCover' },
      { id: 'introduction', name: 'Introduction', toggleKey: 'showIntroduction' },
      { id: 'story', name: 'Story', toggleKey: 'showStory' },
      { id: 'gallery', name: 'Gallery', toggleKey: 'showGallery' },
      { id: 'highlight', name: 'Highlight', toggleKey: 'showHighlight' },
      { id: 'ending', name: 'Ending', toggleKey: 'showEnding' },
    ],
    defaultActiveSectionId: 'cover',
    getSettingsComponent: (sectionId) => {
      switch (sectionId) {
        case 'cover':
          return PhotobookCoverSettings
        case 'introduction':
          return PhotobookIntroductionSettings
        case 'story':
          return PhotobookStorySettings
        case 'gallery':
          return PhotobookGallerySettings
        case 'highlight':
          return PhotobookHighlightSettings
        case 'ending':
          return PhotobookEndingSettings
        default:
          return null
      }
    },
    renderCanvas: ({ templateId, theme, frameStyle, photobookSectionContent, photobookSectionVisibility }) => {
      const PhotobookDesign =
        photobookTemplateComponents[templateId] ??
        photobookTemplateComponents['wedding-timeline'] ??
        PhotobookTimelineTemplate

      return (
        <PhotobookDesign
          theme={theme}
          sectionVisibility={photobookSectionVisibility}
          sectionContent={photobookSectionContent}
          frameStyle={frameStyle}
        />
      )
    },
    getSectionVisible: ({ section, photobookVisibility }) => {
      return Boolean((photobookVisibility as unknown as Record<string, boolean>)[section.toggleKey])
    },
    toggleSection: ({ toggleKey, togglePhotobook }) => {
      togglePhotobook(toggleKey as keyof PhotobookSectionVisibility)
    },
  },
}

export function getModeTemplates(mode: EditorMode): TemplateDef[] {
  return MODE_REGISTRY[mode].templates
}

export function getModeSections(mode: EditorMode): SectionDef[] {
  return MODE_REGISTRY[mode].sections
}

export function getModeSectionCount(mode: EditorMode): number {
  return MODE_REGISTRY[mode].sections.length
}
