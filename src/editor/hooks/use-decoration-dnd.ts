"use client"

import { useCallback, useEffect, useMemo, useState, type RefObject } from 'react'
import { useDragControls, useMotionValue, type DragControls } from 'framer-motion'

type DragBox = { top: number; left: number; right: number; bottom: number }

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value))

export function useDecorationDnd(options: {
  selectedDecorationId: string | null
  boundsRef: RefObject<HTMLElement | null>
  getSelectedElement: () => HTMLElement | null
  onCommitPercentPosition: (id: string, position: { top: string; left: string; bottom?: undefined; right?: undefined }) => void
}) {
  const { selectedDecorationId, boundsRef, getSelectedElement, onCommitPercentPosition } = options

  const dragControls: DragControls = useDragControls()
  const dragX = useMotionValue(0)
  const dragY = useMotionValue(0)

  const [dragConstraints, setDragConstraints] = useState<DragBox | undefined>(undefined)

  const resetDrag = useCallback(() => {
    dragX.set(0)
    dragY.set(0)
  }, [dragX, dragY])

  useEffect(() => {
    // Selection changed (or cleared) — keep drag offsets from leaking.
    resetDrag()
  }, [selectedDecorationId, resetDrag])

  const computeConstraints = useCallback(() => {
    const container = boundsRef.current
    const el = getSelectedElement()
    if (!container || !el) return undefined

    const containerRect = container.getBoundingClientRect()
    const elRect = el.getBoundingClientRect()

    const currentLeftPx = elRect.left - containerRect.left
    const currentTopPx = elRect.top - containerRect.top

    const maxLeftPx = Math.max(0, containerRect.width - elRect.width)
    const maxTopPx = Math.max(0, containerRect.height - elRect.height)

    // Constraints are relative distances from the drag start position.
    return {
      left: -currentLeftPx,
      top: -currentTopPx,
      right: maxLeftPx - currentLeftPx,
      bottom: maxTopPx - currentTopPx,
    }
  }, [boundsRef, getSelectedElement])

  const startDragFromPointerEvent = useCallback(
    (e: React.PointerEvent) => {
      if (!selectedDecorationId) return

      const constraints = computeConstraints()
      if (constraints) setDragConstraints(constraints)

      // Start drag (Framer will use the constraints set above)
      dragControls.start(e)
    },
    [computeConstraints, dragControls, selectedDecorationId],
  )

  const commitDragPosition = useCallback(() => {
    const container = boundsRef.current
    if (!container || !selectedDecorationId) return

    const el = getSelectedElement()
    if (!el) return

    const containerRect = container.getBoundingClientRect()
    const elRect = el.getBoundingClientRect()

    const maxLeftPx = Math.max(0, containerRect.width - elRect.width)
    const maxTopPx = Math.max(0, containerRect.height - elRect.height)

    const leftPx = clamp(elRect.left - containerRect.left, 0, maxLeftPx)
    const topPx = clamp(elRect.top - containerRect.top, 0, maxTopPx)

    const leftPct = containerRect.width > 0 ? (leftPx / containerRect.width) * 100 : 0
    const topPct = containerRect.height > 0 ? (topPx / containerRect.height) * 100 : 0

    onCommitPercentPosition(selectedDecorationId, {
      top: `${topPct.toFixed(2)}%`,
      left: `${leftPct.toFixed(2)}%`,
      bottom: undefined,
      right: undefined,
    })

    resetDrag()
    setDragConstraints(undefined)
  }, [boundsRef, getSelectedElement, onCommitPercentPosition, resetDrag, selectedDecorationId])

  const api = useMemo(
    () => ({
      dragControls,
      dragX,
      dragY,
      dragConstraints,
      startDragFromPointerEvent,
      commitDragPosition,
    }),
    [dragConstraints, dragControls, dragX, dragY, startDragFromPointerEvent, commitDragPosition],
  )

  return api
}
