"use client"

import { useRef, useEffect, useState } from "react"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { aspectRatios, RATIO_LABELS } from "@/editor/lib/aspect-ratios"
import { frameStyles } from "@/editor/lib/frame-styles"
import type { AspectRatio, FrameStyle } from "@/editor/lib/types"
import type { ImageCropData } from "@/editor/lib/crop-data"
import { useCrop } from "@/editor/hooks/use-crop"
import { buildFrameStylePatch, getFrameStyleRestrictions, getEffectiveAspectRatio } from "@/editor/lib/restrictions/frame-style-restrictions"
import { type SectionImageRestrictions } from "@/editor/lib/restrictions/template-restrictions"
import { InlineCropPanel } from "@/editor/components/editor/section-settings/ui/inline-crop-panel"
import { InlineStylePanel } from "@/editor/components/editor/section-settings/ui/inline-style-panel"
import { ImageIcon, Plus, Settings2 } from "lucide-react"

/**
 * Flat value that ImagePickerCore operates on.
 * Adapters (PortfolioImagePicker, PhotobookImagePicker) normalise their
 * domain-specific types to/from this shape.
 */
export interface ImagePickerCoreValue {
  image: string
  aspectRatio: AspectRatio
  frameStyle: FrameStyle
  cropData?: ImageCropData
  caption?: string
}

export interface ImagePickerCoreProps {
  value: ImagePickerCoreValue
  /** Called with only the changed fields — merge into your own type. */
  onChange: (patch: Partial<ImagePickerCoreValue>) => void
  label?: string
  /** Show the caption input below the picker. Default: false. */
  showCaption?: boolean
  onOpenMediaPicker?: () => void
  restrictions?: SectionImageRestrictions
}

export function ImagePickerCore({
  value,
  onChange,
  label = "Image",
  showCaption = false,
  onOpenMediaPicker,
  restrictions = {},
}: ImagePickerCoreProps) {
  const [showStylePicker, setShowStylePicker] = useState(false)

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
  } = useCrop({ image: value.image, cropData: value.cropData })

  // Reset crop state whenever a new image URL is loaded externally
  const prevImageRef = useRef(value.image)
  useEffect(() => {
    if (value.image !== prevImageRef.current) {
      prevImageRef.current = value.image
      syncImage(value.image)
      if (value.cropData) {
        onChange({ cropData: undefined })
      }
    }
  }, [value.image, syncImage, onChange])

  const handleApplyAndSave = async () => {
    const cropData = await handleApply()
    if (cropData) {
      onChange({ cropData })
      setShowCrop(false)
    }
  }

  return (
    <div className="space-y-2.5">
      {label && (
        <Label className="text-xs font-medium text-muted-foreground">
          {label}
        </Label>
      )}

      <div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
        {showCrop && value.image ? (
          <InlineCropPanel
            image={originalImage}
            aspectRatio={value.aspectRatio}
            frameStyle={value.frameStyle}
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
        ) : showStylePicker && !restrictions.hideFrameStyle ? (
          <InlineStylePanel
            image={value.image}
            value={value.frameStyle}
            aspectRatio={value.aspectRatio}
            onChange={(val) => onChange(buildFrameStylePatch(val))}
            onAspectRatioChange={(val) => onChange({ aspectRatio: val, cropData: undefined })}
            onBack={() => setShowStylePicker(false)}
          />
        ) : (
          <>
            {/* Photo area */}
            <div
              onClick={onOpenMediaPicker}
              className="group relative w-full h-64 cursor-pointer overflow-hidden bg-muted/50"
            >
              {value.image ? (
                <>
                  <div className="absolute inset-0 transition-transform duration-500 group-hover:scale-105 overflow-hidden">
                    {/* Always show the original photo — crop is applied in the template, not here */}
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={value.image}
                      alt={label}
                      style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }}
                    />
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

            {/* Settings bar — hidden when every control is restricted */}
            {!(restrictions.hideAspectRatio && restrictions.hideFrameStyle && restrictions.hideCrop) && (
              <div className="flex items-center gap-1 p-1.5 bg-card border-t border-border/50">
                <div className="flex flex-1 items-center gap-1 min-w-0">
                  {!restrictions.hideAspectRatio && (
                    <Select
                      value={getEffectiveAspectRatio(value.frameStyle, value.aspectRatio)}
                      onValueChange={(val) => onChange({ aspectRatio: val as AspectRatio, cropData: undefined })}
                      disabled={!!getFrameStyleRestrictions(value.frameStyle).lockedAspectRatio}
                    >
                      <SelectTrigger className="h-8 w-[72px] shrink-0 border-none shadow-none bg-transparent hover:bg-muted/50 text-xs px-2 focus:ring-0">
                        <SelectValue>
                          {RATIO_LABELS[getEffectiveAspectRatio(value.frameStyle, value.aspectRatio)]}
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent>
                        {Object.values(aspectRatios).map((r) => (
                          <SelectItem key={r.id} value={r.id} className="text-xs">
                            <span className="font-mono mr-1.5 text-muted-foreground">{RATIO_LABELS[r.id]}</span>
                            {r.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}

                  {!restrictions.hideAspectRatio && !restrictions.hideFrameStyle && (
                    <div className="w-px h-4 bg-border/50 shrink-0" />
                  )}

                  {!restrictions.hideFrameStyle && (
                    <button
                      disabled={!value.image}
                      onClick={() => setShowStylePicker(true)}
                      className="h-8 flex-1 min-w-0 px-2 text-xs text-left truncate rounded-md transition-colors disabled:opacity-40 disabled:pointer-events-none text-foreground/80 hover:text-foreground hover:bg-muted/50"
                    >
                      {frameStyles[value.frameStyle]?.name ?? "Style"}
                    </button>
                  )}
                </div>

                {!restrictions.hideCrop && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
                    title="Crop Image"
                    disabled={!value.image}
                    onClick={() => setShowCrop(true)}
                  >
                    <Settings2 className="w-4 h-4" />
                  </Button>
                )}
              </div>
            )}
          </>
        )}
      </div>

      {showCaption && (
        <div className="px-1">
          <Input
            value={value.caption || ""}
            onChange={(e) => onChange({ caption: e.target.value })}
            placeholder="Add caption..."
            className="h-7 border-b border-t-0 border-x-0 rounded-none bg-transparent text-xs italic text-muted-foreground focus-visible:ring-0 px-0 placeholder:text-muted-foreground/50 shadow-none"
          />
        </div>
      )}
    </div>
  )
}
