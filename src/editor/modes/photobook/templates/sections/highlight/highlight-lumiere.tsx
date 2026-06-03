'use client'

import type { PhotobookImageContent } from '@/editor/modes/photobook/image/content'
import { SlotImage } from '@/editor/image'
import { cn } from '@/lib/utils'
import type { ThemeConfig } from '@/editor/lib/config/themes'
import type { PhotobookSectionContent } from '../../../content-types'
import { SectionWrapper } from '@/editor/components/templates/primitives/section-wrapper'
import { Animate } from '@/editor/components/templates/primitives/animate'

interface HighlightLumiereProps {
  sectionContent: PhotobookSectionContent
  theme: ThemeConfig
  imageContent?: PhotobookImageContent
}

export function HighlightLumiere({ sectionContent, theme, imageContent }: HighlightLumiereProps) {
  const { highlight } = sectionContent
  const highlightImage = imageContent?.highlight
  const hasImage = Boolean(highlightImage?.value.asset.src)

  return (
    <SectionWrapper
      id="highlight"
      themeForeground={theme.foreground}
      className={cn('overflow-x-clip', theme.muted)}
    >
      <div className="max-w-3xl mx-auto px-8 @md:px-0 py-20 @md:py-28 flex flex-col items-center">

        {/* Thin section divider */}
        <Animate trigger="mount" direction="none" className="w-full flex items-center gap-4 mb-14 @md:mb-18">
          <div className="h-px flex-1 bg-current opacity-10" />
          {highlight.label && (
            <span className={cn('text-[9px] uppercase tracking-[0.5em] opacity-25', theme.fontBody)}>
              {highlight.label}
            </span>
          )}
          {!highlight.label && <div className="w-1 h-1 rounded-full bg-current opacity-20" />}
          <div className="h-px flex-1 bg-current opacity-10" />
        </Animate>

        {/* Full-width film-framed statement photo */}
        {hasImage && highlightImage && (
          <Animate trigger="mount" delay={0.1} distance={20} className="w-full mb-10 @md:mb-12">
            <div className="border border-current/10 p-[3px]">
              <SlotImage
                slotId={highlightImage.slotId}
                value={highlightImage.value}
                alt={highlight.title ?? 'Highlight'}
                sizes="(max-width: 768px) 95vw, 70vw"
              />
            </div>
          </Animate>
        )}

        {/* Title below photo */}
        {highlight.title && (
          <Animate trigger="mount" delay={hasImage ? 0.25 : 0.1} distance={16} className="text-center mb-7 @md:mb-8 w-full">
            <h2
              className={cn(
                'text-2xl @sm:text-3xl @md:text-4xl @lg:text-5xl font-light italic tracking-tight leading-snug',
                theme.fontTitle,
              )}
            >
              {highlight.title}
            </h2>
          </Animate>
        )}

        {/* Description */}
        {highlight.description && (
          <Animate trigger="mount" delay={hasImage ? 0.35 : 0.18} direction="none" className="text-center max-w-[44ch] mb-10">
            <p
              className={cn(
                'text-sm @md:text-base font-light opacity-55 leading-relaxed',
                theme.fontBody,
                theme.lineHeight,
              )}
            >
              {highlight.description}
            </p>
          </Animate>
        )}

        {/* Pull quote — the emotional centrepiece */}
        {highlight.quote && (
          <Animate trigger="mount" delay={hasImage ? 0.45 : 0.28} direction="none" className="w-full flex flex-col items-center gap-6">
            <div className="flex items-center gap-3">
              <div className="h-px w-6 bg-current opacity-15" />
              <div className="w-[3px] h-[3px] rounded-full bg-current opacity-20" />
              <div className="h-px w-6 bg-current opacity-15" />
            </div>
            <blockquote className="text-center max-w-[40ch]">
              <p
                className={cn(
                  'text-lg @md:text-xl @lg:text-2xl font-light italic opacity-55 leading-relaxed',
                  theme.fontBody,
                )}
              >
                &ldquo;{highlight.quote}&rdquo;
              </p>
            </blockquote>
          </Animate>
        )}
      </div>
    </SectionWrapper>
  )
}

