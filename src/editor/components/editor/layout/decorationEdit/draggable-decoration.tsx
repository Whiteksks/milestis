"use client"

import { memo, useCallback, useMemo } from "react"
import { motion, type MotionValue, type TargetAndTransition } from "framer-motion"
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
}: DraggableDecorationProps) {
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

  return (
    <motion.div
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
    </motion.div>
  )
})
