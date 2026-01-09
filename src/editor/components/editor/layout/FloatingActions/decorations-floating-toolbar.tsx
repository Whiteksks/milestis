"use client"

import { useCallback, useMemo, useState } from "react"

import type { DecorationElement as LegacyDecorationElement } from "@/editor/lib/types"
import { useThemeSelector, useUiSelector } from "@/editor/lib/store"

import type { DecorationElement, DecorationUpdatePayload } from "../decorationEdit/decorationTypes"
import { DecorationToolbar } from "./decoration-toolbar"
import { loadImageAspectRatio } from "../decorationEdit/utils"

export function DecorationsFloatingToolbar({
  decorations,
  scrollContainerRef,
}: {
  decorations: LegacyDecorationElement[]
  scrollContainerRef: React.RefObject<HTMLDivElement | null>
}) {
  const { selectedDecorationId, setSelectedDecorationId } = useUiSelector((state) => ({
    selectedDecorationId: state.selectedDecorationId,
    setSelectedDecorationId: state.setSelectedDecorationId,
  }))

  const { customDecorations, updateDecoration, removeDecoration } = useThemeSelector((state) => ({
    customDecorations: state.customDecorations,
    updateDecoration: state.updateDecoration,
    removeDecoration: state.removeDecoration,
  }))

  const editableIdSet = useMemo(() => new Set(customDecorations.map((d) => d.id)), [customDecorations])

  const toolbarDecorations: DecorationElement[] = useMemo(
    () =>
      decorations.map((d, index) => ({
        id: d.id ?? `decoration-${index}`,
        image: d.image,
        position: d.position,
        size: (d.size as DecorationElement["size"]) ?? undefined,
        scale: d.scale,
        opacity: d.opacity,
        zIndex: d.zIndex,
        responsiveScale: d.responsiveScale,
        transform: d.transform,
        aspectRatio: d.aspectRatio,
        name: d.name,
      })),
    [decorations],
  )

  const selectedId = selectedDecorationId && editableIdSet.has(selectedDecorationId) ? selectedDecorationId : null

  const [preferredDecorationId, setPreferredDecorationId] = useState<string | null>(() => {
    return selectedId ?? toolbarDecorations[0]?.id ?? null
  })

  const activeDecorationId = useMemo(() => {
    if (selectedId) return selectedId
    if (!toolbarDecorations.length) return null
    if (preferredDecorationId && toolbarDecorations.some((d) => d.id === preferredDecorationId)) return preferredDecorationId
    return toolbarDecorations[0]!.id
  }, [preferredDecorationId, selectedId, toolbarDecorations])

  const selectedDecoration = useMemo(
    () => toolbarDecorations.find((d) => d.id === selectedId),
    [selectedId, toolbarDecorations],
  )

  const handleUpdate = useCallback(
    (id: string, updates: DecorationUpdatePayload) => {
      if (!editableIdSet.has(id)) return
      updateDecoration(id, updates as never)
    },
    [editableIdSet, updateDecoration],
  )

  const handleRemove = useCallback(
    (id: string) => {
      if (!editableIdSet.has(id)) return
      removeDecoration(id)
    },
    [editableIdSet, removeDecoration],
  )

  const handleImageReplace = useCallback(
    async (file: File) => {
      if (!selectedId) return
      const url = URL.createObjectURL(file)
      const aspectRatio = await loadImageAspectRatio(url)
      handleUpdate(selectedId, { image: url, aspectRatio })
    },
    [handleUpdate, selectedId],
  )

  const handleLocate = useCallback(() => {
    if (!selectedDecoration) return

    const scroller = scrollContainerRef.current
    const contentRoot = scroller?.querySelector<HTMLElement>('[data-canvas-content-root="true"]')

    if (!scroller || !contentRoot) return

    const topValue = selectedDecoration.position?.top || "0%"
    const topPercent = parseFloat(topValue.replace("%", ""))
    if (Number.isNaN(topPercent)) return

    const contentHeight = contentRoot.scrollHeight
    const targetScrollY = (contentHeight * topPercent) / 100
    const viewportHeight = scroller.clientHeight
    const centeredScrollY = targetScrollY - viewportHeight / 2

    scroller.scrollTo({ top: Math.max(0, centeredScrollY), behavior: "smooth" })
  }, [scrollContainerRef, selectedDecoration])

  if (!toolbarDecorations.length) return null

  return (
    <DecorationToolbar
      decorations={toolbarDecorations}
      activeDecorationId={activeDecorationId}
      onActiveDecorationChange={(id) => setPreferredDecorationId(id)}
      decoration={selectedDecoration}
      onUpdate={selectedDecoration ? (updates) => handleUpdate(selectedDecoration.id, updates) : undefined}
      onDelete={selectedDecoration ? () => handleRemove(selectedDecoration.id) : undefined}
      onImageReplace={selectedDecoration ? handleImageReplace : undefined}
      onCloseSettings={() => setSelectedDecorationId(null)}
      onOpenSettings={() => activeDecorationId && setSelectedDecorationId(activeDecorationId)}
      onSelectDecoration={(id) => setSelectedDecorationId(id)}
      onLocate={selectedDecoration ? handleLocate : undefined}
    />
  )
}
