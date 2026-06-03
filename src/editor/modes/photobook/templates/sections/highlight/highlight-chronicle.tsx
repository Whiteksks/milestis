'use client'

import { SectionWrapper } from '@/editor/components/templates/primitives/section-wrapper'
import type { PhotobookImageContent } from '@/editor/modes/photobook/image/content'
import { SlotImage } from '@/editor/image'
import { cn } from '@/lib/utils'
import type { ThemeConfig } from '@/editor/lib/config/themes'
import type { PhotobookSectionContent } from '../../../content-types'

interface HighlightChronicleProps {
  sectionContent: PhotobookSectionContent
  imageContent?: PhotobookImageContent
  theme: ThemeConfig
}

export function HighlightChronicle({ sectionContent, theme, imageContent }: HighlightChronicleProps) {
  const { highlight } = sectionContent
  const highlightImage = imageContent?.highlight
  const hasImage = Boolean(highlightImage?.value.asset.src)

  return (
    <SectionWrapper
      id="highlight"
      themeForeground={theme.foreground}
      className={cn('overflow-x-clip', theme.background)}
    >

      {/* Cinematic photo panel */}
      <div className="relative min-h-[60vh] @md:min-h-[75vh] flex flex-col justify-end overflow-hidden">

        {/* Background image + gradient overlay */}
        {hasImage && highlightImage ? (
          <div className="absolute inset-0">
            <SlotImage
              fillParent
              slotId={highlightImage.slotId}
              value={highlightImage.value}
              alt={highlight.title ?? 'Highlight'}
              sizes="100vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent" />
          </div>
        ) : (
          <div className={cn('absolute inset-0', theme.muted)} />
        )}

        {/* Text overlay ” anchored bottom-left */}
        <div className="relative z-10 px-8 @md:px-14 @lg:px-20 pb-12 @md:pb-16 space-y-4 max-w-4xl">
          <div className="flex items-center gap-3">
            <div className={cn('h-px w-8', hasImage ? 'bg-white/40' : theme.accent)} />
            {highlight.label && (
              <span
                className={cn(
                  'text-[9px] uppercase tracking-[0.3em]',
                  hasImage ? 'text-white/50' : 'opacity-40',
                  theme.fontBody,
                )}
              >
                {highlight.label}
              </span>
            )}
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

      {/* Pull quote ” below image, standard section background */}
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

