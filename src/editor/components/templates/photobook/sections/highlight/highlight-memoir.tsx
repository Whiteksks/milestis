'use client'
"use client"

import { SectionWrapper } from '../../../primitives/section-wrapper'
import { SiteImage } from '@/editor/components/editor/section-settings/ui/site-image'
import { cn } from '@/lib/utils'
import type { ThemeConfig } from '@/editor/lib/themes'
import type { PhotobookSectionContent } from '@/editor/lib/types'
import { getAspectRatioClass } from '@/editor/lib/aspect-ratios'
import { getFrameStyle } from '@/editor/lib/frame-styles'

interface HighlightMemoirProps {
  sectionContent: PhotobookSectionContent
  theme: ThemeConfig
}

export function HighlightMemoir({ sectionContent, theme }: HighlightMemoirProps) {
  const { highlight } = sectionContent
  const imageBlock = highlight.images
  const imageUrl = imageBlock?.image ?? ''
  const aspectRatio = imageBlock?.imageSettings?.[0]?.aspectRatio ?? 'square'
  const frameStyle = imageBlock?.imageSettings?.[0]?.frameStyle ?? 'none'

  return (
    <SectionWrapper
      id="highlight"
      themeForeground={theme.foreground}
      className={cn('overflow-x-clip', theme.muted)}
      padded={false}
      containerClassName="px-8 @md:px-12 @lg:px-20 py-16 @md:py-24 @lg:py-32"
    >

        <div className="grid grid-cols-1 @md:grid-cols-2 gap-8 @md:gap-16 @lg:gap-20 items-center">

          {/* Left вЂ“ Photo (order-2 on mobile в†’ shows below text) */}
          <div className="order-2 @md:order-1">
            <div
              className={cn(
                'relative overflow-hidden mx-auto @md:mx-0 w-full max-w-sm @md:max-w-none',
                getAspectRatioClass(aspectRatio),
                getFrameStyle(frameStyle),
                theme.shadow,
                theme.elementGlow,
              )}
            >
              {imageUrl ? (
                <SiteImage
                  fillParent
                  unoptimized
                  src={imageUrl}
                  alt={highlight.title ?? 'Highlight'}
                  sizes="(max-width: 768px) 90vw, 45vw"
                  cropData={imageBlock?.imageSettings?.[0]?.cropData}
                />
              ) : (
                <div className={cn('absolute inset-0', theme.background)} />
              )}
            </div>
          </div>

          {/* Right вЂ“ Content (order-1 on mobile в†’ shows above photo) */}
          <div className="order-1 @md:order-2 space-y-6 @md:space-y-8">
            {/* Label */}
            <div className="flex items-center gap-4">
              <div className={cn('h-px w-12', theme.accent)} />
              <span className={cn('text-[10px] uppercase opacity-30', theme.letterSpacing, theme.fontBody)}>
                Highlight
              </span>
            </div>

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
    </SectionWrapper>
  )
}
