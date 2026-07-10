import type { StateCreator } from 'zustand'
import type { ContentStore } from '@/editor/lib/store/content'
import type {
  EventGuestPhoto,
  EventSectionContent,
  EventSectionVisibility,
} from './content-types'

// ─── Defaults ─────────────────────────────────────────────────────────────────

export const defaultEventVisibility: EventSectionVisibility = {
  showGallery: true,
}

export const defaultEventContent: EventSectionContent = {}

// ─── Slice interface ───────────────────────────────────────────────────────────

export interface EventSlice {
  // ── Persisted (saved to Firestore as project content) ──
  eventSectionContent:    EventSectionContent
  eventSectionVisibility: EventSectionVisibility

  // ── Live (populated by Firestore onSnapshot in the template shell) ──
  // NOT saved to Firestore — always loaded fresh from the eventPhotos subcollection.
  eventPhotos: EventGuestPhoto[]

  // ── Actions ──
  toggleEventSection: (key: keyof EventSectionVisibility) => void
  setEventPhotos:     (photos: EventGuestPhoto[]) => void
}

// ─── Slice creator ─────────────────────────────────────────────────────────────

export const createEventSlice: StateCreator<ContentStore, [], [], EventSlice> = (set) => ({
  eventSectionContent:    defaultEventContent,
  eventSectionVisibility: defaultEventVisibility,
  eventPhotos:            [],

  toggleEventSection: (key) =>
    set((s) => ({
      eventSectionVisibility: {
        ...s.eventSectionVisibility,
        [key]: !s.eventSectionVisibility[key],
      },
    })),

  setEventPhotos: (photos) => set(() => ({ eventPhotos: photos })),
})
