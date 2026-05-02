'use client'

import { useContentSelector, useUiSelector, useUiStore, useContentStore } from '@/editor/lib/store'
import { MODE_REGISTRY } from '@/editor/lib/mode-registry'
import type { ContentStore } from '@/editor/lib/store-content'

export function useModeSections() {
  const { editorMode, activeSectionId } = useUiSelector((state) => ({
    editorMode: state.editorMode,
    activeSectionId: state.activeSectionId,
  }))
  const setActiveSectionId = useUiStore((s) => s.setActiveSectionId)

  const modeEntry = MODE_REGISTRY[editorMode]

  // Subscribe only to this mode's visibility slice — no cross-mode store subscriptions
  const visibility = useContentSelector(
    modeEntry.visibilitySelector as (s: ContentStore) => Record<string, boolean>,
  )
  // Stable action reference — no re-render on unrelated store changes
  const toggle = useContentStore(
    modeEntry.toggleSelector as (s: ContentStore) => (key: string) => void,
  )

  // Map sections with their visibility state
  const sections = modeEntry.sections.map((section) => ({
    ...section,
    visible: Boolean(visibility[section.toggleKey]),
  }))

  // Unified toggle
  const toggleVisibility = (key: string) => {
    toggle(key)
  }

  const resolvedActiveSectionId = (() => {
    if (activeSectionId && sections.some((s) => s.id === activeSectionId)) return activeSectionId
    return modeEntry.defaultActiveSectionId
  })()

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
