'use client'

import type { PhotobookImageContent } from '@/editor/image/photobook/content'
import { SlotImage } from '@/editor/image'
import { cn } from '@/lib/utils'
import type { ThemeConfig } from '@/editor/lib/themes'
import type { PhotobookSectionContent } from '@/editor/lib/types'
import { SectionWrapper } from '../../../primitives/section-wrapper'
import { Animate } from '../../../primitives/animate'

interface IntroLumiereProps {
  sectionContent: PhotobookSectionContent
  theme: ThemeConfig
  imageContent?: PhotobookImageContent
}

export function IntroLumiere({ sectionContent, theme, imageContent }: IntroLumiereProps) {
  const { introduction } = sectionContent
  const introImage = imageContent?.introduction
  const hasImage = Boolean(introImage?.value.asset.src)

  return (
    <SectionWrapper
      id="introduction"
      themeForeground={theme.foreground}
      className={cn('overflow-x-clip', theme.background)}
    >
      <div className="max-w-2xl mx-auto px-8 @md:px-0 py-20 @md:py-28 flex flex-col items-center">

        {/* Thin centred rule — no hardcoded label */}
        <Animate trigger="mount" direction="none" className="w-full flex items-center gap-4 mb-16 @md:mb-20">
          <div className="h-px flex-1 bg-current opacity-10" />
          {introduction.label
            ? <span className={cn('text-[9px] uppercase tracking-[0.5em] opacity-25 shrink-0', theme.fontBody)}>{introduction.label}</span>
            : <div className="w-1 h-1 rounded-full bg-current opacity-20" />}
          <div className="h-px flex-1 bg-current opacity-10" />
        </Animate>

        {/* Photo — large, film-framed, centred hero */}
        {hasImage && introImage && (
          <Animate trigger="mount" delay={0.1} distance={24} className="w-full max-w-sm @md:max-w-md @lg:max-w-lg mb-12 @md:mb-14">
            <div className="border border-current/10 p-[3px]">
              <SlotImage
                slotId={introImage.slotId}
                value={introImage.value}
                alt={introduction.title ?? 'Introduction'}
                sizes="(max-width: 768px) 85vw, 480px"
              />
            </div>
            {introImage.value.caption && (
              <p className={cn('mt-2.5 text-[9px] uppercase tracking-widest opacity-25 text-center', theme.fontBody)}>
                {introImage.value.caption}
              </p>
            )}
          </Animate>
        )}

        {/* Title */}
        {introduction.title && (
          <Animate trigger="mount" delay={hasImage ? 0.25 : 0.1} distance={16} className="text-center mb-8 @md:mb-10">
            <h2
              className={cn(
                'text-2xl @sm:text-3xl @md:text-4xl @lg:text-5xl font-light italic tracking-tight leading-snug',
                theme.fontTitle,
              )}
            >
              {introduction.title}
            </h2>
          </Animate>
        )}

        {/* Quote */}
        {introduction.quote && (
          <Animate trigger="mount" delay={hasImage ? 0.35 : 0.18} direction="none" className="text-center max-w-[40ch] mb-8 @md:mb-10">
            <p
              className={cn(
                'text-base @md:text-lg leading-relaxed font-light italic opacity-55',
                theme.fontBody,
                theme.lineHeight,
              )}
            >
              &ldquo;{introduction.quote}&rdquo;
            </p>
          </Animate>
        )}

        {/* Thin rule */}
        {introduction.dedication && (
          <Animate trigger="mount" direction="none" delay={hasImage ? 0.45 : 0.28} className="w-8 h-px bg-current opacity-15 mb-5" />
        )}

        {/* Dedication */}
        {introduction.dedication && (
          <Animate trigger="mount" direction="none" delay={hasImage ? 0.5 : 0.32}>
            <p className={cn('text-[9px] uppercase tracking-[0.4em] opacity-30 text-center', theme.fontBody)}>
              {introduction.dedication}
            </p>
          </Animate>
        )}
      </div>
    </SectionWrapper>
  )
}
