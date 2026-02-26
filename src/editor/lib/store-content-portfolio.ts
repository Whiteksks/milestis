import type { StateCreator } from 'zustand'
import type { MediaImage, SectionContent, SectionVisibility } from './types'
// type-only circular import — erased at runtime, safe in TypeScript
import type { ContentStore } from './store-content'

// ─── Default values ────────────────────────────────────────────────────────

export const defaultPortfolioVisibility: SectionVisibility = {
  showHeader: true,
  showHero: true,
  showBio: true,
  showFeaturedWork: true,
  showVideo: true,
  showContact: true,
  showFooter: true,
}

export const defaultPortfolioContent: SectionContent = {
  header: {
    title: 'Amelia & Noah',
    links: [
      { label: 'Story', href: '#hero' },
      { label: 'About', href: '#bio' },
      { label: 'Gallery', href: '#work' },
      { label: 'Contact', href: '#contact' },
    ],
  },
  hero: {
    title: 'Timeless stories, captured in every frame',
    subtitle: 'Wedding & Lifestyle Photographer',
    description:
      'Creating elegant, heartfelt imagery that feels like your favorite memory – honest, luminous, and entirely you.',
  },
  bio: {
    title: 'A storyteller with a camera',
    subtitle: 'About Me',
    description:
      'Based in Copenhagen, I document modern love stories with a soft, editorial eye. My approach is calm, observant, and quietly intentional – blending candid moments with thoughtful direction so you can simply be present.\n\nFrom the fleeting in‑between glances to the big, emotional vows, I focus on the details that feel most like you.',
    image: '',
    imageAspectRatio: 'portrait',
    imageFrameStyle: 'soft',
    achievements: [
      'Featured in Modern Wedding & White Magazine',
      'Over 120 weddings documented across Europe',
      'Known for calm direction and film‑inspired color',
    ],
  },
  featuredWork: {
    title: 'Selected stories',
    subtitle: 'Portfolio',
    projects: [],
  },
  video: {
    title: 'Super 8 wedding highlights',
    subtitle: 'Motion',
    description: 'A glimpse into how your day could feel in motion.',
    videoUrl: '',
  },
  contact: {
    title: "Let's begin your story",
    subtitle: 'Get in Touch',
    description:
      'Share a few details about your day and vision – I personally reply within 2 business days.',
    email: 'hello@example.com',
    phone: '+1 (555) 000-0000',
  },
  footer: {
    copyright: '© 2024 Amelia Hart Photography. All rights reserved.',
    socialLinks: [],
  },
}

// ─── Slice interface ───────────────────────────────────────────────────────

export interface PortfolioSlice {
  sectionVisibility: SectionVisibility
  sectionContent: SectionContent
  mediaLibrary: MediaImage[]
  galleryImages: string[]

  toggleSection: (section: keyof SectionVisibility) => void
  updateSectionContent: <K extends keyof SectionContent>(
    section: K,
    content: Partial<SectionContent[K]>,
  ) => void
  addMediaImage: (image: MediaImage) => void
  removeMediaImage: (id: string) => void
  setGalleryImages: (images: string[]) => void
  addGalleryImage: (url: string) => void
  removeGalleryImage: (index: number) => void
}

// ─── Slice creator ─────────────────────────────────────────────────────────

export const createPortfolioSlice: StateCreator<ContentStore, [], [], PortfolioSlice> = (set) => ({
  sectionVisibility: defaultPortfolioVisibility,
  sectionContent: defaultPortfolioContent,
  mediaLibrary: [],
  galleryImages: Array(6).fill('/placeholder.svg?height=500&width=700'),

  toggleSection: (section) =>
    set((state) => ({
      sectionVisibility: {
        ...state.sectionVisibility,
        [section]: !state.sectionVisibility[section],
      },
    })),

  updateSectionContent: (section, content) =>
    set((state) => ({
      sectionContent: {
        ...state.sectionContent,
        [section]: { ...state.sectionContent[section], ...content },
      },
    })),

  addMediaImage: (image) =>
    set((state) => ({ mediaLibrary: [...state.mediaLibrary, image] })),

  removeMediaImage: (id) =>
    set((state) => ({ mediaLibrary: state.mediaLibrary.filter((img) => img.id !== id) })),

  setGalleryImages: (images) => set({ galleryImages: images }),

  addGalleryImage: (url) =>
    set((state) => ({ galleryImages: [...state.galleryImages, url] })),

  removeGalleryImage: (index) =>
    set((state) => ({ galleryImages: state.galleryImages.filter((_, i) => i !== index) })),
})
