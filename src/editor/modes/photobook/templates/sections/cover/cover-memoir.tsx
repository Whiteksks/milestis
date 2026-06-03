'use client'

import { cn } from '@/lib/utils'
import type { ThemeConfig } from '@/editor/lib/config/themes'
import type { PhotobookSectionContent } from '../../../content-types'
import type { PhotobookImageContent } from '@/editor/modes/photobook/image/content'
import { SlotImage } from '@/editor/image'
import { SectionWrapper } from '@/editor/components/templates/primitives/section-wrapper'
import { Animate } from '@/editor/components/templates/primitives/animate'

interface CoverMemoirProps {
  sectionContent: PhotobookSectionContent
  theme: ThemeConfig
  imageContent?: PhotobookImageContent
}

export function CoverMemoir({ sectionContent, theme, imageContent }: CoverMemoirProps) {
  const { cover } = sectionContent
  const coverImage = imageContent?.cover

  // Стили вынесены для чистоты JSX
  const containerStyles = "max-w-screen-2xl mx-auto w-full flex-1 grid grid-cols-1 @md:grid-cols-[1.2fr_1fr] items-stretch"
  const contentPadding = "px-6 @sm:px-10 @md:px-16 @lg:px-24"

  return (
    <SectionWrapper
      id="cover"
      themeForeground={theme.foreground}
      className={cn('flex flex-col min-h-screen', theme.background)}
    >
      <div className={containerStyles}>
        
        {/* Left Column – Typography */}
        <div className={cn('relative flex flex-col justify-center py-16 @md:py-24 gap-10', contentPadding)}>
          <Animate trigger="mount" delay={0.1} distance={20} className="space-y-8">
            <h1 className={cn(
              'text-5xl @sm:text-6xl @md:text-7xl @lg:text-8xl font-bold leading-[0.9] tracking-tighter',
              theme.fontTitle
            )}>
              {cover.title}
            </h1>

            {cover.subtitle && (
              <p className={cn(
                'text-base @lg:text-xl font-light opacity-60 max-w-[32ch]',
                theme.lineHeight,
                theme.fontBody
              )}>
                {cover.subtitle}
              </p>
            )}
            {cover.tagline && (
              <p className={cn(
                'text-sm font-light italic opacity-40 max-w-[36ch]',
                theme.lineHeight,
                theme.fontBody
              )}>
                {cover.tagline}
              </p>
            )}
          </Animate>

          {/* Date & Location integrated into the flow */}
          {(cover.date || cover.location) && (
            <Animate trigger="mount" delay={0.3} className="flex items-center gap-4">
              <div className={cn('h-px w-6 shrink-0', theme.accent)} />
              <p className={cn('text-xs uppercase tracking-widest opacity-40', theme.fontBody)}>
                {[cover.date, cover.location].filter(Boolean).join('  ·  ')}
              </p>
            </Animate>
          )}

          {/* Vertical divider for desktop */}
          <div className="hidden @md:block absolute right-0 top-1/4 bottom-1/4 w-px bg-current opacity-5" />
        </div>

        {/* Right Column – Photo Container */}
        <Animate 
          trigger="mount" 
          type="scale" 
          scaleOffset={0.98} 
          className="flex items-center justify-center p-8 @md:p-12 @lg:p-20 bg-black/[0.02]"
        >
          <div className="w-full max-w-[420px] relative">
          {coverImage ? (
              <SlotImage
                slotId={coverImage.slotId}
                value={coverImage.value}
                alt={cover.title}
                className={cn('w-full transition-transform duration-700 hover:scale-[1.02]', theme.shadow, theme.elementGlow)}
                priority
              />
            ) : (
              <div className={cn('w-full aspect-[3/4]', theme.muted)} />
            )}
          </div>
        </Animate>
      </div>

      {/* Footer Branding */}
      <div className={cn('py-8 opacity-[0.08]', contentPadding)}>
        <div className="h-px bg-current w-full" />
      </div>
    </SectionWrapper>
  )
}
