"use client"

import { motion } from "framer-motion"
import Image, { type ImageLoader } from 'next/image'
import { cn } from '@/lib/utils'
import type { ThemeConfig } from '@/editor/lib/themes'
import type { PhotobookSectionContent } from '@/editor/lib/types'
import { getAspectRatioClass } from '@/editor/lib/aspect-ratios'
import { getFrameStyle } from '@/editor/lib/frame-styles'

const passthroughLoader: ImageLoader = ({ src }) => src

interface EndingMemoirProps {
  sectionContent: PhotobookSectionContent
  theme: ThemeConfig
}

export function EndingMemoir({ sectionContent, theme }: EndingMemoirProps) {
  const { ending } = sectionContent
  const imageBlock = ending.images
  const imageUrl = imageBlock?.image ?? ''
  const aspectRatio = imageBlock?.imageSettings?.[0]?.aspectRatio ?? 'square'
  const frameStyle = imageBlock?.imageSettings?.[0]?.frameStyle ?? 'none'

  return (
    <section
      className={cn(
        '@container overflow-x-hidden min-h-screen flex flex-col justify-between py-12 @md:py-16',
        theme.background,
        theme.foreground,
      )}
    >
      {/* Top rule */}
      <div className="max-w-7xl mx-auto w-full px-8 @md:px-12 @lg:px-20">
        <div className={cn('border-t', theme.border)} />
      </div>

      {/* Main content */}
      <div className="flex-1 max-w-7xl mx-auto w-full px-8 @md:px-12 @lg:px-20 py-12 @md:py-16 @lg:py-20 grid grid-cols-1 @md:grid-cols-2 gap-10 @md:gap-16 @lg:gap-20 items-center">

        {/* Closing typography */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.9 }}
          className="space-y-6 @md:space-y-10"
        >
          {ending.text && (
            <p
              className={cn(
                'text-lg @md:text-xl font-light opacity-60 max-w-sm',
                theme.lineHeight,
                theme.fontBody,
              )}
            >
              {ending.text}
            </p>
          )}

          <div className="space-y-2 pt-2">
            {ending.signature && (
              <p className={cn('text-sm opacity-50 italic', theme.fontBody)}>
                — {ending.signature}
              </p>
            )}
            {ending.date && (
              <p className={cn('text-xs uppercase opacity-30', theme.letterSpacing, theme.fontBody)}>
                {ending.date}
              </p>
            )}
          </div>
        </motion.div>

        {/* Optional closing photo */}
        {imageUrl && (
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="flex justify-center @md:justify-end"
          >
            <div
              className={cn(
                'relative overflow-hidden w-full max-w-xs @md:max-w-none @md:w-full',
                getAspectRatioClass(aspectRatio),
                getFrameStyle(frameStyle),
                theme.shadow,
              )}
            >
              <Image
                loader={passthroughLoader}
                unoptimized
                src={imageUrl}
                alt={ending.signature ?? 'Ending'}
                fill
                sizes="(max-width: 768px) 80vw, 40vw"
                className="object-cover"
              />
            </div>
          </motion.div>
        )}
      </div>

      {/* Bottom accent line */}
      <div className="max-w-7xl mx-auto w-full px-8 @md:px-12 @lg:px-20 pb-8">
        <motion.div
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          className={cn('h-px origin-left', theme.accent)}
        />
      </div>
    </section>
  )
}
