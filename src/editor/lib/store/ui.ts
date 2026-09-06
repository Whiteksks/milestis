import { create } from 'zustand'
import type { DeviceView, EditorMode, DecorationsConfig } from '../types'

export type DesignModalSection = 'templates' | 'themes' | 'backgrounds'

export type AiChatMessage = {
  role: 'user' | 'assistant'
  content: string
  photos?: string[]
  isError?: boolean
  /** Sections the AI just edited — rendered as "open this section" buttons under the message. */
  sectionsToOpen?: { id: string; name: string }[]
}

export interface UiStore {
  deviceView: DeviceView
  editorMode: EditorMode
  isMediaLibraryOpen: boolean
  isMediaPickerOpen: boolean
  mediaPickerOwnerId: string | null
  isSidebarCollapsed: boolean

  activeSectionId: string | null

  /** Bumped by requestFocusSection so pages can react even if the same section is requested twice. */
  focusSectionRequest: { sectionId: string; nonce: number } | null
  requestFocusSection: (sectionId: string) => void

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

  projectStatus: 'active' | 'archived' | 'deleted'
  setProjectStatus: (status: 'active' | 'archived' | 'deleted') => void

  publishedSlug: string | null
  publishedAccessToken: string | null
  setPublishedInfo: (slug: string, accessToken?: string) => void
  clearPublishedInfo: () => void

  isDirty: boolean
  markDirty: () => void
  markClean: () => void

  isModerationOpen: boolean
  setIsModerationOpen: (open: boolean) => void

  isPreviewOpen: boolean
  setIsPreviewOpen: (open: boolean) => void

  isAiChatOpen: boolean
  setIsAiChatOpen: (open: boolean) => void

  isHelpGuideOpen: boolean
  setIsHelpGuideOpen: (open: boolean) => void

  aiChatMessages: AiChatMessage[]
  aiChatInput: string
  aiChatIsLoading: boolean
  addAiChatMessage: (msg: AiChatMessage) => void
  setAiChatInput: (input: string) => void
  setAiChatIsLoading: (loading: boolean) => void
  clearAiChat: () => void
}

export const useUiStore = create<UiStore>((set) => ({
  deviceView: 'desktop',
  editorMode: 'portfolio',
  isMediaLibraryOpen: false,
  isMediaPickerOpen: false,
  mediaPickerOwnerId: null,
  isSidebarCollapsed: false,

  activeSectionId: null,
  focusSectionRequest: null,

  isDesignModalOpen: false,
  designModalSection: 'templates',

  previewDecorations: null,
  selectedDecorationId: null,

  projectId: null,
  projectName: null,
  isPublished: false,
  projectStatus: 'active',
  publishedSlug: null,
  publishedAccessToken: null,
  isDirty: false,
  isModerationOpen: false,
  isPreviewOpen: false,
  isAiChatOpen: false,
  isHelpGuideOpen: false,

  aiChatMessages: [],
  aiChatInput: '',
  aiChatIsLoading: false,

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

  // Forces the section panel open (uncollapsing the sidebar) and asks the page to switch its
  // desktop/mobile tab to "sections" — used by the AI chat's "open this section" button.
  requestFocusSection: (sectionId) =>
    set(() => ({
      activeSectionId: sectionId,
      isSidebarCollapsed: false,
      focusSectionRequest: { sectionId, nonce: Date.now() },
    })),

  setProjectId: (id) => set(() => ({ projectId: id })),
  setProjectName: (name) => set(() => ({ projectName: name })),
  setIsPublished: (v) => set(() => ({ isPublished: v })),
  setProjectStatus: (status) => set(() => ({ projectStatus: status })),
  setPublishedInfo: (slug, accessToken) => set(() => ({ publishedSlug: slug, publishedAccessToken: accessToken ?? null })),
  clearPublishedInfo: () => set(() => ({ publishedSlug: null, publishedAccessToken: null })),

  markDirty: () => set(() => ({ isDirty: true })),
  markClean: () => set(() => ({ isDirty: false })),

  setIsModerationOpen: (open) => set(() => ({ isModerationOpen: open })),
  setIsPreviewOpen: (open) => set(() => ({ isPreviewOpen: open })),
  setIsAiChatOpen: (open) => set(() => ({ isAiChatOpen: open })),
  setIsHelpGuideOpen: (open) => set(() => ({ isHelpGuideOpen: open })),

  addAiChatMessage: (msg) => set((s) => ({ aiChatMessages: [...s.aiChatMessages, msg] })),
  setAiChatInput: (input) => set(() => ({ aiChatInput: input })),
  setAiChatIsLoading: (loading) => set(() => ({ aiChatIsLoading: loading })),
  clearAiChat: () => set(() => ({ aiChatMessages: [], aiChatInput: '', aiChatIsLoading: false })),
}))
