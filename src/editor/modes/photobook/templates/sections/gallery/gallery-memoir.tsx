'use client'

import type { PhotobookImageContent } from '@/editor/modes/photobook/image/content'
import { findPhotobookRepeatingImage, SlotImage } from '@/editor/image'
import { SectionWrapper } from '@/editor/components/templates/primitives/section-wrapper'
import { Animate } from '@/editor/components/templates/primitives/animate'
import { cn } from '@/lib/utils'
import type { ThemeConfig } from '@/editor/lib/config/themes'
import type { PhotobookSectionContent } from '../../../content-types'

interface GalleryMemoirProps {
  sectionContent: PhotobookSectionContent
  theme: ThemeConfig
  imageContent?: PhotobookImageContent
}

export function GalleryMemoir({ sectionContent, theme, imageContent }: GalleryMemoirProps) {
  const { gallery } = sectionContent
  const photos = gallery.photos ?? []
  const [hero, ...rest] = photos

  return (
    <SectionWrapper
      id="gallery"
      themeForeground={theme.foreground}
      className={theme.background}
    >
      <div className="max-w-7xl mx-auto px-8 @md:px-12 @lg:px-20 py-20 @md:py-28">

        {/* Header */}
        <Animate direction="up" distance={20} className="mb-14 @md:mb-20">
          <div className="flex items-end justify-between gap-8 pb-6 border-b border-current/10">
            <div className="space-y-2">
              {gallery.label && (
                <span className={cn('block text-[9px] uppercase tracking-[0.4em] opacity-30', theme.fontBody)}>
                  {gallery.label}
                </span>
              )}
              {gallery.title && (
                <h2 className={cn('text-3xl @sm:text-4xl @md:text-5xl font-light tracking-tight', theme.fontTitle)}>
                  {gallery.title}
                </h2>
              )}
            </div>
            {photos.length > 0 && (
              <span className={cn('text-[9px] opacity-15 shrink-0', theme.fontBody)}>
                {String(photos.length).padStart(2, '0')}
              </span>
            )}
          </div>
          {gallery.description && (
            <p className={cn('mt-5 text-sm opacity-45 max-w-lg', theme.lineHeight, theme.fontBody)}>
              {gallery.description}
            </p>
          )}
        </Animate>

        {/* Photo grid ” 3 cols @lg, 2 @sm, 1 mobile. Fixed aspect-[4/5] for editorial consistency */}
        {photos.length > 0 && (
          <div className="space-y-4 @md:space-y-6">

            {/* Hero photo — full-width, cinematic 3:2 */}
            {hero && (
              <Animate direction="up" distance={30} className="group">
                {(() => {
                  const heroImage = imageContent ? findPhotobookRepeatingImage(imageContent, 'gallery', hero.id) : undefined

                  return (
                <div className="bg-current/[0.04] p-2 @md:p-3">
                  <div className="relative aspect-[3/2] @md:aspect-[16/9] overflow-hidden bg-current/5">
                    {heroImage?.value.asset.src ? (
                      <SlotImage
                        slotId={heroImage.slotId}
                        value={heroImage.value}
                        fillParent
                        alt={hero.caption ?? 'Gallery photo'}
                        sizes="100vw"
                        imageClassName="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.02]"
                      />
                    ) : (
                      <div className="absolute inset-0 bg-current/5" />
                    )}
                  </div>
                  <div className="flex items-baseline gap-3 mt-2 px-1">
                    <span className={cn('text-[9px] opacity-20 shrink-0 tabular-nums', theme.fontBody)}>01</span>
                    {hero.caption && (
                      <p className={cn('text-[10px] opacity-35 truncate', theme.fontBody)}>{hero.caption}</p>
                    )}
                  </div>
                </div>
                  )
                })()}
              </Animate>
            )}

            {/* Remaining photos — 2-col @sm, 3-col @lg, passepartout mats */}
            {rest.length > 0 && (
              <div className="grid grid-cols-2 @lg:grid-cols-3 gap-3 @md:gap-4">
                {rest.map((block, i) => (
                  <Animate
                    direction="up"
                    distance={28}
                    delay={(i + 1) * 0.06}
                    key={block.id}
                    className="group"
                  >
                    {(() => {
                      const galleryImage = imageContent ? findPhotobookRepeatingImage(imageContent, 'gallery', block.id) : undefined

                      return (
                    <div className="bg-current/[0.04] p-1.5 @md:p-2">
                      <div className="relative aspect-[4/5] overflow-hidden bg-current/5">
                        {galleryImage?.value.asset.src ? (
                          <SlotImage
                            slotId={galleryImage.slotId}
                            value={galleryImage.value}
                            fillParent
                            alt={block.caption ?? `Photo ${i + 2}`}
                            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 50vw, 33vw"
                            imageClassName="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                          />
                        ) : (
                          <div className="absolute inset-0 bg-current/5" />
                        )}
                      </div>
                      <div className="flex items-baseline gap-2 mt-1.5 px-0.5">
                        <span className={cn('text-[8px] opacity-20 shrink-0 tabular-nums', theme.fontBody)}>
                          {String(i + 2).padStart(2, '0')}
                        </span>
                        {block.caption && (
                          <p className={cn('text-[10px] opacity-35 truncate', theme.fontBody)}>{block.caption}</p>
                        )}
                      </div>
                    </div>
                      )
                    })()}
                  </Animate>
                ))}
              </div>
            )}

          </div>
        )}
      </div>
    </SectionWrapper>
  )
}

