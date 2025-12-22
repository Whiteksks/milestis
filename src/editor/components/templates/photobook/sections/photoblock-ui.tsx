import { AspectRatio, FrameStyle, PhotoBlock } from '@/editor/lib/types'
import { getAspectRatioClass } from '@/editor/lib/aspect-ratios'
import { getFrameStyle } from '@/editor/lib/frame-styles'
import { cn } from '@/lib/utils'

export function PhotoBlockUI ({
  block,
  fallbackAspect,
  fallbackFrame,
}: {
  block: PhotoBlock
  fallbackAspect: AspectRatio
  fallbackFrame?: FrameStyle
}) {
  const settings = block.imageSettings?.[0]
  const aspect = settings?.aspectRatio || fallbackAspect || 'landscape'
  const frame = settings?.frameStyle || fallbackFrame || 'soft'

  return (
    <div className="overflow-hidden rounded-lg border bg-slate-100 shadow-sm w-full max-w-65">
      <div
        className={cn(
          'w-full h-full',
          getAspectRatioClass(aspect),
          getFrameStyle(frame),
        )}
      >
        <img
          src={block.image}
          className="w-full h-full object-cover"
          alt=""
        />
      </div>
    </div>
  )
}
