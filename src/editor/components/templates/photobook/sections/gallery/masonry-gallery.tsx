"use client"

import { cn } from '@/lib/utils'
import { ThemeConfig } from '@/editor/lib/themes'
import { PhotobookSectionContent, PhotobookSectionVisibility, PhotobookSlot } from '@/editor/lib/types'
import { MasonryImage } from '../masonry-ui'

interface MasonryGalleryProps {
  sectionContent: PhotobookSectionContent
  sectionVisibility: PhotobookSectionVisibility
  theme: ThemeConfig
}

export function MasonryGallery({ sectionContent, sectionVisibility, theme }: MasonryGalleryProps) {
  if (!sectionVisibility.showStory && !sectionVisibility.showGallery) {
    return null
  }

  const storySlots: PhotobookSlot[] = sectionContent.story.images || []
  const longForm = storySlots.slice(5)

  return (
    <section className="py-20 border-t border-border/60 bg-muted/10">
      <div className="container mx-auto px-6 mb-14 flex items-center justify-between max-w-350">
        <h2 className={cn('text-3xl sm:text-4xl font-semibold', theme.fontTitle)}>
          Лента воспоминаний
        </h2>
        {sectionContent.gallery.title && (
          <p className="text-xs text-muted-foreground uppercase tracking-[0.25em]">
            {sectionContent.gallery.title}
          </p>
        )}
      </div>

      <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 px-6 [column-fill:balance] max-w-350 mx-auto">
        {longForm.map((slot) =>
          slot.images?.[0] ? (
            <MasonryImage
              key={slot.id}
              src={slot.images[0]}
              aspect={slot.imageSettings?.[0]?.aspectRatio}
              frame={slot.imageSettings?.[0]?.frameStyle}
            />
          ) : null,
        )}

        {sectionVisibility.showGallery &&
          sectionContent.gallery.images?.map((block) => (
            <MasonryImage
              key={block.id}
              src={block.image}
              aspect={block.imageSettings?.[0]?.aspectRatio}
              frame={block.imageSettings?.[0]?.frameStyle}
            />
          ))}
      </div>
    </section>
  )
}
