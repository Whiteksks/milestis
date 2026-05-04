'use client'

import type { PhotobookImageContent } from '@/editor/image/photobook/content'
import { findPhotobookRepeatingImage, SlotImage } from '@/editor/image'
import { cn } from '@/lib/utils'
import type { ThemeConfig } from '@/editor/lib/themes'
import type { PhotobookSectionContent } from '@/editor/lib/types'
import { SectionWrapper } from '../../../primitives/section-wrapper'
import { Animate } from '../../../primitives/animate'
import { SectionLabel } from '../../../primitives/section-label'
import { usePhotobookSectionNum } from '@/editor/hooks/usePhotobookSectionNum'

interface GallerySoleilProps {
  sectionContent: PhotobookSectionContent
  theme: ThemeConfig
  imageContent?: PhotobookImageContent
}

export function GallerySoleil({ sectionContent, theme, imageContent }: GallerySoleilProps) {
  const { gallery } = sectionContent
  const num = usePhotobookSectionNum('gallery')
  const images = gallery.photos ?? []

  return (
    <SectionWrapper
      id="gallery"
      themeForeground={theme.foreground}
      className={cn('overflow-x-clip', theme.background)}
    >
      <div className="max-w-7xl mx-auto px-8 @md:px-14 @lg:px-20 py-20 @md:py-28">
      {/* Header */}
      <div className="flex items-end justify-between gap-4 mb-12 @md:mb-16">
        <div className="space-y-4">
        {gallery.label && (
          <SectionLabel num={num} label={gallery.label} theme={theme} variant="rule-label" />
        )}
          {gallery.title && (
            <h2
              className={cn(
                'text-2xl @md:text-3xl font-light tracking-tight',
                theme.fontTitle,
              )}
            >
              {gallery.title}
            </h2>
          )}
        </div>
        {images.length > 0 && (
          <span
            className={cn(
              'shrink-0 mb-1 text-[10px] opacity-20 tabular-nums',
              theme.fontBody,
            )}
          >
            {String(images.length).padStart(2, '0')}
          </span>
        )}
      </div>

      {gallery.description && (
        <p className={cn('mb-12 text-sm font-light opacity-50 max-w-[45ch]', theme.lineHeight, theme.fontBody)}>
          {gallery.description}
        </p>
      )}

      {/* Two-column photo grid вЂ” no borders, gentle hover */}
      {images.length > 0 ? (
        <div className="grid grid-cols-1 @sm:grid-cols-2 @lg:grid-cols-3 gap-3 @md:gap-4">
          {images.map((photo, index) => {
            const galleryImage = imageContent ? findPhotobookRepeatingImage(imageContent, 'gallery', photo.id) : undefined

            return (
              <Animate
                key={photo.id}
                direction="up"
                distance={20}
                delay={index * 0.04}
                className="group"
              >
                <div className="overflow-hidden rounded-sm">
                  {galleryImage?.value.asset.src ? (
                    <SlotImage
                      slotId={galleryImage.slotId}
                      value={galleryImage.value}
                      alt={photo.caption ?? `Photo ${index + 1}`}
                      sizes="(max-width: 640px) 95vw, (max-width: 1024px) 48vw, 32vw"
                      imageClassName="transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                    />
                  ) : (
                    <div className={cn('w-full aspect-[3/4]', theme.muted)} />
                  )}
                </div>
                {photo.caption && (
                  <p className={cn('mt-2.5 text-[9px] uppercase tracking-widest opacity-30 leading-snug', theme.fontBody)}>
                    {photo.caption}
                  </p>
                )}
              </Animate>
            )
          })}
        </div>
      ) : (
        /* Empty state */
        <div className="grid grid-cols-1 @sm:grid-cols-2 @lg:grid-cols-3 gap-3">
          {[...Array(6)].map((_, i) => (
            <div key={i} className={cn('w-full aspect-[3/4] rounded-sm', theme.muted, 'opacity-40')} />
          ))}
        </div>
      )}
      </div>
    </SectionWrapper>
  )
}
