"use client"

import { useState, useRef, useEffect, useCallback } from "react"
import Cropper, { type Area } from "react-easy-crop"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { aspectRatios } from "@/editor/lib/aspect-ratios"
import { frameStyles } from "@/editor/lib/frame-styles"
import type { AspectRatio, FrameStyle } from "@/editor/lib/types"
import { getCroppedImg } from "@/editor/lib/crop-image"
import { ImageIcon, Plus, Settings2, ZoomIn, RotateCcw, Check, X } from "lucide-react"

const ASPECT_RATIO_MAP: Record<AspectRatio, number> = {
  square: 1,
  portrait: 3 / 4,
  landscape: 4 / 3,
}

export interface PortfolioImagePickerValue {
  image: string
  aspectRatio?: AspectRatio
  frameStyle?: FrameStyle
  cropX?: number
  cropY?: number
  cropZoom?: number
}

interface PortfolioImagePickerProps {
  label?: string
  value: PortfolioImagePickerValue
  onChange: (value: PortfolioImagePickerValue) => void
  onOpenMediaPicker?: () => void
}

export function PortfolioImagePicker({
  label = "Image",
  value,
  onChange,
  onOpenMediaPicker,
}: PortfolioImagePickerProps) {
  const [showCrop, setShowCrop] = useState(false)
  const [isApplying, setIsApplying] = useState(false)

  // Persistent crop state — survives open/close cycles
  const [crop, setCrop] = useState({ x: value.cropX ?? 0, y: value.cropY ?? 0 })
  const [zoom, setZoom] = useState(value.cropZoom ?? 1)
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null)

  // Always crop from the original image, not from a previously cropped blob
  const originalImageRef = useRef<string>(value.image || "")
  const lastCroppedRef = useRef<string>("")

  // Reset when a brand-new image is picked externally
  const prevImageRef = useRef(value.image)
  useEffect(() => {
    if (value.image !== prevImageRef.current) {
      prevImageRef.current = value.image
      // Only update original when it's not our own crop result
      if (value.image !== lastCroppedRef.current) {
        originalImageRef.current = value.image
        setCrop({ x: 0, y: 0 })
        setZoom(1)
        setCroppedAreaPixels(null)
        setShowCrop(false)
      }
    }
  }, [value.image])

  const current = {
    image: value.image || "",
    aspectRatio: (value.aspectRatio as AspectRatio) || "landscape",
    frameStyle: (value.frameStyle as FrameStyle) || "soft",
  }

  const update = (patch: Partial<PortfolioImagePickerValue>) => {
    onChange({ ...value, ...current, ...patch })
  }

  const isCircle = current.frameStyle === "circle"
  const aspectNum = ASPECT_RATIO_MAP[current.aspectRatio] ?? (4 / 3)

  const onCropComplete = useCallback((_: Area, areaPixels: Area) => {
    setCroppedAreaPixels(areaPixels)
  }, [])

  const handleReset = () => {
    setCrop({ x: 0, y: 0 })
    setZoom(1)
  }

  const handleApply = async () => {
    if (!croppedAreaPixels) return
    try {
      setIsApplying(true)
      const cropped = await getCroppedImg(originalImageRef.current || current.image, croppedAreaPixels)
      lastCroppedRef.current = cropped
      update({ image: cropped, cropX: crop.x, cropY: crop.y, cropZoom: zoom })
      setShowCrop(false)
    } catch (e) {
      console.error(e)
    } finally {
      setIsApplying(false)
    }
  }

  // Preview: show the already-cropped blob directly with object-cover
  const cropImgStyle: React.CSSProperties = {
    position: "absolute",
    inset: 0,
    width: "100%",
    height: "100%",
    objectFit: "cover",
  }

  return (
    <div className="space-y-2.5">
      {label && (
        <Label className="text-xs font-medium text-muted-foreground ml-1">
          {label}
        </Label>
      )}

      <div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
        {showCrop && current.image ? (
          <>
            {/* в”Ђв”Ђ Inline Crop Area в”Ђв”Ђ */}
            <div className="relative w-full" style={{ height: 240 }}>
              <Cropper
                image={originalImageRef.current || current.image}
                crop={crop}
                zoom={zoom}
                aspect={aspectNum}
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

            {/* в”Ђв”Ђ Crop Controls Bar в”Ђв”Ђ */}
            <div className="flex items-center gap-1.5 p-1.5 bg-card border-t border-border/50">
              <ZoomIn className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
              <Slider
                min={1}
                max={3}
                step={0.01}
                value={[zoom]}
                onValueChange={([v]) => setZoom(v)}
                className="flex-1"
              />
              <span className="text-[10px] text-muted-foreground w-7 text-right tabular-nums shrink-0">
                {zoom.toFixed(1)}x
              </span>

              <button
                type="button"
                onClick={handleReset}
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
                onClick={() => setShowCrop(false)}
                disabled={isApplying}
                title="Cancel crop"
              >
                <X className="w-3.5 h-3.5" />
              </Button>

              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-primary hover:text-primary hover:bg-primary/10 shrink-0"
                onClick={handleApply}
                disabled={isApplying}
                title="Apply crop"
              >
                <Check className="w-3.5 h-3.5" />
              </Button>
            </div>
          </>
        ) : (
          <>
            {/* в”Ђв”Ђ Normal Photo Area в”Ђв”Ђ */}
            <div
              onClick={onOpenMediaPicker}
              className="group relative aspect-video w-full cursor-pointer overflow-hidden bg-muted/50"
            >
              {current.image ? (
                <>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={current.image}
                    alt={label}
                    style={cropImgStyle}
                    className="transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-foreground/40 opacity-0 transition-opacity duration-200 group-hover:opacity-100 flex items-center justify-center backdrop-blur-[2px]">
                    <div className="flex items-center gap-2 rounded-lg bg-background/90 p-1.5 px-3 shadow-lg">
                      <Plus className="w-3.5 h-3.5 text-foreground" />
                      <span className="text-xs font-medium text-foreground">Change</span>
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex flex-col items-center justify-center h-full gap-2 text-muted-foreground">
                  <ImageIcon className="w-6 h-6 stroke-[1.5]" />
                  <span className="text-xs font-medium">Select Media</span>
                </div>
              )}
            </div>

            {/* в”Ђв”Ђ Settings Bar в”Ђв”Ђ */}
            <div className="flex items-center gap-1 p-1.5 bg-card border-t border-border/50">
              <div className="flex flex-1 items-center gap-1">
                <Select
                  value={current.aspectRatio}
                  onValueChange={(val) => update({ aspectRatio: val as AspectRatio })}
                >
                  <SelectTrigger className="h-8 w-full border-none shadow-none bg-transparent hover:bg-muted/50 text-xs px-2 focus:ring-0">
                    <SelectValue placeholder="Ratio" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.values(aspectRatios).map((r) => (
                      <SelectItem key={r.id} value={r.id} className="text-xs">{r.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <div className="w-px h-4 bg-border/50" />

                <Select
                  value={current.frameStyle}
                  onValueChange={(val) => update({ frameStyle: val as FrameStyle })}
                >
                  <SelectTrigger className="h-8 w-full border-none shadow-none bg-transparent hover:bg-muted/50 text-xs px-2 focus:ring-0">
                    <SelectValue placeholder="Style" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.values(frameStyles).map((s) => (
                      <SelectItem key={s.id} value={s.id} className="text-xs">{s.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
                title="Crop Image"
                disabled={!current.image}
                onClick={() => setShowCrop(true)}
              >
                <Settings2 className="w-4 h-4" />
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
