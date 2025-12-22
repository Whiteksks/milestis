"use client"

import { cn } from '@/lib/utils'
import { ThemeConfig } from '@/editor/lib/themes'
import { PhotobookSectionContent, FrameStyle } from '@/editor/lib/types'
import { PhotoBlockUI } from '../photoblock-ui'

interface TimelineGalleryProps {
  sectionContent: PhotobookSectionContent
  theme: ThemeConfig
  frameStyle: FrameStyle
}

export function TimelineGallery({ sectionContent, theme, frameStyle }: TimelineGalleryProps) {
  if (!sectionContent.gallery.images || sectionContent.gallery.images.length === 0) {
    return null
  }

  return (
    <section className="border-t border-border bg-background">
      <div className="container mx-auto px-4 py-16 max-w-6xl space-y-4">
        <h3 className={cn('text-xl md:text-2xl font-semibold', theme.fontTitle)}>
          {sectionContent.gallery.title || 'Gallery'}
        </h3>

        {sectionContent.gallery.description && (
          <p className="text-sm text-slate-600 max-w-2xl">
            {sectionContent.gallery.description}
          </p>
        )}

        <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {sectionContent.gallery.images.map((block) => (
            <PhotoBlockUI
              key={block.id}
              block={block}
              fallbackAspect="square"
              fallbackFrame={frameStyle}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
