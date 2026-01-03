"use client"

import { motion, type MotionValue } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Trash2, Droplets, Image as ImageIcon, BringToFront, SendToBack, Maximize } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Separator } from '@/components/ui/separator'
import { Label } from '@/components/ui/label'
import { useRef } from 'react'

interface DecorationsFloatingMenuProps {
  scale: number
  onScaleChange: (next: number) => void
  opacity: number
  onOpacityChange: (next: number) => void
  zIndex: number
  onLayerChange: (direction: 'front' | 'back') => void
  onImageReplace: (file: File) => void
  onDelete: () => void
  // Optional: anchor the menu to a decoration position.
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
  opacity,
  onOpacityChange,
  zIndex,
  onLayerChange,
  onImageReplace,
  onDelete,
  anchor,
  x,
  y,
  offsetX = 0,
  offsetY = 0,
  className,
}: DecorationsFloatingMenuProps) {
  const isAnchored = Boolean(anchor)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const normalizedScale = Number.isFinite(scale) ? scale : 1
  const normalizedOpacity = Number.isFinite(opacity) ? opacity : 1
  const isFront = zIndex >= 20

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      onImageReplace(file)
    }
    // Reset input so same file can be selected again if needed
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  return (
    <motion.div
      className={cn(
        'pointer-events-auto',
        isAnchored ? 'absolute z-50' : 'absolute left-1/2 -translate-x-1/2 bottom-4 z-50',
        'bg-white/80 backdrop-blur-md',
        'border border-slate-200',
        'shadow-lg shadow-slate-900/5',
        'rounded-full', // Pill shape
        'p-1.5',
        'flex items-center gap-0.5',
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
      onPointerDown={(e) => e.stopPropagation()} // Prevent drag start on menu click
    >
      {/* 1. Delete */}
      <Button
        type="button"
        variant="ghost"
        onClick={onDelete}
        className="h-8 w-8 p-0 rounded-full text-slate-500 hover:text-red-600 hover:bg-red-50"
        aria-label="Delete decoration"
      >
        <Trash2 className="h-4 w-4" />
      </Button>

      <Separator orientation="vertical" className="h-4 mx-0.5 bg-slate-200" />

      {/* 2. Scale */}
      <Popover>
        <PopoverTrigger asChild>
          <Button
            type="button"
            variant="ghost"
            className="h-8 w-8 p-0 rounded-full text-slate-600 hover:text-slate-900 hover:bg-slate-50"
            aria-label="Scale"
          >
            <Maximize className="h-4 w-4" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-64 p-4" side="top" sideOffset={10}>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="text-xs font-medium text-slate-700">Scale</Label>
              <span className="text-xs text-slate-500 tabular-nums">{Math.round(normalizedScale * 100)}%</span>
            </div>
            <input
              type="range"
              min="0.1"
              max="3"
              step="0.1"
              value={normalizedScale}
              onChange={(e) => onScaleChange(parseFloat(e.target.value))}
              className="w-full accent-slate-900 h-1.5 bg-slate-100 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-slate-900"
            />
          </div>
        </PopoverContent>
      </Popover>

      <Separator orientation="vertical" className="h-4 mx-0.5 bg-slate-200" />

      {/* 3. Opacity */}
      <Popover>
        <PopoverTrigger asChild>
          <Button
            type="button"
            variant="ghost"
            className="h-8 w-8 p-0 rounded-full text-slate-600 hover:text-slate-900 hover:bg-slate-50"
            aria-label="Opacity"
          >
            <Droplets className="h-4 w-4" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-64 p-4" side="top" sideOffset={10}>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="text-xs font-medium text-slate-700">Opacity</Label>
              <span className="text-xs text-slate-500 tabular-nums">{Math.round(normalizedOpacity * 100)}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={normalizedOpacity}
              onChange={(e) => onOpacityChange(parseFloat(e.target.value))}
              className="w-full accent-slate-900 h-1.5 bg-slate-100 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-slate-900"
            />
          </div>
        </PopoverContent>
      </Popover>

      <Separator orientation="vertical" className="h-4 mx-0.5 bg-slate-200" />

      {/* 4. Layers */}
      <Button
        type="button"
        variant="ghost"
        onClick={() => onLayerChange(isFront ? 'back' : 'front')}
        className={cn(
          'h-8 w-8 p-0 rounded-full hover:bg-slate-50',
          isFront ? 'text-slate-900 bg-slate-50' : 'text-slate-400',
        )}
        aria-label={isFront ? 'Send to back' : 'Bring to front'}
      >
        {isFront ? <BringToFront className="h-4 w-4" /> : <SendToBack className="h-4 w-4" />}
      </Button>

      <Separator orientation="vertical" className="h-4 mx-0.5 bg-slate-200" />

      {/* 5. Image */}
      <Button
        type="button"
        variant="ghost"
        onClick={() => fileInputRef.current?.click()}
        className="h-8 w-8 p-0 rounded-full text-slate-600 hover:text-slate-900 hover:bg-slate-50"
        aria-label="Change image"
      >
        <ImageIcon className="h-4 w-4" />
      </Button>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
      />
    </motion.div>
  )
}
