'use client'

import { SectionWrapper } from '../../../primitives/section-wrapper'
import { Animate } from '../../../primitives/animate'
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
  const hasImage = Boolean(imageUrl)
  const aspectRatio = imageBlock?.imageSettings?.[0]?.aspectRatio ?? 'portrait'
  const frameStyle = imageBlock?.imageSettings?.[0]?.frameStyle ?? 'none'

  return (
    <SectionWrapper
      id="ending"
      themeForeground={theme.foreground}
      className={cn('overflow-x-clip', theme.background)}
    >
      <div className="max-w-3xl mx-auto px-8 @md:px-12 @lg:px-20 py-20 @md:py-28 @lg:py-32">

        {/* Top rule with accent */}
        <Animate direction="none" className="mb-14 @md:mb-20">
          <div className={cn('border-t', theme.border)} />
          <div className={cn('h-[2px] w-12 mt-px origin-left', theme.accent)} />
        </Animate>

        {/* Section label */}
        {ending.label && (
          <Animate direction="up" distance={16} className="mb-10 @md:mb-14">
            <span className={cn('text-[9px] uppercase tracking-[0.4em] opacity-30', theme.fontBody)}>
              {ending.label}
            </span>
          </Animate>
        )}

        {/* Ending title — e.g. "The End" */}
        {ending.title && (
          <Animate direction="up" distance={24} delay={0.05} className="mb-10 @md:mb-12">
            <h2
              className={cn(
                'text-5xl @md:text-6xl @lg:text-7xl font-bold tracking-tighter leading-none',
                theme.fontTitle,
              )}
            >
              {ending.title}
            </h2>
          </Animate>
        )}

        {/* Closing text as large styled blockquote */}
        {ending.text && (
          <Animate direction="up" distance={24} delay={0.1} className="mb-12 @md:mb-16">
            <p
              className={cn(
                'text-xl @sm:text-2xl @md:text-3xl @lg:text-4xl font-light italic leading-snug opacity-65',
                theme.fontTitle,
                theme.lineHeight,
              )}
            >
              &ldquo;{ending.text}&rdquo;
            </p>
          </Animate>
        )}

        {/* Optional closing photo */}
        {hasImage && (
          <Animate direction="up" distance={24} delay={0.2} className="mb-12 @md:mb-16">
            <div className={cn('w-full max-w-xs @md:max-w-sm overflow-hidden', theme.shadow)}>
              <SiteImage
                src={imageUrl}
                alt={ending.signature ?? 'Ending'}
                aspectRatio={aspectRatio}
                frameStyle={frameStyle}
                cropData={imageBlock?.imageSettings?.[0]?.cropData}
                unoptimized
                sizes="(max-width: 768px) 70vw, 400px"
                className="w-full"
              />
            </div>
          </Animate>
        )}

        {/* Signature and date */}
        <Animate direction="up" distance={16} delay={hasImage ? 0.35 : 0.25} className="space-y-2">
          {ending.signature && (
            <p className={cn('text-sm opacity-50 italic', theme.fontBody)}>
              {'\u2014'} {ending.signature}
            </p>
          )}
          {ending.date && (
            <p className={cn('text-xs uppercase opacity-30', theme.letterSpacing, theme.fontBody)}>
              {ending.date}
            </p>
          )}
        </Animate>

        {/* Bottom accent line */}
        <Animate direction="none" delay={hasImage ? 0.45 : 0.35} className="mt-16 @md:mt-20">
          <div className={cn('h-px origin-left', theme.accent)} />
        </Animate>

      </div>
    </SectionWrapper>
  )
}