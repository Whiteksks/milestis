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
    title: 'Elena Vance',
    links: [
      { label: 'Home', href: '#hero' },
      { label: 'About', href: '#bio' },
      { label: 'Works', href: '#work' },
      { label: 'Contact', href: '#contact' },
    ],
  },
  hero: {
    title: 'Visualizing concepts through intentional design',
    subtitle: 'Visual Artist & Creator',
    description:
      'Crafting minimalist, impactful visuals that bridge the gap between creative vision and meaningful reality. Focused on clarity, aesthetics, and timeless form.',
    image: '',
    aspectRatio: 'portrait',
    frameStyle: 'soft',
  },
  bio: {
    title: 'Focusing on the essence of craft',
    subtitle: 'About Me',
    description:
      'Based in Europe, I specialize in creating cohesive visual narratives for brands and individuals. My approach is rooted in observation and refinement — balancing clean aesthetics with emotional depth.\n\nWhether it’s a digital interface, a photographic series, or a brand identity, I prioritize work that feels honest, intentional, and lasting.',
    image: '',
    aspectRatio: 'portrait',
    frameStyle: 'soft',
    achievements: [
      'Featured in leading international creative showcases',
      'Collaborated with diverse clients across 10+ countries',
      'Expertise in composition, color theory, and visual storytelling',
    ],
  },
  featuredWork: {
    title: 'Selected works',
    subtitle: 'Portfolio',
    projects: [],
  },
  video: {
    title: 'Aesthetics in motion',
    subtitle: 'Showreel',
    description: 'A brief exploration of movement, process, and visual rhythm.',
    videoUrl: '',
  },
  contact: {
    title: "Let's bring your idea to life",
    subtitle: 'Get in Touch',
    description:
      'I am always open to new collaborations and creative challenges. Share your vision, and I’ll get back to you within 48 hours.',
    email: 'hello@elenavance.com',
  },
  footer: {
    copyright: 'Elena Vance. All rights reserved.',
    socialLinks: [],
  },
}
// ─── Slice interface ───────────────────────────────────────────────────────

export interface PortfolioSlice {
  sectionVisibility: SectionVisibility
  sectionContent: SectionContent
  mediaLibrary: MediaImage[]

  toggleSection: (section: keyof SectionVisibility) => void
  updateSectionContent: <K extends keyof SectionContent>(
    section: K,
    content: Partial<SectionContent[K]>,
  ) => void
  addMediaImage: (image: MediaImage) => void
  removeMediaImage: (id: string) => void
}

// ─── Slice creator ─────────────────────────────────────────────────────────

export const createPortfolioSlice: StateCreator<ContentStore, [], [], PortfolioSlice> = (set) => ({
  sectionVisibility: defaultPortfolioVisibility,
  sectionContent: defaultPortfolioContent,
  mediaLibrary: [],

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
})
