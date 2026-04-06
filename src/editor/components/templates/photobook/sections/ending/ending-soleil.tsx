"use client"

import { cn } from '@/lib/utils'
import type { ThemeConfig } from '@/editor/lib/themes'
import type { PhotobookSectionContent } from '@/editor/lib/types'
import { SiteImage } from '@/editor/components/editor/section-settings/ui/site-image'
import { SectionWrapper } from '../../../primitives/section-wrapper'
import { Animate } from '../../../primitives/animate'

interface EndingSoleilProps {
  sectionContent: PhotobookSectionContent
  theme: ThemeConfig
}

export function EndingSoleil({ sectionContent, theme }: EndingSoleilProps) {
  const { ending } = sectionContent
  const imageUrl = ending.images?.image ?? ''
  const hasImage = Boolean(imageUrl)
  const imageSettings = ending.images?.imageSettings?.[0]
  const aspectRatio = imageSettings?.aspectRatio ?? 'square'
  const frameStyle = imageSettings?.frameStyle ?? 'none'

  return (
    <SectionWrapper
      id="ending"
      themeForeground={theme.foreground}
      className={cn('overflow-x-clip', theme.background)}
      padded={false}
      containerClassName="max-w-none flex flex-col min-h-screen"
    >
      {/* Top thin rule */}
      <div className="px-8 @md:px-14 @lg:px-20 pt-12 @md:pt-16">
        <div className="h-px w-full bg-current opacity-10" />
      </div>

      {/* Central content */}
      <div className="flex-1 flex flex-col @md:flex-row items-center justify-center gap-12 @md:gap-20 px-8 @md:px-14 @lg:px-20 py-16">

        {/* Closing photo — optional */}
        {hasImage && (
          <Animate direction="right" distance={24} className="shrink-0">
            <div className="w-48 @sm:w-56 @md:w-64 overflow-hidden rounded-sm">
              <SiteImage
                src={imageUrl}
                alt={ending.signature ?? 'Ending'}
                aspectRatio={aspectRatio}
                frameStyle={frameStyle}
                cropData={imageSettings?.cropData}
                unoptimized
                sizes="(max-width: 768px) 50vw, 256px"
              />
            </div>
          </Animate>
        )}

        {/* Text */}
        <Animate className="text-center @md:text-left space-y-6 max-w-xs">
          {ending.text && (
            <p
              className={cn(
                'text-base @md:text-lg font-light opacity-60 leading-relaxed',
                theme.fontBody,
                theme.lineHeight,
              )}
            >
              {ending.text}
            </p>
          )}

          <div className="w-8 h-px bg-current opacity-20 mx-auto @md:mx-0" />

          {ending.signature && (
            <p className={cn('text-sm font-light opacity-45 italic', theme.fontBody)}>
              — {ending.signature}
            </p>
          )}

          {ending.date && (
            <p className={cn('text-[10px] uppercase tracking-[0.35em] opacity-25', theme.fontBody)}>
              {ending.date}
            </p>
          )}
        </Animate>
      </div>

      {/* Bottom wordmark */}
      <div className="px-8 @md:px-14 @lg:px-20 pb-12 @md:pb-16 flex items-center justify-center">
        <span className={cn('text-[8px] uppercase tracking-[0.5em] opacity-15', theme.fontBody)}>
          Soleil
        </span>
      </div>
    </SectionWrapper>
  )
}
