"use client"

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type HTMLAttributes,
  type ReactNode,
} from "react"
import { animate, motion, useMotionValue, useTransform, type MotionValue } from "framer-motion"
import { createPortal } from "react-dom"

import { cn } from "@/lib/utils"

const SHEET_SPRING = {
  type: "spring",
  stiffness: 260,
  damping: 32,
  mass: 1.05,
} as const

const SNAP_VELOCITY_THRESHOLD = 720
const SNAP_PROJECTION_FACTOR = 0.2

type SnapPoint = string | number

function clamp01(value: number) {
  return Math.min(Math.max(value, 0), 1)
}

export interface SnapBottomSheetRenderProps {
  dragHandleProps: HTMLAttributes<HTMLDivElement>
  isDragging: boolean
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
  overlayClassName?: string
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

function findSnapIndex(heights: readonly number[], currentHeight: number, velocity: number) {
  const minHeight = heights[0] ?? 0
  const maxHeight = heights[heights.length - 1] ?? 0
  const clampedHeight = Math.min(Math.max(currentHeight, minHeight), maxHeight)
  const projectedHeight = Math.min(
    Math.max(clampedHeight + velocity * SNAP_PROJECTION_FACTOR, minHeight),
    maxHeight,
  )

  if (Math.abs(velocity) >= SNAP_VELOCITY_THRESHOLD) {
    if (velocity > 0) {
      for (let index = 0; index < heights.length; index += 1) {
        if (heights[index] >= projectedHeight - 8) return index
      }
      return heights.length - 1
    }

    for (let index = heights.length - 1; index >= 0; index -= 1) {
      if (heights[index] <= projectedHeight + 8) return index
    }
    return 0
  }

  let closestIndex = 0
  let closestDistance = Number.POSITIVE_INFINITY

  for (let index = 0; index < heights.length; index += 1) {
    const distance = Math.abs(heights[index] - projectedHeight)
    if (distance < closestDistance) {
      closestDistance = distance
      closestIndex = index
    }
  }

  return closestIndex
}

export function SnapBottomSheet<T extends SnapPoint>({
  open = true,
  snapPoints,
  activeSnapPoint,
  setActiveSnapPoint,
  className,
  overlayClassName,
  ariaLabel,
  children,
}: SnapBottomSheetProps<T>) {
  const [isMounted, setIsMounted] = useState(false)
  const [viewportHeight, setViewportHeight] = useState(0)
  const [isDragging, setIsDragging] = useState(false)

  const sheetHeight = useMotionValue(0)
  const animationRef = useRef<ReturnType<typeof animate> | null>(null)
  const viewportHeightRef = useRef(0)
  const viewportFrameRef = useRef<number | null>(null)
  const isDraggingRef = useRef(false)
  const pointerIdRef = useRef<number | null>(null)
  const startClientYRef = useRef(0)
  const startHeightRef = useRef(0)
  const lastClientYRef = useRef(0)
  const lastTimestampRef = useRef(0)
  const velocityRef = useRef(0)

  const resolvedSnapPoints = useMemo(
    () =>
      snapPoints.map((point) => ({
        point,
        height: resolveSnapPoint(point, viewportHeight),
      })),
    [snapPoints, viewportHeight],
  )

  const resolvedSnapHeights = useMemo(
    () => resolvedSnapPoints.map(({ height }) => height),
    [resolvedSnapPoints],
  )

  const orderedSnapPoints = useMemo(
    () => [...resolvedSnapPoints].sort((left, right) => left.height - right.height),
    [resolvedSnapPoints],
  )

  const orderedSnapHeights = useMemo(
    () => orderedSnapPoints.map(({ height }) => height),
    [orderedSnapPoints],
  )

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

  const updateViewportHeight = useCallback(() => {
    const nextHeight = resolveViewportHeight()

    if (nextHeight === viewportHeightRef.current) return

    viewportHeightRef.current = nextHeight
    setViewportHeight(nextHeight)
  }, [])

  const scheduleViewportHeightUpdate = useCallback(() => {
    if (viewportFrameRef.current !== null) return

    viewportFrameRef.current = window.requestAnimationFrame(() => {
      viewportFrameRef.current = null
      updateViewportHeight()
    })
  }, [updateViewportHeight])

  useEffect(() => {
    setIsMounted(true)
    updateViewportHeight()
  }, [updateViewportHeight])

  useEffect(() => {
    if (!isMounted) return

    const handleViewportChange = () => {
      scheduleViewportHeightUpdate()
    }

    handleViewportChange()

    const visualViewport = window.visualViewport
    window.addEventListener("resize", handleViewportChange)
    window.addEventListener("orientationchange", handleViewportChange)
    visualViewport?.addEventListener("resize", handleViewportChange)

    return () => {
      window.removeEventListener("resize", handleViewportChange)
      window.removeEventListener("orientationchange", handleViewportChange)
      visualViewport?.removeEventListener("resize", handleViewportChange)

      if (viewportFrameRef.current !== null) {
        window.cancelAnimationFrame(viewportFrameRef.current)
        viewportFrameRef.current = null
      }
    }
  }, [isMounted, scheduleViewportHeightUpdate])

  useEffect(() => {
    if (!isMounted || !open || targetHeight <= 0) return

    if (!sheetHeight.get()) {
      sheetHeight.set(targetHeight)
      return
    }

    if (isDraggingRef.current) return

    animationRef.current?.stop()
    animationRef.current = animate(sheetHeight, targetHeight, SHEET_SPRING)
  }, [isMounted, open, targetHeight, sheetHeight])

  useEffect(() => {
    return () => {
      animationRef.current?.stop()
    }
  }, [])

  const finishDrag = useCallback(
    (pointerId: number | null, releaseTarget?: HTMLDivElement | null) => {
      if (pointerId !== null && releaseTarget?.hasPointerCapture(pointerId)) {
        releaseTarget.releasePointerCapture(pointerId)
      }

      const currentHeight = Math.min(Math.max(sheetHeight.get(), minSnapHeight), maxSnapHeight)
      const nextIndex = findSnapIndex(orderedSnapHeights, currentHeight, velocityRef.current)
      const nextSnap = orderedSnapPoints[nextIndex]
      const nextPoint = nextSnap?.point ?? activeSnapPoint
      const nextHeight = nextSnap?.height ?? currentHeight

      isDraggingRef.current = false
      pointerIdRef.current = null
      setIsDragging(false)
      velocityRef.current = 0

      animationRef.current?.stop()
      animationRef.current = animate(sheetHeight, nextHeight, SHEET_SPRING)

      if (!Object.is(nextPoint, activeSnapPoint)) {
        setActiveSnapPoint(nextPoint)
      }
    },
    [activeSnapPoint, maxSnapHeight, minSnapHeight, orderedSnapHeights, orderedSnapPoints, setActiveSnapPoint, sheetHeight],
  )

  const handlePointerDown = useCallback((event: React.PointerEvent<HTMLDivElement>) => {
    if (event.pointerType === "mouse" && event.button !== 0) return

    animationRef.current?.stop()
    isDraggingRef.current = true
    pointerIdRef.current = event.pointerId
    startClientYRef.current = event.clientY
    startHeightRef.current = sheetHeight.get() || targetHeight
    lastClientYRef.current = event.clientY
    lastTimestampRef.current = event.timeStamp
    velocityRef.current = 0
    setIsDragging(true)

    event.currentTarget.setPointerCapture(event.pointerId)
  }, [sheetHeight, targetHeight])

  const handlePointerMove = useCallback((event: React.PointerEvent<HTMLDivElement>) => {
    if (!isDraggingRef.current || pointerIdRef.current !== event.pointerId) return

    const deltaY = startClientYRef.current - event.clientY
    const rawHeight = startHeightRef.current + deltaY
    const nextHeight = applyResistance(rawHeight, minSnapHeight, maxSnapHeight)
    const deltaTime = event.timeStamp - lastTimestampRef.current

    if (deltaTime > 0) {
      velocityRef.current = ((lastClientYRef.current - event.clientY) / deltaTime) * 1000
    }

    lastClientYRef.current = event.clientY
    lastTimestampRef.current = event.timeStamp
    sheetHeight.set(nextHeight)
    event.preventDefault()
  }, [maxSnapHeight, minSnapHeight, sheetHeight])

  const handlePointerUp = useCallback((event: React.PointerEvent<HTMLDivElement>) => {
    if (!isDraggingRef.current || pointerIdRef.current !== event.pointerId) return
    finishDrag(event.pointerId, event.currentTarget)
  }, [finishDrag])

  const handlePointerCancel = useCallback((event: React.PointerEvent<HTMLDivElement>) => {
    if (!isDraggingRef.current || pointerIdRef.current !== event.pointerId) return
    finishDrag(event.pointerId, event.currentTarget)
  }, [finishDrag])

  const dragHandleProps = useMemo<HTMLAttributes<HTMLDivElement>>(
    () => ({
      onPointerDown: handlePointerDown,
      onPointerMove: handlePointerMove,
      onPointerUp: handlePointerUp,
      onPointerCancel: handlePointerCancel,
      className: "touch-none select-none [touch-action:none]",
    }),
    [handlePointerCancel, handlePointerDown, handlePointerMove, handlePointerUp],
  )

  const contextValue = useMemo<SnapBottomSheetRenderProps>(
    () => ({
      dragHandleProps,
      isDragging,
      snapHeights: resolvedSnapHeights,
      sheetHeight,
      sheetProgress,
    }),
    [dragHandleProps, isDragging, resolvedSnapHeights, sheetHeight, sheetProgress],
  )

  if (!isMounted || !open) return null

  const content = (
    <>
      <div className={cn("fixed inset-0 z-40 bg-transparent pointer-events-none md:hidden", overlayClassName)} />
      <motion.div
        aria-label={ariaLabel}
        className={cn(
          "fixed bottom-0 left-0 right-0 z-50 flex flex-col overflow-hidden pointer-events-auto md:hidden [will-change:transform]",
          className,
        )}
        style={{
          height: maxSnapHeight,
          maxHeight: maxSnapHeight,
          y: sheetOffset,
        }}
      >
        <SnapBottomSheetContext.Provider value={contextValue}>
          {children}
        </SnapBottomSheetContext.Provider>
      </motion.div>
    </>
  )

  return createPortal(content, document.body)
}