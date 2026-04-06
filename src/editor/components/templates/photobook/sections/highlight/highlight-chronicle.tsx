"use client"

import { SectionWrapper } from '../../../primitives/section-wrapper'
import { SiteImage } from '@/editor/components/editor/section-settings/ui/site-image'
import { cn } from '@/lib/utils'
import type { ThemeConfig } from '@/editor/lib/themes'
import type { PhotobookSectionContent } from '@/editor/lib/types'

interface HighlightChronicleProps {
  sectionContent: PhotobookSectionContent
  theme: ThemeConfig
}

export function HighlightChronicle({ sectionContent, theme }: HighlightChronicleProps) {
  const { highlight } = sectionContent
  const imageUrl = highlight.images?.image ?? ''
  const hasImage = Boolean(imageUrl)

  return (
    <SectionWrapper
      id="highlight"
      themeForeground={theme.foreground}
      className={cn('overflow-x-clip', theme.background)}
      padded={false}
      containerClassName="max-w-none p-0"
    >

      {/* Cinematic photo panel */}
      <div className="relative min-h-[60vh] @md:min-h-[75vh] flex flex-col justify-end overflow-hidden">

        {/* Background image + gradient overlay */}
        {hasImage ? (
          <div className="absolute inset-0">
            <SiteImage
              fillParent
              unoptimized
              src={imageUrl}
              alt={highlight.title ?? 'Highlight'}
              sizes="100vw"
              imageClassName="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent" />
          </div>
        ) : (
          <div className={cn('absolute inset-0', theme.muted)} />
        )}

        {/* Text overlay — anchored bottom-left */}
        <div className="relative z-10 px-8 @md:px-14 @lg:px-20 pb-12 @md:pb-16 space-y-4 max-w-4xl">
          <div className="flex items-center gap-3">
            <div className={cn('h-px w-8', hasImage ? 'bg-white/40' : theme.accent)} />
            <span
              className={cn(
                'text-[9px] uppercase tracking-[0.3em]',
                hasImage ? 'text-white/50' : 'opacity-40',
                theme.fontBody,
              )}
            >
              Highlight
            </span>
          </div>

          {highlight.title && (
            <h2
              className={cn(
                'text-3xl @sm:text-4xl @md:text-5xl @lg:text-6xl font-bold tracking-tight leading-tight',
                hasImage ? 'text-white' : '',
                theme.fontTitle,
              )}
            >
              {highlight.title}
            </h2>
          )}

          {highlight.description && (
            <p
              className={cn(
                'text-sm @md:text-base font-light max-w-[48ch]',
                hasImage ? 'text-white/60' : 'opacity-55',
                theme.lineHeight,
                theme.fontBody,
              )}
            >
              {highlight.description}
            </p>
          )}
        </div>
      </div>

      {/* Pull quote — below image, standard section background */}
      {highlight.quote && (
        <div className="px-8 @md:px-14 @lg:px-20 py-12 @md:py-16 max-w-7xl mx-auto w-full">
          <blockquote className={cn('border-l-2 pl-6', theme.border)}>
            <p
              className={cn(
                'text-xl @md:text-2xl font-light italic opacity-60',
                theme.lineHeight,
                theme.fontBody,
              )}
            >
              &ldquo;{highlight.quote}&rdquo;
            </p>
          </blockquote>
        </div>
      )}
    </SectionWrapper>
  )
}
