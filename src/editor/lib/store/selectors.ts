import { useUiStore, type UiStore } from './ui'
import { useContentStore, type ContentStore } from './content'
import { useThemeStore, type ThemeStore } from './theme'
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
