import type { StateCreator } from 'zustand'
import type { PhotobookSectionContent, PhotobookSectionVisibility } from './types'
// type-only circular import — erased at runtime, safe in TypeScript
import type { ContentStore } from './store-content'

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
    date: 'August 12, 2024',
    location: 'London',
    tagline: 'The story of a single day that changed everything',
    images: {
      id: 'cover-main',
      image: '/placeholder.jpg',
      caption: 'The defining shot of our day',
      imageSettings: [{ aspectRatio: 'square', frameStyle: 'none' }],
    },
  },
  introduction: {
    title: 'Our Journey Begins',
    quote: 'Sometimes, a single day can encompass an entire lifetime.',
    dedication: 'Dedicated to our parents and friends who stood by our side.',
    images: {
      id: 'intro-1',
      image: '/placeholder.jpg',
      caption: 'The morning before the most anticipated day.',
      imageSettings: [{ aspectRatio: 'square', frameStyle: 'none' }],
    },
  },
  story: {
    title: 'The Day Unfolds',
    date: 'August 12, 2024',
    location: 'London',
    paragraphs: [
      'The morning began with a quiet, calm anticipation, fueled by hot coffee and nervous excitement.',
      'Every sequence, from the preparation to the first dance, became an integral chapter of our shared narrative.',
    ],
    images: [
      {
        id: 'story-morning',
        label: 'Bridal Preparation',
        images: ['/placeholder.jpg'],
        caption: 'Moments of tender, anticipatory preparation.',
        imageSettings: [{ aspectRatio: 'square', frameStyle: 'none' }],
      },
      {
        id: 'story-ceremony',
        label: 'The Ceremony',
        images: ['/placeholder.jpg'],
        caption: 'The exact moment we exchanged our vows.',
        imageSettings: [{ aspectRatio: 'square', frameStyle: 'none' }],
      },
    ],
  },
  gallery: {
    title: 'Curated Collection',
    description: 'A selection of candid moments we cherish and revisit time and again.',
    images: [
      {
        id: 'gallery-1',
        image: '/placeholder.jpg',
        caption: 'Just us and the rhythm of the night.',
        imageSettings: [{ aspectRatio: 'square', frameStyle: 'none' }],
      },
    ],
  },
  highlight: {
    title: 'The Defining Moment',
    description: 'Images that became the undeniable symbols of this significant day.',
    quote: 'In this very moment, time seemed to stand still.',
    images: {
      id: 'highlight-main',
      image: '/placeholder.jpg',
      caption: 'Lost in the moment, surrounded by music.',
      imageSettings: [{ aspectRatio: 'square', frameStyle: 'none' }],
    },
    videoUrl: '',
  },
  ending: {
    text: 'Thank you for reliving this day with us through these pages.',
    date: '2024',
    signature: 'With love, Emily and James',
    images: {
      id: 'ending-detail',
      image: '/placeholder.jpg',
      caption: 'The rings that sealed our commitment.',
      imageSettings: [{ aspectRatio: 'square', frameStyle: 'none' }],
    },
  },
}

// ─── Slice interface ───────────────────────────────────────────────────────

export interface PhotobookSlice {
  photobookSectionContent: PhotobookSectionContent
  photobookSectionVisibility: PhotobookSectionVisibility

  updatePhotobookSection: <K extends keyof PhotobookSectionContent>(
    section: K,
    updates: Partial<PhotobookSectionContent[K]>,
  ) => void
  setPhotobookSectionVisibility: (updates: Partial<PhotobookSectionVisibility>) => void
  togglePhotobookSection: (section: keyof PhotobookSectionVisibility) => void
}

// ─── Slice creator ─────────────────────────────────────────────────────────

export const createPhotobookSlice: StateCreator<ContentStore, [], [], PhotobookSlice> = (set) => ({
  photobookSectionContent: defaultPhotobookContent,
  photobookSectionVisibility: defaultPhotobookVisibility,

  updatePhotobookSection: (section, updates) =>
    set((state) => ({
      photobookSectionContent: {
        ...state.photobookSectionContent,
        [section]: { ...state.photobookSectionContent[section], ...updates },
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
