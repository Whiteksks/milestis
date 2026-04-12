'use client'
"use client"

import { SectionWrapper } from '../../../primitives/section-wrapper'
import { SiteImage } from '@/editor/components/editor/section-settings/ui/site-image'
import { cn } from '@/lib/utils'
import type { ThemeConfig } from '@/editor/lib/themes'
import type { PhotobookSectionContent } from '@/editor/lib/types'

interface EndingMemoirProps {
  sectionContent: PhotobookSectionContent
  theme: ThemeConfig
}

export function EndingMemoir({ sectionContent, theme }: EndingMemoirProps) {
  const { ending } = sectionContent
  const imageBlock = ending.images
  const imageUrl = imageBlock?.image ?? ''
  const aspectRatio = imageBlock?.imageSettings?.[0]?.aspectRatio ?? 'square'
  const frameStyle = imageBlock?.imageSettings?.[0]?.frameStyle ?? 'none'

  return (
    <SectionWrapper
      id="ending"
      themeForeground={theme.foreground}
      className={cn('overflow-x-clip', theme.background)}
    >
      {/* Top rule */}
      <div className="max-w-7xl mx-auto w-full px-8 @md:px-12 @lg:px-20">
        <div className={cn('border-t', theme.border)} />
      </div>

      {/* Main content */}
      <div className="flex-1 max-w-7xl mx-auto w-full px-8 @md:px-12 @lg:px-20 py-12 @md:py-16 @lg:py-20 grid grid-cols-1 @md:grid-cols-2 gap-10 @md:gap-16 @lg:gap-20 items-center">

        {/* Closing typography */}
        <div className="space-y-6 @md:space-y-10">
          {ending.text && (
            <p
              className={cn(
                'text-lg @md:text-xl font-light opacity-60 max-w-sm',
                theme.lineHeight,
                theme.fontBody,
              )}
            >
              {ending.text}
            </p>
          )}

          <div className="space-y-2 pt-2">
            {ending.signature && (
              <p className={cn('text-sm opacity-50 italic', theme.fontBody)}>
                вЂ” {ending.signature}
              </p>
            )}
            {ending.date && (
              <p className={cn('text-xs uppercase opacity-30', theme.letterSpacing, theme.fontBody)}>
                {ending.date}
              </p>
            )}
          </div>
        </div>

        {/* Optional closing photo */}
        {imageUrl && (
          <div className="flex justify-center @md:justify-end">
              <SiteImage
                src={imageUrl}
                alt={ending.signature ?? 'Ending'}
                aspectRatio={aspectRatio}
                frameStyle={frameStyle}
                cropData={imageBlock?.imageSettings?.[0]?.cropData}
                unoptimized
                sizes="(max-width: 768px) 80vw, 40vw"
                className={cn('w-full max-w-xs @md:max-w-none @md:w-full', theme.shadow)}
              />
          </div>
        )}
      </div>

      {/* Bottom accent line */}
      <div className="max-w-7xl mx-auto w-full px-8 @md:px-12 @lg:px-20 pb-8">
        <div className={cn('h-px origin-left', theme.accent)} />
      </div>
    </SectionWrapper>
  )
}
