"use client"

import { useCallback, useMemo, useState } from "react"

import type { DecorationElement } from "@/editor/lib/types"
import { useUiStore } from "@/editor/lib/store-ui"
import { useEditorDecorations } from "@/editor/hooks/use-editor-decorations"
import { DecorationToolbar } from "./decoration-toolbar"
import { loadImageAspectRatio } from "../decorationEdit/utils"

export function DecorationsFloatingToolbar({
  decorations,
  scrollContainerRef,
}: {
  decorations: DecorationElement[]
  scrollContainerRef: React.RefObject<HTMLDivElement | null>
}) {
  const setSelectedDecorationId = useUiStore((s) => s.setSelectedDecorationId)
  const { normalizedDecorations, selectedId, handleUpdate, handleRemove } =
    useEditorDecorations(decorations)

  const [preferredDecorationId, setPreferredDecorationId] = useState<string | null>(() => {
    return selectedId ?? normalizedDecorations[0]?.id ?? null
  })

  const activeDecorationId = useMemo(() => {
    if (selectedId) return selectedId
    if (!normalizedDecorations.length) return null
    if (preferredDecorationId && normalizedDecorations.some((d) => d.id === preferredDecorationId)) return preferredDecorationId
    return normalizedDecorations[0]!.id
  }, [preferredDecorationId, selectedId, normalizedDecorations])

  const selectedDecoration = useMemo(
    () => normalizedDecorations.find((d) => d.id === selectedId),
    [selectedId, normalizedDecorations],
  )

  const handleImageSelect = useCallback(
    async (url: string) => {
      if (!selectedId) return
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

  if (!normalizedDecorations.length) return null

  return (
    <DecorationToolbar
      decorations={normalizedDecorations}
      activeDecorationId={activeDecorationId}
      onActiveDecorationChange={(id) => setPreferredDecorationId(id)}
      decoration={selectedDecoration}
      onUpdate={selectedDecoration ? (updates) => handleUpdate(selectedDecoration.id, updates) : undefined}
      onDelete={selectedDecoration ? () => handleRemove(selectedDecoration.id) : undefined}
      onImageSelect={selectedDecoration ? handleImageSelect : undefined}
      onCloseSettings={() => setSelectedDecorationId(null)}
      onOpenSettings={() => activeDecorationId && setSelectedDecorationId(activeDecorationId)}
      onSelectDecoration={(id) => setSelectedDecorationId(id)}
      onLocate={selectedDecoration ? handleLocate : undefined}
    />
  )
}
