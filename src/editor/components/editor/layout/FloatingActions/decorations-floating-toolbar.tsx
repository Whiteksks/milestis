"use client"

import { useCallback, useMemo, useState } from "react"

import type { DecorationElement } from "@/editor/lib/types"
import { useUiStore } from "@/editor/lib/store-ui"
import { useThemeSelector, type ThemeCustomDecorations } from "@/editor/lib/store"
import { useEditorDecorations } from "@/editor/hooks/use-editor-decorations"
import { decorationAnimationOptions, type DecorationAnimation } from "@/editor/lib/decoration-animations"
import { DecorationToolbar } from "./decoration-toolbar"
import { loadImageAspectRatio } from "../decorationEdit/utils"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { LIMITS } from "@/editor/components/editor/section-settings/ui/panel-ui"

export function DecorationsFloatingToolbar({
  decorations,
  scrollContainerRef,
}: {
  decorations: DecorationElement[]
  scrollContainerRef: React.RefObject<HTMLDivElement | null>
}) {
  const setSelectedDecorationId = useUiStore((s) => s.setSelectedDecorationId)

  const { addDecoration, themeCustomizations, updateThemeCustomization } = useThemeSelector((s) => ({
    addDecoration: s.addDecoration,
    themeCustomizations: s.themeCustomizations,
    updateThemeCustomization: s.updateThemeCustomization,
  }))

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

  const handleAddDecoration = useCallback(() => {
    if (normalizedDecorations.length >= LIMITS.decorations) return
    const scroller = scrollContainerRef.current
    const contentRoot = scroller?.querySelector<HTMLElement>('[data-canvas-content-root="true"]')

    let top = '10%'
    let left = '10%'

    if (scroller && contentRoot && contentRoot.scrollHeight > 0) {
      const scrollerRect = scroller.getBoundingClientRect()
      const contentRect = contentRoot.getBoundingClientRect()
      if (contentRect.width > 0 && contentRect.height > 0) {
        const cx = scrollerRect.left + scroller.clientWidth / 2
        const cy = scrollerRect.top + scroller.clientHeight / 2
        const xPct = Math.min(Math.max(((cx - contentRect.left) / contentRect.width) * 90, 0), 100)
        const yPct = Math.min(Math.max(((cy - contentRect.top) / contentRect.height) * 95, 0), 100)
        top = `${yPct.toFixed(2)}%`
        left = `${xPct.toFixed(2)}%`
      }
    }

    const id = (() => {
      try {
        if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
          return `decoration-${crypto.randomUUID()}`
        }
      } catch { /* ignore */ }
      return `decoration-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`
    })()

    const newDecoration: ThemeCustomDecorations = {
      id,
      position: { top, left },
      image: '/placeholder.svg?height=150&width=150',
      opacity: 1,
      scale: 1,
      responsiveScale: true,
      zIndex: 20,
      name: `Decoration ${normalizedDecorations.length + 1}`,
    }

    addDecoration(newDecoration)
    setSelectedDecorationId(newDecoration.id)
  }, [scrollContainerRef, normalizedDecorations.length, addDecoration, setSelectedDecorationId])

  const animationValue = themeCustomizations.decorationAnimation || 'fade'

  // When there are no decorations yet, show a minimal "add" prompt
  if (!normalizedDecorations.length) {
    return (
      <div className="h-10 px-1.5 flex items-center">
        <Button
          type="button"
          variant="ghost"
          onClick={handleAddDecoration}
          className="h-8 px-3 rounded-full text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors gap-1.5"
        >
          <Plus className="h-3.5 w-3.5" />
          Add decoration
        </Button>
      </div>
    )
  }

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
      onAddDecoration={handleAddDecoration}
    />
  )
}
