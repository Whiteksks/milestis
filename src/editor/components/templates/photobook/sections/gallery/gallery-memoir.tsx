"use client"

import { SectionWrapper } from '../../../primitives/section-wrapper'
import { Animate } from '../../../primitives/animate'
import { SiteImage } from '@/editor/components/editor/section-settings/ui/site-image'
import { cn } from '@/lib/utils'
import type { ThemeConfig } from '@/editor/lib/themes'
import type { PhotobookSectionContent } from '@/editor/lib/types'

interface GalleryMemoirProps {
  sectionContent: PhotobookSectionContent
  theme: ThemeConfig
}

export function GalleryMemoir({ sectionContent, theme }: GalleryMemoirProps) {
  const { gallery } = sectionContent
  const photos = gallery.images ?? []

  return (
    <SectionWrapper
      id="gallery"
      themeForeground={theme.foreground}
      className={theme.background}
      padded={false}
      containerClassName="px-8 @md:px-12 @lg:px-20 py-20 @md:py-28"
    >

        {/* Header */}
        <Animate direction="up" distance={20} className="mb-12 @md:mb-16">
          <div className="flex items-center gap-4 mb-4">
            <div className={cn('h-px w-12', theme.accent)} />
            <span className={cn('text-[10px] uppercase opacity-30', theme.letterSpacing, theme.fontBody)}>
              Gallery
            </span>
          </div>
          <div className="flex items-end justify-between gap-4">
            {gallery.title && (
              <h2 className={cn('text-2xl @sm:text-3xl @md:text-4xl font-bold tracking-tight', theme.fontTitle)}>
                {gallery.title}
              </h2>
            )}
            {photos.length > 0 && (
              <span className={cn('hidden @sm:block text-[10px] opacity-20 shrink-0 mb-1', theme.fontBody)}>
                {String(photos.length).padStart(2, '0')}
              </span>
            )}
          </div>
        </Animate>

        {gallery.description && (
          <p className={cn('mb-12 text-sm opacity-50 max-w-md', theme.lineHeight, theme.fontBody)}>
            {gallery.description}
          </p>
        )}

        {/* Photo grid — 3 cols @lg, 2 @sm, 1 mobile. Fixed aspect-[4/5] for editorial consistency */}
        {photos.length > 0 && (
          <div className="grid grid-cols-1 @sm:grid-cols-2 @lg:grid-cols-3 gap-3 @md:gap-4">
            {photos.map((block, index) => (
              <Animate
                direction="up"
                distance={30}
                delay={index * 0.05}
                key={block.id}
                className="group"
              >
                <div className="relative aspect-[4/5] overflow-hidden bg-current/5">
                  {block.image ? (
                    <SiteImage
                      fillParent
                      unoptimized
                      src={block.image}
                      alt={block.caption ?? `Photo ${index + 1}`}
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      imageClassName="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                    />
                  ) : (
                    <div className={cn('absolute inset-0', theme.muted)} />
                  )}
                </div>
                {block.caption && (
                  <p className={cn('mt-2.5 text-xs opacity-40', theme.fontBody)}>
                    {block.caption}
                  </p>
                )}
              </Animate>
            ))}
          </div>
        )}
    </SectionWrapper>
  )
}
