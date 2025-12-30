"use client"

import { motion, type MotionValue } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Minus, Plus, Trash2 } from 'lucide-react'
import { cn } from '@/lib/utils'

interface DecorationsFloatingMenuProps {
  scale: number
  onScaleChange: (next: number) => void
  onDelete: () => void
  // Optional: anchor the menu to a decoration position.
  // If omitted, the menu stays centered at the bottom (current behavior).
  anchor?: {
    top?: string
    bottom?: string
    left?: string
    right?: string
  }
  x?: MotionValue<number>
  y?: MotionValue<number>
  offsetX?: number
  offsetY?: number
  className?: string
}

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value))
const round2 = (value: number) => Math.round(value * 100) / 100

export function DecorationsFloatingMenu({
  scale,
  onScaleChange,
  onDelete,
  anchor,
  x,
  y,
  offsetX = 0,
  offsetY = 0,
  className,
}: DecorationsFloatingMenuProps) {
  const isAnchored = Boolean(anchor)

  const step = 0.1

  const normalizedScale = Number.isFinite(scale) ? scale : 1

  return (
    <motion.div
      className={cn(
        'pointer-events-auto',
        isAnchored ? 'absolute z-50' : 'absolute left-1/2 -translate-x-1/2 bottom-4 z-50',
        'bg-white/65 backdrop-blur-md',
        'border border-slate-200',
        'shadow-[0_18px_50px_-25px_rgba(0,0,0,0.45)]',
        'rounded-2xl',
        'p-1',
        'flex items-center',
        className,
      )}
      style={
        isAnchored
          ? {
              ...(anchor?.top
                ? { top: `calc(${anchor.top} + ${offsetY}px)` }
                : null),
              ...(anchor?.bottom
                ? { bottom: `calc(${anchor.bottom} - ${offsetY}px)` }
                : null),
              ...(anchor?.left ? { left: `calc(${anchor.left} + ${offsetX}px)` } : null),
              ...(anchor?.right ? { right: `calc(${anchor.right} - ${offsetX}px)` } : null),
              x,
              y,
            }
          : undefined
      }
    >
      <Button
        type="button"
        variant="ghost"
        onClick={onDelete}
        className="h-8 w-8 p-0 rounded-xl text-slate-500 hover:text-red-600 hover:bg-red-50"
        aria-label="Delete decoration"
      >
        <Trash2 className="h-4 w-4" />
      </Button>

      
      <Button
        type="button"
        variant="ghost"
        onClick={() => onScaleChange(round2(clamp(normalizedScale + step, 0.1, 3)))}
        className="h-8 w-8 p-0 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-50"
        aria-label="Increase scale"
      >
        <Plus className="h-4 w-4" />
      </Button>

      <Button
        type="button"
        variant="ghost"
        onClick={() => onScaleChange(round2(clamp(normalizedScale - step, 0.1, 3)))}
        className="h-8 w-8 p-0 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-50"
        aria-label="Decrease scale"
      >
        <Minus className="h-4 w-4" />
      </Button>
    </motion.div>
  )
}
