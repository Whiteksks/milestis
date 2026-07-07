'use client'

import { SectionWrapper } from '@/editor/components/templates/primitives/section-wrapper'
import type { PhotobookImageContent } from '@/editor/modes/photobook/image/content'
import { SlotImage } from '@/editor/image'
import { Animate } from '@/editor/components/templates/primitives/animate'
import { cn } from '@/lib/utils'
import type { ThemeConfig } from '@/editor/lib/config/themes'
import type { PhotobookSectionContent } from '../../../content-types'

interface EndingMagazineProps {
  sectionContent: PhotobookSectionContent
  theme: ThemeConfig
  imageContent?: PhotobookImageContent
}

export function EndingMagazine({ sectionContent, theme, imageContent }: EndingMagazineProps) {
  const { ending } = sectionContent
  const endingImage = imageContent?.ending
  const hasImage = Boolean(endingImage?.value.asset.src)

  return (
    <SectionWrapper
      id="ending"
      themeForeground={theme.foreground}
      className={cn('@container relative min-h-screen flex flex-col overflow-hidden', theme.background)}
    >
      {hasImage && endingImage && (
        <div className="absolute inset-0">
          <SlotImage
            fillParent
            slotId={endingImage.slotId}
            value={endingImage.value}
            alt={ending.text ?? 'Closing'}
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-black/50" />
        </div>
      )}

      <Animate
        trigger="mount"
        direction="none"
        className="relative z-10 px-8 @md:px-14 @lg:px-20 pt-10 @md:pt-12"
      >
        <div className={cn('h-px', hasImage ? 'bg-white/15' : 'bg-current opacity-10')} />
      </Animate>

      <div className="relative z-10 flex-1 flex flex-col justify-center px-8 @md:px-14 @lg:px-20 py-12">
        <Animate trigger="mount" delay={0.2} distance={32}>
          <div className="max-w-2xl space-y-8 @md:space-y-10">

            {ending.title && (
              <h2
                className={cn(
                  'text-4xl @sm:text-5xl @md:text-6xl @lg:text-7xl font-bold tracking-tighter leading-none',
                  hasImage ? 'text-white' : '',
                  theme.fontTitle,
                )}
              >
                {ending.title}
              </h2>
            )}

            {ending.text && (
              <p
                className={cn(
                  'text-2xl @sm:text-3xl @md:text-4xl @lg:text-5xl font-light italic leading-snug',
                  hasImage ? 'text-white/80' : 'opacity-70',
                  theme.fontTitle,
                )}
              >
                {ending.text}
              </p>
            )}

            <div className={cn('h-px w-16', hasImage ? 'bg-white/30' : theme.accent)} />

            <div className="space-y-2">
              {ending.signature && (
                <p
                  className={cn(
                    'text-sm @md:text-base font-light',
                    hasImage ? 'text-white/60' : 'opacity-55',
                    theme.fontBody,
                  )}
                >
                  — {ending.signature}
                </p>
              )}
              {ending.date && (
                <p
                  className={cn(
                    'text-[10px] uppercase tracking-[0.35em]',
                    hasImage ? 'text-white/35' : 'opacity-30',
                    theme.fontBody,
                  )}
                >
                  {ending.date}
                </p>
              )}
            </div>
          </div>
        </Animate>
      </div>

      <Animate
        trigger="mount"
        direction="none"
        delay={0.4}
        className="relative z-10 flex items-center justify-between px-8 @md:px-14 @lg:px-20 pb-10 @md:pb-12"
      >
        <div className={cn('h-px w-16 @md:w-24', hasImage ? 'bg-white/20' : 'bg-current opacity-10')} />
        <div className="flex items-center gap-2">
          <div className={cn('w-1.5 h-1.5 rounded-full', hasImage ? 'bg-white/30' : 'bg-current opacity-25')} />
          <div className={cn('w-1.5 h-1.5 rounded-full', hasImage ? 'bg-white/15' : 'bg-current opacity-12')} />
          <div className={cn('w-1.5 h-1.5 rounded-full', hasImage ? 'bg-white/07' : 'bg-current opacity-07')} />
        </div>
      </Animate>
    </SectionWrapper>
  )
}
