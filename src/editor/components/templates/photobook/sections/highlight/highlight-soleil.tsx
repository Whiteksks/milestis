"use client"

import { cn } from '@/lib/utils'
import type { ThemeConfig } from '@/editor/lib/themes'
import type { PhotobookSectionContent } from '@/editor/lib/types'
import { SiteImage } from '@/editor/components/editor/section-settings/ui/site-image'
import { SectionWrapper } from '../../../primitives/section-wrapper'
import { Animate } from '../../../primitives/animate'
import { SectionLabel } from '../../../primitives/section-label'

interface HighlightSoleilProps {
  sectionContent: PhotobookSectionContent
  theme: ThemeConfig
}

export function HighlightSoleil({ sectionContent, theme }: HighlightSoleilProps) {
  const { highlight } = sectionContent
  const imageUrl = highlight.images?.image ?? ''
  const hasImage = Boolean(imageUrl)
  const imageSettings = highlight.images?.imageSettings?.[0]
  const aspectRatio = imageSettings?.aspectRatio ?? 'wide'
  const frameStyle = imageSettings?.frameStyle ?? 'none'

  return (
    <SectionWrapper
      id="highlight"
      themeForeground={theme.foreground}
      className={cn('overflow-x-clip', theme.muted)}
      padded={false}
      containerClassName="py-20 @md:py-28"
    >
      {/* Section label — full width */}
      <div className="px-8 @md:px-14 @lg:px-20 mb-12 @md:mb-16">
        <SectionLabel num={5} label="Highlight" theme={theme} variant="rule-label" />
      </div>

      {/* Full-width photo — edge-to-edge */}
      {hasImage && (
        <Animate className="mb-12 @md:mb-16 overflow-hidden">
          <SiteImage
            src={imageUrl}
            alt={highlight.title ?? 'Highlight'}
            aspectRatio={aspectRatio}
            frameStyle={frameStyle}
            cropData={imageSettings?.cropData}
            unoptimized
            sizes="100vw"
            imageClassName="transition-transform duration-700 ease-out hover:scale-[1.02]"
          />
        </Animate>
      )}

      {/* Text below photo — centered narrow column */}
      <div className="px-8 @md:px-14 @lg:px-20 max-w-2xl mx-auto text-center space-y-6">
        {highlight.title && (
          <Animate>
            <h2
              className={cn(
                'text-2xl @md:text-3xl font-light tracking-tight leading-snug',
                theme.fontTitle,
              )}
            >
              {highlight.title}
            </h2>
          </Animate>
        )}

        {highlight.description && (
          <Animate delay={0.06}>
            <p
              className={cn(
                'text-sm font-light opacity-55 max-w-[44ch] mx-auto',
                theme.lineHeight,
                theme.fontBody,
              )}
            >
              {highlight.description}
            </p>
          </Animate>
        )}

        {highlight.quote && (
          <Animate delay={0.1}>
            <div className="pt-4 space-y-4">
              <div className="w-8 h-px bg-current opacity-20 mx-auto" />
              <blockquote>
                <p
                  className={cn(
                    'text-base @md:text-lg font-light italic opacity-50 max-w-[38ch] mx-auto',
                    theme.lineHeight,
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
    </SectionWrapper>
  )
}
