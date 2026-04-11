'use client'
"use client"

import { SiteImage } from '@/editor/components/editor/section-settings/ui/site-image'
import { cn } from '@/lib/utils'
import type { ThemeConfig } from '@/editor/lib/themes'
import type { PhotobookSectionContent } from '@/editor/lib/types'
import { SectionWrapper } from '../../../primitives/section-wrapper'

interface HighlightLumiereProps {
  sectionContent: PhotobookSectionContent
  theme: ThemeConfig
}

export function HighlightLumiere({ sectionContent, theme }: HighlightLumiereProps) {
  const { highlight } = sectionContent
  const imageSettings = highlight.images?.imageSettings?.[0]
  const imageUrl = highlight.images?.image ?? ''
  const hasImage = Boolean(imageUrl)
  const aspectRatio = imageSettings?.aspectRatio ?? 'square'
  const frameStyle = imageSettings?.frameStyle ?? 'none'

  return (
    <SectionWrapper
      id="highlight"
      themeForeground={theme.foreground}
      className={cn('overflow-x-clip', theme.muted)}
      padded={false}
      containerClassName="max-w-3xl px-8 @md:px-0 flex flex-col items-center text-center py-20 @md:py-28"
    >

        {/* Section header */}
        <div className="flex items-center gap-4 mb-14 w-full">
          <div className="h-px flex-1 bg-current opacity-10" />
          <span className={cn('text-[8px] uppercase tracking-[0.45em] opacity-25 shrink-0', theme.fontBody)}>
            05  В·  Highlight
          </span>
          <div className="h-px flex-1 bg-current opacity-10" />
        </div>

        {/* Title above photo */}
        {highlight.title && (
          <h2
            className={cn(
              'text-2xl @sm:text-3xl @md:text-4xl font-light italic tracking-tight leading-snug mb-10',
              theme.fontTitle,
            )}
          >
            {highlight.title}
          </h2>
        )}

        {/* Statement framed photo */}
        {hasImage && (
          <div className="w-full max-w-xl @md:max-w-2xl mb-10">
            <div className="border border-current/10 p-[3px]">
              <SiteImage
                src={imageUrl}
                alt={highlight.title ?? 'Highlight'}
                aspectRatio={aspectRatio}
                frameStyle={frameStyle}
                cropData={imageSettings?.cropData}
                unoptimized
                sizes="(max-width: 768px) 95vw, 65vw"
              />
            </div>
          </div>
        )}

        {/* Description */}
        {highlight.description && (
          <p
            className={cn(
              'text-sm font-light opacity-55 max-w-[42ch] leading-relaxed mb-10',
              theme.fontBody,
              theme.lineHeight,
            )}
          >
            {highlight.description}
          </p>
        )}

        {/* Pull quote */}
        {highlight.quote && (
          <>
            <div className="origin-center w-10 h-px bg-current opacity-15 mb-8" />
            <blockquote>
              <p
                className={cn(
                  'text-lg @md:text-xl font-light italic opacity-50 max-w-[38ch] leading-relaxed',
                  theme.fontBody,
                )}
              >
                &ldquo;{highlight.quote}&rdquo;
              </p>
            </blockquote>
          </>
        )}
    </SectionWrapper>
  )
}
