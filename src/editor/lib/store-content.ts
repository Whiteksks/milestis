import { create } from 'zustand'
import type { MediaImage, SectionContent, SectionVisibility, PhotobookSectionContent, PhotobookSectionVisibility } from './types'
import { defaultSectionContent, defaultSectionVisibility, defaultPhotobookContent, defaultPhotobookVisibility } from './default-content'

export interface ContentStore {
  sectionVisibility: SectionVisibility
  sectionContent: SectionContent
  mediaLibrary: MediaImage[]
  galleryImages: string[]
  photobookSectionContent: PhotobookSectionContent
  photobookSectionVisibility: PhotobookSectionVisibility

  toggleSection: (section: keyof SectionVisibility) => void
  
  // Universal update function
  updateSectionContent: <K extends keyof SectionContent>(section: K, content: Partial<SectionContent[K]>) => void

  addMediaImage: (image: MediaImage) => void
  removeMediaImage: (id: string) => void
  setGalleryImages: (images: string[]) => void
  addGalleryImage: (url: string) => void
  removeGalleryImage: (index: number) => void
  
  // Improved type-safe update function
  updatePhotobookSection: <K extends keyof PhotobookSectionContent>(section: K, updates: Partial<PhotobookSectionContent[K]>) => void
  
  setPhotobookSectionVisibility: (updates: Partial<PhotobookSectionVisibility>) => void
  togglePhotobookSection: (section: keyof PhotobookSectionVisibility) => void
}

export const useContentStore = create<ContentStore>((set) => ({
  sectionVisibility: defaultSectionVisibility,
  mediaLibrary: [],
  galleryImages: Array(6).fill('/placeholder.svg?height=500&width=700'),
  sectionContent: defaultSectionContent,
  photobookSectionContent: defaultPhotobookContent,
  photobookSectionVisibility: defaultPhotobookVisibility,

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
    set((state) => ({
      mediaLibrary: [...state.mediaLibrary, image],
    })),

  removeMediaImage: (id) =>
    set((state) => ({
      mediaLibrary: state.mediaLibrary.filter((img) => img.id !== id),
    })),

  setGalleryImages: (images) => set({ galleryImages: images }),

  addGalleryImage: (url) =>
    set((state) => ({
      galleryImages: [...state.galleryImages, url],
    })),

  removeGalleryImage: (index) =>
    set((state) => ({
      galleryImages: state.galleryImages.filter((_, i) => i !== index),
    })),

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
}))
