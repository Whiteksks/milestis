"use client"

import { motion } from "framer-motion"
import Image, { type ImageLoader } from 'next/image'
import { cn } from '@/lib/utils'
import type { ThemeConfig } from '@/editor/lib/themes'
import type { PhotobookSectionContent } from '@/editor/lib/types'
import { getAspectRatioClass } from '@/editor/lib/aspect-ratios'
import { getFrameStyle } from '@/editor/lib/frame-styles'

const passthroughLoader: ImageLoader = ({ src }) => src

interface HighlightMemoirProps {
  sectionContent: PhotobookSectionContent
  theme: ThemeConfig
}

export function HighlightMemoir({ sectionContent, theme }: HighlightMemoirProps) {
  const { highlight } = sectionContent
  const imageBlock = highlight.images
  const imageUrl = imageBlock?.image ?? ''
  const aspectRatio = imageBlock?.imageSettings?.[0]?.aspectRatio ?? 'square'
  const frameStyle = imageBlock?.imageSettings?.[0]?.frameStyle ?? 'none'

  return (
    <section className={cn('@container overflow-x-hidden py-16 @md:py-24 @lg:py-32', theme.muted, theme.foreground)}>
      <div className="max-w-7xl mx-auto px-8 @md:px-12 @lg:px-20">

        <div className="grid grid-cols-1 @md:grid-cols-2 gap-8 @md:gap-16 @lg:gap-20 items-center">

          {/* Left – Photo (order-2 on mobile → shows below text) */}
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.9 }}
            className="order-2 @md:order-1"
          >
            <div
              className={cn(
                'relative overflow-hidden mx-auto @md:mx-0 w-full max-w-sm @md:max-w-none',
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
                  alt={highlight.title ?? 'Highlight'}
                  fill
                  sizes="(max-width: 768px) 90vw, 45vw"
                  className="object-cover"
                />
              ) : (
                <div className={cn('absolute inset-0', theme.background)} />
              )}
            </div>
          </motion.div>

          {/* Right – Content (order-1 on mobile → shows above photo) */}
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.9, delay: 0.15 }}
            className="order-1 @md:order-2 space-y-6 @md:space-y-8"
          >
            {/* Label */}
            <div className="flex items-center gap-4">
              <div className={cn('h-px w-12', theme.accent)} />
              <span className={cn('text-[10px] uppercase opacity-30', theme.letterSpacing, theme.fontBody)}>
                Highlight
              </span>
            </div>

            {/* Title */}
            {highlight.title && (
              <h2
                className={cn(
                  'text-3xl @md:text-4xl @lg:text-5xl font-bold tracking-tight leading-tight',
                  theme.fontTitle,
                )}
              >
                {highlight.title}
              </h2>
            )}

            {/* Description */}
            {highlight.description && (
              <p className={cn('text-base font-light opacity-60', theme.lineHeight, theme.fontBody)}>
                {highlight.description}
              </p>
            )}

            {/* Pull quote */}
            {highlight.quote && (
              <blockquote className="py-6 border-t border-b border-current/10">
                <p
                  className={cn(
                    'text-lg @md:text-xl font-light italic opacity-60',
                    theme.lineHeight,
                    theme.fontBody,
                  )}
                >
                  &ldquo;{highlight.quote}&rdquo;
                </p>
              </blockquote>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  )
}
