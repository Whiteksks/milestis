'use client'
"use client"

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
  const imageBlock = cover.images
  const imageUrl = imageBlock?.image ?? ''
  const aspectRatio = imageBlock?.imageSettings?.[0]?.aspectRatio ?? 'portrait'
  const frameStyle = imageBlock?.imageSettings?.[0]?.frameStyle ?? 'none'
  const cropData = imageBlock?.imageSettings?.[0]?.cropData
  return (
    <SectionWrapper
      id="cover"
      themeForeground={theme.foreground}
      className={theme.background}
      containerClassName="relative min-h-screen flex flex-col"
      padded={false}
    >

      {/* Top accent stroke */}
      <Animate trigger="mount" direction="none" className={cn('h-px origin-left shrink-0', theme.accent)} />

      {/* Main two-column grid */}
      <div className="flex-1 grid grid-cols-1 @md:grid-cols-[3fr_2fr] items-center">

        {/* Left вЂ“ Typography */}
        <Animate trigger="mount" delay={0.25} distance={36} className="order-2 @md:order-1 flex flex-col justify-center px-8 @md:px-12 @lg:px-20 py-14 @md:py-20 gap-8">
          {/* Eyebrow label */}
          <div className="flex items-center gap-3">
            <span className={cn('text-[10px] uppercase opacity-25', theme.letterSpacing, theme.fontBody)}>
              Photobook
            </span>
            <div className="w-8 h-px bg-current opacity-15" />
          </div>

          {/* Massive title */}
          <h1
            className={cn(
              'text-5xl @sm:text-6xl @md:text-7xl @lg:text-[6rem] font-bold leading-[0.88] tracking-tighter',
              theme.fontTitle,
            )}
          >
            {cover.title}
          </h1>

          {/* Tagline / subtitle */}
          {(cover.subtitle || cover.tagline) && (
            <p
              className={cn(
                'text-base @lg:text-lg font-light opacity-55 max-w-[28ch]',
                theme.lineHeight,
                theme.fontBody,
              )}
            >
              {cover.subtitle || cover.tagline}
            </p>
          )}

          {/* Date + Location */}
          {(cover.date || cover.location) && (
            <div className="flex items-center gap-4 pt-4 border-t border-current/10">
              <div className={cn('h-px w-8 shrink-0', theme.accent)} />
              <p className={cn('text-xs uppercase tracking-[0.2em] opacity-40', theme.fontBody)}>
                {[cover.date, cover.location].filter(Boolean).join('  В·  ')}
              </p>
            </div>
          )}
        </Animate>

        {/* Right вЂ“ Photo */}
        <Animate trigger="mount" type="scale" scaleOffset={0.96} delay={0.05} className="order-1 @md:order-2 flex items-center justify-center @md:justify-end px-8 @md:px-10 @lg:px-14 py-10 @md:py-16">
          {imageUrl ? (
            <SiteImage
              src={imageUrl}
              alt={cover.title}
              aspectRatio={aspectRatio}
              frameStyle={frameStyle}
              cropData={cropData}
              className={cn('w-full max-w-[260px] @sm:max-w-[300px] @md:max-w-sm', theme.shadow, theme.elementGlow)}
              priority
            />
          ) : (
            <div
              className={cn(
                'w-full max-w-[260px] @sm:max-w-[300px] @md:max-w-sm',
                getAspectRatioClass(aspectRatio),
                theme.muted,
              )}
            />
          )}
        </Animate>
      </div>

      {/* Bottom rule */}
      <div className="px-8 @md:px-12 @lg:px-20 pb-8 shrink-0">
        <div className="h-px bg-current opacity-[0.08]" />
      </div>
    </SectionWrapper>
  )
}
