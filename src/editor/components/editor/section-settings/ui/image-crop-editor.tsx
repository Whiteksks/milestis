"use client"

import { useCallback, useState } from "react"
import Cropper, { type Area } from "react-easy-crop"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Check, X, ZoomIn, RotateCcw } from "lucide-react"
import type { AspectRatio, FrameStyle } from "@/editor/lib/types"
import type { ImageCropData } from "@/editor/lib/crop-data"
import { getImageNaturalSize } from "@/editor/lib/crop-data"

const ASPECT_RATIO_MAP: Record<AspectRatio, number> = {
  square: 1,
  portrait: 3 / 4,
  landscape: 4 / 3,
}

interface ImageCropEditorProps {
  /** Original (unmodified) image URL — never a previously-cropped blob. */
  image: string
  aspectRatio: AspectRatio
  frameStyle: FrameStyle
  /** Initial editor state — pass values from a previously saved ImageCropData. */
  initialEditorX?: number
  initialEditorY?: number
  initialZoom?: number
  /**
   * Called when the user confirms the crop.
   * Returns ImageCropData — no canvas / blob is created.
   */
  onApply: (cropData: ImageCropData) => void
  onCancel: () => void
}

export function ImageCropEditor({
  image,
  aspectRatio,
  frameStyle,
  initialEditorX = 0,
  initialEditorY = 0,
  initialZoom = 1,
  onApply,
  onCancel,
}: ImageCropEditorProps) {
  const [crop, setCrop] = useState({ x: initialEditorX, y: initialEditorY })
  const [zoom, setZoom] = useState(initialZoom)
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null)
  const [isApplying, setIsApplying] = useState(false)

  const isCircle = frameStyle === "circle"
  const aspect = ASPECT_RATIO_MAP[aspectRatio] ?? (4 / 3)

  const handleReset = () => {
    setZoom(1)
    setCrop({ x: 0, y: 0 })
  }

  const onCropComplete = useCallback((_: Area, areaPixels: Area) => {
    setCroppedAreaPixels(areaPixels)
  }, [])

  /**
   * Build an ImageCropData value from the current crop selection.
   * No canvas / blob is created — the caller renders the result via
   * <CroppedImage> which reproduces the crop purely with CSS.
   */
  const handleApply = async () => {
    if (!croppedAreaPixels) return
    try {
      setIsApplying(true)
      const { width: naturalWidth, height: naturalHeight } = await getImageNaturalSize(image)
      const cropData: ImageCropData = {
        editorX: crop.x,
        editorY: crop.y,
        zoom,
        area: croppedAreaPixels,
        naturalWidth,
        naturalHeight,
      }
      onApply(cropData)
    } catch (e) {
      console.error(e)
    } finally {
      setIsApplying(false)
    }
  }

  return (
    <div className="rounded-xl border border-border bg-card overflow-hidden shadow-sm">
      {/* Crop area */}
      <div className="relative w-full" style={{ height: 220 }}>
        <Cropper
          image={image}
          crop={crop}
          zoom={zoom}
          aspect={aspect}
          cropShape={isCircle ? "round" : "rect"}
          showGrid={!isCircle}
          onCropChange={setCrop}
          onZoomChange={setZoom}
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

      {/* Controls */}
      <div className="p-3 space-y-3 border-t border-border/50 bg-card">
        {/* Zoom */}
        <div className="flex items-center gap-2.5">
          <ZoomIn className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
          <Slider
            min={1}
            max={3}
            step={0.01}
            value={[zoom]}
            onValueChange={([v]) => setZoom(v)}
            className="flex-1"
          />
          <span className="text-[10px] text-muted-foreground w-7 text-right tabular-nums">
            {zoom.toFixed(1)}x
          </span>
          <button
            type="button"
            onClick={handleReset}
            title="Reset position & zoom"
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Action buttons */}
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            className="flex-1 h-8 text-xs"
            onClick={onCancel}
            disabled={isApplying}
          >
            <X className="w-3.5 h-3.5 mr-1" />
            Cancel
          </Button>
          <Button
            size="sm"
            className="flex-1 h-8 text-xs"
            onClick={handleApply}
            disabled={isApplying}
          >
            <Check className="w-3.5 h-3.5 mr-1" />
            {isApplying ? "Applying…" : "Apply"}
          </Button>
        </div>
      </div>
    </div>
  )
}