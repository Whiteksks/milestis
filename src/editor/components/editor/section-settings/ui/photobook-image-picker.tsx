"use client"

import { useId } from "react"
import type { AspectRatio, FrameStyle, PhotoBlock } from "@/editor/lib/types"
import type { ImageCropData } from "@/editor/lib/crop-data"
import { type SectionImageRestrictions } from "@/editor/lib/restrictions/template-restrictions"
import { ImagePickerCore } from "@/editor/components/editor/section-settings/ui/image-picker-core"

/** PhotoBlock is the native type for photobook image slots. */
export type PhotobookImagePickerValue = PhotoBlock

interface PhotobookImagePickerProps {
  value?: PhotobookImagePickerValue
  onChange: (value: PhotobookImagePickerValue) => void
  label?: string
  dense?: boolean
  showCaption?: boolean
  showDescription?: boolean
  onOpenMediaPicker?: () => void
  restrictions?: SectionImageRestrictions
}

export function PhotobookImagePicker({
  value: valueProp,
  onChange,
  label = "Image",
  dense = false,
  showCaption = true,
  showDescription = false,
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
  const settings = value.imageSettings?.[0] ?? {}
  const aspectRatio = (settings.aspectRatio as AspectRatio) ?? "square"
  const frameStyle = (settings.frameStyle as FrameStyle) ?? "none"
  const cropData = settings.cropData as ImageCropData | undefined
  const aspectRatioBeforeLock = settings.aspectRatioBeforeLock as AspectRatio | undefined

  return (
    <ImagePickerCore
      label={label}
      dense={dense}
      showCaption={showCaption}
      showDescription={showDescription}
      value={{
        image: value.image,
        aspectRatio,
        frameStyle,
        cropData,
        aspectRatioBeforeLock,
        caption: value.caption,
        description: value.description,
      }}
      onChange={(patch) => {
        // Merge patch back into PhotoBlock shape
        const newSettings = {
          aspectRatio: patch.aspectRatio ?? aspectRatio,
          frameStyle: patch.frameStyle ?? frameStyle,
          // 'cropData' in patch handles { cropData: undefined } (reset) correctly
          cropData: "cropData" in patch ? (patch.cropData as ImageCropData | undefined) : cropData,
          aspectRatioBeforeLock: "aspectRatioBeforeLock" in patch ? patch.aspectRatioBeforeLock : aspectRatioBeforeLock,
        }
        onChange({
          ...value,
          image: patch.image ?? value.image,
          caption: patch.caption ?? value.caption,
          description: patch.description ?? value.description,
          imageSettings: [newSettings],
        })
      }}
      onOpenMediaPicker={onOpenMediaPicker}
      restrictions={restrictions}
    />
  )
}
