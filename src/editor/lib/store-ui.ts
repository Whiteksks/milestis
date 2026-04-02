import { create } from 'zustand'
import type { DeviceView, EditorMode, DecorationsConfig } from './types'

export type DesignModalSection = 'templates' | 'themes' | 'backgrounds'

export interface UiStore {
  deviceView: DeviceView
  editorMode: EditorMode
  isMediaLibraryOpen: boolean
  isMediaPickerOpen: boolean
  mediaPickerOwnerId: string | null
  isSidebarCollapsed: boolean

  activeSectionId: string | null

  isDesignModalOpen: boolean
  designModalSection: DesignModalSection

  previewDecorations?: DecorationsConfig | null
  selectedDecorationId: string | null

  setDeviceView: (view: DeviceView) => void
  setEditorMode: (mode: EditorMode) => void
  setMediaLibraryOpen: (open: boolean) => void
  openMediaPicker: (ownerId: string) => void
  closeMediaPicker: () => void
  toggleMediaLibrary: () => void
  toggleSidebar: () => void

  openDesignModal: (section: DesignModalSection) => void
  closeDesignModal: () => void
  setDesignModalSection: (section: DesignModalSection) => void

  setPreviewDecorations: (d?: DecorationsConfig | null) => void
  clearPreviewDecorations: () => void
  setSelectedDecorationId: (id: string | null) => void

  setActiveSectionId: (id: string | null) => void

  projectId: string | null
  setProjectId: (id: string | null) => void

  projectName: string | null
  setProjectName: (name: string | null) => void

  isPublished: boolean
  setIsPublished: (v: boolean) => void

  isExported: boolean
  setIsExported: (v: boolean) => void

  publishedSlug: string | null
  publishedAccessToken: string | null
  setPublishedInfo: (slug: string, accessToken?: string) => void
  clearPublishedInfo: () => void

  isDirty: boolean
  markDirty: () => void
  markClean: () => void
}

export const useUiStore = create<UiStore>((set) => ({
  deviceView: 'desktop',
  editorMode: 'portfolio',
  isMediaLibraryOpen: false,
  isMediaPickerOpen: false,
  mediaPickerOwnerId: null,
  isSidebarCollapsed: false,

  activeSectionId: null,

  isDesignModalOpen: false,
  designModalSection: 'templates',

  previewDecorations: null,
  selectedDecorationId: null,

  projectId: null,
  projectName: null,
  isPublished: false,
  isExported: false,
  publishedSlug: null,
  publishedAccessToken: null,
  isDirty: false,

  setDeviceView: (view) => set({ deviceView: view }),

  setEditorMode: (mode) => set({ editorMode: mode }),

  setMediaLibraryOpen: (open) => set(() => ({ isMediaLibraryOpen: open })),

  openMediaPicker: (ownerId) =>
    set(() => ({
      isMediaPickerOpen: true,
      mediaPickerOwnerId: ownerId,
    })),

  closeMediaPicker: () => set(() => ({ isMediaPickerOpen: false, mediaPickerOwnerId: null })),

  toggleMediaLibrary: () =>
    set((state) => ({ isMediaLibraryOpen: !state.isMediaLibraryOpen })),

  toggleSidebar: () =>
    set((state) => ({ isSidebarCollapsed: !state.isSidebarCollapsed })),

  openDesignModal: (section) =>
    set(() => ({
      isDesignModalOpen: true,
      designModalSection: section,
    })),

  closeDesignModal: () => set(() => ({ isDesignModalOpen: false })),

  setDesignModalSection: (section) => set(() => ({ designModalSection: section })),

  setPreviewDecorations: (d) => set(() => ({ previewDecorations: d ?? null })),

  clearPreviewDecorations: () => set(() => ({ previewDecorations: null })),

  setSelectedDecorationId: (id) => set(() => ({ selectedDecorationId: id })),

  setActiveSectionId: (id) => set(() => ({ activeSectionId: id })),

  setProjectId: (id) => set(() => ({ projectId: id })),
  setProjectName: (name) => set(() => ({ projectName: name })),
  setIsPublished: (v) => set(() => ({ isPublished: v })),
  setIsExported: (v) => set(() => ({ isExported: v })),
  setPublishedInfo: (slug, accessToken) => set(() => ({ publishedSlug: slug, publishedAccessToken: accessToken ?? null })),
  clearPublishedInfo: () => set(() => ({ publishedSlug: null, publishedAccessToken: null })),

  markDirty: () => set(() => ({ isDirty: true })),
  markClean: () => set(() => ({ isDirty: false })),
}))
