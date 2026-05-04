'use client'

import type { CSSProperties } from 'react'
import Cropper from 'react-easy-crop'
import type { Area } from 'react-easy-crop'
import { Check, X, ZoomIn, RotateCcw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Slider } from '@/components/ui/slider'
import { Separator } from '@/components/ui/separator'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import type { FrameStyle } from '@/editor/lib/types'

/** Maps each frame style to the visual CSS overlay inside the Cropper. */
function getCropAreaStyle(frameStyle: FrameStyle): CSSProperties {
  const base: CSSProperties = { border: '2px solid hsl(var(--primary))' }

  switch (frameStyle) {
    case 'soft':       return { ...base, borderRadius: '0.5rem' }
    case 'squircle':   return { ...base, borderRadius: '30%' }
    case 'organic':    return { ...base, borderRadius: '2rem 0.5rem 2rem 0.5rem' }
    case 'organic-b':  return { ...base, borderRadius: '2rem 2rem 0.5rem 2rem' }
    case 'arch':       return { ...base, borderRadius: '50% 50% 0 0 / 35% 35% 0 0' }
    case 'diamond':    return { ...base, transform: 'translate(-50%, -50%) rotate(45deg) scale(0.707)', borderRadius: '0' }
    default:           return base
  }
}

export interface ImageCropPanelProps {
  /** Original image URL passed to the Cropper. */
  imageSrc: string
  /** Numeric aspect ratio (width / height). Use parseImageRatio(). */
  aspectRatio: number
  frameStyle: FrameStyle
  heightPx?: number
  /** When provided, restores the Cropper to the previously saved crop area. */
  initialCroppedAreaPixels?: Area

  cropPosition: { x: number; y: number }
  zoom: number
  isApplying: boolean

  onCropChange: (v: { x: number; y: number }) => void
  onZoomChange: (v: number) => void
  onCropComplete: (_: Area, pixels: Area) => void
  onReset: () => void
  onApply: () => void
  onCancel: () => void
}

/**
 * Pure presentational crop panel for the new image system.
 * State is managed by useImageCrop — this component only renders.
 */
export function ImageCropPanel({
  imageSrc,
  aspectRatio,
  frameStyle,
  heightPx = 256,
  initialCroppedAreaPixels,
  cropPosition,
  zoom,
  isApplying,
  onCropChange,
  onZoomChange,
  onCropComplete,
  onReset,
  onApply,
  onCancel,
}: ImageCropPanelProps) {
  const isCircle = frameStyle === 'circle'
  const cropAreaStyle = getCropAreaStyle(frameStyle)

  return (
    <>
      <div className="relative w-full" style={{ height: heightPx }}>
        <Cropper
          image={imageSrc}
          crop={cropPosition}
          zoom={zoom}
          aspect={aspectRatio}
          cropShape={isCircle ? 'round' : 'rect'}
          showGrid={!isCircle}
          initialCroppedAreaPixels={initialCroppedAreaPixels}
          onCropChange={onCropChange}
          onZoomChange={onZoomChange}
          onCropComplete={onCropComplete}
          style={{
            containerStyle: {
              borderRadius: 0,
              background:
                'radial-gradient(ellipse 70% 60% at 50% 50%, #3a3f46 0%, #242729 50%, #1a1c1e 100%)',
              overflow: 'hidden',
            },
            cropAreaStyle,
          }}
        />
      </div>

      <div className="flex items-center gap-1.5 p-1.5 bg-card border-t border-border/50">
        <ZoomIn className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
        <Slider
          min={1}
          max={3}
          step={0.01}
          value={[zoom]}
          onValueChange={([v]) => onZoomChange(v)}
          className="flex-1"
        />
        <span className="text-[10px] text-muted-foreground w-7 text-right tabular-nums shrink-0">
          {zoom.toFixed(1)}x
        </span>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={onReset}
              className="h-6 w-6 text-muted-foreground hover:text-foreground shrink-0"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Clear crop</TooltipContent>
        </Tooltip>

        <Separator orientation="vertical" className="h-4 bg-border/50 shrink-0" />

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-muted-foreground hover:text-foreground hover:bg-muted/50 shrink-0"
              onClick={onCancel}
              disabled={isApplying}
            >
              <X className="w-3.5 h-3.5" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Cancel</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-primary hover:text-primary hover:bg-primary/10 shrink-0"
              onClick={onApply}
              disabled={isApplying}
            >
              <Check className="w-3.5 h-3.5" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Apply crop</TooltipContent>
        </Tooltip>
      </div>
    </>
  )
}
