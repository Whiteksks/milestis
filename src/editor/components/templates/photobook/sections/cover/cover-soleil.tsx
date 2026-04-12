'use client'
"use client"

import { cn } from '@/lib/utils'
import type { ThemeConfig } from '@/editor/lib/themes'
import type { PhotobookSectionContent } from '@/editor/lib/types'
import { SiteImage } from '@/editor/components/editor/section-settings/ui/site-image'
import { SectionWrapper } from '../../../primitives/section-wrapper'
import { Animate } from '../../../primitives/animate'

interface CoverSoleilProps {
  sectionContent: PhotobookSectionContent
  theme: ThemeConfig
}

export function CoverSoleil({ sectionContent, theme }: CoverSoleilProps) {
  const { cover } = sectionContent
  const imageUrl = cover.images?.image ?? ''
  const hasImage = Boolean(imageUrl)
  return (
    <SectionWrapper
      id="cover"
      themeForeground={hasImage ? undefined : theme.foreground}
      className={cn(
        '@container relative min-h-screen flex flex-col overflow-hidden',
        !hasImage && theme.background,
      )}
    >
      {/* Full-bleed background */}
      {hasImage && (
        <div className="absolute inset-0">
          <SiteImage
            fillParent
            unoptimized
            src={imageUrl}
            alt={cover.title ?? 'Cover'}
            sizes="100vw"
            imageClassName="object-cover"
            priority
          />
          {/* Bottom-heavy gradient for text legibility */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-black/10" />
        </div>
      )}

      {/* Top bar */}
      <Animate trigger="mount" direction="none" className="relative z-10 flex items-center justify-between px-8 @md:px-14 @lg:px-20 pt-10 @md:pt-14">
        <div className="h-px w-12 bg-current opacity-20" style={{ color: hasImage ? 'white' : undefined }} />
        {(cover.date || cover.location) && (
          <p
            className={cn(
              'text-[9px] uppercase tracking-[0.35em]',
              hasImage ? 'text-white/45' : 'opacity-30',
              theme.fontBody,
            )}
          >
            {[cover.date, cover.location].filter(Boolean).join('  В·  ')}
          </p>
        )}
      </Animate>

      {/* Bottom content */}
      <div className="relative z-10 flex-1 flex flex-col justify-end px-8 @md:px-14 @lg:px-20 pb-14 @md:pb-20 @lg:pb-28">
        <Animate trigger="mount" delay={0.2} distance={32} className="space-y-4 max-w-[22ch]">
          <h1
            className={cn(
              'text-4xl @sm:text-5xl @md:text-6xl @lg:text-7xl font-light leading-[1.05] tracking-tight',
              hasImage ? 'text-white' : '',
              theme.fontTitle,
            )}
          >
            {cover.title}
          </h1>

          {(cover.subtitle || cover.tagline) && (
            <p
              className={cn(
                'text-sm @md:text-base font-light max-w-[32ch]',
                hasImage ? 'text-white/55' : 'opacity-50',
                theme.lineHeight,
                theme.fontBody,
              )}
            >
              {cover.subtitle || cover.tagline}
            </p>
          )}
        </Animate>
      </div>

      {/* No-image fallback: centered layout */}
      {!hasImage && (
        <div className="absolute inset-0 flex items-center justify-center px-8 @md:px-14">
          <div className="text-center space-y-6">
            <h1
              className={cn(
                'text-5xl @sm:text-6xl @md:text-7xl font-light tracking-tight leading-[1.05]',
                theme.fontTitle,
              )}
            >
              {cover.title}
            </h1>
            {(cover.subtitle || cover.tagline) && (
              <p className={cn('text-base font-light opacity-50 max-w-[30ch] mx-auto', theme.lineHeight, theme.fontBody)}>
                {cover.subtitle || cover.tagline}
              </p>
            )}
            {(cover.date || cover.location) && (
              <p className={cn('text-[10px] uppercase tracking-[0.35em] opacity-30 pt-4', theme.fontBody)}>
                {[cover.date, cover.location].filter(Boolean).join('  В·  ')}
              </p>
            )}
          </div>
        </div>
      )}
    </SectionWrapper>
  )
}
