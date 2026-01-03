import { create } from 'zustand'
import type { DeviceView, EditorMode, DecorationsConfig } from './types'

export type DesignModalSection = 'templates' | 'themes' | 'decorations'

export interface UiStore {
  deviceView: DeviceView
  editorMode: EditorMode
  isMediaLibraryOpen: boolean
  isMediaPickerOpen: boolean
  isSidebarCollapsed: boolean

  isDesignModalOpen: boolean
  designModalSection: DesignModalSection

  previewDecorations?: DecorationsConfig | null
  selectedDecorationId: string | null

  setDeviceView: (view: DeviceView) => void
  setEditorMode: (mode: EditorMode) => void
  toggleMediaLibrary: () => void
  toggleMediaPicker: () => void
  toggleSidebar: () => void

  openDesignModal: (section: DesignModalSection) => void
  closeDesignModal: () => void
  setDesignModalSection: (section: DesignModalSection) => void

  setPreviewDecorations: (d?: DecorationsConfig | null) => void
  clearPreviewDecorations: () => void
  setSelectedDecorationId: (id: string | null) => void
}

export const useUiStore = create<UiStore>((set) => ({
  deviceView: 'desktop',
  editorMode: 'portfolio',
  isMediaLibraryOpen: false,
  isMediaPickerOpen: false,
  isSidebarCollapsed: false,

  isDesignModalOpen: false,
  designModalSection: 'templates',

  previewDecorations: null,
  selectedDecorationId: null,

  setDeviceView: (view) => set({ deviceView: view }),

  setEditorMode: (mode) => set({ editorMode: mode }),

  toggleMediaLibrary: () =>
    set((state) => ({ isMediaLibraryOpen: !state.isMediaLibraryOpen })),

  toggleMediaPicker: () =>
    set((state) => ({ isMediaPickerOpen: !state.isMediaPickerOpen })),

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
}))
