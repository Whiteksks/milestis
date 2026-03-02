"use client"

import Cropper, { type Area } from "react-easy-crop"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Check, X, ZoomIn, RotateCcw } from "lucide-react"
import type { AspectRatio, FrameStyle } from "@/editor/lib/types"

const ASPECT_RATIO_NUM: Record<AspectRatio, number> = {
  square: 1,
  portrait: 3 / 4,
  landscape: 4 / 3,
}

export interface InlineCropPanelProps {
  /** Original image URL passed directly to the Cropper. */
  image: string
  aspectRatio: AspectRatio
  frameStyle: FrameStyle
  /** Height of the Cropper canvas in px. Defaults to 240. */
  heightPx?: number

  // ── State (from useCrop) ──
  crop: { x: number; y: number }
  zoom: number
  isApplying: boolean

  // ── Callbacks ──
  onCropChange: (v: { x: number; y: number }) => void
  onZoomChange: (v: number) => void
  onCropComplete: (_: Area, pixels: Area) => void
  onReset: () => void
  /** Called when the user clicks Apply. Caller must persist the crop data. */
  onApply: () => void
  onCancel: () => void
}

/**
 * Pure presentational component — renders the react-easy-crop canvas plus
 * its zoom slider, reset, cancel and apply controls.
 *
 * Stateless: all values come from `useCrop` and are managed by the parent.
 */
export function InlineCropPanel({
  image,
  aspectRatio,
  frameStyle,
  heightPx = 240,
  crop,
  zoom,
  isApplying,
  onCropChange,
  onZoomChange,
  onCropComplete,
  onReset,
  onApply,
  onCancel,
}: InlineCropPanelProps) {
  const isCircle = frameStyle === "circle"
  const aspect = ASPECT_RATIO_NUM[aspectRatio] ?? (4 / 3)

  return (
    <>
      {/* Cropper canvas */}
      <div className="relative w-full" style={{ height: heightPx }}>
        <Cropper
          image={image}
          crop={crop}
          zoom={zoom}
          aspect={aspect}
          cropShape={isCircle ? "round" : "rect"}
          showGrid={!isCircle}
          onCropChange={onCropChange}
          onZoomChange={onZoomChange}
          onCropComplete={onCropComplete}
          style={{
            containerStyle: {
              borderRadius: 0,
              background: "hsl(var(--muted))",
            },
            cropAreaStyle: {
              border: "2px solid hsl(var(--primary))",
              color: "rgba(0,0,0,0.5)",
            },
          }}
        />
      </div>

      {/* Controls bar */}
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

        <button
          type="button"
          onClick={onReset}
          title="Reset position & zoom"
          className="text-muted-foreground hover:text-foreground transition-colors shrink-0"
        >
          <RotateCcw className="w-3.5 h-3.5" />
        </button>

        <div className="w-px h-4 bg-border/50 shrink-0" />

        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-muted-foreground hover:text-foreground hover:bg-muted/50 shrink-0"
          onClick={onCancel}
          disabled={isApplying}
          title="Cancel crop"
        >
          <X className="w-3.5 h-3.5" />
        </Button>

        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-primary hover:text-primary hover:bg-primary/10 shrink-0"
          onClick={onApply}
          disabled={isApplying}
          title="Apply crop"
        >
          <Check className="w-3.5 h-3.5" />
        </Button>
      </div>
    </>
  )
}
