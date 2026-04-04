"use client"

import { motion } from "framer-motion"
import { SiteImage } from '@/editor/components/editor/section-settings/ui/site-image'
import { cn } from '@/lib/utils'
import type { ThemeConfig } from '@/editor/lib/themes'
import type { PhotobookSectionContent } from '@/editor/lib/types'

interface IntroMemoirProps {
  sectionContent: PhotobookSectionContent
  theme: ThemeConfig
}

export function IntroMemoir({ sectionContent, theme }: IntroMemoirProps) {
  const { introduction } = sectionContent
  const imageBlock = introduction.images
  const imageUrl = imageBlock?.image ?? ''
  const aspectRatio = imageBlock?.imageSettings?.[0]?.aspectRatio ?? 'portrait'
  const frameStyle = imageBlock?.imageSettings?.[0]?.frameStyle ?? 'none'

  return (
    <section className={cn('@container py-20 @md:py-28 @lg:py-36', theme.background, theme.foreground)}>
      <div className="max-w-7xl mx-auto px-8 @md:px-12 @lg:px-20">

        {/* Section label */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6 }}
          className="flex items-center gap-4 mb-16 @md:mb-20"
        >
          <div className={cn('h-px w-12', theme.accent)} />
          <span className={cn('text-[10px] uppercase opacity-30', theme.letterSpacing, theme.fontBody)}>
            Introduction
          </span>
        </motion.div>

        {/* Content: text left, image right */}
        <div className="grid grid-cols-1 @md:grid-cols-[3fr_2fr] gap-12 @md:gap-20 items-start">

          {/* Left – text */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.8 }}
            className="space-y-10"
          >
            {introduction.title && (
              <h2
                className={cn(
                  'text-3xl @md:text-4xl @lg:text-5xl font-bold leading-tight tracking-tight',
                  theme.fontTitle,
                )}
              >
                {introduction.title}
              </h2>
            )}

            {introduction.quote && (
              <blockquote className="relative pl-6">
                <div className={cn('absolute left-0 top-0 bottom-0 w-0.5 rounded-full', theme.accent)} />
                <p
                  className={cn(
                    'text-lg @md:text-xl font-light italic opacity-65',
                    theme.lineHeight,
                    theme.fontBody,
                  )}
                >
                  &ldquo;{introduction.quote}&rdquo;
                </p>
              </blockquote>
            )}

            {introduction.dedication && (
              <div className="flex items-center gap-4 pt-2">
                <div className="h-px w-8 bg-current opacity-20" />
                <p className={cn('text-xs uppercase tracking-[0.2em] opacity-45', theme.fontBody)}>
                  {introduction.dedication}
                </p>
              </div>
            )}
          </motion.div>

          {/* Right – image */}
          {imageUrl && (
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.8, delay: 0.15 }}
            >
              <SiteImage
                src={imageUrl}
                alt={introduction.title ?? 'Introduction'}
                aspectRatio={aspectRatio}
                frameStyle={frameStyle}
                cropData={imageBlock?.imageSettings?.[0]?.cropData}
                unoptimized
                sizes="(max-width: 768px) 80vw, 35vw"
                className={theme.shadow}
              />
            </motion.div>
          )}
        </div>
      </div>
    </section>
  )
}
