"use client"

import Image from "next/image"
import { cn } from "@/lib/utils"
import type { AspectRatio, FrameStyle } from "@/editor/lib/types"
import type { ImageCropData } from "@/editor/lib/crop-data"
import { getCropWrapperStyle } from "@/editor/lib/crop-data"
import { getFrameStyle } from "@/editor/lib/frame-styles"
import { getAspectRatioClass, ASPECT_RATIO_NUM } from "@/editor/lib/aspect-ratios"

/**
 * Plain <img> wrapper for fill/crop modes where Next.js Image brings no benefit
 * (unoptimized Firebase URLs) but causes a hydration gap that makes images jump.
 * Inline styles are present in the SSR HTML from the very first paint.
 */
function FillImg({
  src,
  alt,
  objectFit = "cover",
  priority,
  className,
}: {
  src: string
  alt: string
  objectFit?: "cover" | "fill"
  priority?: boolean
  className?: string
}) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt}
      loading={priority ? "eager" : "lazy"}
      fetchPriority={priority ? "high" : undefined}
      className={className}
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        objectFit,
      }}
    />
  )
}

interface SiteImageProps {
  /** Original image URL — always the unmodified source, never a cropped blob. */
  src?: string | null
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
  aspectRatio = "square",
  frameStyle = "none",
  cropData,
  className,
  imageClassName,
  priority = false,
  unoptimized = false,
  sizes,
  fillParent = false,
}: SiteImageProps) {
  const resolvedSrc = src?.trim() ?? ""

  if (!resolvedSrc) return null

  const frameClass = getFrameStyle(frameStyle)
  const isCircle = frameStyle === "circle"

  const containerAspect = cropData
    ? `${cropData.area.width} / ${cropData.area.height}`
    : `${ASPECT_RATIO_NUM[aspectRatio]}`

  // cropData branch: pure CSS crop using <img> so styles are in SSR HTML from first paint.
  const innerContent = cropData ? (
    <div style={getCropWrapperStyle(cropData)}>
      <FillImg
        src={resolvedSrc}
        alt={alt}
        objectFit="fill"
        priority={priority}
        className={imageClassName}
      />
    </div>
  ) : (
    <Image
      src={resolvedSrc}
      alt={alt}
      fill
      priority={priority}
      unoptimized={unoptimized}
      sizes={sizes}
      style={{ objectFit: "cover" }}
      className={cn("transition-transform duration-500", imageClassName)}
    />
  )

  // fillParent branch: <img> so styles are in SSR HTML — no hydration jump on fullscreen photos.
  if (fillParent) {
    return (
      <div className={cn("absolute inset-0 overflow-hidden", className)}>
        <FillImg
          src={resolvedSrc}
          alt={alt}
          objectFit="cover"
          priority={priority}
          className={cn("transition-transform duration-500", imageClassName)}
        />
      </div>
    )
  }

  if (cropData) {
    return (
      <div
        className={cn(
          "relative w-full overflow-hidden",
          isCircle && "rounded-full",
          frameClass,
          className,
        )}
        style={{ aspectRatio: containerAspect }}
      >
        {innerContent}
      </div>
    )
  }

  return (
    <div
      className={cn(
        "relative w-full overflow-hidden",
        getAspectRatioClass(aspectRatio),
        isCircle && "rounded-full",
        frameClass,
        className,
      )}
    >
      {innerContent}
    </div>
  )
}

/** @deprecated Use {@link SiteImage} instead. */
export const CroppedImage = SiteImage
