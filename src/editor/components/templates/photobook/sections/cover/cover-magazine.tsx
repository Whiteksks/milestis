"use client"

import { motion, MotionConfig, type Transition } from "framer-motion"
import Image, { type ImageLoader } from 'next/image'
import { cn } from '@/lib/utils'
import type { ThemeConfig } from '@/editor/lib/themes'
import type { PhotobookSectionContent } from '@/editor/lib/types'

const passthroughLoader: ImageLoader = ({ src }) => src

interface CoverMagazineProps {
  sectionContent: PhotobookSectionContent
  theme: ThemeConfig
  disableAnimations?: boolean
}

export function CoverMagazine({ sectionContent, theme, disableAnimations = false }: CoverMagazineProps) {
  const { cover } = sectionContent
  const imageUrl = cover.images?.image ?? ''
  const hasImage = Boolean(imageUrl)

  // Split title into words — alternate solid / outline rendering
  const words = (cover.title ?? '').split(' ').filter(Boolean)
  const t = (duration: number, delay = 0, ease?: Transition['ease']): Transition =>
    disableAnimations ? { duration: 0, delay: 0 } : { duration, delay, ...(ease !== undefined ? { ease } : {}) }

  return (
    <MotionConfig reducedMotion={disableAnimations ? 'always' : 'user'}>
    <section
      className={cn(
        '@container relative min-h-screen flex flex-col overflow-hidden',
        theme.background,
        theme.foreground,
      )}
    >
      {/* Full-bleed background */}
      {hasImage && (
        <div className="absolute inset-0">
          <Image
            loader={passthroughLoader}
            unoptimized
            src={imageUrl}
            alt={cover.title ?? 'Cover'}
            fill
            sizes="100vw"
            className="object-cover"
            priority
          />
          {/* Gradient: darken bottom 60%, slight top vignette */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/30" />
        </div>
      )}

      {/* Masthead top bar */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={t(0.9)}
        className="relative z-10 flex items-center justify-between px-8 @md:px-14 @lg:px-20 pt-8 @md:pt-10"
      >
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
      </motion.div>

      {/* Bottom title block */}
      <div className="relative z-10 flex-1 flex flex-col justify-end px-8 @md:px-14 @lg:px-20 pb-12 @md:pb-20 @lg:pb-28">

        {/* Top thin rule above title */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={t(1.4, 0, [0.16, 1, 0.3, 1])}
          className={cn(
            'h-px origin-left mb-8',
            hasImage ? 'bg-white/25' : theme.accent,
          )}
        />

        {/* Alternate solid / outline title words */}
        <motion.div
          initial={{ opacity: 0, y: 44 }}
          animate={{ opacity: 1, y: 0 }}
          transition={t(1, 0.2, [0.16, 1, 0.3, 1])}
        >
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
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={t(0.8, 0.55)}
              className={cn(
                'mt-6 text-sm @md:text-base font-light max-w-[36ch]',
                hasImage ? 'text-white/50' : 'opacity-50',
                theme.lineHeight,
                theme.fontBody,
              )}
            >
              {cover.subtitle || cover.tagline}
            </motion.p>
          )}
        </motion.div>
      </div>
    </section>
    </MotionConfig>
  )
}
