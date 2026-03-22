import type { PhotobookSectionVisibility } from '@/editor/lib/types'
import type { PhotobookTemplateProps } from '@/editor/lib/template-types'
import type { ModeRegistryEntry } from './types'
import { type PhotobookTemplateId } from './photobook-ids'

import dynamic from 'next/dynamic'
import { PhotobookTemplateShell } from '@/editor/components/editor/layout/photobook-template-shell'

const LoadingTemplate = () => (
  <div className="w-full h-full min-h-[50vh] bg-slate-50 animate-pulse rounded-lg" />
)
const LoadingSettings = () => null

// Templates
const PhotobookTimelineTemplate = dynamic(
  () => import('@/editor/components/templates/photobook/photobook-timeline').then(m => m.PhotobookTimelineTemplate),
  { loading: LoadingTemplate },
)
const PhotobookMasonryTemplate = dynamic(
  () => import('@/editor/components/templates/photobook/photobook-masonry'),
  { loading: LoadingTemplate },
)
const TemplateClassic = dynamic(
  () => import('@/editor/components/templates/photobook/template-classic').then(m => m.TemplateClassic),
  { loading: LoadingTemplate },
)
const TemplateCircle = dynamic(
  () => import('@/editor/components/templates/photobook/template-circle').then(m => m.TemplateCircle),
  { loading: LoadingTemplate },
)
const TemplateMagazine = dynamic(
  () => import('@/editor/components/templates/photobook/template-magazine').then(m => m.TemplateMagazine),
  { loading: LoadingTemplate },
)
const TemplatePolaroid = dynamic(
  () => import('@/editor/components/templates/photobook/template-polaroid').then(m => m.TemplatePolaroid),
  { loading: LoadingTemplate },
)
const TemplateSplit = dynamic(
  () => import('@/editor/components/templates/photobook/template-split').then(m => m.TemplateSplit),
  { loading: LoadingTemplate },
)
const TemplateVertical = dynamic(
  () => import('@/editor/components/templates/photobook/template-vertical').then(m => m.TemplateVertical),
  { loading: LoadingTemplate },
)
const TemplateMemoirDesign = dynamic(
  () => import('@/editor/components/templates/photobook/template-memoir').then(m => m.TemplateMemoirDesign),
  { loading: LoadingTemplate },
)

// Section settings panels
const PhotobookCoverSettings = dynamic(
  () => import('@/editor/components/editor/section-settings/photobook/cover-settings'),
  { loading: LoadingSettings },
)
const PhotobookIntroductionSettings = dynamic(
  () => import('@/editor/components/editor/section-settings/photobook/introduction-settings'),
  { loading: LoadingSettings },
)
const PhotobookStorySettings = dynamic(
  () => import('@/editor/components/editor/section-settings/photobook/story-settings'),
  { loading: LoadingSettings },
)
const PhotobookGallerySettings = dynamic(
  () => import('@/editor/components/editor/section-settings/photobook/gallery-settings'),
  { loading: LoadingSettings },
)
const PhotobookHighlightSettings = dynamic(
  () => import('@/editor/components/editor/section-settings/photobook/highlight-settings'),
  { loading: LoadingSettings },
)
const PhotobookEndingSettings = dynamic(
  () => import('@/editor/components/editor/section-settings/photobook/ending-settings'),
  { loading: LoadingSettings },
)

const photobookTemplateComponents: Partial<
  Record<PhotobookTemplateId, React.ComponentType<PhotobookTemplateProps>>
> = {
  'wedding-timeline': PhotobookTimelineTemplate,
  masonry: PhotobookMasonryTemplate,
  'photobook-classic': TemplateClassic,
  'photobook-circle': TemplateCircle,
  'photobook-magazine': TemplateMagazine,
  'photobook-polaroid': TemplatePolaroid,
  'photobook-split': TemplateSplit,
  'photobook-vertical': TemplateVertical,
  'photobook-memoir': TemplateMemoirDesign,
}

export const photobookMode: ModeRegistryEntry<keyof PhotobookSectionVisibility> = {
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
    { id: 'photobook-memoir', name: 'Memoir', tags: ['editorial', 'minimal'] },
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
      case 'cover': return PhotobookCoverSettings
      case 'introduction': return PhotobookIntroductionSettings
      case 'story': return PhotobookStorySettings
      case 'gallery': return PhotobookGallerySettings
      case 'highlight': return PhotobookHighlightSettings
      case 'ending': return PhotobookEndingSettings
      default: return null
    }
  },
  canvasDataSelector: () => ({}),

  renderCanvas: ({ templateId }) => {
    const id = templateId as PhotobookTemplateId

    const Design =
      photobookTemplateComponents[id] ??
      photobookTemplateComponents['wedding-timeline'] ??
      PhotobookTimelineTemplate

    return <PhotobookTemplateShell Design={Design} />
  },

  visibilitySelector: (s) => s.photobookSectionVisibility,

  toggleSelector: (s) => s.togglePhotobookSection,
}
