"use client"

import { SiteImage } from '@/editor/components/editor/section-settings/ui/site-image'
import { cn } from '@/lib/utils'
import type { ThemeConfig } from '@/editor/lib/themes'
import type { PhotobookSectionContent } from '@/editor/lib/types'
import { SectionWrapper } from '../../../primitives/section-wrapper'
import { Animate } from '../../../primitives/animate'

interface IntroLumiereProps {
  sectionContent: PhotobookSectionContent
  theme: ThemeConfig
}

export function IntroLumiere({ sectionContent, theme }: IntroLumiereProps) {
  const { introduction } = sectionContent
  const imageSettings = introduction.images?.imageSettings?.[0]
  const imageUrl = introduction.images?.image ?? ''
  const hasImage = Boolean(imageUrl)
  const aspectRatio = imageSettings?.aspectRatio ?? 'portrait'
  const frameStyle = imageSettings?.frameStyle ?? 'none'

  return (
    <SectionWrapper
      id="introduction"
      themeForeground={theme.foreground}
      className={cn('overflow-x-clip', theme.background)}
      padded={false}
      containerClassName="max-w-2xl px-8 @md:px-0 text-center space-y-12 @md:space-y-16 py-20 @md:py-28"
    >

        {/* Section header */}
        <div className="flex items-center gap-4">
          <div className="h-px flex-1 bg-current opacity-10" />
          <span className={cn('text-[8px] uppercase tracking-[0.45em] opacity-25 shrink-0', theme.fontBody)}>
            02  ·  Introduction
          </span>
          <div className="h-px flex-1 bg-current opacity-10" />
        </div>

        {/* Title */}
        {introduction.title && (
          <h2
            className={cn(
              'text-2xl @sm:text-3xl @md:text-4xl font-light italic tracking-tight leading-snug',
              theme.fontTitle,
            )}
          >
            {introduction.title}
          </h2>
        )}

        {/* Quote */}
        {introduction.quote && (
          <Animate className="space-y-3">
            <p
              className={cn(
                'text-lg @md:text-xl leading-relaxed font-light italic opacity-60',
                theme.fontBody,
                theme.lineHeight,
              )}
            >
              &ldquo;{introduction.quote}&rdquo;
            </p>
          </Animate>
        )}

        {/* Dedication */}
        {introduction.dedication && (
          <p
            className={cn('text-[10px] uppercase tracking-[0.35em] opacity-30', theme.fontBody)}
          >
            {introduction.dedication}
          </p>
        )}

        {/* Thin rule between text and photo */}
        {hasImage && (
          <div className="origin-center w-12 h-px bg-current opacity-15 mx-auto" />
        )}

        {/* Framed photo */}
        {hasImage && (
          <div className="w-full max-w-[280px] @md:max-w-xs mx-auto">
            <div className="border border-current/10 p-[3px]">
              <SiteImage
                src={imageUrl}
                alt={introduction.title ?? 'Introduction'}
                aspectRatio={aspectRatio}
                frameStyle={frameStyle}
                cropData={imageSettings?.cropData}
                unoptimized
                sizes="(max-width: 768px) 80vw, 320px"
              />
            </div>
            {introduction.images?.caption && (
              <p className={cn('mt-2 text-[9px] uppercase tracking-widest opacity-25 text-center', theme.fontBody)}>
                {introduction.images.caption}
              </p>
            )}
          </div>
        )}
    </SectionWrapper>
  )
}
