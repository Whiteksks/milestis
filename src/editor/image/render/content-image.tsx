'use client'

import { cn } from '@/lib/utils'
import { getFrameStyle } from '@/editor/lib/config/frame-styles'
import { parseImageRatio } from '../image-ratio'
import type { ResolvedImage } from '../render'

function toPercent(value: number): string {
  return `${value * 100}%`
}

export interface ContentImageProps {
  image: ResolvedImage
  alt?: string
  className?: string
  imageClassName?: string
  priority?: boolean
  sizes?: string
  /** When true, renders without aspect-ratio box — fills the nearest positioned ancestor.
   *  Use inside a container that has `position: relative/absolute` and explicit dimensions. */
  fillParent?: boolean
}

function BackgroundLayer({
  src,
  alt,
  backgroundSize = 'cover',
  backgroundPosition = 'center',
  className,
}: {
  src: string
  alt: string
  backgroundSize?: 'cover' | 'contain' | string
  backgroundPosition?: string
  className?: string
}) {
  return (
    <div
      role={alt ? 'img' : undefined}
      aria-label={alt || undefined}
      className={className}
      style={{
        position: 'absolute',
        inset: 0,
        backgroundImage: `url(${JSON.stringify(src).slice(1, -1)})`,
        backgroundRepeat: 'no-repeat',
        backgroundSize,
        backgroundPosition,
      }}
    />
  )
}

export function ContentImage({
  image,
  alt,
  className,
  imageClassName,
  fillParent = false,
}: ContentImageProps) {
  const crop = image.crop
  // Aspect ratio is always derived from the resolved ratio value, not from crop rect
  // (crop rect values are normalized 0–1 percentages and cannot represent aspect ratio).
  const aspectRatio = parseImageRatio(image.ratio)
  const frameClassName = getFrameStyle(image.frameStyle)
  const resolvedAlt = alt ?? image.asset.alt ?? ''

  if (fillParent) {
    return (
      <div
        className={className}
        style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}
        data-image-slot={image.slotId}
        data-image-usage={image.usage}
      >
        <BackgroundLayer
          src={image.asset.src}
          alt={resolvedAlt}
          backgroundSize="cover"
          backgroundPosition={image.objectPosition}
          className={imageClassName}
        />
      </div>
    )
  }

  return (
    <div
      className={cn(frameClassName, className)}
      // All layout-critical properties are inline — present in SSR HTML from first paint.
      // Tailwind classes only apply after CSS loads, causing squeeze/jump on slow connections.
      style={{ position: 'relative', width: '100%', overflow: 'hidden', aspectRatio }}
      data-image-slot={image.slotId}
      data-image-usage={image.usage}
    >
      {crop ? (
        // Crop branch: expand the background layer beyond the container and offset it
        // so only the desired region is visible. This keeps first-paint geometry
        // stable without relying on img intrinsic sizing.
        <div
          style={{
            position: 'absolute',
            width: toPercent(1 / crop.rect.width),
            height: toPercent(1 / crop.rect.height),
            left: toPercent(-crop.rect.left / crop.rect.width),
            top: toPercent(-crop.rect.top / crop.rect.height),
          }}
        >
          <BackgroundLayer
            src={image.asset.src}
            alt={resolvedAlt}
            backgroundSize="100% 100%"
            backgroundPosition="top left"
            className={imageClassName}
          />
        </div>
      ) : (
        <BackgroundLayer
          src={image.asset.src}
          alt={resolvedAlt}
          backgroundSize={image.fit === 'contain' ? 'contain' : 'cover'}
          backgroundPosition={image.objectPosition}
          className={imageClassName}
        />
      )}
    </div>
  )
}
