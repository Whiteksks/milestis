"use client"

import type React from "react"

import { memo, useCallback, useMemo, useRef } from "react"
import { motion, AnimatePresence, type MotionValue, type TargetAndTransition } from "motion/react"
import { Move } from "lucide-react"
import { cn } from "@/lib/utils"
import type { DecorationElement } from "./decorationTypes"
import { getBaseSizePx } from "./utils"
import { DecorationVisual } from "./decoration-visual"

export interface DraggableDecorationProps {
  decoration: DecorationElement
  isSelected: boolean
  responsiveFactor?: number
  dragX?: MotionValue<number>
  dragY?: MotionValue<number>
  animationVariants?: {
    initial: TargetAndTransition
    animate: TargetAndTransition
  }
  animationDelay?: number
  onClick?: (id: string) => void
  /** When provided, renders a drag handle inside the decoration when selected. */
  onStartDrag?: (e: React.PointerEvent, element: HTMLElement) => void
}

export const DraggableDecoration = memo(function DraggableDecoration({
  decoration,
  isSelected,
  responsiveFactor = 1,
  dragX,
  dragY,
  animationVariants = { initial: { opacity: 0 }, animate: { opacity: 1 } },
  animationDelay = 0,
  onClick,
  onStartDrag,
}: DraggableDecorationProps) {
  // Ref on the outer div — passed to startDrag so commitDrag reads the
  // decoration's own bounding rect, not a separate overlay element.
  const outerRef = useRef<HTMLDivElement>(null)

  const {
    id,
    position,
    size,
    scale = 1,
    opacity = 1,
    zIndex = 0,
    responsiveScale,
    transform,
    aspectRatio = 1,
  } = decoration

  const effectiveScale = (responsiveScale ? responsiveFactor : 1) * scale
  const baseSizePx = getBaseSizePx(size)

  const dimensions = useMemo(() => {
    const baseWidth = baseSizePx * effectiveScale
    const baseHeight = baseWidth / aspectRatio
    return {
      width: Math.max(16, Math.round(baseWidth)),
      height: Math.max(16, Math.round(baseHeight)),
    }
  }, [baseSizePx, effectiveScale, aspectRatio])

  const flipTransform = useMemo(() => {
    const scaleX = transform?.flipX ? -1 : 1
    const scaleY = transform?.flipY ? -1 : 1
    if (scaleX === 1 && scaleY === 1) return undefined
    return `scaleX(${scaleX}) scaleY(${scaleY})`
  }, [transform?.flipX, transform?.flipY])

  const handleClick = useCallback(() => {
    if (onClick && id) onClick(id)
  }, [onClick, id])

  const handlePointerDown = useCallback(
    (e: React.PointerEvent) => {
      if (outerRef.current) onStartDrag?.(e, outerRef.current)
    },
    [onStartDrag],
  )

  return (
    <motion.div
      ref={outerRef}
      data-decoration-id={id}
      initial={animationVariants.initial}
      animate={isSelected ? { opacity } : { ...animationVariants.animate, opacity }}
      transition={{ duration: 0.8, delay: animationDelay }}
      // layoutScroll attaches a scroll listener per element to adjust layout animations.
      // Only needed when the decoration is selected and being dragged.
      {...(isSelected ? { layoutScroll: true } : {})}
      className={cn("absolute pointer-events-none")}
      style={{
        top: position?.top ? `calc(${position.top} - ${dimensions.height / 2}px)` : "auto",
        bottom: "auto",
        left: position?.left ? `calc(${position.left} - ${dimensions.width / 2}px)` : "auto",
        right: "auto",
        zIndex,
        x: isSelected ? dragX : 0,
        y: isSelected ? dragY : 0,
        width: dimensions.width,
        height: dimensions.height,
      }}
      onClick={handleClick}
    >
      <div className="relative w-full h-full" style={{ transform: flipTransform }}>
        <DecorationVisual decoration={decoration} />
      </div>

      <AnimatePresence>
        {isSelected && onStartDrag && (
          <motion.button
            key="drag-handle"
            type="button"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className={cn(
              "absolute inset-0",
              "rounded-xl",
              "ring-1 ring-slate-900/10",
              "flex items-center justify-center",
              "cursor-grab active:cursor-grabbing",
              "text-slate-800/40 hover:text-slate-900",
              "touch-none select-none pointer-events-auto",
              "transition-colors",
            )}
            onPointerDown={handlePointerDown}
            onContextMenu={(e) => e.preventDefault()}
            aria-label="Drag decoration"
          >
            <Move className="h-5 w-5" />
          </motion.button>
        )}
      </AnimatePresence>
    </motion.div>
  )
})
