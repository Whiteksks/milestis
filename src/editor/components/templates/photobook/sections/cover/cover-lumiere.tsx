'use client'
"use client"

import { cn } from '@/lib/utils'
import type { ThemeConfig } from '@/editor/lib/themes'
import type { PhotobookSectionContent } from '@/editor/lib/types'
import { SiteImage } from '@/editor/components/editor/section-settings/ui/site-image'
import { SectionWrapper } from '../../../primitives/section-wrapper'
import { Animate } from '../../../primitives/animate'

interface CoverLumiereProps {
  sectionContent: PhotobookSectionContent
  theme: ThemeConfig
}

export function CoverLumiere({ sectionContent, theme }: CoverLumiereProps) {
  const { cover } = sectionContent
  const imageUrl = cover.images?.image ?? ''
  const hasImage = Boolean(imageUrl)
  return (
    <SectionWrapper
      id="cover"
      themeForeground={theme.foreground}
      className={cn(
        '@container min-h-screen flex flex-col items-center justify-center',    
        'px-8 @md:px-16 @lg:px-24 py-16',
        theme.background,
      )}
      padded={false}
    >

      {/* Framed photo */}
      {hasImage && (
        <Animate trigger="mount" delay={0.2} distance={28} className="w-full max-w-[240px] @sm:max-w-[300px] @md:max-w-sm mb-10 @md:mb-12">
          <SiteImage
            src={imageUrl}
            alt={cover.title ?? 'Cover'}
            aspectRatio={cover.images?.imageSettings?.[0]?.aspectRatio ?? 'portrait'}
            frameStyle={cover.images?.imageSettings?.[0]?.frameStyle ?? 'none'}
            cropData={cover.images?.imageSettings?.[0]?.cropData}
            priority
          />
        </Animate>
      )}

      {/* Title */}
      <Animate trigger="mount" delay={hasImage ? 0.5 : 0.25} distance={14} className="text-center space-y-3 max-w-md">
        <h1
          className={cn(
            'text-3xl @sm:text-4xl @md:text-5xl font-light italic tracking-tight leading-tight',
            theme.fontTitle,
          )}
        >
          {cover.title}
        </h1>
        {cover.subtitle && (
          <p className={cn('text-sm font-light opacity-40 tracking-widest', theme.fontBody)}>
            {cover.subtitle}
          </p>
        )}
      </Animate>

      {/* Date / location */}
      {(cover.date || cover.location) && (
        <Animate as="p" trigger="mount" direction="none" delay={hasImage ? 0.7 : 0.45} className={cn('mt-6 text-[9px] uppercase tracking-[0.38em] opacity-25', theme.fontBody)}>
          {[cover.date, cover.location].filter(Boolean).join('  вЂ”  ')}
        </Animate>
      )}

      {cover.tagline && (
        <Animate as="p" trigger="mount" direction="none" delay={0.85} className={cn('mt-2 text-[10px] italic opacity-30', theme.fontBody)}>
          {cover.tagline}
        </Animate>
      )}

      {/* Bottom decorative rule */}
      <Animate trigger="mount" direction="none" delay={1.05} className="origin-center w-16 h-px bg-current opacity-15 mt-14 @md:mt-16" />
    </SectionWrapper>
  )
}
