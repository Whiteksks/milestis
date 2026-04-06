"use client"

import { cn } from '@/lib/utils'
import type { ThemeConfig } from '@/editor/lib/themes'
import type { PhotobookSectionContent } from '@/editor/lib/types'
import { SiteImage } from '@/editor/components/editor/section-settings/ui/site-image'
import { SectionWrapper } from '../../../primitives/section-wrapper'
import { Animate } from '../../../primitives/animate'
import { SectionLabel } from '../../../primitives/section-label'

interface IntroSoleilProps {
  sectionContent: PhotobookSectionContent
  theme: ThemeConfig
}

export function IntroSoleil({ sectionContent, theme }: IntroSoleilProps) {
  const { introduction } = sectionContent
  const imageUrl = introduction.images?.image ?? ''
  const hasImage = Boolean(imageUrl)
  const imageSettings = introduction.images?.imageSettings?.[0]
  const aspectRatio = imageSettings?.aspectRatio ?? 'portrait'
  const frameStyle = imageSettings?.frameStyle ?? 'none'

  return (
    <SectionWrapper
      id="introduction"
      themeForeground={theme.foreground}
      className={cn('overflow-x-clip', theme.background)}
      padded={false}
      containerClassName="max-w-3xl px-8 @md:px-0 py-20 @md:py-28 space-y-12 @md:space-y-16"
    >
      <SectionLabel num={2} label="Introduction" theme={theme} variant="rule-label" />

      {/* Title */}
      {introduction.title && (
        <Animate>
          <h2
            className={cn(
              'text-2xl @sm:text-3xl @md:text-4xl font-light tracking-tight leading-snug',
              theme.fontTitle,
            )}
          >
            {introduction.title}
          </h2>
        </Animate>
      )}

      {/* Two-column: quote left, photo right */}
      <div className="grid grid-cols-1 @md:grid-cols-[3fr_2fr] gap-10 @md:gap-16 items-start">
        <div className="space-y-8">
          {introduction.quote && (
            <Animate delay={0.05}>
              <blockquote>
                <p
                  className={cn(
                    'text-lg @md:text-xl font-light leading-relaxed opacity-65',
                    theme.fontBody,
                    theme.lineHeight,
                  )}
                >
                  &ldquo;{introduction.quote}&rdquo;
                </p>
              </blockquote>
            </Animate>
          )}

          {introduction.dedication && (
            <Animate delay={0.1}>
              <p className={cn('text-[10px] uppercase tracking-[0.35em] opacity-30', theme.fontBody)}>
                {introduction.dedication}
              </p>
            </Animate>
          )}
        </div>

        {hasImage && (
          <Animate delay={0.08} direction="left" distance={20}>
            <div className="overflow-hidden rounded-sm">
              <SiteImage
                src={imageUrl}
                alt={introduction.title ?? 'Introduction'}
                aspectRatio={aspectRatio}
                frameStyle={frameStyle}
                cropData={imageSettings?.cropData}
                unoptimized
                sizes="(max-width: 768px) 80vw, 35vw"
              />
            </div>
            {introduction.images?.caption && (
              <p className={cn('mt-3 text-[9px] uppercase tracking-widest opacity-25', theme.fontBody)}>
                {introduction.images.caption}
              </p>
            )}
          </Animate>
        )}
      </div>
    </SectionWrapper>
  )
}
