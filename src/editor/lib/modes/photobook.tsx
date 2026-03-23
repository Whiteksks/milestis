import type { PhotobookSectionVisibility } from '@/editor/lib/types'
import type { PhotobookTemplateProps } from '@/editor/lib/template-types'
import type { ModeRegistryEntry } from './types'
import { type PhotobookTemplateId } from './photobook-ids'

import dynamic from 'next/dynamic'
import { PhotobookTemplateShell } from '@/editor/components/editor/layout/photobook-template-shell'

// Cover components — lightweight, used for template preview cards
import { CoverChronicle } from '@/editor/components/templates/photobook/sections/cover/cover-chronicle'
import { CoverLumiere } from '@/editor/components/templates/photobook/sections/cover/cover-lumiere'
import { CoverMagazine } from '@/editor/components/templates/photobook/sections/cover/cover-magazine'
import { CoverMemoir } from '@/editor/components/templates/photobook/sections/cover/cover-memoir'

const LoadingTemplate = () => (
  <div className="w-full h-full min-h-[50vh] bg-slate-50 animate-pulse rounded-lg" />
)
const LoadingSettings = () => null


const TemplateMemoirDesign = dynamic(
  () => import('@/editor/components/templates/photobook/template-memoir').then(m => m.TemplateMemoirDesign),
  { loading: LoadingTemplate },
)
const TemplateChronicleDesign = dynamic(
  () => import('@/editor/components/templates/photobook/template-chronicle').then(m => m.TemplateChronicleDesign),
  { loading: LoadingTemplate },
)
const TemplateMagazineDesign = dynamic(
  () => import('@/editor/components/templates/photobook/template-magazine').then(m => m.TemplateMagazineDesign),
  { loading: LoadingTemplate },
)
const TemplateLumiereDesign = dynamic(
  () => import('@/editor/components/templates/photobook/template-lumiere').then(m => m.TemplateLumiereDesign),
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
  'photobook-memoir': TemplateMemoirDesign,
  'photobook-chronicle': TemplateChronicleDesign,
  'photobook-magazine': TemplateMagazineDesign,
  'photobook-lumiere': TemplateLumiereDesign,
}

export const photobookMode: ModeRegistryEntry<keyof PhotobookSectionVisibility> = {
  label: 'Photobook',
  templates: [
    { id: 'photobook-memoir', name: 'Memoir', tags: ['editorial', 'minimal'], previewComponent: CoverMemoir },
    { id: 'photobook-chronicle', name: 'Chronicle', tags: ['editorial', 'documentary'], previewComponent: CoverChronicle },
    { id: 'photobook-magazine', name: 'Magazine', tags: ['editorial', 'magazine'], previewComponent: CoverMagazine },
    { id: 'photobook-lumiere', name: 'Lumière', tags: ['editorial', 'film', 'light'], previewComponent: CoverLumiere },
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
      photobookTemplateComponents['photobook-memoir'] ??
      TemplateMemoirDesign

    return <PhotobookTemplateShell Design={Design} />
  },

  visibilitySelector: (s) => s.photobookSectionVisibility,

  toggleSelector: (s) => s.togglePhotobookSection,
}
