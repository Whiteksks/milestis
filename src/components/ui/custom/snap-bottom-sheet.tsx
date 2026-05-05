"use client"

import {
  useCallback,
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

const SNAP_SPRING = {
  type: "spring" as const,
  stiffness: 380,
  damping: 32,
  mass: 0.9,
  restDelta: 0.5,
  restSpeed: 2,
}

const DRAG_ACTIVATION_DISTANCE = 3
const RESISTANCE_FACTOR = 0.14

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max)
}

export interface SnapBottomSheetRenderProps {
  dragHandleRef: React.RefObject<HTMLDivElement | null>
  snapHeights: readonly number[]
  sheetHeight: MotionValue<number>
  sheetProgress: MotionValue<number>
}

const SnapBottomSheetContext = createContext<SnapBottomSheetRenderProps | null>(null)

interface SnapBottomSheetProps {
  open?: boolean
  snapHeights: readonly number[]
  activeSnapIndex: number
  setActiveSnapIndex: (snapIndex: number) => void
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

  return clamp((value - startHeight) / (endHeight - startHeight), 0, 1)
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

function applyResistance(value: number, min: number, max: number) {
  if (value < min) return min - (min - value) * RESISTANCE_FACTOR
  if (value > max) return max + (value - max) * RESISTANCE_FACTOR
  return value
}

function findNearestSnapIndex(value: number, snapHeights: readonly number[]) {
  let bestIndex = 0
  let bestDistance = Number.POSITIVE_INFINITY

  for (let index = 0; index < snapHeights.length; index += 1) {
    const distance = Math.abs(snapHeights[index] - value)
    if (distance < bestDistance) {
      bestDistance = distance
      bestIndex = index
    }
  }

  return bestIndex
}

export function SnapBottomSheet({
  open = true,
  snapHeights,
  activeSnapIndex,
  setActiveSnapIndex,
  className,
  ariaLabel,
  children,
}: SnapBottomSheetProps) {
  const [isMounted, setIsMounted] = useState(false)

  const sheetHeight = useMotionValue(0)
  const animationRef = useRef<ReturnType<typeof animate> | null>(null)
  const startHeightRef = useRef(0)
  const dragHandleRef = useRef<HTMLDivElement | null>(null)

  const maxSnapHeight = snapHeights[snapHeights.length - 1] ?? 0
  const minSnapHeight = snapHeights[0] ?? 0
  const lastSnapIndex = Math.max(0, snapHeights.length - 1)
  const safeActiveSnapIndex = clamp(activeSnapIndex, 0, lastSnapIndex)
  const targetHeight = snapHeights[safeActiveSnapIndex] ?? minSnapHeight
  const sheetOffset = useTransform(sheetHeight, [minSnapHeight, maxSnapHeight], [maxSnapHeight - minSnapHeight, 0])
  const sheetProgress = useTransform(sheetHeight, (value) => {
    if (maxSnapHeight <= minSnapHeight) return 1
    return clamp((value - minSnapHeight) / (maxSnapHeight - minSnapHeight), 0, 1)
  })

  const animateToHeight = useCallback(
    (nextHeight: number) => {
      const currentHeight = sheetHeight.get()

      if (Math.abs(currentHeight - nextHeight) < 0.5) {
        animationRef.current?.stop()
        sheetHeight.set(nextHeight)
        return
      }

      animationRef.current?.stop()
      animationRef.current = animate(sheetHeight, nextHeight, SNAP_SPRING)
    },
    [sheetHeight],
  )

  useEffect(() => {
    setIsMounted(true)
  }, [])

  useEffect(() => {
    if (!isMounted) return

    if (!open) {
      animationRef.current?.stop()
      return
    }

    if (targetHeight < 0) return

    if (!sheetHeight.get()) {
      sheetHeight.set(targetHeight)
      return
    }

    animateToHeight(targetHeight)
  }, [animateToHeight, isMounted, open, targetHeight, sheetHeight])

  useEffect(() => {
    return () => {
      animationRef.current?.stop()
    }
  }, [])

  useDrag(
    ({ first, last, movement: [, my], swipe: [, sy] }) => {
      if (first) {
        animationRef.current?.stop()
        startHeightRef.current = sheetHeight.get() || targetHeight
      }

      sheetHeight.set(applyResistance(startHeightRef.current - my, minSnapHeight, maxSnapHeight))

      if (!last) return

      let snapIndex: number
      if (sy !== 0) {
        snapIndex = clamp(safeActiveSnapIndex - sy, 0, lastSnapIndex)
      } else {
        const currentHeight = clamp(sheetHeight.get(), minSnapHeight, maxSnapHeight)
        snapIndex = findNearestSnapIndex(currentHeight, snapHeights)
      }

      const nextSnapHeight = snapHeights[snapIndex] ?? sheetHeight.get()

      animateToHeight(nextSnapHeight)

      if (snapIndex !== safeActiveSnapIndex) {
        setActiveSnapIndex(snapIndex)
      }
    },
    {
      target: dragHandleRef,
      axis: "y",
      filterTaps: true,
      threshold: DRAG_ACTIVATION_DISTANCE,
      swipe: { velocity: 0.3 },
    },
  )

  const contextValue = useMemo<SnapBottomSheetRenderProps>(
    () => ({
      dragHandleRef,
      snapHeights,
      sheetHeight,
      sheetProgress,
    }),
    [snapHeights, sheetHeight, sheetProgress],
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