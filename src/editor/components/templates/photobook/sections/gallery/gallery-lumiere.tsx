'use client'
"use client"

import { SiteImage } from '@/editor/components/editor/section-settings/ui/site-image'
import { cn } from '@/lib/utils'
import type { ThemeConfig } from '@/editor/lib/themes'
import type { PhotobookSectionContent } from '@/editor/lib/types'
import { SectionWrapper } from '../../../primitives/section-wrapper'
import { Animate } from '../../../primitives/animate'

interface GalleryLumiereProps {
  sectionContent: PhotobookSectionContent
  theme: ThemeConfig
}

export function GalleryLumiere({ sectionContent, theme }: GalleryLumiereProps) {
  const { gallery } = sectionContent
  const images = gallery.images ?? []

  return (
    <SectionWrapper
      id="gallery"
      themeForeground={theme.foreground}
      className={cn('overflow-x-clip', theme.background)}
    >
      <div className="max-w-5xl mx-auto px-8 @md:px-14 @lg:px-10 py-20 @md:py-28">

        {/* Section header */}
        <div className="flex items-center gap-4 mb-14 @md:mb-18">
          <div className="h-px flex-1 bg-current opacity-10" />
          <span className={cn('text-[8px] uppercase tracking-[0.45em] opacity-25 shrink-0', theme.fontBody)}>
            {String(images.length).padStart(2, '0')}  В·  Gallery
          </span>
          <div className="h-px flex-1 bg-current opacity-10" />
        </div>

        {/* Gallery title */}
        {gallery.title && (
          <h2
            className={cn(
              'text-center text-xl @md:text-2xl font-light italic opacity-55 mb-12',
              theme.fontTitle,
            )}
          >
            {gallery.title}
          </h2>
        )}

        {/* Contact-sheet grid */}
        {images.length > 0 ? (
          <div className="grid grid-cols-1 @sm:grid-cols-2 @lg:grid-cols-3 gap-4 @md:gap-5">
            {images.map((photo, index) => {
              const imageUrl = photo.image ?? ''
              const imageSettings = photo.imageSettings?.[0]
              const aspectRatio = imageSettings?.aspectRatio ?? 'portrait'
              const frameStyle = imageSettings?.frameStyle ?? 'none'
              const photoNum = String(index + 1).padStart(2, '0')

              return (
                <Animate
                  key={photo.id}
                  direction="up"
                  distance={20}
                  delay={index * 0.05}
                  className="flex flex-col gap-1.5"
                >
                  {/* Framed photo */}
                  <div className="border border-current/10 p-[3px]">
                    {imageUrl && (
                      <SiteImage
                        src={imageUrl}
                        alt={photo.caption ?? `Photo ${photoNum}`}
                        aspectRatio={aspectRatio}
                        frameStyle={frameStyle}
                        cropData={imageSettings?.cropData}
                        unoptimized
                        sizes="(max-width: 640px) 95vw, (max-width: 1024px) 45vw, 30vw"
                      />
                    )}
                  </div>

                  {/* Caption */}
                  <div className="flex items-baseline gap-2">
                    <span className={cn('text-[8px] opacity-20 shrink-0', theme.fontBody)}>
                      {photoNum}
                    </span>
                    {photo.caption && (
                      <p className={cn('text-[9px] uppercase tracking-widest opacity-25 leading-snug', theme.fontBody)}>
                        {photo.caption}
                      </p>
                    )}
                  </div>
                </Animate>
              )
            })}
          </div>
        ) : (
          /* Empty state */
          <div className="grid grid-cols-1 @sm:grid-cols-2 @lg:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="border border-current/10 p-[3px]">
                <div className="aspect-[4/5] bg-current/5" />
              </div>
            ))}
          </div>
        )}
      </div>
    </SectionWrapper>
  )
}
