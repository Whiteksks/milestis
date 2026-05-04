'use client'

import { cn } from '@/lib/utils'
import type { ThemeConfig } from '@/editor/lib/themes'
import type { PhotobookSectionContent } from '@/editor/lib/types'
import type { PhotobookImageContent } from '@/editor/image/photobook/content'
import { SlotImage } from '@/editor/image'
import { SectionWrapper } from '../../../primitives/section-wrapper'
import { Animate } from '../../../primitives/animate'
import { SectionLabel } from '../../../primitives/section-label'
import { usePhotobookSectionNum } from '@/editor/hooks/usePhotobookSectionNum'

interface HighlightSoleilProps {
  sectionContent: PhotobookSectionContent
  theme: ThemeConfig
  imageContent?: PhotobookImageContent
}

export function HighlightSoleil({ sectionContent, theme, imageContent }: HighlightSoleilProps) {
  const { highlight } = sectionContent
  const num = usePhotobookSectionNum('highlight')
  const highlightImage = imageContent?.highlight
  const hasImage = Boolean(highlightImage?.value.asset.src)

  return (
    <SectionWrapper
      id="highlight"
      themeForeground={theme.foreground}
      // Добавим немного больше вертикальных отступов секции
      className={cn('overflow-x-clip py-20 @md:py-32', theme.muted)}
    >
      {/* Section label */}
      {highlight.label && (
        <div className="px-8 @md:px-14 @lg:px-20 mb-12 @md:mb-20">
          <SectionLabel num={num} label={highlight.label} theme={theme} variant="rule-label" />
        </div>
      )}

      {hasImage && highlightImage && (
        <div className="px-8 max-w-5xl mx-auto @md:px-14 @lg:px-24 mb-16 @md:mb-24">
          <Animate className="overflow-hidden rounded-sm ring-1 ring-current/5 shadow-sm">
            <SlotImage
              slotId={highlightImage.slotId}
              value={highlightImage.value}
              alt={highlight.title ?? 'Highlight'}
              sizes="(max-width: 1024px) 100vw, 80vw"
              imageClassName="transition-transform duration-1000 ease-out hover:scale-[1.03]"
            />
          </Animate>
        </div>
      )}

      <div className="px-8 @md:px-14 max-w-3xl mx-auto text-center space-y-8">
        {highlight.title && (
          <Animate>
            <h2
              className={cn(
                'text-3xl @md:text-4xl font-light tracking-tight leading-tight',
                theme.fontTitle,
              )}
            >
              {highlight.title}
            </h2>
          </Animate>
        )}

        <div className="space-y-6">
          {highlight.description && (
            <Animate delay={0.1}>
              <p
                className={cn(
                  'text-base font-light opacity-60 max-w-[50ch] mx-auto',
                  theme.lineHeight,
                  theme.fontBody,
                )}
              >
                {highlight.description}
              </p>
            </Animate>
          )}

          {highlight.quote && (
            <Animate delay={0.2}>
              <div className="pt-8 space-y-6">
                <div className="w-12 h-px bg-current opacity-10 mx-auto" />
                <blockquote>
                  <p
                    className={cn(
                      'text-lg @md:text-xl font-light italic opacity-40 max-w-[35ch] mx-auto leading-relaxed',
                      theme.fontBody,
                    )}
                  >
                    &ldquo;{highlight.quote}&rdquo;
                  </p>
                </blockquote>
              </div>
            </Animate>
          )}
        </div>
      </div>
    </SectionWrapper>
  )
}