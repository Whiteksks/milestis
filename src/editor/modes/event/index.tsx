import { Images } from 'lucide-react'
import dynamic from 'next/dynamic'
import type { ModeRegistryEntry } from '@/editor/lib/modes/types'
import type { EventTemplateProps } from '@/editor/lib/template-types'
import type { EventTemplateId } from './template-ids'
import type { EventSectionContent, EventSectionVisibility } from './content-types'
import {
  createEventSlice,
  defaultEventContent,
  defaultEventVisibility,
} from './store-slice'
import { useContentStore } from '@/editor/lib/store/content'
import { EventTemplateShell } from './event-template-shell'
import { EventGalleryCover } from './templates/sections/event-gallery-cover'
import { EventFilmCover } from './templates/sections/event-film-cover'
import { EventPublishedPage } from './event-published-page'

// ─── Template dynamic imports ─────────────────────────────────────────────────

const LoadingTemplate = () => <div className="w-full h-full min-h-screen bg-transparent" />

const TemplateEventGallery = dynamic(
  () => import('./templates/template-event-gallery').then((m) => m.TemplateEventGallery),
  { loading: LoadingTemplate },
)

const TemplateEventFilm = dynamic(
  () => import('./templates/template-event-film').then((m) => m.TemplateEventFilm),
  { loading: LoadingTemplate },
)

const eventTemplateComponents: Partial<Record<EventTemplateId, React.ComponentType<EventTemplateProps>>> = {
  'event-gallery': TemplateEventGallery,
  'event-film':    TemplateEventFilm,
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
    getActiveEffectsCount: () => 0,
    resetEffects: () => {},
    hideMediaButton:   true,
    hidePreviewButton: true,
  },

  createSlice: createEventSlice,

  label: 'Event',
  defaultTemplateId: 'event-gallery',

  templates: [
    {
      id: 'event-gallery',
      nameKey: 'editor.event.templates.gallery.name',
      tagKeys: ['editor.event.tags.grid', 'editor.event.tags.minimal'],
      previewComponent: EventGalleryCover,
    },
    {
      id: 'event-film',
      nameKey: 'editor.event.templates.film.name',
      tagKeys: ['editor.event.tags.film', 'editor.event.tags.warm'],
      previewComponent: EventFilmCover,
    },
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
      TemplateEventGallery

    return <EventTemplateShell Design={Design} />
  },

  extractContent: (store) => ({
    sectionVisibility: store.eventSectionVisibility,
    sectionContent:    store.eventSectionContent,
    // eventPhotos are NOT persisted — they live in Firestore subcollection
    imageContent:      null,
  }),

  extractPreviewMeta: (store) => ({
    heroThumbUrl: store.eventPhotos[0]
      ? `https://firebasestorage.googleapis.com/v0/b/${process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET ?? ''}/o/${encodeURIComponent(store.eventPhotos[0].storageRef)}?alt=media`
      : undefined,
  }),

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

  renderPublished: ({ projectId, templateId, theme }) => (
    <EventPublishedPage
      projectId={projectId ?? ''}
      templateId={templateId ?? 'event-gallery'}
      themeBackground={theme?.background}
    />
  ),

  visibilitySelector: (s) => s.eventSectionVisibility,
  toggleSelector:     (s) => s.toggleEventSection,
}
