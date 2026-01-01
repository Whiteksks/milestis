"use client"

import type { MotionValue } from 'framer-motion'
import { motion, type DragControls } from 'framer-motion'
import { Move } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { DecorationElement } from '@/editor/lib/types'

type DragBox = { top: number; left: number; right: number; bottom: number }

interface DecorationsDndHandleProps {
  decoration: DecorationElement
  sizePx: number
  dragX: MotionValue<number>
  dragY: MotionValue<number>
  dragControls: DragControls
  dragConstraints?: DragBox
  onStartDrag: (e: React.PointerEvent) => void
  onCommit: () => void
}

export function DecorationsDndHandle({
  decoration,
  sizePx,
  dragX,
  dragY,
  dragControls,
  dragConstraints,
  onStartDrag,
  onCommit,
}: DecorationsDndHandleProps) {
  return (
    <motion.button
      type="button"
      className={cn(
        'absolute z-50',
        'rounded-xl',
        'ring-1 ring-slate-900/10',
        'flex items-center justify-center',
        'cursor-grab active:cursor-grabbing',
        'text-slate-800 hover:text-slate-900',
        'touch-none select-none',
      )}
      style={{
        top: decoration.position?.top || 'auto',
        bottom: decoration.position?.bottom || 'auto',
        left: decoration.position?.left || 'auto',
        right: decoration.position?.right || 'auto',
        width: `${Math.max(16, Math.round(sizePx))}px`,
        height: `${Math.max(16, Math.round(sizePx))}px`,
        x: dragX,
        y: dragY,
      }}
      drag
      dragControls={dragControls}
      dragListener={false}
      dragConstraints={dragConstraints}
      dragMomentum={false}
      dragElastic={0}
      onDragEnd={onCommit}
      onPointerDown={onStartDrag}
      onContextMenu={(e) => e.preventDefault()}
      aria-label="Drag decoration"
    >
      <Move className="h-5 w-5 opacity-80" />
    </motion.button>
  )
}
