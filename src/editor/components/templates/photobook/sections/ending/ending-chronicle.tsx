'use client'

import { SectionWrapper } from '../../../primitives/section-wrapper'
import { SiteImage } from '@/editor/components/editor/section-settings/ui/site-image'
import { cn } from '@/lib/utils'
import type { ThemeConfig } from '@/editor/lib/themes'
import type { PhotobookSectionContent } from '@/editor/lib/types'

interface EndingChronicleProps {
  sectionContent: PhotobookSectionContent
  theme: ThemeConfig
}

export function EndingChronicle({ sectionContent, theme }: EndingChronicleProps) {
  const { ending } = sectionContent
  const imageBlock = ending.images
  const imageUrl = imageBlock?.image ?? ''
  const aspectRatio = imageBlock?.imageSettings?.[0]?.aspectRatio ?? 'square'
  const frameStyle = imageBlock?.imageSettings?.[0]?.frameStyle ?? 'none'

  return (
    <SectionWrapper
      id="ending"
      themeForeground={theme.foreground}
      className={cn('overflow-x-clip', theme.muted)}
    >
      <div className="max-w-7xl mx-auto w-full px-8 @md:px-14 @lg:px-20 flex flex-col gap-10 @md:gap-14">

        {/* Top editorial header */}
        <div>
          <div className={cn('border-t-2', theme.border)} />
          <div className="flex items-center justify-between mt-3">
            {ending.label && (
              <span className={cn('text-[9px] uppercase tracking-[0.3em] opacity-35', theme.fontBody)}>
                {ending.label}
              </span>
            )}
          </div>
        </div>

        <div className="flex-1 flex flex-col @md:flex-row gap-12 @md:gap-20 items-start @md:items-center">

          {/* Left вЂ” typographic closing */}
          <div className="flex-1 space-y-6 @md:space-y-8">
            {/* Title masthead */}
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

          {/* Right вЂ” optional closing photo */}
          {imageUrl && (
            <div className="w-full @md:w-64 @lg:w-80 shrink-0">
              <SiteImage
                src={imageUrl}
                alt={ending.signature ?? 'Ending'}
                aspectRatio={aspectRatio}
                frameStyle={frameStyle}
                cropData={imageBlock?.imageSettings?.[0]?.cropData}
                unoptimized
                sizes="(max-width: 768px) 80vw, 320px"
                className={theme.shadow}
              />
            </div>
          )}
        </div>

        {/* Bottom closing accent line */}
        <div className={cn('h-[2px] origin-left', theme.accent)} />
      </div>
    </SectionWrapper>
  )
}
