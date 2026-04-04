import { AspectRatio, FrameStyle, PhotoBlock } from '@/editor/lib/types'
import { SiteImage } from '@/editor/components/editor/section-settings/ui/site-image'

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
      <SiteImage
        src={block.image}
        alt=""
        aspectRatio={aspect}
        frameStyle={frame}
        cropData={settings?.cropData}
        unoptimized
        sizes="260px"
      />
    </div>
  )
}
