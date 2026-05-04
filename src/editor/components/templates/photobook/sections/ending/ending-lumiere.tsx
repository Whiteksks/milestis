'use client'

import type { PhotobookImageContent } from '@/editor/image/photobook/content'
import { SlotImage } from '@/editor/image'
import { cn } from '@/lib/utils'
import type { ThemeConfig } from '@/editor/lib/themes'
import type { PhotobookSectionContent } from '@/editor/lib/types'
import { SectionWrapper } from '../../../primitives/section-wrapper'
import { Animate } from '../../../primitives/animate'

interface EndingLumiereProps {
  sectionContent: PhotobookSectionContent
  theme: ThemeConfig
  imageContent?: PhotobookImageContent
}

export function EndingLumiere({ sectionContent, theme, imageContent }: EndingLumiereProps) {
  const { ending } = sectionContent
  const endingImage = imageContent?.ending
  const hasImage = Boolean(endingImage?.value.asset.src)

  return (
    <SectionWrapper
      id="ending"
      themeForeground={theme.foreground}
      className={cn('@container overflow-x-clip', theme.background)}
    >
      <div className="max-w-2xl mx-auto px-8 @md:px-0 py-20 @md:py-28 flex flex-col items-center">

        {/* Top ornament — mirrors intro */}
        <Animate trigger="mount" direction="none" className="w-full flex items-center gap-4 mb-16 @md:mb-20">
          <div className="h-px flex-1 bg-current opacity-10" />
          <div className="w-1 h-1 rounded-full bg-current opacity-20" />
          <div className="h-px flex-1 bg-current opacity-10" />
        </Animate>

        {/* Label + Title */}
        {(ending.label || ending.title) && (
          <Animate trigger="mount" direction="none" delay={0.05} className="flex flex-col items-center gap-3 mb-12 @md:mb-16">
            {ending.label && (
              <span className={cn('text-[9px] uppercase tracking-[0.5em] opacity-25', theme.fontBody)}>
                {ending.label}
              </span>
            )}
            {ending.title && (
              <p className={cn('text-2xl @md:text-3xl font-light italic opacity-50 text-center', theme.fontTitle)}>
                {ending.title}
              </p>
            )}
          </Animate>
        )}

        {/* Optional closing photo — large, film-framed */}
        {hasImage && endingImage && (
          <Animate trigger="mount" delay={0.1} distance={24} className="w-full max-w-xs @md:max-w-sm mb-12 @md:mb-14">
            <div className="border border-current/10 p-[3px]">
              <SlotImage
                slotId={endingImage.slotId}
                value={endingImage.value}
                alt={ending.signature ?? 'Closing'}
                sizes="(max-width: 768px) 75vw, 380px"
              />
            </div>
          </Animate>
        )}

        {/* Closing text — the emotional heartbeat */}
        <Animate trigger="mount" delay={hasImage ? 0.3 : 0.15} direction="none" className="flex flex-col items-center text-center space-y-5">
          {ending.text && (
            <p
              className={cn(
                'text-base @md:text-lg font-light italic opacity-55 max-w-[36ch] leading-relaxed',
                theme.fontBody,
                theme.lineHeight,
              )}
            >
              {ending.text}
            </p>
          )}

          {/* Ornamental separator */}
          <div className="flex items-center gap-2 py-2">
            <div className="h-px w-6 bg-current opacity-15" />
            <div className="w-[3px] h-[3px] rounded-full bg-current opacity-20" />
            <div className="h-px w-6 bg-current opacity-15" />
          </div>

          {ending.signature && (
            <p className={cn('text-[10px] uppercase tracking-[0.4em] opacity-35', theme.fontBody)}>
              {ending.signature}
            </p>
          )}

          {ending.date && (
            <p className={cn('text-[9px] uppercase tracking-[0.38em] opacity-20', theme.fontBody)}>
              {ending.date}
            </p>
          )}
        </Animate>

        {/* Bottom ornament */}
        <Animate
          trigger="mount"
          direction="none"
          delay={hasImage ? 0.45 : 0.3}
          className="w-full flex items-center gap-4 mt-16 @md:mt-20"
        >
          <div className="h-px flex-1 bg-current opacity-10" />
          <div className="w-1 h-1 rounded-full bg-current opacity-15" />
          <div className="h-px flex-1 bg-current opacity-10" />
        </Animate>
      </div>
    </SectionWrapper>
  )
}
