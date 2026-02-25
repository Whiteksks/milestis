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

// Section settings panels — lazy loaded so they stay out of the initial editor bundle.
// They are only needed when a user opens/switches a section in the sidebar.
const LoadingSettings = () => null

const HeaderSettings = dynamic(() => import('@/editor/components/editor/section-settings/portfolio/header-settings').then(m => m.HeaderSettings), { loading: LoadingSettings })
const HeroSettings = dynamic(() => import('@/editor/components/editor/section-settings/portfolio/hero-settings').then(m => m.HeroSettings), { loading: LoadingSettings })
const BioSettings = dynamic(() => import('@/editor/components/editor/section-settings/portfolio/bio-settings').then(m => m.BioSettings), { loading: LoadingSettings })
const FeaturedWorkSettings = dynamic(() => import('@/editor/components/editor/section-settings/portfolio/featured-work-settings').then(m => m.FeaturedWorkSettings), { loading: LoadingSettings })
const VideoSettings = dynamic(() => import('@/editor/components/editor/section-settings/portfolio/video-settings').then(m => m.VideoSettings), { loading: LoadingSettings })
const ContactSettings = dynamic(() => import('@/editor/components/editor/section-settings/portfolio/contact-settings').then(m => m.ContactSettings), { loading: LoadingSettings })
const FooterSettings = dynamic(() => import('@/editor/components/editor/section-settings/portfolio/footer-settings').then(m => m.FooterSettings), { loading: LoadingSettings })

const PhotobookCoverSettings = dynamic(() => import('@/editor/components/editor/section-settings/photobook/cover-settings'), { loading: LoadingSettings })
const PhotobookIntroductionSettings = dynamic(() => import('@/editor/components/editor/section-settings/photobook/introduction-settings'), { loading: LoadingSettings })
const PhotobookStorySettings = dynamic(() => import('@/editor/components/editor/section-settings/photobook/story-settings'), { loading: LoadingSettings })
const PhotobookGallerySettings = dynamic(() => import('@/editor/components/editor/section-settings/photobook/gallery-settings'), { loading: LoadingSettings })
const PhotobookHighlightSettings = dynamic(() => import('@/editor/components/editor/section-settings/photobook/highlight-settings'), { loading: LoadingSettings })
const PhotobookEndingSettings = dynamic(() => import('@/editor/components/editor/section-settings/photobook/ending-settings'), { loading: LoadingSettings })

type TemplateDef = {
  id: TemplateId
  name: string
  description?: string
  thumbnail?: string
  tags?: string[]
}

type SectionDef<K extends string = string> = {
  id: string
  name: string
  toggleKey: K
}

/** All data needed to render the canvas — add new mode fields here. */
type CanvasRenderArgs = {
  templateId: TemplateId
  theme: ThemeConfig
  frameStyle: FrameStyle
  photobookSectionContent: PhotobookSectionContent
  photobookSectionVisibility: PhotobookSectionVisibility
}

type ModeRegistryEntry<TVisibilityKey extends string> = {
  label: string
  templates: TemplateDef[]
  sections: SectionDef<TVisibilityKey>[]
  defaultActiveSectionId: string

  getSettingsComponent: (sectionId: string) => React.ComponentType | null

  renderCanvas: (args: CanvasRenderArgs) => React.ReactNode

  getSectionVisible: (args: {
    section: SectionDef<TVisibilityKey>
    portfolioVisibility: SectionVisibility
    photobookVisibility: PhotobookSectionVisibility
  }) => boolean

  toggleSection: (args: {
    toggleKey: TVisibilityKey
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

export const MODE_REGISTRY: {
  portfolio: ModeRegistryEntry<keyof SectionVisibility>
  photobook: ModeRegistryEntry<keyof PhotobookSectionVisibility>
} = {
  portfolio: {
    label: 'Portfolio',
    templates: [
      { id: 'classic', name: 'Classic', tags: ['classic', 'elegant'] },
      { id: 'minimal', name: 'Minimal', tags: ['minimal'] },
      { id: 'elegant', name: 'Elegant', tags: ['elegant'] },
      { id: 'modern', name: 'Modern', tags: ['modern'] },
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
      return Boolean(portfolioVisibility[section.toggleKey])
    },
    toggleSection: ({ toggleKey, togglePortfolio }) => {
      togglePortfolio(toggleKey)
    },
  },

  photobook: {
    label: 'Photobook',
    templates: [
      { id: 'wedding-timeline', name: 'Photobook Timeline', tags: ['modern'] },
      { id: 'masonry', name: 'Photobook Masonry', tags: ['modern'] },
      { id: 'photobook-classic', name: 'Photobook Classic', tags: ['classic'] },
      { id: 'photobook-circle', name: 'Photobook Circle', tags: ['modern'] },
      { id: 'photobook-magazine', name: 'Photobook Magazine', tags: ['elegant'] },
      { id: 'photobook-polaroid', name: 'Photobook Polaroid', tags: ['classic'] },
      { id: 'photobook-split', name: 'Photobook Split', tags: ['minimal'] },
      { id: 'photobook-vertical', name: 'Photobook Vertical', tags: ['minimal'] },
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
      return Boolean(photobookVisibility[section.toggleKey])
    },
    toggleSection: ({ toggleKey, togglePhotobook }) => {
      togglePhotobook(toggleKey)
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
