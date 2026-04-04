"use client"

import { motion, MotionConfig, type Transition } from "framer-motion"
import { SiteImage } from '@/editor/components/editor/section-settings/ui/site-image'
import { cn } from '@/lib/utils'
import type { ThemeConfig } from '@/editor/lib/themes'
import type { PhotobookSectionContent } from '@/editor/lib/types'

interface CoverChronicleProps {
  sectionContent: PhotobookSectionContent
  theme: ThemeConfig
  disableAnimations?: boolean
}

export function CoverChronicle({ sectionContent, theme, disableAnimations = false }: CoverChronicleProps) {
  const { cover } = sectionContent
  const imageUrl = cover.images?.image ?? ''
  const hasImage = Boolean(imageUrl)
  const t = (duration: number, delay = 0, ease?: Transition['ease']): Transition =>
    disableAnimations ? { duration: 0, delay: 0 } : { duration, delay, ...(ease !== undefined ? { ease } : {}) }

  return (
    <MotionConfig reducedMotion={disableAnimations ? 'always' : 'user'}>
    <section
      className={cn(
        '@container relative min-h-screen flex flex-col overflow-hidden',
        !hasImage && cn(theme.background, theme.foreground),
      )}
    >
      {/* Full-bleed background photo */}
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
          <div className="absolute inset-0 bg-black/60" />
        </div>
      )}

      {/* Masthead top bar */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={t(0.8)}
        className="relative z-10 flex items-center justify-between px-8 @md:px-14 @lg:px-20 pt-8 @md:pt-10"
      >
        <div className="flex items-center gap-3">
          <div className={cn('h-px w-8', hasImage ? 'bg-white/40' : theme.accent)} />
          <span
            className={cn(
              'text-[9px] uppercase tracking-[0.3em]',
              hasImage ? 'text-white/50' : 'opacity-40',
              theme.fontBody,
            )}
          >
            Chronicle
          </span>
        </div>
        {(cover.date || cover.location) && (
          <p
            className={cn(
              'text-[9px] uppercase tracking-[0.18em]',
              hasImage ? 'text-white/40' : 'opacity-30',
              theme.letterSpacing,
              theme.fontBody,
            )}
          >
            {[cover.date, cover.location].filter(Boolean).join('  ·  ')}
          </p>
        )}
      </motion.div>

      {/* Bottom section */}
      <div className="relative z-10 flex-1 flex flex-col justify-end px-8 @md:px-14 @lg:px-20 pb-12 @md:pb-20 @lg:pb-28">

        {/* Thick accent rule */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={t(1.4, 0, [0.16, 1, 0.3, 1])}
          className={cn('h-[2px] origin-left mb-8', hasImage ? 'bg-white/30' : theme.accent)}
        />

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={t(1, 0.25, [0.16, 1, 0.3, 1])}
          className="space-y-5"
        >
          <h1
            className={cn(
              'text-5xl @sm:text-6xl @md:text-7xl @lg:text-[7rem]',
              'font-bold tracking-tight leading-[0.88] max-w-[16ch]',
              hasImage ? 'text-white' : '',
              theme.fontTitle,
            )}
          >
            {cover.title}
          </h1>

          {(cover.subtitle || cover.tagline) && (
            <p
              className={cn(
                'text-sm @md:text-base font-light max-w-[34ch]',
                hasImage ? 'text-white/55' : 'opacity-55',
                theme.lineHeight,
                theme.fontBody,
              )}
            >
              {cover.subtitle || cover.tagline}
            </p>
          )}
        </motion.div>
      </div>
    </section>
    </MotionConfig>
  )
}
