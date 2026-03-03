"use client"

import { useId } from "react"
import type { AspectRatio, FrameStyle, PhotoBlock } from "@/editor/lib/types"
import type { ImageCropData } from "@/editor/lib/crop-data"
import { type SectionImageRestrictions } from "@/editor/lib/restrictions/template-restrictions"
import { ImagePickerCore } from "@/editor/components/editor/section-settings/ui/image-picker-core"

/** PhotoBlock is the native type for photobook image slots. */
export interface PhotobookImagePickerValue extends PhotoBlock {}

interface PhotobookImagePickerProps {
  value?: PhotobookImagePickerValue
  onChange: (value: PhotobookImagePickerValue) => void
  label?: string
  showCaption?: boolean
  onOpenMediaPicker?: () => void
  restrictions?: SectionImageRestrictions
}

export function PhotobookImagePicker({
  value: valueProp,
  onChange,
  label = "Image",
  showCaption = true,
  onOpenMediaPicker,
  restrictions,
}: PhotobookImagePickerProps) {
  const autoId = useId()

  // Provide a stable default when no value has been set yet
  const value: PhotobookImagePickerValue = valueProp ?? {
    id: `pb-image-${autoId}`,
    image: "",
    caption: "",
    imageSettings: [{ aspectRatio: "square", frameStyle: "none" }],
  }

  // Normalise PhotoBlock → flat core value
  const settings = value.imageSettings[0] ?? {}
  const aspectRatio = (settings.aspectRatio as AspectRatio) ?? "square"
  const frameStyle = (settings.frameStyle as FrameStyle) ?? "none"
  const cropData = settings.cropData as ImageCropData | undefined

  return (
    <ImagePickerCore
      label={label}
      showCaption={showCaption}
      value={{
        image: value.image,
        aspectRatio,
        frameStyle,
        cropData,
        caption: value.caption,
      }}
      onChange={(patch) => {
        // Merge patch back into PhotoBlock shape
        const newSettings = {
          aspectRatio: patch.aspectRatio ?? aspectRatio,
          frameStyle: patch.frameStyle ?? frameStyle,
          // 'cropData' in patch handles { cropData: undefined } (reset) correctly
          cropData: "cropData" in patch ? (patch.cropData as ImageCropData | undefined) : cropData,
        }
        onChange({
          ...value,
          image: patch.image ?? value.image,
          caption: patch.caption ?? value.caption,
          imageSettings: [newSettings],
        })
      }}
      onOpenMediaPicker={onOpenMediaPicker}
      restrictions={restrictions}
    />
  )
}
