import type { StateCreator } from 'zustand'
import {
  appendPhotobookRepeatingImage,
  createEmptyPhotobookImageContent,
  removePhotobookRepeatingImage,
  replacePhotobookRepeatingImage,
  setPhotobookSingleImage,
  type PhotobookImageContent,
} from '@/editor/modes/photobook/image/content'
import type {
  PhotobookManagedImage,
  PhotobookRepeatingImageSectionId,
  PhotobookSingleImageSectionId,
} from '@/editor/modes/photobook/image/types'
import type { PhotobookSectionContent, PhotobookSectionVisibility } from './content-types'
// type-only circular import — erased at runtime, safe in TypeScript
import type { ContentStore } from '@/editor/lib/store/content'
import { useAiBriefStore } from '@/editor/lib/store/ai-brief'

// ─── Default values ────────────────────────────────────────────────────────

export const defaultPhotobookVisibility: PhotobookSectionVisibility = {
  showCover: true,
  showIntroduction: true,
  showStory: true,
  showGallery: true,
  showHighlight: true,
  showEnding: true,
}

export const defaultPhotobookContent: PhotobookSectionContent = {
  cover: {
    title: 'Emily & James',
    subtitle: 'The Wedding Album',
    date: 'August 12, 2026',
    location: 'London',
    tagline: 'The story of a single day that changed everything',
  },
  introduction: {
    label: 'Introduction',
    title: 'Our Journey Begins',
    quote: 'Sometimes, a single day can encompass an entire lifetime.',
    dedication: 'Dedicated to our parents and friends who stood by our side.',
  },
  story: {
    label: 'Story',
    title: 'The Day Unfolds',
    date: 'August 12, 2026',
    location: 'London',
    moments: [],
  },
  gallery: {
    label: 'Gallery',
    title: 'Curated Collection',
    description: 'A selection of candid moments we cherish and revisit time and again.',
    photos: [],
  },
  highlight: {
    label: 'Highlight',
    title: 'The Defining Moment',
    description: 'Images that became the undeniable symbols of this significant day.',
    quote: 'In this very moment, time seemed to stand still.',
    videoUrl: '',
  },
  ending: {
    title: 'The End',
    text: 'Thank you for reliving this day with us through these pages.',
    date: '2026',
    signature: 'With love, Emily and James',
  },
}

export const defaultPhotobookImageContent: PhotobookImageContent = createEmptyPhotobookImageContent()

// ─── Slice interface ───────────────────────────────────────────────────────

export interface PhotobookSlice {
  photobookSectionContent: PhotobookSectionContent
  photobookSectionVisibility: PhotobookSectionVisibility
  photobookImageContent: PhotobookImageContent

  /** `source` defaults to 'user' so every existing manual-edit call site is unaffected — the AI
   *  pipeline's apply layer passes 'ai' explicitly, so ai-brief.ts can tell the two apart without
   *  every UI call site needing to know about it. */
  updatePhotobookSection: <K extends keyof PhotobookSectionContent>(
    section: K,
    updates: Partial<PhotobookSectionContent[K]>,
    source?: 'user' | 'ai',
  ) => void
  setPhotobookImageContent: (content: PhotobookImageContent) => void
  setPhotobookSingleImage: (section: PhotobookSingleImageSectionId, image?: PhotobookManagedImage) => void
  appendPhotobookRepeatingImage: (section: PhotobookRepeatingImageSectionId, image: PhotobookManagedImage) => void
  replacePhotobookRepeatingImage: (
    section: PhotobookRepeatingImageSectionId,
    imageId: string,
    image: PhotobookManagedImage,
  ) => void
  removePhotobookRepeatingImage: (section: PhotobookRepeatingImageSectionId, imageId: string) => void
  /** Single source of truth for gallery photos: writes sectionContent.gallery.photos and
   *  photobookImageContent.gallery together in one call, keyed by each image's own id —
   *  the two arrays can never drift apart because there is only one place that sets either. */
  setPhotobookGalleryPhotos: (entries: Array<{ image: PhotobookManagedImage; caption?: string }>) => void
  /** Same guarantee as setPhotobookGalleryPhotos, for story moments. */
  setPhotobookStoryMoments: (
    entries: Array<{ image: PhotobookManagedImage; label?: string; caption?: string; description?: string }>,
  ) => void
  setPhotobookSectionVisibility: (updates: Partial<PhotobookSectionVisibility>) => void
  togglePhotobookSection: (section: keyof PhotobookSectionVisibility) => void
}

// ─── Slice creator ─────────────────────────────────────────────────────────

export const createPhotobookSlice: StateCreator<ContentStore, [], [], PhotobookSlice> = (set) => ({
  photobookSectionContent: defaultPhotobookContent,
  photobookSectionVisibility: defaultPhotobookVisibility,
  photobookImageContent: defaultPhotobookImageContent,

  updatePhotobookSection: (section, updates, source = 'user') => {
    if (source === 'user') useAiBriefStore.getState().markManuallyEdited(section)
    set((state) => ({
      photobookSectionContent: {
        ...state.photobookSectionContent,
        [section]: { ...state.photobookSectionContent[section], ...updates },
      },
    }))
  },

  setPhotobookImageContent: (content) =>
    set(() => ({
      photobookImageContent: content,
    })),

  setPhotobookSingleImage: (section, image) =>
    set((state) => ({
      photobookImageContent: setPhotobookSingleImage(state.photobookImageContent, section, image),
    })),

  appendPhotobookRepeatingImage: (section, image) =>
    set((state) => ({
      photobookImageContent: appendPhotobookRepeatingImage(state.photobookImageContent, section, image),
    })),

  replacePhotobookRepeatingImage: (section, imageId, image) =>
    set((state) => ({
      photobookImageContent: replacePhotobookRepeatingImage(state.photobookImageContent, section, imageId, image),
    })),

  removePhotobookRepeatingImage: (section, imageId) =>
    set((state) => ({
      photobookImageContent: removePhotobookRepeatingImage(state.photobookImageContent, section, imageId),
    })),

  setPhotobookGalleryPhotos: (entries) =>
    set((state) => ({
      photobookSectionContent: {
        ...state.photobookSectionContent,
        gallery: {
          ...state.photobookSectionContent.gallery,
          photos: entries.map(({ image, caption }) => ({ id: image.id, caption })),
        },
      },
      photobookImageContent: {
        ...state.photobookImageContent,
        gallery: entries.map((e) => e.image),
      },
    })),

  setPhotobookStoryMoments: (entries) =>
    set((state) => ({
      photobookSectionContent: {
        ...state.photobookSectionContent,
        story: {
          ...state.photobookSectionContent.story,
          moments: entries.map(({ image, label, caption, description }) => ({ id: image.id, label, caption, description })),
        },
      },
      photobookImageContent: {
        ...state.photobookImageContent,
        story: entries.map((e) => e.image),
      },
    })),

  setPhotobookSectionVisibility: (updates) =>
    set((state) => ({
      photobookSectionVisibility: {
        ...state.photobookSectionVisibility,
        ...updates,
      },
    })),

  togglePhotobookSection: (section) =>
    set((state) => ({
      photobookSectionVisibility: {
        ...state.photobookSectionVisibility,
        [section]: !state.photobookSectionVisibility[section],
      },
    })),
})
