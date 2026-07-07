'use client'

import { SectionWrapper } from '@/editor/components/templates/primitives/section-wrapper'
import type { PhotobookImageContent } from '@/editor/modes/photobook/image/content'
import { SlotImage } from '@/editor/image'
import { cn } from '@/lib/utils'
import type { ThemeConfig } from '@/editor/lib/config/themes'
import type { PhotobookSectionContent } from '../../../content-types'

interface EndingChronicleProps {
  sectionContent: PhotobookSectionContent
  theme: ThemeConfig
  imageContent?: PhotobookImageContent
}

export function EndingChronicle({ sectionContent, theme, imageContent }: EndingChronicleProps) {
  const { ending } = sectionContent
  const endingImage = imageContent?.ending
  const hasImage = Boolean(endingImage?.value.asset.src)

  return (
    <SectionWrapper
      id="ending"
      themeForeground={theme.foreground}
      className={cn('overflow-x-clip', theme.muted)}
    >
      <div className="max-w-7xl mx-auto w-full px-8 @md:px-14 @lg:px-20 flex flex-col gap-10 @md:gap-14">

        <div>
          <div className={cn('border-t-2', theme.border)} />
          <div className="flex items-center justify-between mt-3" />
        </div>

        <div className="flex-1 flex flex-col @md:flex-row gap-12 @md:gap-20 items-start @md:items-center">

          <div className="flex-1 space-y-6 @md:space-y-8">
            {ending.title && (
              <h2
                className={cn(
                  'text-[3.5rem] @sm:text-[5rem] @md:text-[7rem] @lg:text-[9rem]',
                  'font-bold leading-none tracking-tighter',
                  theme.fontTitle,
                )}
              >
                {ending.title}
              </h2>
            )}

            {ending.text && (
              <p
                className={cn(
                  'text-base @md:text-lg font-light opacity-55 max-w-[40ch]',
                  theme.lineHeight,
                  theme.fontBody,
                )}
              >
                {ending.text}
              </p>
            )}

            <div className="space-y-1.5 pt-2">
              {ending.signature && (
                <p className={cn('text-sm italic opacity-45', theme.fontBody)}>
                  — {ending.signature}
                </p>
              )}
              {ending.date && (
                <p className={cn('text-[10px] uppercase tracking-widest opacity-25', theme.letterSpacing, theme.fontBody)}>
                  {ending.date}
                </p>
              )}
            </div>
          </div>

          {hasImage && endingImage && (
            <div className="w-full @md:w-64 @lg:w-80 shrink-0">
              <SlotImage
                slotId={endingImage.slotId}
                value={endingImage.value}
                alt={ending.signature ?? 'Ending'}
                sizes="(max-width: 768px) 80vw, 320px"
              />
            </div>
          )}
        </div>

        <div className={cn('h-[2px] origin-left', theme.accent)} />
      </div>
    </SectionWrapper>
  )
}

