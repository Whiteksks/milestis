"use client"

import Image from "next/image"
import { cn } from "@/lib/utils"
import type { AspectRatio, FrameStyle } from "@/editor/lib/types"
import type { ImageCropData } from "@/editor/lib/crop-data"
import { getCropWrapperStyle } from "@/editor/lib/crop-data"
import { getFrameStyle } from "@/editor/lib/frame-styles"
import { getAspectRatioClass, ASPECT_RATIO_NUM } from "@/editor/lib/aspect-ratios"

interface SiteImageProps {
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
  /** Skip Next.js image optimisation (required for external URLs like Firebase Storage). */
  unoptimized?: boolean
  /** Hint to the browser about the rendered image size for responsive loading. */
  sizes?: string
  /**
   * When true, the outer container is `absolute inset-0` so it fills a parent
   * element that already controls size and aspect ratio.
   * Use for full-bleed cards and background images.
   */
  fillParent?: boolean
}

/**
 * Renders a site image with optional CSS-based crop, frame style, and aspect ratio.
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
export function SiteImage({
  src,
  alt = "",
  aspectRatio = "landscape",
  frameStyle = "soft",
  cropData,
  className,
  imageClassName,
  priority = false,
  unoptimized = false,
  sizes,
  fillParent = false,
}: SiteImageProps) {
  const frameClass = getFrameStyle(frameStyle)
  const isCircle = frameStyle === "circle"

  // When cropData is present, derive the aspect ratio from the actual crop
  // pixels so it's always pixel-perfect even if the caller passes a different
  // aspectRatio prop (should not happen, but defensive).
  const containerAspect = cropData
    ? `${cropData.area.width} / ${cropData.area.height}`
    : `${ASPECT_RATIO_NUM[aspectRatio]}`

  const innerContent = cropData ? (
    <div style={getCropWrapperStyle(cropData)}>
      <Image
        src={src}
        alt={alt}
        fill
        priority={priority}
        unoptimized={unoptimized}
        sizes={sizes}
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
      unoptimized={unoptimized}
      sizes={sizes}
      style={{ objectFit: "cover" }}
      className={cn("transition-transform duration-500", imageClassName)}
    />
  )

  if (fillParent) {
    return (
      <div className={cn("absolute inset-0 overflow-hidden", className)}>
        {innerContent}
      </div>
    )
  }

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
      {innerContent}
    </div>
  )
}

/** @deprecated Use {@link SiteImage} instead. */
export const CroppedImage = SiteImage
