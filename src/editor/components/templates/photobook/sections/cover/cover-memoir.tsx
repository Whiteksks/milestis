'use client'

import { cn } from '@/lib/utils'
import type { ThemeConfig } from '@/editor/lib/themes'
import type { PhotobookSectionContent } from '@/editor/lib/types'
import { getAspectRatioClass } from '@/editor/lib/aspect-ratios'
import { SiteImage } from '@/editor/components/editor/section-settings/ui/site-image'
import { SectionWrapper } from '../../../primitives/section-wrapper'
import { Animate } from '../../../primitives/animate'

interface CoverMemoirProps {
  sectionContent: PhotobookSectionContent
  theme: ThemeConfig
}

export function CoverMemoir({ sectionContent, theme }: CoverMemoirProps) {
  const { cover } = sectionContent
  const imageSettings = cover.images?.imageSettings?.[0]
  const imageUrl = cover.images?.image ?? ''

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
            <div className="flex items-center gap-4">
              <span className={cn('text-[10px] uppercase tracking-[0.3em] opacity-30', theme.fontBody)}>
                Photobook Edition
              </span>
              <div className="flex-1 h-px bg-current opacity-10" />
            </div>

            <h1 className={cn(
              'text-5xl @sm:text-6xl @md:text-7xl @lg:text-8xl font-bold leading-[0.9] tracking-tighter',
              theme.fontTitle
            )}>
              {cover.title}
            </h1>

            {(cover.subtitle || cover.tagline) && (
              <p className={cn(
                'text-base @lg:text-xl font-light opacity-60 max-w-[32ch]',
                theme.lineHeight,
                theme.fontBody
              )}>
                {cover.subtitle || cover.tagline}
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
            {imageUrl ? (
              <SiteImage
                src={imageUrl}
                alt={cover.title}
                aspectRatio={imageSettings?.aspectRatio ?? 'portrait'}
                frameStyle={imageSettings?.frameStyle ?? 'none'}
                cropData={imageSettings?.cropData}
                className={cn('w-full transition-transform duration-700 hover:scale-[1.02]', theme.shadow, theme.elementGlow)}
                priority
              />
            ) : (
              <div className={cn(
                'w-full',
                getAspectRatioClass(imageSettings?.aspectRatio ?? 'portrait'),
                theme.muted
              )} />
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