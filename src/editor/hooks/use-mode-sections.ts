'use client'

import { useContentSelector, useUiSelector } from '@/editor/lib/store'
import { MODE_REGISTRY } from '@/editor/lib/mode-registry'
import { useCallback, useEffect, useMemo } from 'react'

export function useModeSections() {
  const { editorMode, activeSectionId, setActiveSectionId } = useUiSelector((state) => ({
    editorMode: state.editorMode,
    activeSectionId: state.activeSectionId,
    setActiveSectionId: state.setActiveSectionId,
  }))
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

  const resolvedActiveSectionId = useMemo(() => {
    if (activeSectionId && sections.some((s) => s.id === activeSectionId)) return activeSectionId
    return modeEntry.defaultActiveSectionId
  }, [activeSectionId, modeEntry.defaultActiveSectionId, sections])

  useEffect(() => {
    if (resolvedActiveSectionId !== activeSectionId) {
      setActiveSectionId(resolvedActiveSectionId)
    }
  }, [activeSectionId, resolvedActiveSectionId, setActiveSectionId])

  return {
    editorMode,
    sections,
    toggleVisibility,
    defaultActiveSectionId: modeEntry.defaultActiveSectionId,
    getSettingsComponent: modeEntry.getSettingsComponent,
    activeSectionId,
    setActiveSectionId,
    resolvedActiveSectionId,
  }
}
