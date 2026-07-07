'use client'

import { cn } from '@/lib/utils'
import type { ThemeConfig } from '@/editor/lib/config/themes'
import type { PhotobookSectionContent } from '../../../content-types'
import type { PhotobookImageContent } from '@/editor/modes/photobook/image/content'
import { SlotImage } from '@/editor/image'
import { SectionWrapper } from '@/editor/components/templates/primitives/section-wrapper'
import { Animate } from '@/editor/components/templates/primitives/animate'
import { SectionLabel } from '@/editor/components/templates/primitives/section-label'
import { usePhotobookSectionNum } from '@/editor/hooks/usePhotobookSectionNum'

interface IntroSoleilProps {
  sectionContent: PhotobookSectionContent
  theme: ThemeConfig
  imageContent?: PhotobookImageContent
}

export function IntroSoleil({ sectionContent, theme, imageContent }: IntroSoleilProps) {
  const { introduction } = sectionContent
  const num = usePhotobookSectionNum('introduction')

  const introImage = imageContent?.introduction
  const hasImage = Boolean(introImage?.value.asset.src)

  const bodyFontStyles = cn(
    'font-light leading-relaxed',
    theme.fontBody,
    theme.lineHeight
  )

  return (
    <SectionWrapper
      id="introduction"
      themeForeground={theme.foreground}
      className={cn('overflow-x-clip select-none', theme.background)}
    >
      <div className="max-w-4xl mx-auto px-6 @md:px-12 py-20 @md:py-32">
        {introduction.label && (
          <div className="mb-12 @md:mb-20">
            <SectionLabel num={num} label={introduction.label} theme={theme} variant="rule-label" />
          </div>
        )}

        <div className="space-y-12 @md:space-y-20">
          {introduction.title && (
            <Animate duration={0.8}>
              <h2
                className={cn(
                  'text-3xl @sm:text-4xl @md:text-5xl font-light tracking-tight leading-[1.1]',
                  theme.fontTitle,
                )}
              >
                {introduction.title}
              </h2>
            </Animate>
          )}

          <div className="grid grid-cols-1 @md:grid-cols-12 gap-10 @md:gap-16 items-start">
            
            <div className="order-2 @md:order-1 @md:col-span-7 space-y-10">
              {introduction.quote && (
                <Animate delay={0.1}>
                  <blockquote className="relative">
                    <p className={cn('text-xl @md:text-2xl opacity-70', bodyFontStyles)}>
                      &ldquo;{introduction.quote}&rdquo;
                    </p>
                  </blockquote>
                </Animate>
              )}

              {introduction.dedication && (
                <Animate delay={0.2}>
                  <p className={cn(
                    'text-[10px] uppercase tracking-[0.4em] opacity-40 border-t pt-6 inline-block border-current/10',
                    theme.fontBody
                  )}>
                    {introduction.dedication}
                  </p>
                </Animate>
              )}
            </div>

            {hasImage && introImage && (
              <div className="order-1 @md:order-2 @md:col-span-5">
                <Animate delay={0.15} direction="up" distance={30}>
                  <div className="group relative">
                    <div className="">
                      <SlotImage
                        slotId={introImage.slotId}
                        value={introImage.value}
                        alt={introduction.title ?? 'Introduction'}
                        sizes="(max-width: 768px) 90vw, 40vw"
                        className="transition-transform duration-700 group-hover:scale-102"
                      />
                    </div>

                    {introImage.value.caption && (
                      <p className={cn(
                        'mt-4 text-[9px] uppercase tracking-widest opacity-30 italic',
                        theme.fontBody
                      )}>
                        {introImage.value.caption}
                      </p>
                    )}
                  </div>
                </Animate>
              </div>
            )}

          </div>
        </div>
      </div>
    </SectionWrapper>
  )
}
