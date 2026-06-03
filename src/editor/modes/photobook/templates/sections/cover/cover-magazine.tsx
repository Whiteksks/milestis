'use client'

import { SlotImage } from '@/editor/image'
import { cn } from '@/lib/utils'
import type { ThemeConfig } from '@/editor/lib/config/themes'
import type { PhotobookSectionContent } from '../../../content-types'
import type { PhotobookImageContent } from '@/editor/modes/photobook/image/content'
import { SectionWrapper } from '@/editor/components/templates/primitives/section-wrapper'
import { Animate } from '@/editor/components/templates/primitives/animate'

interface CoverMagazineProps {
  sectionContent: PhotobookSectionContent
  theme: ThemeConfig
  imageContent?: PhotobookImageContent
}

export function CoverMagazine({ sectionContent, theme, imageContent }: CoverMagazineProps) {
  const { cover } = sectionContent
  const coverImage = imageContent?.cover
  const hasImage = Boolean(coverImage?.value.asset.src)

  // Split title into words ” alternate solid / outline rendering
  const words = (cover.title ?? '').split(' ').filter(Boolean)
  return (
    <SectionWrapper
      id="cover"
      themeForeground={theme.foreground}
      className={cn(
        'relative min-h-screen flex flex-col overflow-hidden',       
        theme.background,
      )}
    >
      {/* Full-bleed background */}
      {hasImage && coverImage && (
        <div className="absolute inset-0">
          <SlotImage
            slotId={coverImage.slotId}
            value={coverImage.value}
            fillParent
            alt={cover.title ?? 'Cover'}
            sizes="100vw"
            priority
          />
          {/* Gradient: darken bottom 60%, slight top vignette */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/30" />
        </div>
      )}

      {/* Top editorial bar */}
      <Animate trigger="mount" direction="none" className="relative z-10 flex items-center justify-between px-8 @md:px-14 @lg:px-20 pt-10 @md:pt-12">
        <div className={cn('h-px w-16 @md:w-24 shrink-0', hasImage ? 'bg-white/25' : 'bg-current opacity-15')} />
        {(cover.date || cover.location) && (
          <p
            className={cn(
              'text-[9px] uppercase tracking-[0.3em]',
              hasImage ? 'text-white/40' : 'opacity-25',
              theme.fontBody,
            )}
          >
            {[cover.location, cover.date].filter(Boolean).join('  ·  ')}
          </p>
        )}
      </Animate>

      {/* Bottom title block */}
      <div className="relative z-10 flex-1 flex flex-col justify-end px-8 @md:px-14 @lg:px-20 pb-12 @md:pb-20 @lg:pb-28">

        {/* Thin horizontal accent rule */}
        <Animate
          trigger="mount"
          direction="none"
          delay={0.1}
          className={cn('h-px w-full origin-left mb-8 @md:mb-10', hasImage ? 'bg-white/20' : theme.accent)}
        />

        {/* Alternate solid / outline title words */}
        <Animate trigger="mount" delay={0.25} distance={48}>
          <h1
            className={cn(
              'text-5xl @sm:text-6xl @md:text-7xl @lg:text-[8.5rem]',
              'font-bold tracking-tighter leading-[0.85] uppercase',
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
          {cover.subtitle && (
            <Animate
              as="p"
              trigger="mount"
              direction="none"
              delay={0.5}
              className={cn(
                'mt-6 @md:mt-8 text-sm @md:text-base font-light max-w-[40ch] border-l-2 pl-4 @md:pl-5',
                hasImage ? 'text-white/55 border-white/25' : 'opacity-55 border-current/20',
                theme.lineHeight,
                theme.fontBody,
              )}
            >
              {cover.subtitle}
            </Animate>
          )}
          {cover.tagline && (
            <Animate
              as="p"
              trigger="mount"
              direction="none"
              delay={0.6}
              className={cn(
                'mt-3 text-sm font-light italic max-w-[44ch] pl-4 @md:pl-5',
                hasImage ? 'text-white/40' : 'opacity-40',
                theme.fontBody,
              )}
            >
              {cover.tagline}
            </Animate>
          )}
        </Animate>
      </div>
    </SectionWrapper>
  )
}

