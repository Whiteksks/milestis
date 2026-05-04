import { useUiStore, type UiStore } from './store-ui'
import { useContentStore, type ContentStore } from './store-content'
import { useThemeStore, type ThemeStore } from './store-theme'
import { useShallow } from 'zustand/react/shallow'
import {
  selectPortfolioRepeatingResolvedImage,
  selectPortfolioSingleResolvedImage,
} from '@/editor/image/portfolio/selectors'
import type {
  PortfolioRepeatingImageSectionId,
  PortfolioSingleImageSectionId,
} from '@/editor/image/portfolio/types'
import {
  selectPhotobookImageContent,
  selectPhotobookRepeatingResolvedImage,
  selectPhotobookSingleResolvedImage,
} from '@/editor/image/photobook/selectors'
import type {
  PhotobookRepeatingImageSectionId,
  PhotobookSingleImageSectionId,
} from '@/editor/image/photobook/types'

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

export const usePortfolioImageContent = () =>
  useContentSelector((state) => state.portfolioImageContent)

export const usePortfolioResolvedSingleImage = (sectionId: PortfolioSingleImageSectionId) =>
  useContentStore((state) => selectPortfolioSingleResolvedImage(state.portfolioImageContent, sectionId))

export const usePortfolioResolvedRepeatingImage = (
  sectionId: PortfolioRepeatingImageSectionId,
  imageId: string,
) => useContentStore((state) => selectPortfolioRepeatingResolvedImage(state.portfolioImageContent, imageId))

export const usePhotobookImageContent = () =>
  useContentSelector((state) => selectPhotobookImageContent(state))

export const usePhotobookResolvedSingleImage = (sectionId: PhotobookSingleImageSectionId) =>
  useContentStore((state) => selectPhotobookSingleResolvedImage(state.photobookImageContent, sectionId))

export const usePhotobookResolvedRepeatingImage = (
  sectionId: PhotobookRepeatingImageSectionId,
  imageId: string,
) => useContentStore((state) => selectPhotobookRepeatingResolvedImage(state.photobookImageContent, sectionId, imageId))

export const useThemeBasics = () =>
  useThemeSelector((state) => ({
    currentTheme: state.currentTheme,
  }))
