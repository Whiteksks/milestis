"use client"

import { motion } from "framer-motion"
import { SiteImage } from '@/editor/components/editor/section-settings/ui/site-image'
import { cn } from '@/lib/utils'
import type { ThemeConfig } from '@/editor/lib/themes'
import type { PhotobookSectionContent } from '@/editor/lib/types'

interface IntroChronicleProps {
  sectionContent: PhotobookSectionContent
  theme: ThemeConfig
}

export function IntroChronicle({ sectionContent, theme }: IntroChronicleProps) {
  const { introduction } = sectionContent
  const imageBlock = introduction.images
  const imageUrl = imageBlock?.image ?? ''
  const aspectRatio = imageBlock?.imageSettings?.[0]?.aspectRatio ?? 'landscape'
  const frameStyle = imageBlock?.imageSettings?.[0]?.frameStyle ?? 'none'

  return (
    <section className={cn('@container py-16 @md:py-24 @lg:py-32', theme.background, theme.foreground)}>
      <div className="max-w-7xl mx-auto px-8 @md:px-14 @lg:px-20">

        {/* Editorial header */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.6 }}
          className="mb-12 @md:mb-16"
        >
          <div className={cn('border-t-2', theme.border)} />
          <div className="flex items-center justify-between mt-3">
            <span className={cn('text-[9px] uppercase tracking-[0.3em] opacity-35', theme.letterSpacing, theme.fontBody)}>
              Introduction
            </span>
            <span className={cn('text-[9px] uppercase tracking-[0.2em] opacity-20', theme.fontBody)}>
              I
            </span>
          </div>
        </motion.div>

        {/* Main grid: text left, image right */}
        <div className="grid grid-cols-1 @md:grid-cols-[3fr_2fr] gap-10 @md:gap-16 @lg:gap-24 items-start">

          {/* Left – editorial text */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.8 }}
            className="space-y-9"
          >
            {introduction.title && (
              <h2
                className={cn(
                  'text-3xl @sm:text-4xl @md:text-5xl @lg:text-6xl font-bold tracking-tight leading-[0.92]',
                  theme.fontTitle,
                )}
              >
                {introduction.title}
              </h2>
            )}

            {introduction.quote && (
              <div className="relative">
                {/* Oversized quotation mark */}
                <span
                  className={cn(
                    'absolute -top-4 -left-1 text-[5rem] leading-none opacity-10 select-none',
                    theme.fontTitle,
                  )}
                >
                  &ldquo;
                </span>
                <blockquote className="pl-6 border-l-2 border-current/15">
                  <p
                    className={cn(
                      'text-xl @md:text-2xl font-light italic opacity-65 leading-snug',
                      theme.fontBody,
                    )}
                  >
                    {introduction.quote}
                  </p>
                </blockquote>
              </div>
            )}

            {introduction.dedication && (
              <div className="flex items-center gap-4 pt-4">
                <div className={cn('h-px w-8 shrink-0', theme.accent)} />
                <p className={cn('text-xs uppercase tracking-[0.2em] opacity-40', theme.fontBody)}>
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
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <SiteImage
                src={imageUrl}
                alt={introduction.title ?? 'Introduction'}
                aspectRatio={aspectRatio}
                frameStyle={frameStyle}
                cropData={imageBlock?.imageSettings?.[0]?.cropData}
                unoptimized
                sizes="(max-width: 768px) 90vw, 38vw"
                className={theme.shadow}
              />
              {imageBlock?.caption && (
                <p className={cn('mt-2.5 text-[10px] uppercase tracking-wide opacity-35', theme.fontBody)}>
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
