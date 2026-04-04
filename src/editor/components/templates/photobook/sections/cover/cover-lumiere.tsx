"use client"

import { motion, MotionConfig, type Transition } from "framer-motion"
import { cn } from '@/lib/utils'
import type { ThemeConfig } from '@/editor/lib/themes'
import type { PhotobookSectionContent } from '@/editor/lib/types'
import { SiteImage } from '@/editor/components/editor/section-settings/ui/site-image'

interface CoverLumiereProps {
  sectionContent: PhotobookSectionContent
  theme: ThemeConfig
  disableAnimations?: boolean
}

export function CoverLumiere({ sectionContent, theme, disableAnimations = false }: CoverLumiereProps) {
  const { cover } = sectionContent
  const imageUrl = cover.images?.image ?? ''
  const hasImage = Boolean(imageUrl)
  const t = (duration: number, delay = 0, ease?: Transition['ease']): Transition =>
    disableAnimations ? { duration: 0, delay: 0 } : { duration, delay, ...(ease !== undefined ? { ease } : {}) }

  return (
    <MotionConfig reducedMotion={disableAnimations ? 'always' : 'user'}>
    <section
      className={cn(
        '@container min-h-screen flex flex-col items-center justify-center',
        'px-8 @md:px-16 @lg:px-24 py-16',
        theme.background,
        theme.foreground,
      )}
    >
      {/* Wordmark */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={t(1)}
        className="flex items-center gap-4 mb-12 @md:mb-16"
      >
        <div className="h-px w-10 bg-current opacity-15" />
        <span className={cn('text-[8px] uppercase tracking-[0.5em] opacity-25', theme.fontBody)}>
          Lumière
        </span>
        <div className="h-px w-10 bg-current opacity-15" />
      </motion.div>

      {/* Framed photo */}
      {hasImage && (
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={t(1.1, 0.2)}
          className="w-full max-w-[240px] @sm:max-w-[300px] @md:max-w-sm mb-10 @md:mb-12"
        >
          <div className="border border-current/10 p-[3px]">
            <SiteImage
              src={imageUrl}
              alt={cover.title ?? 'Cover'}
              aspectRatio={cover.images?.imageSettings?.[0]?.aspectRatio ?? 'portrait'}
              frameStyle={cover.images?.imageSettings?.[0]?.frameStyle ?? 'none'}
              cropData={cover.images?.imageSettings?.[0]?.cropData}
              priority
            />
          </div>
        </motion.div>
      )}

      {/* Title */}
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={t(0.9, hasImage ? 0.5 : 0.25)}
        className="text-center space-y-3 max-w-md"
      >
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
      </motion.div>

      {/* Date / location */}
      {(cover.date || cover.location) && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={t(0.7, hasImage ? 0.7 : 0.45)}
          className={cn('mt-6 text-[9px] uppercase tracking-[0.38em] opacity-25', theme.fontBody)}
        >
          {[cover.date, cover.location].filter(Boolean).join('  —  ')}
        </motion.p>
      )}

      {cover.tagline && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={t(0.7, 0.85)}
          className={cn('mt-2 text-[10px] italic opacity-30', theme.fontBody)}
        >
          {cover.tagline}
        </motion.p>
      )}

      {/* Bottom decorative rule */}
      <motion.div
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={t(0.9, 1.05)}
        className="origin-center w-16 h-px bg-current opacity-15 mt-14 @md:mt-16"
      />
    </section>
    </MotionConfig>
  )
}
