'use client'
"use client"

import { SectionWrapper } from '../../../primitives/section-wrapper'
import { Animate } from '../../../primitives/animate'
import { SiteImage } from '@/editor/components/editor/section-settings/ui/site-image'
import { cn } from '@/lib/utils'
import type { ThemeConfig } from '@/editor/lib/themes'
import type { PhotobookSectionContent } from '@/editor/lib/types'

interface IntroMemoirProps {
  sectionContent: PhotobookSectionContent
  theme: ThemeConfig
}

export function IntroMemoir({ sectionContent, theme }: IntroMemoirProps) {
  const { introduction } = sectionContent
  const imageBlock = introduction.images
  const imageUrl = imageBlock?.image ?? ''
  const aspectRatio = imageBlock?.imageSettings?.[0]?.aspectRatio ?? 'portrait'
  const frameStyle = imageBlock?.imageSettings?.[0]?.frameStyle ?? 'none'

  return (
    <SectionWrapper
      id="introduction"
      themeForeground={theme.foreground}
      className={theme.background}
      padded={false}
      containerClassName="px-8 @md:px-12 @lg:px-20 py-20 @md:py-28 @lg:py-36"
    >

        {/* Section label */}
        <Animate direction="up" distance={20} className="flex items-center gap-4 mb-16 @md:mb-20">
          <div className={cn('h-px w-12', theme.accent)} />
          <span className={cn('text-[10px] uppercase opacity-30', theme.letterSpacing, theme.fontBody)}>
            Introduction
          </span>
        </Animate>
        <div className="grid grid-cols-1 @md:grid-cols-[3fr_2fr] gap-12 @md:gap-20 items-start">

          {/* Left РІР‚вЂњ text */}
          <Animate direction="right" distance={30} delay={0.1} className="space-y-10">
            {introduction.title && (
              <h2
                className={cn(
                  'text-3xl @md:text-4xl @lg:text-5xl font-bold leading-tight tracking-tight',
                  theme.fontTitle,
                )}
              >
                {introduction.title}
              </h2>
            )}

            {introduction.quote && (
              <blockquote className="relative pl-6">
                <div className={cn('absolute left-0 top-0 bottom-0 w-0.5 rounded-full', theme.accent)} />
                <p
                  className={cn(
                    'text-lg @md:text-xl font-light italic opacity-65',
                    theme.lineHeight,
                    theme.fontBody,
                  )}
                >
                  &ldquo;{introduction.quote}&rdquo;
                </p>
              </blockquote>
            )}

            {introduction.dedication && (
              <div className="flex items-center gap-4 pt-2">
                <div className="h-px w-8 bg-current opacity-20" />
                <p className={cn('text-xs uppercase tracking-[0.2em] opacity-45', theme.fontBody)}>
                  {introduction.dedication}
                </p>
              </div>
            )}
          </Animate>

          {imageUrl && (
            <Animate direction="left" distance={30} delay={0.2} scaleOffset={0.98}>
              <SiteImage
                src={imageUrl}
                alt={introduction.title ?? 'Introduction'}
                aspectRatio={aspectRatio}
                frameStyle={frameStyle}
                cropData={imageBlock?.imageSettings?.[0]?.cropData}
                unoptimized
                sizes="(max-width: 768px) 80vw, 35vw"
                className={theme.shadow}
              />
            </Animate>
          )}
        </div>
    </SectionWrapper>
  )
}
