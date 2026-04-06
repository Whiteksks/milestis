"use client"

import { SiteImage } from '@/editor/components/editor/section-settings/ui/site-image'
import { cn } from '@/lib/utils'
import type { ThemeConfig } from '@/editor/lib/themes'
import type { PhotobookSectionContent } from '@/editor/lib/types'
import { SectionWrapper } from '../../../primitives/section-wrapper'
import { Animate } from '../../../primitives/animate'

interface CoverMagazineProps {
  sectionContent: PhotobookSectionContent
  theme: ThemeConfig
}

export function CoverMagazine({ sectionContent, theme }: CoverMagazineProps) {
  const { cover } = sectionContent
  const imageUrl = cover.images?.image ?? ''
  const hasImage = Boolean(imageUrl)

  // Split title into words — alternate solid / outline rendering
  const words = (cover.title ?? '').split(' ').filter(Boolean)
  return (
    <SectionWrapper
      id="cover"
      themeForeground={theme.foreground}
      className={cn(
        '@container relative min-h-screen flex flex-col overflow-hidden',       
        theme.background,
      )}
      padded={false}
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
          {/* Gradient: darken bottom 60%, slight top vignette */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/30" />
        </div>
      )}

      {/* Masthead top bar */}
      <Animate trigger="mount" direction="none" className="relative z-10 flex items-center justify-between px-8 @md:px-14 @lg:px-20 pt-8 @md:pt-10">
        {/* Left — publication name */}
        <span
          className={cn(
            'text-[10px] uppercase tracking-[0.4em] font-bold',
            hasImage ? 'text-white/60' : 'opacity-40',
            theme.letterSpacing,
            theme.fontBody,
          )}
        >
          Photobook
        </span>

        {/* Right — date / location */}
        <div className="flex items-center gap-6">
          {cover.date && (
            <span
              className={cn(
                'text-[9px] uppercase tracking-[0.2em]',
                hasImage ? 'text-white/40' : 'opacity-25',
                theme.fontBody,
              )}
            >
              {cover.date}
            </span>
          )}
          {cover.location && (
            <span
              className={cn(
                'text-[9px] uppercase tracking-[0.2em]',
                hasImage ? 'text-white/40' : 'opacity-25',
                theme.fontBody,
              )}
            >
              {cover.location}
            </span>
          )}
        </div>
      </Animate>

      {/* Bottom title block */}
      <div className="relative z-10 flex-1 flex flex-col justify-end px-8 @md:px-14 @lg:px-20 pb-12 @md:pb-20 @lg:pb-28">

        {/* Top thin rule above title */}
        <Animate trigger="mount" direction="none" className={cn(
            'h-px origin-left mb-8',
            hasImage ? 'bg-white/25' : theme.accent,
          )}
        />

        {/* Alternate solid / outline title words */}
        <Animate trigger="mount" delay={0.2} distance={44}>
          <h1
            className={cn(
              'text-5xl @sm:text-6xl @md:text-7xl @lg:text-[8rem]',
              'font-bold tracking-tighter leading-[0.88] uppercase',
              theme.fontTitle,
            )}
          >
            {words.map((word, i) => (
              <span
                key={i}
                className="block"
                style={
                  i % 2 === 1
                    ? {
                        // Outline word
                        WebkitTextStroke: hasImage ? '1.5px rgba(255,255,255,0.7)' : '1.5px currentColor',
                        WebkitTextFillColor: 'transparent',
                        color: 'transparent',
                      }
                    : {
                        // Solid word
                        color: hasImage ? '#ffffff' : undefined,
                      }
                }
              >
                {word}
              </span>
            ))}
          </h1>

          {/* Subtitle / tagline */}
          {(cover.subtitle || cover.tagline) && (
            <Animate as="p" trigger="mount" direction="none" delay={0.55} className={cn(
                'mt-6 text-sm @md:text-base font-light max-w-[36ch]',
                hasImage ? 'text-white/50' : 'opacity-50',
                theme.lineHeight,
                theme.fontBody,
              )}
            >
              {cover.subtitle || cover.tagline}
            </Animate>
          )}
        </Animate>
      </div>
    </SectionWrapper>
  )
}
