'use client'

import { SectionWrapper } from '../../../primitives/section-wrapper'
import type { PhotobookImageContent } from '@/editor/image/photobook/content'
import { SlotImage } from '@/editor/image'
import { cn } from '@/lib/utils'
import type { ThemeConfig } from '@/editor/lib/themes'
import type { PhotobookSectionContent } from '@/editor/lib/types'

interface HighlightMemoirProps {
  sectionContent: PhotobookSectionContent
  theme: ThemeConfig
  imageContent?: PhotobookImageContent
}

export function HighlightMemoir({ sectionContent, theme, imageContent }: HighlightMemoirProps) {
  const { highlight } = sectionContent
  const highlightImage = imageContent?.highlight
  const hasImage = Boolean(highlightImage?.value.asset.src)

  return (
    <SectionWrapper
      id="highlight"
      themeForeground={theme.foreground}
      className={cn('overflow-x-clip', theme.muted)}
    >
      <div className="max-w-7xl mx-auto px-8 @md:px-12 @lg:px-20 py-16 @md:py-24 @lg:py-32">

        <div className="grid grid-cols-1 @md:grid-cols-2 gap-8 @md:gap-16 @lg:gap-20 items-center">

          {/* Left “ Photo (order-2 on mobile в†’ shows below text) */}
          <div className="order-2 @md:order-1">
            {hasImage && highlightImage ? (
              <div className={cn('overflow-hidden mx-auto @md:mx-0 w-full max-w-sm @md:max-w-none', theme.shadow, theme.elementGlow)}>
                <SlotImage
                  slotId={highlightImage.slotId}
                  value={highlightImage.value}
                  alt={highlight.title ?? 'Highlight'}
                  sizes="(max-width: 768px) 90vw, 45vw"
                />
              </div>
            ) : (
              <div className={cn('aspect-square bg-current/5', theme.background)} />
            )}
          </div>

          {/* Right “ Content (order-1 on mobile в†’ shows above photo) */}
          <div className="order-1 @md:order-2 space-y-6 @md:space-y-8">
            {/* Label */}
            {highlight.label && (
              <div className="flex items-center gap-4">
                <div className={cn('h-px w-12', theme.accent)} />
                <span className={cn('text-[10px] uppercase opacity-30', theme.letterSpacing, theme.fontBody)}>
                  {highlight.label}
                </span>
              </div>
            )}

            {/* Title */}
            {highlight.title && (
              <h2
                className={cn(
                  'text-3xl @md:text-4xl @lg:text-5xl font-bold tracking-tight leading-tight',
                  theme.fontTitle,
                )}
              >
                {highlight.title}
              </h2>
            )}

            {/* Description */}
            {highlight.description && (
              <p className={cn('text-base font-light opacity-60', theme.lineHeight, theme.fontBody)}>
                {highlight.description}
              </p>
            )}

            {/* Pull quote */}
            {highlight.quote && (
              <blockquote className="py-6 border-t border-b border-current/10">
                <p
                  className={cn(
                    'text-lg @md:text-xl font-light italic opacity-60',
                    theme.lineHeight,
                    theme.fontBody,
                  )}
                >
                  &ldquo;{highlight.quote}&rdquo;
                </p>
              </blockquote>
            )}
          </div>
        </div>
      </div>
    </SectionWrapper>
  )
}
