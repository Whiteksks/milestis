import type { PhotobookSectionVisibility, PhotobookSectionContent } from './content-types'
import type { PhotobookTemplateProps } from '@/editor/lib/template-types'
import type { ModeRegistryEntry } from '@/editor/lib/modes/types'
import { type PhotobookTemplateId } from './template-ids'
import { Layers } from 'lucide-react'
import {
  createPhotobookSlice,
  defaultPhotobookContent,
  defaultPhotobookImageContent,
  defaultPhotobookVisibility,
} from '@/editor/modes/photobook/store-slice'
import type { PhotobookImageContent } from './image/content'
import { useContentStore } from '@/editor/lib/store/content'

import dynamic from 'next/dynamic'
import { PhotobookTemplateShell } from '@/editor/components/editor/layout/photobook-template-shell'
import { PhotobookTextureOverlay, getMoodFilter } from '@/editor/components/editor/layout/background-layers/overlays/photobook-overlay'

// Cover components — lightweight, used for template preview cards
import { CoverChronicle } from '@/editor/modes/photobook/templates/sections/cover/cover-chronicle'
import { CoverLumiere } from '@/editor/modes/photobook/templates/sections/cover/cover-lumiere'
import { CoverMagazine } from '@/editor/modes/photobook/templates/sections/cover/cover-magazine'
import { CoverMemoir } from '@/editor/modes/photobook/templates/sections/cover/cover-memoir'
import { CoverSoleil } from '@/editor/modes/photobook/templates/sections/cover/cover-soleil'

const LoadingTemplate = () => (
  <div className="w-full h-full min-h-screen bg-transparent" />
)



const TemplateMemoirDesign = dynamic(
  () => import('@/editor/modes/photobook/templates/template-memoir').then(m => m.TemplateMemoirDesign),
  { loading: LoadingTemplate },
)
const TemplateChronicleDesign = dynamic(
  () => import('@/editor/modes/photobook/templates/template-chronicle').then(m => m.TemplateChronicleDesign),
  { loading: LoadingTemplate },
)
const TemplateMagazineDesign = dynamic(
  () => import('@/editor/modes/photobook/templates/template-magazine').then(m => m.TemplateMagazineDesign),
  { loading: LoadingTemplate },
)
const TemplateLumiereDesign = dynamic(
  () => import('@/editor/modes/photobook/templates/template-lumiere').then(m => m.TemplateLumiereDesign),
  { loading: LoadingTemplate },
)
const TemplateSoleilDesign = dynamic(
  () => import('@/editor/modes/photobook/templates/template-soleil').then(m => m.TemplateSoleilDesign),
  { loading: LoadingTemplate },
)

// Section settings panels — static imports so panels are ready when the drawer opens
import PhotobookCoverSettings from '@/editor/modes/photobook/section-settings/cover-settings'
import PhotobookIntroductionSettings from '@/editor/modes/photobook/section-settings/introduction-settings'
import PhotobookStorySettings from '@/editor/modes/photobook/section-settings/story-settings'
import PhotobookGallerySettings from '@/editor/modes/photobook/section-settings/gallery-settings'
import PhotobookHighlightSettings from '@/editor/modes/photobook/section-settings/highlight-settings'
import PhotobookEndingSettings from '@/editor/modes/photobook/section-settings/ending-settings'

const photobookTemplateComponents: Partial<
  Record<PhotobookTemplateId, React.ComponentType<PhotobookTemplateProps>>
> = {
  'photobook-memoir': TemplateMemoirDesign,
  'photobook-chronicle': TemplateChronicleDesign,
  'photobook-magazine': TemplateMagazineDesign,
  'photobook-lumiere': TemplateLumiereDesign,
  'photobook-soleil': TemplateSoleilDesign,
}

export const photobookMode: ModeRegistryEntry<keyof PhotobookSectionVisibility> = {
  id: 'photobook' as const,
  uiConfig: {
    backgroundLabel: 'Mood & Texture',
    backgroundHint: 'No overlays applied',
    backgroundIcon: Layers,
    sectionsTabLabel: 'Content',
    backgroundCatalogTitle: 'Mood & Texture',
    backgroundCatalogMobileIcon: Layers,
    backgroundCatalogMobileLabel: 'Mood',
    getActiveEffectsCount: (c) =>
      [c.photobookMood, c.photobookTexture].filter((v) => v && v !== 'none').length,
    resetEffects: (update) =>
      update({ photobookMood: 'none', photobookTexture: 'none' }),
  },
  createSlice: createPhotobookSlice,
  label: 'Photobook',
  defaultTemplateId: 'photobook-memoir',
  templates: [
    { id: 'photobook-memoir', name: 'Memoir', tags: ['editorial', 'minimal'], previewComponent: CoverMemoir },
    { id: 'photobook-chronicle', name: 'Chronicle', tags: ['editorial', 'documentary'], previewComponent: CoverChronicle },
    { id: 'photobook-magazine', name: 'Magazine', tags: ['editorial', 'magazine'], previewComponent: CoverMagazine },
    { id: 'photobook-lumiere', name: 'Lumière', tags: ['editorial', 'film', 'light'], previewComponent: CoverLumiere },
    { id: 'photobook-soleil', name: 'Soleil', tags: ['warm', 'spacious', 'minimal'], previewComponent: CoverSoleil },
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

  extractContent: (store) => ({
    sectionVisibility: store.photobookSectionVisibility,
    sectionContent: store.photobookSectionContent,
    imageContent: store.photobookImageContent,
  }),

  extractPreviewMeta: (store) => {
    const img = store.photobookImageContent
    const content = store.photobookSectionContent
    return {
      heroThumbUrl: img.cover?.value.asset.blurDataUrl ?? img.cover?.value.asset.src,
      title: content.cover.title,
      subtitle: content.cover.subtitle,
      date: content.cover.date,
      aspectRatio: img.cover?.value.presentation?.ratio,
      frameStyle: img.cover?.value.presentation?.frameStyle,
    }
  },

  hydrateStore: (savedContent) => {
    if (savedContent) {
      useContentStore.setState({
        photobookSectionVisibility: savedContent.sectionVisibility as PhotobookSectionVisibility,
        photobookSectionContent: savedContent.sectionContent as PhotobookSectionContent,
        photobookImageContent: (savedContent.imageContent as PhotobookImageContent) ?? defaultPhotobookImageContent,
      })
    } else {
      useContentStore.setState({
        photobookSectionVisibility: defaultPhotobookVisibility,
        photobookSectionContent: defaultPhotobookContent,
        photobookImageContent: defaultPhotobookImageContent,
      })
    }
  },

  renderPublished: ({ templateId, theme, themeCustomizations, content, imageContent, visibility }) => {
    const id = templateId as PhotobookTemplateId
    const Design =
      photobookTemplateComponents[id] ??
      photobookTemplateComponents['photobook-memoir'] ??
      TemplateMemoirDesign

    const texture = themeCustomizations.photobookTexture ?? 'none'
    const mood    = themeCustomizations.photobookMood    ?? 'none'
    const moodFilter = getMoodFilter(mood)

    return (
      <div
        className="relative overflow-hidden"
        style={moodFilter !== 'none' ? { filter: moodFilter } : undefined}
      >
        <Design
          theme={theme}
          sectionContent={content as PhotobookSectionContent}
          imageContent={imageContent as PhotobookTemplateProps['imageContent']}
          sectionVisibility={visibility as PhotobookSectionVisibility}
        />
        <PhotobookTextureOverlay texture={texture} />
      </div>
    )
  },

  visibilitySelector: (s) => s.photobookSectionVisibility,

  toggleSelector: (s) => s.togglePhotobookSection,
}
