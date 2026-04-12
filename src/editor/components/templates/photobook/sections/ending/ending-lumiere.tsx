'use client'
  "use client"

import { SiteImage } from '@/editor/components/editor/section-settings/ui/site-image'
import { cn } from '@/lib/utils'
import type { ThemeConfig } from '@/editor/lib/themes'
import type { PhotobookSectionContent } from '@/editor/lib/types'
import { SectionWrapper } from '../../../primitives/section-wrapper'

interface EndingLumiereProps {
  sectionContent: PhotobookSectionContent
  theme: ThemeConfig
}

export function EndingLumiere({ sectionContent, theme }: EndingLumiereProps) {
  const { ending } = sectionContent
  const imageSettings = ending.images?.imageSettings?.[0]
  const imageUrl = ending.images?.image ?? ''
  const hasImage = Boolean(imageUrl)
  const aspectRatio = imageSettings?.aspectRatio ?? 'square'
  const frameStyle = imageSettings?.frameStyle ?? 'none'

  return (
    <SectionWrapper
      id="ending"
      themeForeground={theme.foreground}
      className={cn('overflow-x-clip', theme.background)}
    >
      {/* Top decorative rule */}
      <div className="px-8 @md:px-16 pt-10 @md:pt-14">
        <div className="flex items-center gap-4">
          <div className="h-px flex-1 bg-current opacity-10" />
          <span className={cn('text-[8px] uppercase tracking-[0.45em] opacity-20 shrink-0', theme.fontBody)}>
            06  В·  Fin
          </span>
          <div className="h-px flex-1 bg-current opacity-10" />
        </div>
      </div>

      {/* Central colophon */}
      <div className="flex-1 flex flex-col items-center justify-center px-8 py-16 text-center space-y-8 @md:space-y-10">

        {/* "Fin." */}
        <div
          className={cn(
            'text-[4rem] @sm:text-[5.5rem] @md:text-[7rem] font-light italic leading-none tracking-tight opacity-75',
            theme.fontTitle,
          )}
        >
          Fin.
        </div>

        {/* Decorative rule */}
        <div className="origin-center w-12 h-px bg-current opacity-15" />

        {/* Closing message */}
        {ending.text && (
          <p
            className={cn(
              'text-sm font-light italic opacity-45 max-w-[38ch] leading-relaxed',
              theme.fontBody,
              theme.lineHeight,
            )}
          >
            {ending.text}
          </p>
        )}

        {/* Signature */}
        {ending.signature && (
          <p
            className={cn('text-[10px] uppercase tracking-[0.35em] opacity-30', theme.fontBody)}
          >
            {ending.signature}
          </p>
        )}

        {/* Date */}
        {ending.date && (
          <p
            className={cn('text-[9px] uppercase tracking-[0.38em] opacity-20', theme.fontBody)}
          >
            {ending.date}
          </p>
        )}

        {/* Optional closing photograph */}
        {hasImage && (
          <div className="w-full max-w-[180px] @sm:max-w-[220px] mx-auto pt-2">
            <div className="border border-current/10 p-[3px]">
              <SiteImage
                src={imageUrl}
                alt="Closing photograph"
                aspectRatio={aspectRatio}
                frameStyle={frameStyle}
                cropData={imageSettings?.cropData}
                unoptimized
                sizes="220px"
              />
            </div>
          </div>
        )}
      </div>

      {/* Bottom decorative rule */}
      <div className="px-8 @md:px-16 pb-10 @md:pb-14">
        <div className="flex items-center gap-4">
          <div className="h-px flex-1 bg-current opacity-10" />
          <div className="w-1 h-1 rounded-full bg-current opacity-15" />
          <div className="h-px flex-1 bg-current opacity-10" />
        </div>
      </div>
    </SectionWrapper>
  )
}
