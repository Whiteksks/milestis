'use client'

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
  const aspectRatio = imageSettings?.aspectRatio ?? 'portrait'
  const frameStyle = imageSettings?.frameStyle ?? 'none'

  return (
    <SectionWrapper
      id="ending"
      themeForeground={theme.foreground}
      className={cn('overflow-x-clip', theme.background)}
    >
      <div className="flex flex-col items-center px-8 @md:px-14 @lg:px-20 py-20 @md:py-28 @lg:py-36">

        {/* Top thin rule */}
        <Animate trigger="mount" direction="none" className="w-full max-w-2xl mb-16 @md:mb-20">
          <div className="h-px w-full bg-current opacity-10" />
        </Animate>

        {/* Label ornament */}
        {ending.label && (
          <Animate trigger="mount" direction="none" delay={0.1} className="mb-12 @md:mb-16 flex items-center gap-4">
            <div className="h-px w-8 bg-current opacity-15" />
            <span className={cn('text-[9px] uppercase tracking-[0.5em] opacity-25', theme.fontBody)}>{ending.label}</span>
            <div className="h-px w-8 bg-current opacity-15" />
          </Animate>
        )}

        {ending.title && (
          <Animate trigger="mount" direction="none" delay={0.15} className="mb-12 @md:mb-16">
            <p className={cn('text-2xl @md:text-3xl font-light italic opacity-45 text-center', theme.fontTitle)}>
              {ending.title}
            </p>
          </Animate>
        )}

        {/* Large closing photo */}
        {hasImage && (
          <Animate trigger="mount" delay={0.2} distance={32} className="w-full max-w-sm @md:max-w-md mb-14 @md:mb-18">
            <div className="overflow-hidden rounded-sm">
              <SiteImage
                src={imageUrl}
                alt={ending.signature ?? 'Closing'}
                aspectRatio={aspectRatio}
                frameStyle={frameStyle}
                cropData={imageSettings?.cropData}
                unoptimized
                sizes="(max-width: 768px) 80vw, 400px"
                className="w-full"
              />
            </div>
          </Animate>
        )}

        {/* Text block */}
        <Animate trigger="mount" delay={hasImage ? 0.35 : 0.2} direction="none" className="flex flex-col items-center text-center space-y-6 max-w-[38ch]">
          {ending.text && (
            <p
              className={cn(
                'text-base @md:text-lg @lg:text-xl font-light italic opacity-55 leading-relaxed',
                theme.fontBody,
                theme.lineHeight,
              )}
            >
              {ending.text}
            </p>
          )}

          {(ending.signature || ending.date) && (
            <>
              <div className="w-8 h-px bg-current opacity-20" />
              {ending.signature && (
                <p className={cn('text-sm font-light opacity-45 italic', theme.fontBody)}>
                  {'\u2014'} {ending.signature}
                </p>
              )}
              {ending.date && (
                <p className={cn('text-[10px] uppercase tracking-[0.45em] opacity-25', theme.fontBody)}>
                  {ending.date}
                </p>
              )}
            </>
          )}
        </Animate>

        {/* Bottom thin rule */}
        <Animate trigger="mount" direction="none" delay={hasImage ? 0.5 : 0.35} className="w-full max-w-2xl mt-16 @md:mt-20">
          <div className="h-px w-full bg-current opacity-10" />
        </Animate>

      </div>
    </SectionWrapper>
  )
}