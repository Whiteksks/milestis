"use client"

import { motion } from "framer-motion"
import Image, { type ImageLoader } from 'next/image'
import { cn } from '@/lib/utils'
import type { ThemeConfig } from '@/editor/lib/themes'
import type { PhotobookSectionContent } from '@/editor/lib/types'

const passthroughLoader: ImageLoader = ({ src }) => src

interface HighlightMemoirProps {
  sectionContent: PhotobookSectionContent
  theme: ThemeConfig
}

export function HighlightMemoir({ sectionContent, theme }: HighlightMemoirProps) {
  const { highlight } = sectionContent

  return (
    <section className={cn('py-20 md:py-28', theme.muted, theme.foreground)}>
      <div className="max-w-7xl mx-auto px-8 md:px-12 lg:px-24">

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-20 items-center">

          {/* Left — Photo card (not a background, a contained element) */}
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.9 }}
          >
            <div
              className={cn(
                'overflow-hidden',
                theme.cardStyle,
                theme.radiusMedium,
                theme.elementGlow,
              )}
            >
              <div className="aspect-square relative">
                {highlight.images?.image ? (
                  <Image
                    loader={passthroughLoader}
                    unoptimized
                    src={highlight.images.image}
                    alt={highlight.title ?? 'Highlight'}
                    fill
                    sizes="(max-width: 768px) 90vw, 45vw"
                    className="object-cover"
                  />
                ) : (
                  <div className={cn('w-full h-full', theme.background)} />
                )}
              </div>
            </div>
          </motion.div>

          {/* Right — Content */}
          <motion.div
            initial={{ opacity: 0, x: 24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.9, delay: 0.15 }}
            className="space-y-8"
          >
            {/* Section label */}
            <div className="flex items-center gap-4">
              <div className={cn('h-px w-12', theme.accent)} />
              <span
                className={cn(
                  'text-[10px] uppercase opacity-30',
                  theme.letterSpacing,
                  theme.fontBody,
                )}
              >
                Highlight
              </span>
            </div>

            {/* Title */}
            {highlight.title && (
              <h2
                className={cn(
                  'text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight leading-tight',
                  theme.fontTitle,
                )}
              >
                {highlight.title}
              </h2>
            )}

            {/* Description */}
            {highlight.description && (
              <p
                className={cn(
                  'text-base font-light opacity-60',
                  theme.lineHeight,
                  theme.fontBody,
                )}
              >
                {highlight.description}
              </p>
            )}

            {/* Pull quote — displayed as a card within the section */}
            {highlight.quote && (
              <div className={cn('p-5 md:p-6', theme.cardStyle, theme.radiusMedium)}>
                <p
                  className={cn(
                    'text-base italic font-light opacity-75',
                    theme.lineHeight,
                    theme.fontBody,
                  )}
                >
                  &ldquo;{highlight.quote}&rdquo;
                </p>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  )
}
