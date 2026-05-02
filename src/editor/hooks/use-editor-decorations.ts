"use client"

import { useUiStore } from "@/editor/lib/store-ui"
import { useThemeStore } from "@/editor/lib/store-theme"
import type { DecorationElement, DecorationUpdatePayload } from "@/editor/lib/types"

/**
 * Shared logic for all editor components that display and mutate decorations.
 *
 * Accepts raw decorations from a theme preset (id may be absent) and:
 * - guarantees every item has a stable id (`decoration-{index}` fallback)
 * - derives which decorations are user-editable (in customDecorations store)
 * - exposes update / remove / select handlers with editability guards
 */
export function useEditorDecorations(rawDecorations: DecorationElement[]) {
  // Use individual selectors for actions — they are stable references and don't need useShallow
  const selectedDecorationId = useUiStore((s) => s.selectedDecorationId)
  const setSelectedDecorationId = useUiStore((s) => s.setSelectedDecorationId)

  const customDecorations = useThemeStore((s) => s.customDecorations)
  const updateDecoration = useThemeStore((s) => s.updateDecoration)
  const removeDecoration = useThemeStore((s) => s.removeDecoration)

  /** Set of ids that belong to user-added (editable) decorations */
  const editableIdSet = new Set(customDecorations.map((d) => d.id))

  /** Raw decorations normalised so every element has a definite id. */
  const normalizedDecorations = rawDecorations.map((d, i) => ({ ...d, id: d.id ?? `decoration-${i}` }))

  /**
   * The currently selected decoration id, but only when it belongs to the
   * editable set.  Read-only (theme-preset) decorations cannot be selected.
   */
  const selectedId =
    selectedDecorationId && editableIdSet.has(selectedDecorationId)
      ? selectedDecorationId
      : null

  const handleUpdate = (id: string, updates: DecorationUpdatePayload) => {
    if (!editableIdSet.has(id)) return
    updateDecoration(id, updates as never)
  }

  const handleRemove = (id: string) => {
    if (!editableIdSet.has(id)) return
    removeDecoration(id)
  }

  const handleSelect = (id: string | null) => {
    setSelectedDecorationId(id)
  }

  return {
    normalizedDecorations,
    selectedId,
    editableIdSet,
    handleUpdate,
    handleRemove,
    handleSelect,
    setSelectedDecorationId,
  }
}
