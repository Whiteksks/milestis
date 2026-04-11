'use client'
"use client"

import { SectionWrapper } from '../../../primitives/section-wrapper'
import { SiteImage } from '@/editor/components/editor/section-settings/ui/site-image'
import { cn } from '@/lib/utils'
import type { ThemeConfig } from '@/editor/lib/themes'
import type { PhotobookSectionContent } from '@/editor/lib/types'

interface GalleryChronicleProps {
  sectionContent: PhotobookSectionContent
  theme: ThemeConfig
}

export function GalleryChronicle({ sectionContent, theme }: GalleryChronicleProps) {
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

        {/* Editorial header */}
        <div className="mb-10 @md:mb-14">
          <div className={cn('border-t-2', theme.border)} />
          <div className="flex items-center justify-between mt-3">
            <span className={cn('text-[9px] uppercase tracking-[0.3em] opacity-35', theme.fontBody)}>
              Gallery
            </span>
            {photos.length > 0 && (
              <span className={cn('text-[9px] opacity-20', theme.fontBody)}>
                {String(photos.length).padStart(2, '0')} images
              </span>
            )}
          </div>
          {gallery.title && (
            <h2 className={cn('mt-4 text-2xl @md:text-3xl font-bold tracking-tight', theme.fontTitle)}>
              {gallery.title}
            </h2>
          )}
        </div>

        {photos.length > 0 && (
          <div className="space-y-3 @md:space-y-4">

            {/* Feature photo вЂ” full width, cinematic aspect */}
            {feature && (
              <div className="group">
                <div className="relative aspect-[16/7] @md:aspect-[21/9] overflow-hidden">
                  {feature.image ? (
                    <SiteImage
                      fillParent
                      unoptimized
                      src={feature.image}
                      alt={feature.caption ?? 'Feature'}
                      sizes="100vw"
                      imageClassName="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                    />
                  ) : (
                    <div className={cn('absolute inset-0', theme.muted)} />
                  )}
                </div>
                {feature.caption && (
                  <p className={cn('mt-2 text-[10px] uppercase tracking-wide opacity-35', theme.fontBody)}>
                    {feature.caption}
                  </p>
                )}
              </div>
            )}
            {rest.length > 0 && (
              <div className="grid grid-cols-1 @sm:grid-cols-2 @lg:grid-cols-3 gap-3 @md:gap-4">
                {rest.map((block, index) => (
                  <div
                    key={block.id}
                    className="group"
                  >
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
                    {block.caption && (
                      <p className={cn('mt-2 text-[10px] uppercase tracking-wide opacity-30', theme.fontBody)}>
                        {block.caption}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {gallery.description && (
          <p className={cn('mt-10 text-xs opacity-40 max-w-md', theme.lineHeight, theme.fontBody)}>
            {gallery.description}
          </p>
        )}
    </SectionWrapper>
  )
}
