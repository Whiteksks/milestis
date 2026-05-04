'use client'

import { SectionWrapper } from '../../../primitives/section-wrapper'
import type { PhotobookImageContent } from '@/editor/image/photobook/content'
import { SlotImage } from '@/editor/image'
import { Animate } from '../../../primitives/animate'
import { cn } from '@/lib/utils'
import type { ThemeConfig } from '@/editor/lib/themes'
import type { PhotobookSectionContent } from '@/editor/lib/types'

interface IntroMagazineProps {
  sectionContent: PhotobookSectionContent
  theme: ThemeConfig
  imageContent?: PhotobookImageContent
}

export function IntroMagazine({ sectionContent, theme, imageContent }: IntroMagazineProps) {
  const { introduction } = sectionContent
  const introImage = imageContent?.introduction
  const hasImage = Boolean(introImage?.value.asset.src)

  return (
    <SectionWrapper
      id="introduction"
      themeForeground={theme.foreground}
      className={theme.background}
    >
      <div className="relative overflow-hidden max-w-7xl mx-auto px-8 @md:px-14 @lg:px-20 py-16 @md:py-24 @lg:py-32">

        {/* Decorative giant section watermark */}
        <span
          aria-hidden
          className={cn(
            'absolute -right-4 @lg:-right-8 top-0 text-[16rem] @lg:text-[22rem] font-bold leading-[0.8] select-none pointer-events-none opacity-[0.04] tracking-tighter',
            theme.fontTitle,
          )}
        >
          02
        </span>

        {/* Section header */}
        <Animate trigger="mount" direction="none" className="relative mb-16 @md:mb-20">
          <div className={cn('h-[2px]', theme.accent)} />
          {introduction.label && (
            <p className={cn('mt-3 text-[9px] uppercase tracking-[0.4em] opacity-35', theme.fontBody)}>
              {introduction.label}
            </p>
          )}
        </Animate>

        {/* Main editorial grid */}
        <div className="relative grid grid-cols-1 @md:grid-cols-[3fr_2fr] gap-12 @md:gap-16 @lg:gap-24 items-start">

          {/* Left — editorial text */}
          <div className="space-y-10 @md:space-y-12">
            {introduction.title && (
              <Animate distance={28}>
                <h2
                  className={cn(
                    'text-4xl @sm:text-5xl @md:text-6xl @lg:text-7xl font-bold tracking-tighter leading-[0.88] uppercase',
                    theme.fontTitle,
                  )}
                >
                  {introduction.title}
                </h2>
              </Animate>
            )}

            {introduction.quote && (
              <Animate delay={0.1} distance={20}>
                <div className="relative pl-6 border-l-2 border-current/15">
                  <p
                    className={cn(
                      'text-xl @md:text-2xl @lg:text-3xl font-light italic leading-snug opacity-60',
                      theme.fontBody,
                    )}
                  >
                    {introduction.quote}
                  </p>
                </div>
              </Animate>
            )}

            {introduction.dedication && (
              <Animate delay={0.2} direction="none">
                <div className="flex items-center gap-4 pt-2">
                  <div className={cn('h-px w-8 shrink-0', theme.accent)} />
                  <p className={cn('text-[10px] uppercase tracking-[0.25em] opacity-40', theme.fontBody)}>
                    {introduction.dedication}
                  </p>
                </div>
              </Animate>
            )}
          </div>

          {/* Right — image */}
          {hasImage && introImage && (
            <Animate delay={0.15} type="scale" scaleOffset={0.97}>
              <SlotImage
                slotId={introImage.slotId}
                value={introImage.value}
                alt={introduction.title ?? 'Introduction'}
                sizes="(max-width: 768px) 90vw, 38vw"
                className={theme.shadow}
              />
              {introImage.value.caption && (
                <p className={cn('mt-3 text-[9px] uppercase tracking-widest opacity-30', theme.fontBody)}>
                  {introImage.value.caption}
                </p>
              )}
            </Animate>
          )}
        </div>
      </div>
    </SectionWrapper>
  )
}
