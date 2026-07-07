'use client'

import { cn } from '@/lib/utils'
import type { ThemeConfig } from '@/editor/lib/config/themes'
import type { PhotobookSectionContent } from '../../../content-types'
import type { PhotobookImageContent } from '@/editor/modes/photobook/image/content'
import { SlotImage } from '@/editor/image'
import { SectionWrapper } from '@/editor/components/templates/primitives/section-wrapper'
import { Animate } from '@/editor/components/templates/primitives/animate'

interface EndingSoleilProps {
  sectionContent: PhotobookSectionContent
  theme: ThemeConfig
  imageContent?: PhotobookImageContent
}

export function EndingSoleil({ sectionContent, theme, imageContent }: EndingSoleilProps) {
  const { ending } = sectionContent
  const endingImage = imageContent?.ending
  const hasImage = Boolean(endingImage?.value.asset.src)

  return (
    <SectionWrapper
      id="ending"
      themeForeground={theme.foreground}
      className={cn('overflow-x-clip', theme.background)}
    >
      <div className="flex flex-col items-center px-8 @md:px-14 @lg:px-20 py-20 @md:py-28 @lg:py-36">

        <Animate trigger="mount" direction="none" className="w-full max-w-2xl mb-16 @md:mb-20">
          <div className="h-px w-full bg-current opacity-10" />
        </Animate>

        {ending.title && (
          <Animate trigger="mount" direction="none" delay={0.15} className="mb-12 @md:mb-16">
            <p className={cn('text-2xl @md:text-3xl font-light italic opacity-45 text-center', theme.fontTitle)}>
              {ending.title}
            </p>
          </Animate>
        )}

        {hasImage && endingImage && (
          <Animate trigger="mount" delay={0.2} distance={32} className="w-full max-w-sm @md:max-w-md mb-14 @md:mb-18">
            <div className="overflow-hidden rounded-sm">
              <SlotImage
                slotId={endingImage.slotId}
                value={endingImage.value}
                alt={ending.signature ?? 'Closing'}
                sizes="(max-width: 768px) 80vw, 400px"
              />
            </div>
          </Animate>
        )}

        <Animate trigger="mount" delay={hasImage ? 0.35 : 0.2} direction="none" className="flex flex-col items-center text-center space-y-6 max-w-[38ch]">
          {ending.text && (
            <p
              className={cn(
                'text-base @md:text-lg @lg:text-xl font-light italic opacity-55 leading-relaxed',
                theme.fontBody,
                theme.lineHeight,
              )}
            >
              {ending.text}
            </p>
          )}

          {(ending.signature || ending.date) && (
            <>
              <div className="w-8 h-px bg-current opacity-20" />
              {ending.signature && (
                <p className={cn('text-sm font-light opacity-45 italic', theme.fontBody)}>
                  {'\u2014'} {ending.signature}
                </p>
              )}
              {ending.date && (
                <p className={cn('text-[10px] uppercase tracking-[0.45em] opacity-25', theme.fontBody)}>
                  {ending.date}
                </p>
              )}
            </>
          )}
        </Animate>

        <Animate trigger="mount" direction="none" delay={hasImage ? 0.5 : 0.35} className="w-full max-w-2xl mt-16 @md:mt-20">
          <div className="h-px w-full bg-current opacity-10" />
        </Animate>

      </div>
    </SectionWrapper>
  )
}
