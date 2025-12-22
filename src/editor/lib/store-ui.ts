import { create } from 'zustand'
import type { DeviceView, EditorMode, DecorationsConfig } from './types'

export interface UiStore {
  deviceView: DeviceView
  editorMode: EditorMode
  isTemplateModalOpen: boolean
  isThemeModalOpen: boolean
  isMediaLibraryOpen: boolean
  isMediaPickerOpen: boolean
  isSidebarCollapsed: boolean
  isDecorationsModalOpen: boolean
  previewDecorations?: DecorationsConfig | null

  setDeviceView: (view: DeviceView) => void
  setEditorMode: (mode: EditorMode) => void
  toggleTemplateModal: () => void
  toggleThemeModal: () => void
  toggleMediaLibrary: () => void
  toggleMediaPicker: () => void
  toggleSidebar: () => void
  toggleDecorationsModal: () => void
  setPreviewDecorations: (d?: DecorationsConfig | null) => void
  clearPreviewDecorations: () => void
}

export const useUiStore = create<UiStore>((set) => ({
  deviceView: 'desktop',
  editorMode: 'portfolio',
  isTemplateModalOpen: false,
  isThemeModalOpen: false,
  isMediaLibraryOpen: false,
  isMediaPickerOpen: false,
  isSidebarCollapsed: false,
  isDecorationsModalOpen: false,
  previewDecorations: null,

  setDeviceView: (view) => set({ deviceView: view }),

  setEditorMode: (mode) => set({ editorMode: mode }),

  toggleTemplateModal: () =>
    set((state) => ({ isTemplateModalOpen: !state.isTemplateModalOpen })),

  toggleThemeModal: () =>
    set((state) => ({ isThemeModalOpen: !state.isThemeModalOpen })),

  toggleMediaLibrary: () =>
    set((state) => ({ isMediaLibraryOpen: !state.isMediaLibraryOpen })),

  toggleMediaPicker: () =>
    set((state) => ({ isMediaPickerOpen: !state.isMediaPickerOpen })),

  toggleSidebar: () =>
    set((state) => ({ isSidebarCollapsed: !state.isSidebarCollapsed })),

  toggleDecorationsModal: () =>
    set((state) => ({ isDecorationsModalOpen: !state.isDecorationsModalOpen })),

  setPreviewDecorations: (d) => set(() => ({ previewDecorations: d ?? null })),

  clearPreviewDecorations: () => set(() => ({ previewDecorations: null })),
}))
