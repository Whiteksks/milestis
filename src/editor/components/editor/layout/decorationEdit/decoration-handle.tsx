"use client"

import type React from "react"

import { memo, useRef, useCallback } from "react"
import { motion, type MotionValue, type DragControls } from "framer-motion"
import { Move } from "lucide-react"
import { cn } from "@/lib/utils"
import type { DecorationElement, DragBox } from "./decorationTypes"
import { getBaseSizePx } from "./utils"

export interface DecorationHandleProps {
  decoration: DecorationElement
  responsiveFactor?: number
  dragX: MotionValue<number>
  dragY: MotionValue<number>
  dragControls: DragControls
  constraints?: DragBox
  onStartDrag: (e: React.PointerEvent, element: HTMLElement) => void
  onCommitDrag: (element: HTMLElement) => void
}

export const DecorationHandle = memo(function DecorationHandle({
  decoration,
  responsiveFactor = 1,
  dragX,
  dragY,
  dragControls,
  constraints,
  onStartDrag,
  onCommitDrag,
}: DecorationHandleProps) {
  const ref = useRef<HTMLButtonElement>(null)

  const { position, size, scale = 1, responsiveScale, aspectRatio = 1 } = decoration

  const effectiveScale = (responsiveScale ? responsiveFactor : 1) * scale
  const baseSizePx = getBaseSizePx(size)
  const width = Math.max(16, Math.round(baseSizePx * effectiveScale))
  const height = Math.max(16, Math.round(width / aspectRatio))

  const handlePointerDown = useCallback(
    (e: React.PointerEvent) => {
      if (ref.current) onStartDrag(e, ref.current)
    },
    [onStartDrag],
  )

  const handleDragEnd = useCallback(() => {
    if (ref.current) onCommitDrag(ref.current)
  }, [onCommitDrag])

  return (
    <motion.button
      ref={ref}
      type="button"
      className={cn(
        "absolute z-50",
        "rounded-xl",
        "ring-1 ring-slate-900/10",
        "flex items-center justify-center",
        "cursor-grab active:cursor-grabbing",
        "text-slate-800/40 hover:text-slate-900",
        "touch-none select-none",
        "transition-colors",
      )}
      style={{
        top: position?.top || "auto",
        bottom: position?.bottom || "auto",
        left: position?.left || "auto",
        right: position?.right || "auto",
        width,
        height,
        x: dragX,
        y: dragY,
      }}
      drag
      dragControls={dragControls}
      dragListener={false}
      dragConstraints={constraints}
      dragMomentum={false}
      dragElastic={0}
      onDragEnd={handleDragEnd}
      onPointerDown={handlePointerDown}
      onContextMenu={(e) => e.preventDefault()}
      aria-label="Drag decoration"
    >
      <Move className="h-5 w-5" />
    </motion.button>
  )
})
