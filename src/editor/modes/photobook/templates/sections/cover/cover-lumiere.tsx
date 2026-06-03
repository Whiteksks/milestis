'use client'

import { cn } from '@/lib/utils'
import type { ThemeConfig } from '@/editor/lib/config/themes'
import type { PhotobookSectionContent } from '../../../content-types'
import type { PhotobookImageContent } from '@/editor/modes/photobook/image/content'
import { SlotImage } from '@/editor/image'
import { SectionWrapper } from '@/editor/components/templates/primitives/section-wrapper'
import { Animate } from '@/editor/components/templates/primitives/animate'

interface CoverLumiereProps {
  sectionContent: PhotobookSectionContent
  theme: ThemeConfig
  imageContent?: PhotobookImageContent
}

export function CoverLumiere({ sectionContent, theme, imageContent }: CoverLumiereProps) {
  const { cover } = sectionContent
  const coverImage = imageContent?.cover
  const hasImage = Boolean(coverImage?.value.asset.src)

  return (
    <SectionWrapper
      id="cover"
      themeForeground={hasImage ? undefined : theme.foreground}
      className={cn(
        '@container relative min-h-screen flex flex-col overflow-hidden',
        !hasImage && theme.background,
      )}
    >
      {/* Full-bleed background — cinematic, like looking through a lens */}
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
          {/* Soft cinematic vignette — heavy bottom, gentle top bloom */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/88 via-black/10 to-black/45" />
        </div>
      )}

      {/* Top — film caption strip */}
      <Animate
        trigger="mount"
        direction="none"
        delay={0.6}
        className="relative z-10 flex items-center justify-center gap-5 px-8 @md:px-16 pt-10 @md:pt-12"
      >
        <div className={cn('h-px w-8 @md:w-12 shrink-0', hasImage ? 'bg-white/20' : 'bg-current opacity-10')} />
        {(cover.date || cover.location) && (
          <p
            className={cn(
              'text-[8px] uppercase tracking-[0.5em] shrink-0',
              hasImage ? 'text-white/30' : 'opacity-20',
              theme.fontBody,
            )}
          >
            {[cover.location, cover.date].filter(Boolean).join(' · ')}
          </p>
        )}
        <div className={cn('h-px w-8 @md:w-12 shrink-0', hasImage ? 'bg-white/20' : 'bg-current opacity-10')} />
      </Animate>

      {/* === WITH IMAGE: title anchored at bottom === */}
      {hasImage && (
        <div className="relative z-10 flex-1 flex flex-col justify-end items-center text-center px-8 @md:px-16 @lg:px-20 pb-16 @md:pb-20 @lg:pb-28">
          <Animate trigger="mount" delay={0.2} distance={30}>
            {/* Film-frame ornament above title */}
            <div className="flex items-center justify-center gap-3 mb-7">
              <div className="h-px w-10 @md:w-16 bg-white/25" />
              <div className="w-[3px] h-[3px] rounded-full bg-white/40" />
              <div className="h-px w-10 @md:w-16 bg-white/25" />
            </div>

            <h1
              className={cn(
                'text-4xl @sm:text-5xl @md:text-6xl @lg:text-[7rem] font-light italic tracking-tight leading-[1.0] text-white',
                theme.fontTitle,
              )}
            >
              {cover.title}
            </h1>

            {cover.subtitle && (
              <p
                className={cn(
                  'mt-5 text-sm font-light text-white/45 tracking-[0.2em] max-w-[32ch] mx-auto',
                  theme.fontBody,
                )}
              >
                {cover.subtitle}
              </p>
            )}
            {cover.tagline && (
              <p
                className={cn(
                  'mt-3 text-sm font-light italic text-white/30 max-w-[32ch] mx-auto',
                  theme.fontBody,
                )}
              >
                {cover.tagline}
              </p>
            )}
          </Animate>
        </div>
      )}

      {/* === NO IMAGE: centered poetry layout === */}
      {!hasImage && (
        <div className="flex-1 flex flex-col items-center justify-center px-8 @md:px-16 text-center">
          <Animate trigger="mount" delay={0.15} distance={20} className="space-y-6 max-w-lg">
            <h1
              className={cn(
                'text-4xl @sm:text-5xl @md:text-6xl @lg:text-7xl font-light italic tracking-tight leading-[1.0]',
                theme.fontTitle,
              )}
            >
              {cover.title}
            </h1>

            <div className="flex items-center justify-center gap-3">
              <div className="h-px w-6 bg-current opacity-15" />
              <div className="w-1 h-1 rounded-full bg-current opacity-20" />
              <div className="h-px w-6 bg-current opacity-15" />
            </div>

            {cover.subtitle && (
              <p className={cn('text-sm font-light opacity-40 tracking-widest max-w-[28ch] mx-auto', theme.fontBody)}>
                {cover.subtitle}
              </p>
            )}
            {cover.tagline && (
              <p className={cn('text-sm font-light italic opacity-30 max-w-[28ch] mx-auto', theme.fontBody)}>
                {cover.tagline}
              </p>
            )}
          </Animate>
        </div>
      )}
    </SectionWrapper>
  )
}

