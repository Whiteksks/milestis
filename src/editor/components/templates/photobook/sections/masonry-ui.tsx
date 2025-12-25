import type { ThemeConfig } from '@/editor/lib/themes'
import { AspectRatio, FrameStyle, PhotobookSlot } from '@/editor/lib/types'
import { getAspectRatioClass } from '@/editor/lib/aspect-ratios'
import { getFrameStyle } from '@/editor/lib/frame-styles'
import { cn } from '@/lib/utils'
import { motion } from 'framer-motion'

export function FeaturedCard({
  slot,
  theme,
}: {
  slot: PhotobookSlot
  theme: ThemeConfig
}) {
  const img = slot.images?.[0]
  return (
    <div className="h-full flex flex-col">
      {img && <img src={img} className="w-full h-2/3 object-cover" />}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <h3 className={cn('text-lg font-semibold', theme.fontTitle)}>{slot.label}</h3>
        {slot.caption && (
          <p className="text-sm text-muted-foreground line-clamp-3">{slot.caption}</p>
        )}
      </div>
    </div>
  )
}

export function MasonryImage({
  src,
  aspect,
  frame,
}: {
  src: string
  aspect?: AspectRatio
  frame?: FrameStyle
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="mb-6 hover:scale-105 hover:shadow-2xl transition-transform duration-300"
    >
      <div
        className={cn(
          'overflow-hidden border border-border shadow-lg rounded-3xl',
          getAspectRatioClass(aspect || 'portrait'),
          getFrameStyle(frame || 'soft'),
        )}
      >
        <img src={src} className="w-full h-full object-cover" />
      </div>
    </motion.div>
  )
}
