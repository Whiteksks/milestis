"use client"

import { useCallback, useEffect, useMemo, useRef, useState, type HTMLAttributes, type ReactNode } from "react"
import {
  animate,
  motion,
  useDragControls,
  useMotionValue,
  type AnimationPlaybackControls,
  type PanInfo,
} from "framer-motion"
import { createPortal } from "react-dom"

import { cn } from "@/lib/utils"

// ─── Spring config ────────────────────────────────────────────────────────────

const SNAP_SPRING = {
  type: "spring" as const,
  stiffness: 380,
  damping: 32,
  mass: 0.9,
  restDelta: 0.5,
  restSpeed: 2,
}

/** How far ahead (in seconds) to project velocity when choosing a snap point. */
const VELOCITY_PROJECTION_S = 0.18

// ─── Helpers ─────────────────────────────────────────────────────────────────

/**
 * Normalises snap heights so they are ascending and non-negative.
 * Each entry is clamped to be >= its predecessor and >= 0.
 */
function normaliseHeights(heights: readonly number[]): number[] {
  return heights.reduce<number[]>((acc, h, i) => {
    acc.push(Math.max(acc[i - 1] ?? 0, Math.max(0, h)))
    return acc
  }, [])
}

/**
 * Returns the index in `values` whose entry is closest to `target`.
 */
function nearestIndex(target: number, values: readonly number[]): number {
  let best = 0
  let bestDist = Infinity
  for (let i = 0; i < values.length; i++) {
    const dist = Math.abs(values[i] - target)
    if (dist < bestDist) {
      bestDist = dist
      best = i
    }
  }
  return best
}

// ─── Public types ─────────────────────────────────────────────────────────────

export interface MobileSnapSheetRenderProps {
  /** Spread onto the element that should initiate the drag gesture. */
  dragHandleProps: Pick<HTMLAttributes<HTMLDivElement>, "onPointerDown">
}

interface MobileSnapSheetProps {
  open?: boolean
  /** Heights (px) the sheet can snap to, in ascending order. */
  snapHeights: readonly number[]
  /** Currently active snap index (controlled). */
  snapIndex: number
  onSnapIndexChange: (index: number) => void
  className?: string
  ariaLabel?: string
  children: (props: MobileSnapSheetRenderProps) => ReactNode
}

// ─── Component ────────────────────────────────────────────────────────────────

export function MobileSnapSheet({
  open = true,
  snapHeights,
  snapIndex,
  onSnapIndexChange,
  className,
  ariaLabel,
  children,
}: MobileSnapSheetProps) {
  const [isMounted, setIsMounted] = useState(false)
  const dragControls = useDragControls()
  const animRef = useRef<AnimationPlaybackControls | null>(null)
  /**
   * Guard that prevents the external-snapIndex effect from re-animating while
   * a drag or its immediately-following onSnapIndexChange propagation is active.
   */
  const isDraggingRef = useRef(false)

  // Derived snap geometry ──────────────────────────────────────────────────────

  const normalised = useMemo(() => normaliseHeights(snapHeights), [snapHeights])
  const lastIndex = Math.max(0, normalised.length - 1)
  const maxHeight = normalised[lastIndex] ?? 0
  const minHeight = normalised[0] ?? 0
  const safeIndex = Math.min(Math.max(snapIndex, 0), lastIndex)

  /**
   * Each snap height is expressed as a `y` offset from the top of the fixed
   * container (which always has `height = maxHeight`):
   *   y = 0                        → fully open  (sheet at maxHeight)
   *   y = maxHeight − minHeight    → most collapsed (sheet at minHeight)
   */
  const snapY = useMemo(
    () => normalised.map((h) => maxHeight - h),
    [normalised, maxHeight],
  )

  // Motion value ───────────────────────────────────────────────────────────────

  const y = useMotionValue(snapY[safeIndex] ?? 0)

  const animateTo = useCallback(
    (targetY: number) => {
      animRef.current?.stop()
      if (Math.abs(y.get() - targetY) < 0.5) {
        y.set(targetY)
        animRef.current = null
        return
      }
      animRef.current = animate(y, targetY, SNAP_SPRING)
    },
    [y],
  )

  // Mount / unmount ────────────────────────────────────────────────────────────

  useEffect(() => {
    setIsMounted(true)
    return () => { animRef.current?.stop() }
  }, [])

  // Sync external snapIndex changes (e.g. parent resets to nav on tab switch) ──

  useEffect(() => {
    if (!isMounted || !open || isDraggingRef.current) return
    animateTo(snapY[safeIndex] ?? 0)
  }, [animateTo, isMounted, open, safeIndex, snapY])

  // Drag handlers ──────────────────────────────────────────────────────────────

  const handleDragStart = useCallback(() => {
    isDraggingRef.current = true
    animRef.current?.stop()
  }, [])

  const handleDragEnd = useCallback(
    (_: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
      // Project the current position forward in time using velocity to pick
      // which snap feels most natural for the gesture speed/direction.
      const projected = y.get() + info.velocity.y * VELOCITY_PROJECTION_S
      const nextIndex = nearestIndex(projected, snapY)
      const nextY = snapY[nextIndex] ?? y.get()

      animateTo(nextY)

      if (nextIndex !== safeIndex) {
        onSnapIndexChange(nextIndex)
      }

      // Delay clearing so the effect triggered by onSnapIndexChange (re-render)
      // still sees isDraggingRef as true and doesn't double-animate.
      requestAnimationFrame(() => {
        isDraggingRef.current = false
      })
    },
    [animateTo, onSnapIndexChange, safeIndex, snapY, y],
  )

  // Drag handle props (only onPointerDown needed with dragControls) ─────────────

  const handlePointerDown = useCallback(
    (event: React.PointerEvent<HTMLDivElement>) => {
      dragControls.start(event)
    },
    [dragControls],
  )

  const dragHandleProps = useMemo<MobileSnapSheetRenderProps["dragHandleProps"]>(
    () => ({ onPointerDown: handlePointerDown }),
    [handlePointerDown],
  )

  // ─── Render ─────────────────────────────────────────────────────────────────

  if (!isMounted || !open) return null

  return createPortal(
    <motion.div
      aria-label={ariaLabel}
      className={cn(
        "fixed bottom-0 left-0 right-0 z-50 flex flex-col overflow-hidden pointer-events-auto md:hidden",
        className,
      )}
      style={{ height: maxHeight, y, willChange: "transform" }}
      drag="y"
      dragControls={dragControls}
      dragListener={false}
      dragConstraints={{ top: 0, bottom: maxHeight - minHeight }}
      dragElastic={{ top: 0.1, bottom: 0.1 }}
      dragMomentum={false}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      {children({ dragHandleProps })}
    </motion.div>,
    document.body,
  )
}