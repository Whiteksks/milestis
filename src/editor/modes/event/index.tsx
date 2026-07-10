import { Images } from 'lucide-react'
import dynamic from 'next/dynamic'
import type { ModeRegistryEntry } from '@/editor/lib/modes/types'
import type { EventTemplateProps } from '@/editor/lib/template-types'
import type { EventTemplateId } from './template-ids'
import type { EventPublishedData, EventSectionContent, EventSectionVisibility } from './content-types'
import {
  createEventSlice,
  defaultEventContent,
  defaultEventVisibility,
} from './store-slice'
import { useContentStore } from '@/editor/lib/store/content'
import { EventTemplateShell } from './event-template-shell'
import { EventFilmCover } from './templates/sections/event-film-cover'
import { EventCosmosCover } from './templates/sections/event-cosmos-cover'
import { EventParallaxCover } from './templates/sections/event-parallax-cover'
import { EventBubblesCover } from './templates/sections/event-bubbles-cover'
import { EventCoverflowCover } from './templates/sections/event-coverflow-cover'
import { EventPublishedPage } from './event-published-page'
import { PhotobookTextureOverlay, getMoodFilter } from '@/editor/components/editor/layout/background-layers/overlays/photobook-overlay'

// ─── Template dynamic imports ─────────────────────────────────────────────────

const LoadingTemplate = () => <div className="w-full h-full min-h-screen bg-transparent" />


const TemplateEventFilm = dynamic(
  () => import('./templates/template-event-film').then((m) => m.TemplateEventFilm),
  { loading: LoadingTemplate },
)

const TemplateEventCosmos = dynamic(
  () => import('./templates/template-event-cosmos').then((m) => m.TemplateEventCosmos),
  { loading: LoadingTemplate },
)

const TemplateEventParallax = dynamic(
  () => import('./templates/template-event-parallax').then((m) => m.TemplateEventParallax),
  { loading: LoadingTemplate },
)

const TemplateEventBubbles = dynamic(
  () => import('./templates/template-event-bubbles').then((m) => m.TemplateEventBubbles),
  { loading: LoadingTemplate },
)

const TemplateEventCoverflow = dynamic(
  () => import('./templates/template-event-coverflow').then((m) => m.TemplateEventCoverflow),
  { loading: LoadingTemplate },
)
const eventTemplateComponents: Partial<Record<EventTemplateId, React.ComponentType<EventTemplateProps>>> = {
  'event-film':      TemplateEventFilm,
  'event-cosmos':    TemplateEventCosmos,
  'event-parallax':  TemplateEventParallax,
  'event-bubbles':   TemplateEventBubbles,
  'event-coverflow': TemplateEventCoverflow,
}

// ─── Mode entry ───────────────────────────────────────────────────────────────

export const eventMode: ModeRegistryEntry<keyof EventSectionVisibility> = {
  id: 'event' as const,

  uiConfig: {
    backgroundLabelKey:              'editor.event.ui.backgroundLabel',
    backgroundHintKey:               'editor.event.ui.backgroundHint',
    backgroundIcon:                  Images,
    sectionsTabLabelKey:             'editor.event.ui.sectionsTabLabel',
    backgroundCatalogTitleKey:       'editor.event.ui.backgroundCatalogTitle',
    backgroundCatalogMobileIcon:     Images,
    backgroundCatalogMobileLabelKey: 'editor.event.ui.backgroundCatalogMobileLabel',
    getActiveEffectsCount: (c) =>
      [c.photobookMood, c.photobookTexture].filter((v) => v && v !== 'none').length,
    resetEffects: (update) =>
      update({ photobookMood: 'none', photobookTexture: 'none' }),
    hideMediaButton:   true,
    hidePreviewButton: true,
    hideSectionsTab:   true,
  },

  createSlice: createEventSlice,

  label: 'Event',
  defaultTemplateId: 'event-gallery',

  templates: [
    {
      id: 'event-film',
      nameKey: 'editor.event.templates.film.name',
      tagKeys: ['editor.event.tags.film', 'editor.event.tags.warm'],
      previewComponent: EventFilmCover,
    },
    {
      id: 'event-cosmos',
      nameKey: 'editor.event.templates.cosmos.name',
      tagKeys: ['editor.event.tags.cosmos', 'editor.event.tags.dynamic'],
      previewComponent: EventCosmosCover,
    },
    {
      id: 'event-parallax',
      nameKey: 'editor.event.templates.parallax.name',
      tagKeys: ['editor.event.tags.parallax', 'editor.event.tags.horizontal'],
      previewComponent: EventParallaxCover,
    },
    {
      id: 'event-bubbles',
      nameKey: 'editor.event.templates.bubbles.name',
      tagKeys: ['editor.event.tags.bubbles', 'editor.event.tags.dynamic'],
      previewComponent: EventBubblesCover,
    },
    {
      id: 'event-coverflow',
      nameKey: 'editor.event.templates.coverflow.name',
      tagKeys: ['editor.event.tags.coverflow', 'editor.event.tags.threed'],
      previewComponent: EventCoverflowCover,
    }
  ],

  sections: [
    {
      id:        'gallery',
      nameKey:   'editor.event.sections.gallery',
      toggleKey: 'showGallery',
    },
  ],
  defaultActiveSectionId: 'gallery',

  // No settings panels for V1 — photographer edits title/date via the event header
  getSettingsComponent: () => null,

  // Event mode reads photos directly in the shell — no extra canvas args needed
  canvasDataSelector: () => ({}),

  renderCanvas: ({ templateId }) => {
    const id = templateId as EventTemplateId
    const Design =
      eventTemplateComponents[id] ??
      eventTemplateComponents['event-gallery'] ??
      TemplateEventCoverflow

    return <EventTemplateShell Design={Design} />
  },

  extractContent: (store) => ({
    sectionVisibility: store.eventSectionVisibility,
    sectionContent:    store.eventSectionContent,
    // eventPhotos are NOT persisted — they live in Firestore subcollection
    imageContent:      null,
  }),

  extractPreviewMeta: (store) => {
    const firstPhoto = store.eventPhotos[0]
    const heroThumbUrl = firstPhoto?.thumbUrl
      ?? (firstPhoto
        ? `https://firebasestorage.googleapis.com/v0/b/${process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET ?? ''}/o/${encodeURIComponent(firstPhoto.storageRef)}?alt=media`
        : undefined)
    return { heroThumbUrl }
  },

  hydrateStore: (savedContent) => {
    if (savedContent) {
      useContentStore.setState({
        eventSectionVisibility: (savedContent.sectionVisibility as EventSectionVisibility) ?? defaultEventVisibility,
        eventSectionContent:    (savedContent.sectionContent    as EventSectionContent)    ?? defaultEventContent,
      })
    } else {
      useContentStore.setState({
        eventSectionVisibility: defaultEventVisibility,
        eventSectionContent:    defaultEventContent,
      })
    }
    // Always reset live photos — they will be loaded by EventTemplateShell
    useContentStore.setState({ eventPhotos: [] })
  },

  renderPublished: ({ projectId, templateId, themeCustomizations, theme, publishedData }) => {
    const mood       = themeCustomizations?.photobookMood    ?? 'none'
    const texture    = themeCustomizations?.photobookTexture ?? 'none'
    const moodFilter = getMoodFilter(mood)
    const eventData = publishedData as EventPublishedData | undefined
    return (
      <div
        className="relative overflow-hidden"
        style={moodFilter !== 'none' ? { filter: moodFilter } : undefined}
      >
        <EventPublishedPage
          projectId={projectId ?? ''}
          templateId={templateId ?? 'event-gallery'}
          theme={theme}
          initialPhotos={eventData?.approvedPhotos ?? []}
          initialMaxPhotos={eventData?.maxPhotos ?? 100}
          initialMaxPhotosPerGuest={eventData?.maxPhotosPerGuest ?? 2}
        />
        <PhotobookTextureOverlay texture={texture} />
      </div>
    )
  },

  visibilitySelector: (s) => s.eventSectionVisibility,
  toggleSelector:     (s) => s.toggleEventSection,
}
