"use client"

import type React from "react"

import { useCallback, useEffect, useMemo, useState, type RefObject } from "react"
import { useDragControls, useMotionValue } from "framer-motion"
import type { DragBox, DecorationPosition } from "../components/editor/layout/decorationEdit/decorationTypes"
import { clamp } from "../components/editor/layout/decorationEdit/utils"

export interface UseDecorationDragOptions {
  /** Currently selected decoration ID */
  decorationId: string | null
  /** Reference to the bounds container */
  boundsRef: RefObject<HTMLElement | null>
  /** Callback to commit position as percentages */
  onCommit: (position: DecorationPosition) => void
}

export interface UseDecorationDragReturn {
  dragControls: ReturnType<typeof useDragControls>
  dragX: ReturnType<typeof useMotionValue<number>>
  dragY: ReturnType<typeof useMotionValue<number>>
  constraints: DragBox | undefined
  startDrag: (e: React.PointerEvent, element: HTMLElement) => void
  commitDrag: (element: HTMLElement) => void
}

export function useDecorationDrag({
  decorationId,
  boundsRef,
  onCommit,
}: UseDecorationDragOptions): UseDecorationDragReturn {
  const dragControls = useDragControls()
  const dragX = useMotionValue(0)
  const dragY = useMotionValue(0)
  const [constraints, setConstraints] = useState<DragBox | undefined>()

  // Reset on selection change
  useEffect(() => {
    dragX.set(0)
    dragY.set(0)
    setConstraints(undefined)
  }, [decorationId, dragX, dragY])

  const computeConstraints = useCallback(
    (element: HTMLElement): DragBox | undefined => {
      const container = boundsRef.current
      if (!container) return undefined

      const containerRect = container.getBoundingClientRect()
      const elRect = element.getBoundingClientRect()

      const currentLeft = elRect.left - containerRect.left
      const currentTop = elRect.top - containerRect.top
      const maxLeft = Math.max(0, containerRect.width - elRect.width)
      const maxTop = Math.max(0, containerRect.height - elRect.height)

      return {
        left: -currentLeft,
        top: -currentTop,
        right: maxLeft - currentLeft,
        bottom: maxTop - currentTop,
      }
    },
    [boundsRef],
  )

  const startDrag = useCallback(
    (e: React.PointerEvent, element: HTMLElement) => {
      if (!decorationId) return
      const newConstraints = computeConstraints(element)
      if (newConstraints) setConstraints(newConstraints)
      dragControls.start(e)
    },
    [decorationId, computeConstraints, dragControls],
  )

  const commitDrag = useCallback(
    (element: HTMLElement) => {
      const container = boundsRef.current
      if (!container || !decorationId) return

      const containerRect = container.getBoundingClientRect()
      const elRect = element.getBoundingClientRect()

      const maxLeft = Math.max(0, containerRect.width - elRect.width)
      const maxTop = Math.max(0, containerRect.height - elRect.height)

      const leftPx = clamp(elRect.left - containerRect.left, 0, maxLeft)
      const topPx = clamp(elRect.top - containerRect.top, 0, maxTop)

      const leftPct = containerRect.width > 0 ? (leftPx / containerRect.width) * 100 : 0
      const topPct = containerRect.height > 0 ? (topPx / containerRect.height) * 100 : 0

      onCommit({
        top: `${topPct.toFixed(2)}%`,
        left: `${leftPct.toFixed(2)}%`,
        bottom: undefined,
        right: undefined,
      })

      dragX.set(0)
      dragY.set(0)
      setConstraints(undefined)
    },
    [boundsRef, decorationId, onCommit, dragX, dragY],
  )

  return useMemo(
    () => ({
      dragControls,
      dragX,
      dragY,
      constraints,
      startDrag,
      commitDrag,
    }),
    [dragControls, dragX, dragY, constraints, startDrag, commitDrag],
  )
}
