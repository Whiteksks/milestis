"use client"

import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState, type HTMLAttributes, type ReactNode } from "react"
import {
  animate,
  motion,
  useDragControls,
  useMotionValue,
  type AnimationPlaybackControls,
  type PanInfo,
} from "motion/react"
import { createPortal } from "react-dom"

import { cn } from "@/lib/utils"

// ─── Animation configs ──────────────────────────────────────────────────────────

/** Used after drag-end: continues the gesture's velocity for a physical feel. */
const SNAP_SPRING = {
  type: "spring" as const,
  stiffness: 380,
  damping: 32,
  mass: 0.9,
  restDelta: 0.5,
  restSpeed: 2,
}

/** Used for programmatic transitions (tab click, auto-open): smooth, predictable. */
const SNAP_TWEEN = {
  type: "tween" as const,
  duration: 0.32,
  ease: [0.32, 0.72, 0, 1] as [number, number, number, number],
}

/** Static object — never changes, avoids object identity churn on motion/react. */
const DRAG_ELASTIC = { top: 0.1, bottom: 0.1 } as const

type SnapAnimConfig = typeof SNAP_SPRING | typeof SNAP_TWEEN

/** How far ahead (in seconds) to project velocity when choosing a snap point. */
const VELOCITY_PROJECTION_S = 0.18

// ─── Helpers ─────────────────────────────────────────────────────────────────

/**
 * Normalises snap heights so they are ascending and non-negative.
 * Each entry is clamped to be >= its predecessor and >= 0.
 */
function normaliseHeights(heights: readonly number[]): number[] {
  if (heights.length === 0) return [0]
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
  const pendingSnapIndexRef = useRef<number | null>(null)

  // Derived snap geometry ──────────────────────────────────────────────────────

  /**
   * Each snap height is expressed as a `y` offset from the top of the fixed
   * container (which always has `height = maxHeight`):
   *   y = 0                        → fully open  (sheet at maxHeight)
   *   y = maxHeight − minHeight    → most collapsed (sheet at minHeight)
   * Recomputed only when snapHeights changes (viewport resize).
   */
  const { snapY, maxHeight, dragConstraints } = useMemo(() => {
    const normalised = normaliseHeights(snapHeights)
    const lastIndex = Math.max(0, normalised.length - 1)
    const maxH = normalised[lastIndex] ?? 0
    const minH = normalised[0] ?? 0
    return {
      snapY: normalised.map((h) => maxH - h),
      maxHeight: maxH,
      dragConstraints: { top: 0, bottom: maxH - minH },
    }
  }, [snapHeights])

  const safeIndex = Math.min(Math.max(snapIndex, 0), Math.max(0, snapY.length - 1))
  const targetY = snapY[safeIndex] ?? 0

  const safeIndexRef = useRef(safeIndex)

  const snapYRef = useRef(snapY)

  const previousSafeIndexRef = useRef(safeIndex)
  const previousTargetYRef = useRef(targetY)

  useLayoutEffect(() => {
    safeIndexRef.current = safeIndex
    snapYRef.current = snapY
  }, [safeIndex, snapY])

  // Motion value ───────────────────────────────────────────────────────────────

  const y = useMotionValue(targetY)

  const animateTo = useCallback(
    (targetY: number, config: SnapAnimConfig = SNAP_TWEEN) => {
      animRef.current?.stop()
      if (Math.abs(y.get() - targetY) < 0.5) {
        y.set(targetY)
        animRef.current = null
        return
      }
      animRef.current = animate(y, targetY, config)
    },
    [y],
  )

  // Mount / unmount ────────────────────────────────────────────────────────────

  // useLayoutEffect fires before paint — avoids a null-render flash on mount
  useLayoutEffect(() => {
    setIsMounted(true)
    return () => { animRef.current?.stop() }
  }, [])

  // Sync external snapIndex changes (e.g. parent resets to nav on tab switch) ──

  useEffect(() => {
    if (!isMounted || !open) return

    const previousSafeIndex = previousSafeIndexRef.current
    const previousTargetY = previousTargetYRef.current

    previousSafeIndexRef.current = safeIndex
    previousTargetYRef.current = targetY

    if (isDraggingRef.current) {
      pendingSnapIndexRef.current = safeIndex
      return
    }

    const indexChanged = previousSafeIndex !== safeIndex
    const geometryChanged = Math.abs(previousTargetY - targetY) >= 0.5

    if (indexChanged) {
      animateTo(targetY)
      return
    }

    if (geometryChanged) {
      animRef.current?.stop()
      y.set(targetY)
    }
  }, [animateTo, isMounted, open, safeIndex, targetY, y])

  // Drag handlers ──────────────────────────────────────────────────────────────

  const handleDragStart = useCallback(() => {
    isDraggingRef.current = true
    pendingSnapIndexRef.current = null
    animRef.current?.stop()
  }, [])

  const handleDragEnd = useCallback(
    (_: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
      // Project the current position forward in time using velocity to pick
      // which snap feels most natural for the gesture speed/direction.
      const currentSnapY = snapYRef.current
      const projected = y.get() + info.velocity.y * VELOCITY_PROJECTION_S
      const nextIndex = nearestIndex(projected, currentSnapY)
      const nextY = currentSnapY[nextIndex] ?? y.get()

      // Spring: continues the gesture's inertia
      animateTo(nextY, SNAP_SPRING)

      if (nextIndex !== safeIndexRef.current) {
        onSnapIndexChange(nextIndex)
      }

      // Delay clearing so the effect triggered by onSnapIndexChange (re-render)
      // still sees isDraggingRef as true and doesn't double-animate.
      requestAnimationFrame(() => {
        isDraggingRef.current = false

        const pendingSnapIndex = pendingSnapIndexRef.current
        if (pendingSnapIndex === null) return

        pendingSnapIndexRef.current = null

        const pendingTargetY = snapYRef.current[pendingSnapIndex] ?? y.get()
        if (Math.abs(y.get() - pendingTargetY) < 0.5) return

        // Tween: this is a correction, not a gesture continuation
        animateTo(pendingTargetY, SNAP_TWEEN)
      })
    },
    [animateTo, onSnapIndexChange, y],
  )

  // Drag handle props (only onPointerDown needed with dragControls) ─────────────

  const dragHandleProps = useMemo<MobileSnapSheetRenderProps["dragHandleProps"]>(
    () => ({ onPointerDown: (e) => dragControls.start(e) }),
    [dragControls],
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
      dragConstraints={dragConstraints}
      dragElastic={DRAG_ELASTIC}
      dragMomentum={false}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      {children({ dragHandleProps })}
    </motion.div>,
    document.body,
  )
}