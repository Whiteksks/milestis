"use client"

import { useRef, useEffect } from "react"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { aspectRatios } from "@/editor/lib/aspect-ratios"
import { frameStyles } from "@/editor/lib/frame-styles"
import type { AspectRatio, FrameStyle } from "@/editor/lib/types"
import type { ImageCropData } from "@/editor/lib/crop-data"
import { getCropWrapperStyle } from "@/editor/lib/crop-data"
import { useCrop } from "@/editor/hooks/use-crop"
import { InlineCropPanel } from "@/editor/components/editor/section-settings/ui/inline-crop-panel"
import { ImageIcon, Plus, Settings2 } from "lucide-react"
import { cn } from "@/lib/utils"

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
  const current = {
    image: value.image || "",
    aspectRatio: (value.aspectRatio as AspectRatio) || "landscape",
    frameStyle: (value.frameStyle as FrameStyle) || "soft",
  }

  const update = (patch: Partial<PortfolioImagePickerValue>) => {
    onChange({ ...value, ...current, ...patch })
  }

  // ── Crop logic ──────────────────────────────────────────────────────────────
  const {
    showCrop, setShowCrop,
    isApplying,
    crop, setCrop,
    zoom, setZoom,
    onCropComplete,
    handleReset,
    handleApply,
    originalImage,
    syncImage,
  } = useCrop({ image: current.image, cropData: value.cropData })

  // Reset crop whenever a new image is loaded externally
  const prevImageRef = useRef(value.image)
  useEffect(() => {
    if (value.image !== prevImageRef.current) {
      prevImageRef.current = value.image
      syncImage(value.image)
      if (value.cropData) {
        onChange({ ...value, cropData: undefined })
      }
    }
  }, [value.image]) // eslint-disable-line react-hooks/exhaustive-deps

  const handleApplyAndSave = async () => {
    const cropData = await handleApply()
    if (cropData) {
      update({ cropData })
      setShowCrop(false)
    }
  }

  // ── Derived ─────────────────────────────────────────────────────────────────
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
          <InlineCropPanel
            image={originalImage}
            aspectRatio={current.aspectRatio}
            frameStyle={current.frameStyle}
            crop={crop}
            zoom={zoom}
            isApplying={isApplying}
            onCropChange={setCrop}
            onZoomChange={setZoom}
            onCropComplete={onCropComplete}
            onReset={handleReset}
            onApply={handleApplyAndSave}
            onCancel={() => setShowCrop(false)}
          />
        ) : (
          <>
            {/* Normal Photo Area */}
            <div
              onClick={onOpenMediaPicker}
              className={cn(
                "group relative w-full cursor-pointer overflow-hidden bg-muted/50",
                aspectClass,
              )}
            >
              {current.image ? (
                <>
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
                        style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }}
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