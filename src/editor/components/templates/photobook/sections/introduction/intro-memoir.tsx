"use client"

import { motion } from "framer-motion"
import Image, { type ImageLoader } from 'next/image'
import { cn } from '@/lib/utils'
import type { ThemeConfig } from '@/editor/lib/themes'
import type { PhotobookSectionContent } from '@/editor/lib/types'

const passthroughLoader: ImageLoader = ({ src }) => src

interface IntroMemoirProps {
  sectionContent: PhotobookSectionContent
  theme: ThemeConfig
}

export function IntroMemoir({ sectionContent, theme }: IntroMemoirProps) {
  const { introduction } = sectionContent

  return (
    <section className={cn('py-24 md:py-32', theme.background, theme.foreground)}>
      <div className="max-w-5xl mx-auto px-8 md:px-12 lg:px-24">

        {/* Section marker */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6 }}
          className="flex items-center gap-4 mb-16"
        >
          <div className={cn('h-px w-16', theme.accent)} />
          <span className={cn('text-[10px] uppercase opacity-30', theme.letterSpacing, theme.fontBody)}>
            Introduction
          </span>
        </motion.div>

        {/* Content grid: text left, photo right */}
        <div className="grid grid-cols-1 md:grid-cols-[3fr,2fr] gap-12 md:gap-20 items-start">

          {/* Left — text content */}
          <div className="space-y-10">

            {/* Title */}
            {introduction.title && (
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7 }}
                className={cn(
                  'text-3xl md:text-4xl lg:text-5xl font-bold leading-tight tracking-tight',
                  theme.fontTitle,
                )}
              >
                {introduction.title}
              </motion.h2>
            )}

            {/* Quote with accent bar */}
            {introduction.quote && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: 0.12 }}
                className="relative pl-6"
              >
                <div className={cn('absolute left-0 top-0 bottom-0 w-0.5 rounded-full', theme.accent)} />
                <p
                  className={cn(
                    'text-lg md:text-xl font-light italic opacity-65',
                    theme.lineHeight,
                    theme.fontBody,
                  )}
                >
                  &ldquo;{introduction.quote}&rdquo;
                </p>
              </motion.div>
            )}

            {/* Dedication */}
            {introduction.dedication && (
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: 0.25 }}
                className="flex items-center gap-4 pt-2"
              >
                <div className="h-px w-10 bg-current opacity-20" />
                <p
                  className={cn(
                    'text-sm opacity-50 uppercase',
                    theme.letterSpacing,
                    theme.fontBody,
                  )}
                >
                  {introduction.dedication}
                </p>
              </motion.div>
            )}
          </div>

          {/* Right — photo card */}
          {introduction.images?.image && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <div
                className={cn(
                  'overflow-hidden',
                  theme.cardStyle,
                  theme.radiusMedium,
                )}
              >
                <div className="aspect-[4/5] relative">
                  <Image
                    loader={passthroughLoader}
                    unoptimized
                    src={introduction.images.image}
                    alt={introduction.title ?? 'Introduction'}
                    fill
                    sizes="(max-width: 768px) 80vw, 320px"
                    className="object-cover"
                  />
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </section>
  )
}
