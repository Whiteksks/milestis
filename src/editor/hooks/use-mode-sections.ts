'use client'

import { useContentSelector, useUiSelector, useUiStore, useContentStore } from '@/editor/lib/store'
import { MODE_REGISTRY } from '@/editor/lib/mode-registry'
import type { ContentStore } from '@/editor/lib/store-content'
import { useCallback, useMemo } from 'react'

export function useModeSections() {
  const { editorMode, activeSectionId } = useUiSelector((state) => ({
    editorMode: state.editorMode,
    activeSectionId: state.activeSectionId,
  }))
  const setActiveSectionId = useUiStore((s) => s.setActiveSectionId)

  const modeEntry = useMemo(() => MODE_REGISTRY[editorMode], [editorMode])

  // Subscribe only to this mode's visibility slice — no cross-mode store subscriptions
  const visibility = useContentSelector(
    modeEntry.visibilitySelector as (s: ContentStore) => Record<string, boolean>,
  )
  // Stable action reference — no re-render on unrelated store changes
  const toggle = useContentStore(
    modeEntry.toggleSelector as (s: ContentStore) => (key: string) => void,
  )

  // Map sections with their visibility state
  const sections = useMemo(
    () =>
      modeEntry.sections.map((section) => ({
        ...section,
        visible: Boolean(visibility[section.toggleKey]),
      })),
    [modeEntry, visibility],
  )

  // Unified toggle
  const toggleVisibility = useCallback((key: string) => {
    toggle(key)
  }, [toggle])

  const resolvedActiveSectionId = useMemo(() => {
    if (activeSectionId && sections.some((s) => s.id === activeSectionId)) return activeSectionId
    return modeEntry.defaultActiveSectionId
  }, [activeSectionId, modeEntry.defaultActiveSectionId, sections])

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
