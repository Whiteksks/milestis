"use client"

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react"
import { useDrag } from "@use-gesture/react"
import { animate, motion, useMotionValue, useTransform, type MotionValue } from "framer-motion"
import { createPortal } from "react-dom"

import { cn } from "@/lib/utils"

const SHEET_SNAP_TRANSITION = {
  type: "spring",
  stiffness: 300,
  damping: 30,
  restDelta: 0.01,
} as const


type SnapPoint = string | number

function clamp01(value: number) {
  return Math.min(Math.max(value, 0), 1)
}

export interface SnapBottomSheetRenderProps {
  dragHandleRef: React.RefObject<HTMLDivElement | null>
  snapHeights: readonly number[]
  sheetHeight: MotionValue<number>
  sheetProgress: MotionValue<number>
}

const SnapBottomSheetContext = createContext<SnapBottomSheetRenderProps | null>(null)

interface SnapBottomSheetProps<T extends SnapPoint> {
  open?: boolean
  snapPoints: readonly T[]
  activeSnapPoint: T
  setActiveSnapPoint: (snapPoint: T) => void
  className?: string
  ariaLabel?: string
  children: ReactNode
}

export function useSnapBottomSheet() {
  const context = useContext(SnapBottomSheetContext)

  if (!context) {
    throw new Error("useSnapBottomSheet must be used inside SnapBottomSheet")
  }

  return context
}

function resolveSnapRangeProgress(
  value: number,
  snapHeights: readonly number[],
  fromSnap: number,
  toSnap: number,
) {
  const startHeight = snapHeights[fromSnap] ?? 0
  const endHeight = snapHeights[toSnap] ?? startHeight

  if (endHeight <= startHeight) return 1

  return clamp01((value - startHeight) / (endHeight - startHeight))
}

interface SnapBottomSheetTransitionOptions {
  enterBetween: readonly [number, number]
  exitBetween?: readonly [number, number]
  collapseOnUpperSnap?: boolean
}

export function useSnapBottomSheetTransition({
  enterBetween,
  exitBetween,
  collapseOnUpperSnap = false,
}: SnapBottomSheetTransitionOptions) {
  const { sheetHeight, snapHeights } = useSnapBottomSheet()

  const enterProgress = useTransform(sheetHeight, (value) =>
    resolveSnapRangeProgress(value, snapHeights, enterBetween[0], enterBetween[1]),
  )

  const resolvedExitBetween = exitBetween ??
    (collapseOnUpperSnap
      ? ([enterBetween[1], Math.min(enterBetween[1] + 1, snapHeights.length - 1)] as const)
      : undefined)

  const exitProgress = useTransform(sheetHeight, (value) => {
    if (!resolvedExitBetween || resolvedExitBetween[1] <= resolvedExitBetween[0]) return 1

    const rangeProgress = resolveSnapRangeProgress(
      value,
      snapHeights,
      resolvedExitBetween[0],
      resolvedExitBetween[1],
    )

    return 1 - rangeProgress
  })

  const visibilityProgress = useTransform(() => enterProgress.get() * exitProgress.get())

  return {
    enterProgress,
    exitProgress,
    visibilityProgress,
  }
}

function resolveViewportHeight() {
  if (typeof window === "undefined") return 0
  return window.visualViewport?.height ?? window.innerHeight
}

function resolveSnapPoint(point: SnapPoint, viewportHeight: number) {
  if (typeof point === "number") {
    if (point > 0 && point <= 1) return viewportHeight * point
    return point
  }

  const parsed = Number.parseFloat(point)
  return Number.isFinite(parsed) ? parsed : 0
}

function applyResistance(value: number, min: number, max: number) {
  if (value < min) return min - (min - value) * 0.14
  if (value > max) return max + (value - max) * 0.14
  return value
}

function syncViewportHeight(
  heightRef: React.MutableRefObject<number>,
  setHeight: (h: number) => void,
) {
  const next = resolveViewportHeight()
  if (next === heightRef.current) return
  heightRef.current = next
  setHeight(next)
}


export function SnapBottomSheet<T extends SnapPoint>({
  open = true,
  snapPoints,
  activeSnapPoint,
  setActiveSnapPoint,
  className,
  ariaLabel,
  children,
}: SnapBottomSheetProps<T>) {
  const [isMounted, setIsMounted] = useState(false)
  const [viewportHeight, setViewportHeight] = useState(0)

  const sheetHeight = useMotionValue(0)
  const animationRef = useRef<ReturnType<typeof animate> | null>(null)
  const viewportHeightRef = useRef(0)
  const viewportFrameRef = useRef<number | null>(null)
  const startHeightRef = useRef(0)
  const hasDraggedRef = useRef(false)
  const dragHandleRef = useRef<HTMLDivElement | null>(null)

  const { resolvedSnapHeights, orderedSnapPoints, orderedSnapHeights } = useMemo(() => {
    const resolved = snapPoints.map((point) => ({ point, height: resolveSnapPoint(point, viewportHeight) }))
    const ordered = [...resolved].sort((a, b) => a.height - b.height)
    return {
      resolvedSnapHeights: resolved.map(({ height }) => height),
      orderedSnapPoints: ordered,
      orderedSnapHeights: ordered.map(({ height }) => height),
    }
  }, [snapPoints, viewportHeight])

  const maxSnapHeight = orderedSnapHeights[orderedSnapHeights.length - 1] ?? 0
  const minSnapHeight = orderedSnapHeights[0] ?? 0
  const sheetOffset = useTransform(sheetHeight, (value) => Math.max(0, maxSnapHeight - value))
  const sheetProgress = useTransform(sheetHeight, (value) => {
    if (maxSnapHeight <= minSnapHeight) return 1
    return Math.min(Math.max((value - minSnapHeight) / (maxSnapHeight - minSnapHeight), 0), 1)
  })
  const activeSnapIndex = Math.max(
    0,
    snapPoints.findIndex((point) => Object.is(point, activeSnapPoint)),
  )
  const targetHeight = resolvedSnapHeights[activeSnapIndex] ?? minSnapHeight

  useEffect(() => {
    setIsMounted(true)
    syncViewportHeight(viewportHeightRef, setViewportHeight)
  }, [])

  useEffect(() => {
    if (!isMounted) return

    syncViewportHeight(viewportHeightRef, setViewportHeight)

    const schedule = () => {
      if (viewportFrameRef.current !== null) return
      viewportFrameRef.current = window.requestAnimationFrame(() => {
        viewportFrameRef.current = null
        syncViewportHeight(viewportHeightRef, setViewportHeight)
      })
    }

    const visualViewport = window.visualViewport
    window.addEventListener("resize", schedule)
    window.addEventListener("orientationchange", schedule)
    visualViewport?.addEventListener("resize", schedule)

    return () => {
      window.removeEventListener("resize", schedule)
      window.removeEventListener("orientationchange", schedule)
      visualViewport?.removeEventListener("resize", schedule)
      if (viewportFrameRef.current !== null) {
        window.cancelAnimationFrame(viewportFrameRef.current)
        viewportFrameRef.current = null
      }
    }
  }, [isMounted])

  useEffect(() => {
    if (!isMounted || !open || targetHeight <= 0) return

    if (!sheetHeight.get()) {
      sheetHeight.set(targetHeight)
      return
    }

    animationRef.current?.stop()
    animationRef.current = animate(sheetHeight, targetHeight, SHEET_SNAP_TRANSITION)
  }, [isMounted, open, targetHeight, sheetHeight])

  useEffect(() => {
    return () => {
      animationRef.current?.stop()
    }
  }, [])

  useDrag(
    ({ first, last, movement: [, my], swipe: [, sy] }) => {
      if (first) {
        startHeightRef.current = sheetHeight.get() || targetHeight
        hasDraggedRef.current = false
      }

      // Only engage once there is real movement — prevents tap from
      // interrupting an in-progress snap animation
      if (Math.abs(my) > 3) {
        if (!hasDraggedRef.current) {
          hasDraggedRef.current = true
          animationRef.current?.stop()
        }
        sheetHeight.set(applyResistance(startHeightRef.current - my, minSnapHeight, maxSnapHeight))
      }

      if (!last) return

      // Tap — no real drag happened, leave animation untouched
      if (!hasDraggedRef.current) return

      let snapIndex: number
      if (sy !== 0) {
        // flick: move ±1 snap from the active snap point
        // sy=-1 → flick up → higher snap, sy=1 → flick down → lower snap
        const activeOrderedIndex = orderedSnapPoints.findIndex((s) => Object.is(s.point, activeSnapPoint))
        snapIndex = Math.min(Math.max(activeOrderedIndex - sy, 0), orderedSnapPoints.length - 1)
      } else {
        // slow drag: snap to nearest
        const h = Math.min(Math.max(sheetHeight.get(), minSnapHeight), maxSnapHeight)
        snapIndex = orderedSnapHeights.reduce(
          (best, sh, i) =>
            Math.abs(sh - h) < Math.abs(orderedSnapHeights[best] - h) ? i : best,
          0,
        )
      }

      const nextSnap = orderedSnapPoints[snapIndex]
      const nextPoint = nextSnap?.point ?? activeSnapPoint
      const snapHeight = nextSnap?.height ?? sheetHeight.get()

      animationRef.current?.stop()
      animationRef.current = animate(sheetHeight, snapHeight, SHEET_SNAP_TRANSITION)

      if (!Object.is(nextPoint, activeSnapPoint)) {
        setActiveSnapPoint(nextPoint)
      }
    },
    {
      target: dragHandleRef,
      axis: "y",
      filterTaps: true,
      swipe: { velocity: 0.3 },
    },
  )

  const contextValue = useMemo<SnapBottomSheetRenderProps>(
    () => ({
      dragHandleRef,
      snapHeights: resolvedSnapHeights,
      sheetHeight,
      sheetProgress,
    }),
    [resolvedSnapHeights, sheetHeight, sheetProgress],
  )

  if (!isMounted || !open) return null

  return createPortal(
    <motion.div
      aria-label={ariaLabel}
      className={cn(
        "fixed bottom-0 left-0 right-0 z-50 flex flex-col overflow-hidden pointer-events-auto md:hidden",
        className,
      )}
      style={{
        height: maxSnapHeight,
        maxHeight: maxSnapHeight,
        willChange: "transform",
        y: sheetOffset,
      }}
    >
      <SnapBottomSheetContext.Provider value={contextValue}>
        {children}
      </SnapBottomSheetContext.Provider>
    </motion.div>,
    document.body,
  )
}