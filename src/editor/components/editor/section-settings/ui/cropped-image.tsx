"use client"

import Image from "next/image"
import { cn } from "@/lib/utils"
import type { AspectRatio, FrameStyle } from "@/editor/lib/types"
import type { ImageCropData } from "@/editor/lib/crop-data"
import { getCropWrapperStyle } from "@/editor/lib/crop-data"
import { getFrameStyle } from "@/editor/lib/frame-styles"
import { getAspectRatioClass } from "@/editor/lib/aspect-ratios"

const ASPECT_RATIO_NUM: Record<AspectRatio, number> = {
  square: 1,
  portrait: 3 / 4,
  landscape: 4 / 3,
}

interface CroppedImageProps {
  /** Original image URL — always the unmodified source, never a cropped blob. */
  src: string
  alt?: string
  aspectRatio?: AspectRatio
  frameStyle?: FrameStyle
  /**
   * Crop data produced by PortfolioImagePicker.
   * When provided the component renders exactly the cropped region using
   * CSS transforms — no canvas / blob copy is created.
   * When absent the image is rendered with object-fit:cover at full size.
   */
  cropData?: ImageCropData
  /** Extra classes applied to the outermost container element. */
  className?: string
  /** Extra classes applied to the Next.js <Image> element. */
  imageClassName?: string
  /** Passed to Next.js Image for priority loading (above-the-fold images). */
  priority?: boolean
}

/**
 * Renders an image with optional CSS-based crop and frame style.
 *
 * The crop is reproduced by:
 *   1. Wrapping the image in an overflow:hidden container whose aspect-ratio
 *      matches the crop area.
 *   2. Placing the full-size image inside an absolutely-positioned inner
 *      wrapper that is scaled and offset so only the desired region shows.
 *
 * This is visually identical to the react-easy-crop preview without any
 * canvas / blob creation.
 */
export function CroppedImage({
  src,
  alt = "",
  aspectRatio = "landscape",
  frameStyle = "soft",
  cropData,
  className,
  imageClassName,
  priority = false,
}: CroppedImageProps) {
  const frameClass = getFrameStyle(frameStyle)
  const isCircle = frameStyle === "circle"

  // When cropData is present, derive the aspect ratio from the actual crop
  // pixels so it's always pixel-perfect even if the caller passes a different
  // aspectRatio prop (should not happen, but defensive).
  const containerAspect = cropData
    ? `${cropData.area.width} / ${cropData.area.height}`
    : `${ASPECT_RATIO_NUM[aspectRatio]}`

  return (
    <div
      className={cn(
        "relative w-full overflow-hidden",
        // Only apply Tailwind aspect-ratio class when there's no cropData;
        // with cropData we set it via inline style for pixel accuracy.
        !cropData && getAspectRatioClass(aspectRatio),
        isCircle && "rounded-full",
        frameClass,
        className,
      )}
      style={cropData ? { aspectRatio: containerAspect } : undefined}
    >
      {cropData ? (
        /*
         * Inner wrapper: sized to the full original image and offset so that
         * the crop area exactly fills the container.
         *
         * width  = naturalWidth  / area.width  * 100%  (of container width)
         * height = naturalHeight / area.height * 100%  (of container height)
         * left   = -area.x / area.width  * 100%
         * top    = -area.y / area.height * 100%
         *
         * Next.js Image with fill + objectFit:fill stretches to the wrapper.
         */
        <div style={getCropWrapperStyle(cropData)}>
          <Image
            src={src}
            alt={alt}
            fill
            priority={priority}
            style={{ objectFit: "fill" }}
            className={imageClassName}
          />
        </div>
      ) : (
        <Image
          src={src}
          alt={alt}
          fill
          priority={priority}
          style={{ objectFit: "cover" }}
          className={cn("transition-transform duration-500", imageClassName)}
        />
      )}
    </div>
  )
}
