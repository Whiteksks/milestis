'use client'

import { SectionWrapper } from '../../../primitives/section-wrapper'
import type { PhotobookImageContent } from '@/editor/image/photobook/content'
import { SlotImage } from '@/editor/image'
import { cn } from '@/lib/utils'
import type { ThemeConfig } from '@/editor/lib/themes'
import type { PhotobookSectionContent } from '@/editor/lib/types'

interface IntroChronicleProps {
  sectionContent: PhotobookSectionContent
  theme: ThemeConfig
  imageContent?: PhotobookImageContent
}

export function IntroChronicle({ sectionContent, theme, imageContent }: IntroChronicleProps) {
  const { introduction } = sectionContent
  const introImage = imageContent?.introduction
  const hasImage = Boolean(introImage?.value.asset.src)

  return (
    <SectionWrapper
      id="introduction"
      themeForeground={theme.foreground}
      className={theme.background}
    >
      <div className="max-w-7xl mx-auto px-8 @md:px-14 @lg:px-20 py-16 @md:py-24 @lg:py-32">

        {/* Editorial header */}
        <div className="mb-12 @md:mb-16">
          <div className={cn('border-t-2', theme.border)} />
          <div className="flex items-center justify-between mt-3">
            {introduction.label && (
              <span className={cn('text-[9px] uppercase tracking-[0.3em] opacity-35', theme.letterSpacing, theme.fontBody)}>
                {introduction.label}
              </span>
            )}
          </div>
        </div>
        <div className="grid grid-cols-1 @md:grid-cols-[3fr_2fr] gap-10 @md:gap-16 @lg:gap-24 items-start">

          <div className="space-y-9">
            {introduction.title && (
              <h2
                className={cn(
                  'text-3xl @sm:text-4xl @md:text-5xl @lg:text-6xl font-bold tracking-tight leading-[0.92]',
                  theme.fontTitle,
                )}
              >
                {introduction.title}
              </h2>
            )}

            {introduction.quote && (
              <div className="relative">
                <blockquote className="pl-6 border-l-2 border-current/15">
                  <p
                    className={cn(
                      'text-xl @md:text-2xl font-light italic opacity-65 leading-snug',
                      theme.fontBody,
                    )}
                  >
                    {introduction.quote}
                  </p>
                </blockquote>
              </div>
            )}

            {introduction.dedication && (
              <div className="flex items-center gap-4 pt-4">
                <div className={cn('h-px w-8 shrink-0', theme.accent)} />
                <p className={cn('text-xs uppercase tracking-[0.2em] opacity-40', theme.fontBody)}>
                  {introduction.dedication}
                </p>
              </div>
            )}
          </div>

          {/* Right – image */}
          {hasImage && introImage && (
            <div>
              <SlotImage
                slotId={introImage.slotId}
                value={introImage.value}
                alt={introduction.title ?? 'Introduction'}
                sizes="(max-width: 768px) 90vw, 38vw"
                className={theme.shadow}
              />
              {introImage.value.caption && (
                <p className={cn('mt-2.5 text-[10px] uppercase tracking-wide opacity-35', theme.fontBody)}>
                  {introImage.value.caption}
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </SectionWrapper>
  )
}
