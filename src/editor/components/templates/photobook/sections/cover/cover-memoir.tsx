"use client"

import { motion, MotionConfig, type Transition } from "framer-motion"
import Image, { type ImageLoader } from 'next/image'
import { cn } from '@/lib/utils'
import type { ThemeConfig } from '@/editor/lib/themes'
import type { PhotobookSectionContent } from '@/editor/lib/types'
import { getAspectRatioClass } from '@/editor/lib/aspect-ratios'
import { getFrameStyle } from '@/editor/lib/frame-styles'

const passthroughLoader: ImageLoader = ({ src }) => src

interface CoverMemoirProps {
  sectionContent: PhotobookSectionContent
  theme: ThemeConfig
  disableAnimations?: boolean
}

export function CoverMemoir({ sectionContent, theme, disableAnimations = false }: CoverMemoirProps) {
  const { cover } = sectionContent
  const imageBlock = cover.images
  const imageUrl = imageBlock?.image ?? ''
  const aspectRatio = imageBlock?.imageSettings?.[0]?.aspectRatio ?? 'portrait'
  const frameStyle = imageBlock?.imageSettings?.[0]?.frameStyle ?? 'none'
  const t = (duration: number, delay = 0, ease?: Transition['ease']): Transition =>
    disableAnimations ? { duration: 0, delay: 0 } : { duration, delay, ...(ease !== undefined ? { ease } : {}) }

  return (
    <MotionConfig reducedMotion={disableAnimations ? 'always' : 'user'}>
    <section className={cn('@container relative min-h-screen flex flex-col', theme.background, theme.foreground)}>

      {/* Top accent stroke — draws in from left */}
      <motion.div
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={t(1.6, 0, [0.16, 1, 0.3, 1])}
        className={cn('h-px origin-left shrink-0', theme.accent)}
      />

      {/* Main two-column grid */}
      <div className="flex-1 grid grid-cols-1 @md:grid-cols-[3fr_2fr] items-center">

        {/* Left – Typography */}
        <motion.div
          initial={{ opacity: 0, y: 36 }}
          animate={{ opacity: 1, y: 0 }}
          transition={t(1, 0.25, [0.16, 1, 0.3, 1])}
          className="order-2 @md:order-1 flex flex-col justify-center px-8 @md:px-12 @lg:px-20 py-14 @md:py-20 gap-8"
        >
          {/* Eyebrow label */}
          <div className="flex items-center gap-3">
            <span className={cn('text-[10px] uppercase opacity-25', theme.letterSpacing, theme.fontBody)}>
              Photobook
            </span>
            <div className="w-8 h-px bg-current opacity-15" />
          </div>

          {/* Massive title */}
          <h1
            className={cn(
              'text-5xl @sm:text-6xl @md:text-7xl @lg:text-[6rem] font-bold leading-[0.88] tracking-tighter',
              theme.fontTitle,
            )}
          >
            {cover.title}
          </h1>

          {/* Tagline / subtitle */}
          {(cover.subtitle || cover.tagline) && (
            <p
              className={cn(
                'text-base @lg:text-lg font-light opacity-55 max-w-[28ch]',
                theme.lineHeight,
                theme.fontBody,
              )}
            >
              {cover.subtitle || cover.tagline}
            </p>
          )}

          {/* Date + Location */}
          {(cover.date || cover.location) && (
            <div className="flex items-center gap-4 pt-4 border-t border-current/10">
              <div className={cn('h-px w-8 shrink-0', theme.accent)} />
              <p className={cn('text-xs uppercase tracking-[0.2em] opacity-40', theme.fontBody)}>
                {[cover.date, cover.location].filter(Boolean).join('  ·  ')}
              </p>
            </div>
          )}
        </motion.div>

        {/* Right – Photo */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={t(1.2, 0.05, [0.16, 1, 0.3, 1])}
          className="order-1 @md:order-2 flex items-center justify-center @md:justify-end px-8 @md:px-10 @lg:px-14 py-10 @md:py-16"
        >
          <div
            className={cn(
              'relative overflow-hidden w-full max-w-[260px] @sm:max-w-[300px] @md:max-w-sm',
              getAspectRatioClass(aspectRatio),
              getFrameStyle(frameStyle),
              theme.shadow,
              theme.elementGlow,
            )}
          >
            {imageUrl ? (
              <Image
                loader={passthroughLoader}
                unoptimized
                src={imageUrl}
                alt={cover.title}
                fill
                sizes="(max-width: 768px) 80vw, 40vw"
                className="object-cover"
                priority
              />
            ) : (
              <div className={cn('absolute inset-0', theme.muted)} />
            )}
          </div>
        </motion.div>
      </div>

      {/* Bottom rule */}
      <div className="px-8 @md:px-12 @lg:px-20 pb-8 shrink-0">
        <div className="h-px bg-current opacity-[0.08]" />
      </div>
    </section>
    </MotionConfig>
  )
}
