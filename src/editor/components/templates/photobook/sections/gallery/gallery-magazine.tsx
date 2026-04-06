"use client"

import { SectionWrapper } from '../../../primitives/section-wrapper'
import { SiteImage } from '@/editor/components/editor/section-settings/ui/site-image'
import { cn } from '@/lib/utils'
import type { ThemeConfig } from '@/editor/lib/themes'
import type { PhotobookSectionContent } from '@/editor/lib/types'

interface GalleryMagazineProps {
  sectionContent: PhotobookSectionContent
  theme: ThemeConfig
}

export function GalleryMagazine({ sectionContent, theme }: GalleryMagazineProps) {
  const { gallery } = sectionContent
  const photos = gallery.images ?? []
  const [feature, ...rest] = photos

  return (
    <SectionWrapper
      id="gallery"
      themeForeground={theme.foreground}
      className={theme.background}
      padded={false}
      containerClassName="px-8 @md:px-14 @lg:px-20 py-16 @md:py-24"
    >

      {/* Magazine spread header */}
      <div className="mb-10 @md:mb-14">
          <div className="flex items-center justify-between">
            <div className={cn('h-[2px] flex-1', theme.accent)} />
            <span className={cn('px-5 text-[9px] uppercase tracking-[0.35em] opacity-35', theme.fontBody)}>
              Gallery
            </span>
            <div className="h-px flex-1 bg-current opacity-10" />
            <span className={cn('pl-5 text-[9px] opacity-20', theme.fontBody)}>
              {String(photos.length).padStart(2, '0')}
            </span>
          </div>
          {gallery.title && (
            <h2
              className={cn(
                'mt-6 text-3xl @md:text-4xl font-bold tracking-tight uppercase',
                theme.fontTitle,
              )}
            >
              {gallery.title}
            </h2>
          )}
          {gallery.description && (
            <p className={cn('mt-3 text-xs opacity-40 max-w-md', theme.lineHeight, theme.fontBody)}>
              {gallery.description}
            </p>
          )}
      </div>

      {photos.length > 0 && (
        <div className="space-y-3 @md:space-y-4">

          {/* Feature — hero full-width, widescreen */}
          {feature && (
            <div>
                <div className="relative aspect-[21/9] @md:aspect-[21/8] overflow-hidden group">
                  {feature.image ? (
                    <SiteImage
                      fillParent
                      unoptimized
                      src={feature.image}
                      alt={feature.caption ?? 'Feature'}
                      sizes="100vw"
                      imageClassName="object-cover transition-transform duration-700 group-hover:scale-[1.02]"
                    />
                  ) : (
                    <div className={cn('absolute inset-0', theme.muted)} />
                  )}
                </div>
                {feature.caption && (
                  <p className={cn('mt-2 text-[9px] uppercase tracking-[0.3em] opacity-30', theme.fontBody)}>
                    {feature.caption}
                  </p>
                )}
            </div>
          )}

          {/* Remaining — editorial 3-column grid with numbered captions */}
          {rest.length > 0 && (
            <div className="grid grid-cols-1 @sm:grid-cols-2 @lg:grid-cols-3 gap-3 @md:gap-4 pt-2">
              {rest.map((block, index) => (
                <div key={block.id} className="group">
                    <div className="relative aspect-[4/5] overflow-hidden">
                      {block.image ? (
                        <SiteImage
                          fillParent
                          unoptimized
                          src={block.image}
                          alt={block.caption ?? `Photo ${index + 2}`}
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                          imageClassName="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                        />
                      ) : (
                        <div className={cn('absolute inset-0', theme.muted)} />
                      )}
                    </div>
                    <div className="mt-2 flex items-start gap-3">
                      <span className={cn('text-[9px] opacity-20 shrink-0 mt-0.5', theme.fontBody)}>
                        {String(index + 2).padStart(2, '0')}
                      </span>
                      {block.caption && (
                        <p className={cn('text-[9px] uppercase tracking-[0.2em] opacity-35 leading-relaxed', theme.fontBody)}>
                          {block.caption}
                        </p>
                      )}
                    </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </SectionWrapper>
  )
}
