'use client'

import { useContentStore, useUiStore } from '@/editor/lib/store'
import { MODE_REGISTRY } from '@/editor/lib/mode-registry'
import { useCallback } from 'react'

export function useModeSections() {
  const { editorMode } = useUiStore()
  const { 
    sectionVisibility, 
    toggleSection: togglePortfolio,
    photobookSectionVisibility,
    togglePhotobookSection: togglePhotobook
  } = useContentStore()

  const modeEntry = MODE_REGISTRY[editorMode]

  // Map sections with their visibility state
  const sections = modeEntry.sections.map((section) => ({
    ...section,
    visible: modeEntry.getSectionVisible({
      section,
      portfolioVisibility: sectionVisibility,
      photobookVisibility: photobookSectionVisibility,
    }),
  }))

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
