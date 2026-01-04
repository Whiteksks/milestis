"use client"

import { memo, useCallback, useMemo } from "react"
import { motion, type MotionValue } from "framer-motion"
import Image, { type ImageLoader } from "next/image"
import { cn } from "@/lib/utils"
import type { DecorationElement } from "./decorationTypes"
import { getBaseSizePx } from "./utils"

const passthroughLoader: ImageLoader = ({ src }) => src

export interface DraggableDecorationProps {
  decoration: DecorationElement
  isSelected: boolean
  responsiveFactor?: number
  dragX?: MotionValue<number>
  dragY?: MotionValue<number>
  animationVariants?: {
    initial: Record<string, unknown>
    animate: Record<string, unknown>
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
    image,
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
      className={cn("absolute pointer-events-none")}
      style={{
        top: position?.top || "auto",
        bottom: position?.bottom || "auto",
        left: position?.left || "auto",
        right: position?.right || "auto",
        zIndex,
        x: isSelected ? dragX : 0,
        y: isSelected ? dragY : 0,
        width: dimensions.width,
        height: dimensions.height,
      }}
      onClick={handleClick}
    >
      <div className="relative w-full h-full" style={{ transform: flipTransform }}>
        <Image
          loader={passthroughLoader}
          unoptimized
          src={image || "/placeholder.svg"}
          alt=""
          fill
          sizes="200px"
          className="object-contain"
        />
      </div>
    </motion.div>
  )
})
