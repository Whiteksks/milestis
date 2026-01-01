'use client'

import { useContentSelector, useUiSelector } from '@/editor/lib/store'
import { MODE_REGISTRY } from '@/editor/lib/mode-registry'
import { useCallback, useMemo } from 'react'

export function useModeSections() {
  const editorMode = useUiSelector((state) => state.editorMode)
  const {
    sectionVisibility,
    toggleSection: togglePortfolio,
    photobookSectionVisibility,
    togglePhotobookSection: togglePhotobook,
  } = useContentSelector((state) => ({
    sectionVisibility: state.sectionVisibility,
    toggleSection: state.toggleSection,
    photobookSectionVisibility: state.photobookSectionVisibility,
    togglePhotobookSection: state.togglePhotobookSection,
  }))

  const modeEntry = useMemo(() => MODE_REGISTRY[editorMode], [editorMode])

  // Map sections with their visibility state
  const sections = useMemo(
    () =>
      modeEntry.sections.map((section) => ({
        ...section,
        visible: modeEntry.getSectionVisible({
          section,
          portfolioVisibility: sectionVisibility,
          photobookVisibility: photobookSectionVisibility,
        }),
      })),
    [modeEntry, sectionVisibility, photobookSectionVisibility],
  )

  // Unified toggle function
  const toggleVisibility = useCallback((key: string) => {
    modeEntry.toggleSection({
      toggleKey: key,
      portfolioVisibility: sectionVisibility,
      photobookVisibility: photobookSectionVisibility,
      togglePortfolio,
      togglePhotobook,
    })
  }, [modeEntry, sectionVisibility, photobookSectionVisibility, togglePortfolio, togglePhotobook])

  return {
    editorMode,
    sections,
    toggleVisibility,
    defaultActiveSectionId: modeEntry.defaultActiveSectionId,
    getSettingsComponent: modeEntry.getSettingsComponent
  }
}
