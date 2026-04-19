"use client"

import { useMemo, useState } from "react"
import { useModeSections } from "@/editor/hooks/use-mode-sections"
import { useUiStore } from "@/editor/lib/store"
import { getSectionQuickActions } from "@/editor/components/editor/section-settings/quick-actions/section-quick-actions"

/**
 * Shared logic for the Sections quick-actions toolbar.
 * Used by both the desktop pill (SectionsToolbarPanel) and the mobile sheet.
 */
export function useSectionsToolbar() {
  const {
    editorMode,
    sections,
    toggleVisibility,
    resolvedActiveSectionId,
    setActiveSectionId,
  } = useModeSections()

  const isMediaPickerOpen = useUiStore((s) => s.isMediaPickerOpen)

  const [isSectionPopoverOpen, setIsSectionPopoverOpen] = useState(false)
  const [activeQuickActionId, setActiveQuickActionId] = useState<string | null>(null)

  const currentSection = useMemo(
    () => sections.find((s) => s.id === resolvedActiveSectionId),
    [resolvedActiveSectionId, sections],
  )

  const quickActions = useMemo(
    () => getSectionQuickActions(editorMode, resolvedActiveSectionId),
    [editorMode, resolvedActiveSectionId],
  )

  const isQuickActionOpen = (id: string) => activeQuickActionId === id

  return {
    sections,
    resolvedActiveSectionId,
    currentSection,
    quickActions,
    isSectionPopoverOpen,
    setIsSectionPopoverOpen,
    activeQuickActionId,
    setActiveQuickActionId,
    isQuickActionOpen,
    isMediaPickerOpen,
    toggleVisibility,
    setActiveSectionId,
  }
}
