'use client'

import { SectionWrapper } from '../../../primitives/section-wrapper'
import { SiteImage } from '@/editor/components/editor/section-settings/ui/site-image'
import { Animate } from '../../../primitives/animate'
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
    >
      {/* Full-bleed cinematic photo panel */}
      <div className="relative min-h-[60vh] @md:min-h-[75vh] overflow-hidden">
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
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-black/20" />
            </div>

            {/* Text anchored bottom-left */}
            <Animate
              trigger="mount"
              delay={0.1}
              distance={24}
              className="absolute bottom-0 left-0 right-0 z-10 px-8 @md:px-14 @lg:px-20 pb-12 @md:pb-16 max-w-5xl"
            >
              {highlight.label && (
                <div className="flex items-center gap-3 mb-5">
                  <div className="h-px w-8 bg-white/35" />
                  <span className="text-[9px] uppercase tracking-[0.4em] text-white/45">
                    {highlight.label}
                  </span>
                </div>
              )}
              {highlight.title && (
                <h2
                  className={cn(
                    'text-3xl @sm:text-4xl @md:text-5xl @lg:text-6xl font-bold tracking-tighter leading-[0.88] uppercase text-white',
                    theme.fontTitle,
                  )}
                >
                  {highlight.title}
                </h2>
              )}
              {highlight.description && (
                <p
                  className={cn(
                    'mt-4 @md:mt-5 text-sm @md:text-base font-light text-white/55 max-w-[52ch] border-l-2 border-white/20 pl-4 @md:pl-5',
                    theme.lineHeight,
                    theme.fontBody,
                  )}
                >
                  {highlight.description}
                </p>
              )}
            </Animate>
          </>
        ) : (
          /* No image: typographic panel */
          <div className={cn('absolute inset-0 flex items-end px-8 @md:px-14 @lg:px-20 pb-14', theme.background)}>
            <div className="space-y-5 max-w-3xl">
              {highlight.label && (
                <div className="flex items-center gap-3 mb-2">
                  <div className={cn('h-px w-8', theme.accent)} />
                  <span className={cn('text-[9px] uppercase tracking-[0.4em] opacity-40', theme.fontBody)}>
                    {highlight.label}
                  </span>
                </div>
              )}
              {highlight.title && (
                <h2
                  className={cn(
                    'text-4xl @md:text-6xl font-bold tracking-tighter leading-[0.88] uppercase',
                    theme.fontTitle,
                  )}
                >
                  {highlight.title}
                </h2>
              )}
              {highlight.description && (
                <p className={cn('text-sm @md:text-base opacity-55 max-w-[52ch]', theme.lineHeight, theme.fontBody)}>
                  {highlight.description}
                </p>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Pull quote — editorial full-width strip */}
      {highlight.quote && (
        <Animate
          trigger="mount"
          direction="none"
          className="px-8 @md:px-14 @lg:px-20 py-14 @md:py-20"
        >
          <div className="max-w-7xl mx-auto grid grid-cols-1 @md:grid-cols-[auto_1fr] gap-6 @md:gap-16 @lg:gap-24 items-start">
            <div className={cn('h-[2px] w-12 mt-4 shrink-0', theme.accent)} />
            <blockquote>
              <p
                className={cn(
                  'text-2xl @md:text-3xl @lg:text-4xl font-light italic leading-snug opacity-65',
                  theme.fontBody,
                )}
              >
                &ldquo;{highlight.quote}&rdquo;
              </p>
            </blockquote>
          </div>
        </Animate>
      )}
    </SectionWrapper>
  )
}
