import { useUiStore, type UiStore } from './store-ui'
import { useContentStore, type ContentStore } from './store-content'
import { useThemeStore, type ThemeStore } from './store-theme'
import { useShallow } from 'zustand/react/shallow'

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
// Primitive scalars — direct store subscriptions are more efficient than useShallow
export const useDeviceView = () => useUiStore((s) => s.deviceView)
export const useEditorMode = () => useUiStore((s) => s.editorMode)

export const useSectionVisibility = () =>
  useContentSelector((state) => state.sectionVisibility)

export const useSectionContent = () =>
  useContentSelector((state) => state.sectionContent)

export const useThemeBasics = () =>
  useThemeSelector((state) => ({
    currentTheme: state.currentTheme,
    frameStyle: state.frameStyle,
  }))
