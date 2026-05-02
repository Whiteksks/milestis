"use client"

import { useState } from "react"
import type { DecorationElement } from "@/editor/lib/types"
import { useUiStore } from "@/editor/lib/store-ui"
import { useThemeSelector, useUiSelector, type ThemeCustomDecorations } from "@/editor/lib/store"
import { useEditorDecorations } from "@/editor/hooks/use-editor-decorations"
import { loadImageAspectRatio } from "@/editor/components/editor/layout/decorationEdit/utils"
import { LIMITS } from "@/editor/components/editor/section-settings/ui/panel-ui"

const DEFAULT_BUBBLE_STYLES = ["soft", "glass", "memory"] as const

/**
 * Shared logic for the Decorations toolbar.
 * Used by both the desktop pill (DecorationsFloatingToolbar) and the mobile sheet.
 * Reads decoration data directly from stores — no prop needed.
 */
export function useDecorationsToolbar(
  scrollContainerRef: React.RefObject<HTMLDivElement | null>,
) {
  const setSelectedDecorationId = useUiStore((s) => s.setSelectedDecorationId)

  // Read allDecorations from stores (mirrors canvas.tsx logic)
  const previewDecorations = useUiSelector((s) => s.previewDecorations)
  const { customDecorations, addDecoration } = useThemeSelector((s) => ({
    customDecorations: s.customDecorations,
    addDecoration: s.addDecoration,
  }))
  const allDecorations: DecorationElement[] = [...(previewDecorations?.elements ?? []), ...customDecorations]

  const { normalizedDecorations, selectedId, handleUpdate, handleRemove } =
    useEditorDecorations(allDecorations)

  const [preferredDecorationId, setPreferredDecorationId] = useState<string | null>(() => {
    return selectedId ?? normalizedDecorations[0]?.id ?? null
  })

  const activeDecorationId = (() => {
    if (selectedId) return selectedId
    if (!normalizedDecorations.length) return null
    if (
      preferredDecorationId &&
      normalizedDecorations.some((d) => d.id === preferredDecorationId)
    )
      return preferredDecorationId
    return normalizedDecorations[0]!.id
  })()

  const selectedDecoration = normalizedDecorations.find((d) => d.id === selectedId)

  const handleImageSelect = async (url: string) => {
    if (!selectedId) return
    const aspectRatio = await loadImageAspectRatio(url)
    handleUpdate(selectedId, { kind: "image", image: url, aspectRatio })
  }

  const handleLocate = () => {
    if (!selectedDecoration) return

    const scroller = scrollContainerRef.current
    const contentRoot = scroller?.querySelector<HTMLElement>(
      '[data-canvas-content-root="true"]',
    )

    if (!scroller || !contentRoot) return

    const topValue = selectedDecoration.position?.top || "0%"
    const topPercent = parseFloat(topValue.replace("%", ""))
    if (Number.isNaN(topPercent)) return

    const contentHeight = contentRoot.scrollHeight
    const targetScrollY = (contentHeight * topPercent) / 100
    const viewportHeight = scroller.clientHeight
    const centeredScrollY = targetScrollY - viewportHeight / 2

    scroller.scrollTo({ top: Math.max(0, centeredScrollY), behavior: "smooth" })
  }

  const handleAddDecoration = () => {
    if (normalizedDecorations.length >= LIMITS.decorations) return

    const scroller = scrollContainerRef.current
    const contentRoot = scroller?.querySelector<HTMLElement>(
      '[data-canvas-content-root="true"]',
    )

    let top = "10%"
    let left = "10%"

    if (scroller && contentRoot && contentRoot.scrollHeight > 0) {
      const scrollerRect = scroller.getBoundingClientRect()
      const contentRect = contentRoot.getBoundingClientRect()
      if (contentRect.width > 0 && contentRect.height > 0) {
        const cx = scrollerRect.left + scroller.clientWidth / 2
        const cy = scrollerRect.top + scroller.clientHeight / 2
        const xPct = Math.min(
          Math.max(((cx - contentRect.left) / contentRect.width) * 90, 0),
          100,
        )
        const yPct = Math.min(
          Math.max(((cy - contentRect.top) / contentRect.height) * 95, 0),
          100,
        )
        top = `${yPct.toFixed(2)}%`
        left = `${xPct.toFixed(2)}%`
      }
    }

    const id = (() => {
      try {
        if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
          return `decoration-${crypto.randomUUID()}`
        }
      } catch {
        /* ignore */
      }
      return `decoration-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`
    })()

    const newDecoration: ThemeCustomDecorations = {
      id,
      kind: "bubble",
      bubbleSeed: id,
      bubbleStyle: DEFAULT_BUBBLE_STYLES[normalizedDecorations.length % DEFAULT_BUBBLE_STYLES.length],
      position: { top, left },
      opacity: 1,
      scale: 1,
      responsiveScale: true,
      zIndex: 20,
      name: `Decoration ${normalizedDecorations.length + 1}`,
      aspectRatio: 1,
    }

    addDecoration(newDecoration)
    setSelectedDecorationId(newDecoration.id)
  }

  return {
    normalizedDecorations,
    selectedId,
    activeDecorationId,
    selectedDecoration,
    preferredDecorationId,
    setPreferredDecorationId,
    handleUpdate,
    handleRemove,
    handleImageSelect,
    handleLocate,
    handleAddDecoration,
    setSelectedDecorationId,
    atLimit: normalizedDecorations.length >= LIMITS.decorations,
  }
}
