import { useUiStore, type UiStore } from './store-ui'
import { useContentStore, type ContentStore } from './store-content'
import { useThemeStore, type ThemeStore } from './store-theme'
import { useShallow } from 'zustand/react/shallow'

// Generic typed selector helper
const createSelectorHook = <S,>() =>
  <T>(selector: (state: S) => T): T => {
    // This wrapper exists mainly for type inference and a single import point.
    throw new Error('createSelectorHook should be specialized per store')
  }

// UI selectors
export const useUiSelector = <T,>(selector: (state: UiStore) => T) =>
  useUiStore(useShallow(selector))

// Content selectors
export const useContentSelector = <T,>(
  selector: (state: ContentStore) => T,
) => useContentStore(useShallow(selector))

// Theme selectors
export const useThemeSelector = <T,>(selector: (state: ThemeStore) => T) =>
  useThemeStore(useShallow(selector))

// Convenience hooks for common slices
export const useDeviceView = () =>
  useUiSelector((state) => state.deviceView)

export const useEditorMode = () =>
  useUiSelector((state) => state.editorMode)

export const useSectionVisibility = () =>
  useContentSelector((state) => state.sectionVisibility)

export const useSectionContent = () =>
  useContentSelector((state) => state.sectionContent)

export const useThemeBasics = () =>
  useThemeSelector((state) => ({
    currentTheme: state.currentTheme,
    frameStyle: state.frameStyle,
  }))
