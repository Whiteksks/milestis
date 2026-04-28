"use client"

import type { AspectRatio, FrameStyle } from "@/editor/lib/types"
import type { ImageCropData } from "@/editor/lib/crop-data"
import { type SectionImageRestrictions } from "@/editor/lib/restrictions/template-restrictions"
import { ImagePickerCore } from "@/editor/components/editor/section-settings/ui/image-picker-core"

/**
 * URL of the ORIGINAL (unmodified) image. Never replaced with a cropped blob.
 * Use `cropData` + `CroppedImage` to render the cropped result.
 */
export interface PortfolioImagePickerValue {
  image: string
  aspectRatio?: AspectRatio
  frameStyle?: FrameStyle
  cropData?: ImageCropData
  aspectRatioBeforeLock?: AspectRatio
}

interface PortfolioImagePickerProps {
  label?: string
  dense?: boolean
  value: PortfolioImagePickerValue
  onChange: (value: PortfolioImagePickerValue) => void
  onOpenMediaPicker?: () => void
  restrictions?: SectionImageRestrictions
}

export function PortfolioImagePicker({
  label = "Image",
  dense = false,
  value,
  onChange,
  onOpenMediaPicker,
  restrictions,
}: PortfolioImagePickerProps) {
  return (
    <ImagePickerCore
      label={label}
      dense={dense}
      value={{
        image: value.image,
        aspectRatio: value.aspectRatio ?? "portrait",
        frameStyle: value.frameStyle ?? "soft",
        cropData: value.cropData,
        aspectRatioBeforeLock: value.aspectRatioBeforeLock,
      }}
      onChange={(patch) => onChange({ ...value, ...patch })}
      onOpenMediaPicker={onOpenMediaPicker}
      restrictions={restrictions}
    />
  )
}