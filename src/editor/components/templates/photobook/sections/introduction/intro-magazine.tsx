"use client"

import { motion } from "framer-motion"
import Image, { type ImageLoader } from 'next/image'
import { cn } from '@/lib/utils'
import type { ThemeConfig } from '@/editor/lib/themes'
import type { PhotobookSectionContent } from '@/editor/lib/types'
import { getAspectRatioClass } from '@/editor/lib/aspect-ratios'
import { getFrameStyle } from '@/editor/lib/frame-styles'

const passthroughLoader: ImageLoader = ({ src }) => src

interface IntroMagazineProps {
  sectionContent: PhotobookSectionContent
  theme: ThemeConfig
}

export function IntroMagazine({ sectionContent, theme }: IntroMagazineProps) {
  const { introduction } = sectionContent
  const imageBlock = introduction.images
  const imageUrl = imageBlock?.image ?? ''
  const aspectRatio = imageBlock?.imageSettings?.[0]?.aspectRatio ?? 'portrait'
  const frameStyle = imageBlock?.imageSettings?.[0]?.frameStyle ?? 'none'

  return (
    <section className={cn('@container py-16 @md:py-24 @lg:py-32', theme.background, theme.foreground)}>
      <div className="max-w-7xl mx-auto px-8 @md:px-14 @lg:px-20">

        {/* Magazine spread header */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.6 }}
          className="flex items-center justify-between mb-14 @md:mb-20"
        >
          <div className={cn('h-[2px] flex-1', theme.accent)} />
          <span className={cn('px-5 text-[9px] uppercase tracking-[0.35em] opacity-35', theme.letterSpacing, theme.fontBody)}>
            Introduction
          </span>
          <div className="h-px flex-1 bg-current opacity-10" />
          <span className={cn('pl-5 text-[9px] opacity-20', theme.fontBody)}>p. 02</span>
        </motion.div>

        {/* Two-column spread: big quote left, image right */}
        <div className="grid grid-cols-1 @md:grid-cols-[3fr_2fr] gap-12 @md:gap-20 @lg:gap-28 items-start">

          {/* Left — editorial text column */}
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.8 }}
            className="space-y-10"
          >
            {introduction.title && (
              <h2
                className={cn(
                  'text-4xl @sm:text-5xl @md:text-6xl font-bold tracking-tight leading-[0.9] uppercase',
                  theme.fontTitle,
                )}
              >
                {introduction.title}
              </h2>
            )}

            {introduction.quote && (
              <div className="relative pl-8">
                {/* Oversized drop-quote mark */}
                <span
                  className={cn(
                    'absolute left-0 top-0 text-[5rem] leading-none opacity-[0.08] select-none font-bold',
                    theme.fontTitle,
                  )}
                >
                  &ldquo;
                </span>
                <p
                  className={cn(
                    'text-2xl @md:text-3xl font-light italic leading-snug opacity-70',
                    theme.fontBody,
                  )}
                >
                  {introduction.quote}
                </p>
              </div>
            )}

            {introduction.dedication && (
              <div className="pt-4 border-t border-current/10 flex items-center gap-4">
                <div className={cn('h-px w-6 shrink-0', theme.accent)} />
                <p className={cn('text-[10px] uppercase tracking-[0.2em] opacity-40', theme.fontBody)}>
                  {introduction.dedication}
                </p>
              </div>
            )}
          </motion.div>

          {/* Right — image */}
          {imageUrl && (
            <motion.div
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <div
                className={cn(
                  'relative overflow-hidden',
                  getAspectRatioClass(aspectRatio),
                  getFrameStyle(frameStyle),
                  theme.shadow,
                )}
              >
                <Image
                  loader={passthroughLoader}
                  unoptimized
                  src={imageUrl}
                  alt={introduction.title ?? 'Introduction'}
                  fill
                  sizes="(max-width: 768px) 90vw, 38vw"
                  className="object-cover"
                />
              </div>
              {imageBlock?.caption && (
                <p className={cn('mt-2.5 text-[10px] uppercase tracking-widest opacity-30', theme.fontBody)}>
                  {imageBlock.caption}
                </p>
              )}
            </motion.div>
          )}
        </div>
      </div>
    </section>
  )
}
