'use client'

import { useContentSelector, useUiSelector, useUiStore, useContentStore } from '@/editor/lib/store'
import { MODE_REGISTRY } from '@/editor/lib/mode-registry'
import { useCallback, useEffect, useMemo } from 'react'

export function useModeSections() {
  const { editorMode, activeSectionId } = useUiSelector((state) => ({
    editorMode: state.editorMode,
    activeSectionId: state.activeSectionId,
  }))
  const setActiveSectionId = useUiStore((s) => s.setActiveSectionId)

  const { sectionVisibility, photobookSectionVisibility } = useContentSelector((state) => ({
    sectionVisibility: state.sectionVisibility,
    photobookSectionVisibility: state.photobookSectionVisibility,
  }))
  const togglePortfolio = useContentStore((s) => s.toggleSection)
  const togglePhotobook = useContentStore((s) => s.togglePhotobookSection)

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
