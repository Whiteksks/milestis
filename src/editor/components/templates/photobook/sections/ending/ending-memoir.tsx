"use client"

import { motion } from "framer-motion"
import Image, { type ImageLoader } from 'next/image'
import { cn } from '@/lib/utils'
import type { ThemeConfig } from '@/editor/lib/themes'
import type { PhotobookSectionContent } from '@/editor/lib/types'

const passthroughLoader: ImageLoader = ({ src }) => src

interface EndingMemoirProps {
  sectionContent: PhotobookSectionContent
  theme: ThemeConfig
}

export function EndingMemoir({ sectionContent, theme }: EndingMemoirProps) {
  const { ending } = sectionContent

  return (
    <section
      className={cn(
        'min-h-screen py-16 flex flex-col justify-between',
        theme.background,
        theme.foreground,
      )}
    >
      {/* Top rule */}
      <div className="max-w-7xl mx-auto w-full px-8 md:px-12 lg:px-24">
        <div className={cn('border-t mb-16', theme.border)} />
      </div>

      {/* Main content */}
      <div className="flex-1 max-w-7xl mx-auto w-full px-8 md:px-12 lg:px-24 grid grid-cols-1 md:grid-cols-2 gap-16 items-center">

        {/* Left — Closing typography */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.9 }}
          className="space-y-10"
        >
          {/* Monumental "Fin" word */}
          <h2
            className={cn(
              'text-[5rem] sm:text-[7rem] md:text-[9rem] lg:text-[11rem]',
              'font-bold leading-none tracking-tighter uppercase',
              theme.fontTitle,
            )}
          >
            Fin
          </h2>

          {/* Closing message */}
          {ending.text && (
            <p
              className={cn(
                'text-lg md:text-xl font-light opacity-60 max-w-sm',
                theme.lineHeight,
                theme.fontBody,
              )}
            >
              {ending.text}
            </p>
          )}

          {/* Signature + date */}
          <div className="space-y-2 pt-2">
            {ending.signature && (
              <p className={cn('text-sm opacity-50 italic', theme.fontBody)}>
                — {ending.signature}
              </p>
            )}
            {ending.date && (
              <p
                className={cn(
                  'text-xs uppercase opacity-30',
                  theme.letterSpacing,
                  theme.fontBody,
                )}
              >
                {ending.date}
              </p>
            )}
          </div>
        </motion.div>

        {/* Right — Optional photo card (never used as background) */}
        {ending.images?.image && (
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="flex justify-center md:justify-end"
          >
            <div
              className={cn(
                'w-full max-w-xs overflow-hidden',
                theme.cardStyle,
                theme.radiusMedium,
                theme.shadow,
              )}
            >
              <div className="aspect-[3/4] relative">
                <Image
                  loader={passthroughLoader}
                  unoptimized
                  src={ending.images.image}
                  alt="Ending"
                  fill
                  sizes="(max-width: 768px) 70vw, 320px"
                  className="object-cover"
                />
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {/* Bottom colophon */}
      <div className="max-w-7xl mx-auto w-full px-8 md:px-12 lg:px-24 pt-16">
        <div className="flex items-center gap-4">
          <div className={cn('w-2 h-2 rounded-full opacity-30', theme.accent)} />
          <span
            className={cn(
              'text-[10px] uppercase opacity-20',
              theme.letterSpacing,
              theme.fontBody,
            )}
          >
            Milestis Photobook
          </span>
          <div className="h-px flex-1 bg-current opacity-10" />
          <span className={cn('text-[10px] opacity-20', theme.fontBody)}>
            {new Date().getFullYear()}
          </span>
        </div>
      </div>
    </section>
  )
}
