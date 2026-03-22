"use client"

import { motion } from "framer-motion"
import Image, { type ImageLoader } from 'next/image'
import { cn } from '@/lib/utils'
import type { ThemeConfig } from '@/editor/lib/themes'
import type { PhotobookSectionContent } from '@/editor/lib/types'

const passthroughLoader: ImageLoader = ({ src }) => src

interface CoverMemoirProps {
  sectionContent: PhotobookSectionContent
  theme: ThemeConfig
}

export function CoverMemoir({ sectionContent, theme }: CoverMemoirProps) {
  const { cover } = sectionContent

  return (
    <section className={cn('relative min-h-screen flex flex-col', theme.background, theme.foreground)}>

      {/* Top accent bar — animates in from left */}
      <motion.div
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
        className={cn('h-px w-full origin-left', theme.accent)}
      />

      {/* Main layout: left typography / right photo */}
      <div className="flex-1 grid grid-cols-1 md:grid-cols-2 items-center max-w-7xl mx-auto w-full px-8 md:px-12 lg:px-24 py-12 gap-12 md:gap-16">

        {/* Left — Typography */}
        <motion.div
          initial={{ opacity: 0, x: -24 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="order-2 md:order-1 flex flex-col gap-8"
        >
          {/* Category label */}
          <div className="flex items-center gap-4">
            <span className={cn('text-[10px] uppercase opacity-30', theme.letterSpacing, theme.fontBody)}>
              Photobook
            </span>
            <div className="w-10 h-px bg-current opacity-20" />
          </div>

          {/* Main title */}
          <h1
            className={cn(
              'text-5xl sm:text-6xl md:text-7xl lg:text-[5.5rem] font-bold leading-[0.88] tracking-tighter uppercase',
              theme.fontTitle,
            )}
          >
            {cover.title}
          </h1>

          {/* Subtitle or tagline */}
          {(cover.subtitle || cover.tagline) && (
            <p
              className={cn(
                'text-base opacity-55 font-light max-w-xs',
                theme.lineHeight,
                theme.fontBody,
              )}
            >
              {cover.subtitle || cover.tagline}
            </p>
          )}

          {/* Date + location pill */}
          {(cover.date || cover.location) && (
            <div className="flex items-center gap-3 pt-2">
              <div className={cn('h-px w-8 shrink-0', theme.accent)} />
              <span
                className={cn(
                  'text-xs opacity-40 uppercase',
                  theme.letterSpacing,
                  theme.fontBody,
                )}
              >
                {[cover.date, cover.location].filter(Boolean).join(' · ')}
              </span>
            </div>
          )}
        </motion.div>

        {/* Right — Photo card */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.1, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
          className="order-1 md:order-2 flex justify-center md:justify-end w-full"
        >
          <div
            className={cn(
              'w-full max-w-xs sm:max-w-sm overflow-hidden',
              theme.cardStyle,
              theme.radiusMedium,
              theme.elementGlow,
            )}
          >
            <div className="aspect-[3/4] relative">
              {cover.images?.image ? (
                <Image
                  loader={passthroughLoader}
                  unoptimized
                  src={cover.images.image}
                  alt={cover.title}
                  fill
                  sizes="(max-width: 640px) 80vw, (max-width: 768px) 65vw, 384px"
                  className="object-cover"
                  priority
                />
              ) : (
                <div className={cn('w-full h-full', theme.muted)} />
              )}
            </div>
          </div>
        </motion.div>
      </div>

      {/* Bottom rule + colophon */}
      <div className="max-w-7xl mx-auto w-full px-8 md:px-12 lg:px-24 pb-8">
        <div className={cn('border-t', theme.border)} />
        <div className="flex items-center justify-between mt-4">
          <p className={cn('text-[10px] uppercase opacity-20', theme.letterSpacing, theme.fontBody)}>
            Vol. I
          </p>
          <div className={cn('w-3 h-3 rounded-full opacity-30', theme.accent)} />
        </div>
      </div>
    </section>
  )
}
