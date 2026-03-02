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
import type { ImageCropData } from "@/editor/lib/crop-data"
import { getCropWrapperStyle, getImageNaturalSize } from "@/editor/lib/crop-data"
import { ImageIcon, Plus, Settings2, ZoomIn, RotateCcw, Check, X } from "lucide-react"
import { cn } from "@/lib/utils"

const ASPECT_RATIO_MAP: Record<AspectRatio, number> = {
  square: 1,
  portrait: 3 / 4,
  landscape: 4 / 3,
}

export interface PortfolioImagePickerValue {
  /**
   * URL of the ORIGINAL (unmodified) image. Never replaced with a cropped blob.
   * Use `cropData` + `CroppedImage` to render the cropped result.
   */
  image: string
  aspectRatio?: AspectRatio
  frameStyle?: FrameStyle
  /**
   * CSS-based crop descriptor. When present, `CroppedImage` uses it to
   * position the original image so visually the same region is shown.
   */
  cropData?: ImageCropData
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

  // Restore crop editor state from saved cropData (if any)
  const [crop, setCrop] = useState({
    x: value.cropData?.editorX ?? 0,
    y: value.cropData?.editorY ?? 0,
  })
  const [zoom, setZoom] = useState(value.cropData?.zoom ?? 1)
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null)

  // Always crop from the original URL — never from a blob
  const originalImageRef = useRef<string>(value.image || "")

  // Reset crop state when a new image is picked externally
  const prevImageRef = useRef(value.image)
  useEffect(() => {
    if (value.image !== prevImageRef.current) {
      prevImageRef.current = value.image
      originalImageRef.current = value.image
      setCrop({ x: 0, y: 0 })
      setZoom(1)
      setCroppedAreaPixels(null)
      setShowCrop(false)
      // Clear stale cropData from parent state so the canvas reflects the new image immediately
      if (value.cropData) {
        onChange({ ...value, cropData: undefined })
      }
    }
  }, [value.image]) // eslint-disable-line react-hooks/exhaustive-deps

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

  /**
   * On apply we no longer rasterise the crop to a blob.
   * Instead we record the pixel area + natural image dimensions so that
   * `CroppedImage` can reproduce the exact same framing using CSS.
   */
  const handleApply = async () => {
    if (!croppedAreaPixels) return
    try {
      setIsApplying(true)
      const src = originalImageRef.current || current.image
      const { width: naturalWidth, height: naturalHeight } = await getImageNaturalSize(src)
      const cropData: ImageCropData = {
        editorX: crop.x,
        editorY: crop.y,
        zoom,
        area: croppedAreaPixels,
        naturalWidth,
        naturalHeight,
      }
      update({ cropData })
      setShowCrop(false)
    } catch (e) {
      console.error(e)
    } finally {
      setIsApplying(false)
    }
  }

  // Aspect ratio class for the preview container (matches the canvas output)
  const aspectClass = aspectRatios[current.aspectRatio]?.className ?? "aspect-[4/3]"

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
            {/* Inline Crop Area */}
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

            {/* Crop Controls Bar */}
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
            {/* Normal Photo Area — uses selected aspect ratio so preview matches canvas */}
            <div
              onClick={onOpenMediaPicker}
              className={cn(
                "group relative w-full cursor-pointer overflow-hidden bg-muted/50",
                aspectClass,
              )}
            >
              {current.image ? (
                <>
                  {/*
                   * Render the crop preview using the same CSS technique as CroppedImage:
                   * an absolutely-positioned inner wrapper scaled/offset to show exactly
                   * the saved crop area. Falls back to object-cover when no crop applied.
                   */}
                  <div className="absolute inset-0 transition-transform duration-500 group-hover:scale-105 overflow-hidden">
                    {value.cropData ? (
                      <div style={getCropWrapperStyle(value.cropData)}>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={current.image}
                          alt={label}
                          style={{ width: "100%", height: "100%", objectFit: "fill" }}
                        />
                      </div>
                    ) : (
                      /* eslint-disable-next-line @next/next/no-img-element */
                      <img
                        src={current.image}
                        alt={label}
                        style={{
                          position: "absolute",
                          inset: 0,
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                        }}
                      />
                    )}
                  </div>

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

            {/* Settings Bar */}
            <div className="flex items-center gap-1 p-1.5 bg-card border-t border-border/50">
              <div className="flex flex-1 items-center gap-1">
                <Select
                  value={current.aspectRatio}
                  onValueChange={(val) => update({ aspectRatio: val as AspectRatio, cropData: undefined })}
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