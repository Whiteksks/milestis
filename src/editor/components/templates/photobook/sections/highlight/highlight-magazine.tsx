"use client"

import { SectionWrapper } from '../../../primitives/section-wrapper'
import { SiteImage } from '@/editor/components/editor/section-settings/ui/site-image'
import { cn } from '@/lib/utils'
import type { ThemeConfig } from '@/editor/lib/themes'
import type { PhotobookSectionContent } from '@/editor/lib/types'

interface HighlightMagazineProps {
  sectionContent: PhotobookSectionContent
  theme: ThemeConfig
}

export function HighlightMagazine({ sectionContent, theme }: HighlightMagazineProps) {
  const { highlight } = sectionContent
  const imageUrl = highlight.images?.image ?? ''
  const hasImage = Boolean(imageUrl)

  return (
    <SectionWrapper
      id="highlight"
      themeForeground={theme.foreground}
      className={cn('overflow-x-clip', theme.muted)}
      padded={false}
      containerClassName="max-w-none"
    >

      {/* Full-bleed feature photo */}
      <div className="relative min-h-[55vh] @md:min-h-[70vh] overflow-hidden">
        {hasImage ? (
          <>
            <div className="absolute inset-0">
              <SiteImage
                fillParent
                unoptimized
                src={imageUrl}
                alt={highlight.title ?? 'Highlight'}
                sizes="100vw"
                imageClassName="object-cover"
              />
              {/* Bottom-heavy gradient for text legibility */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/35 to-transparent" />
            </div>

            {/* Title anchored bottom-left over photo */}
            <div className="absolute bottom-0 left-0 right-0 z-10 px-8 @md:px-14 @lg:px-20 pb-10 @md:pb-14 space-y-3 max-w-5xl">
              <div className="flex items-center gap-3 mb-4">
                <div className="h-px w-8 bg-white/35" />
                <span className="text-[9px] uppercase tracking-[0.35em] text-white/50 font-sans">
                  Highlight
                </span>
              </div>

              {highlight.title && (
                <h2
                  className={cn(
                    'text-3xl @sm:text-4xl @md:text-5xl @lg:text-6xl font-bold tracking-tight leading-tight uppercase text-white',
                    theme.fontTitle,
                  )}
                >
                  {highlight.title}
                </h2>
              )}

              {highlight.description && (
                <p
                  className={cn(
                    'text-sm @md:text-base font-light text-white/55 max-w-[52ch]',
                    theme.lineHeight,
                    theme.fontBody,
                  )}
                >
                  {highlight.description}
                </p>
              )}
            </div>
          </>
        ) : (
          /* No image placeholder */
          <div className={cn('absolute inset-0 flex items-end px-8 @md:px-14 @lg:px-20 pb-14', theme.background)}>
            <div className="space-y-4 max-w-2xl">
              {highlight.title && (
                <h2
                  className={cn(
                    'text-4xl @md:text-6xl font-bold tracking-tight leading-tight uppercase',
                    theme.fontTitle,
                  )}
                >
                  {highlight.title}
                </h2>
              )}
              {highlight.description && (
                <p className={cn('text-sm opacity-55', theme.lineHeight, theme.fontBody)}>
                  {highlight.description}
                </p>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Pull quote strip — below the image */}
      {highlight.quote && (
        <div className={cn('border-t border-b border-current/10 py-10 @md:py-14')}>
          <div className="max-w-7xl mx-auto px-8 @md:px-14 @lg:px-20 grid grid-cols-1 @md:grid-cols-[1fr_3fr] gap-6 @md:gap-16 items-center">
            <span className={cn('text-[9px] uppercase tracking-[0.35em] opacity-30', theme.fontBody)}>
              p. 05
            </span>
            <blockquote>
              <p
                className={cn(
                  'text-xl @md:text-2xl @lg:text-3xl font-light italic leading-snug opacity-65',
                  theme.fontBody,
                )}
              >
                &ldquo;{highlight.quote}&rdquo;
              </p>
            </blockquote>
          </div>
        </div>
      )}
    </SectionWrapper>
  )
}
