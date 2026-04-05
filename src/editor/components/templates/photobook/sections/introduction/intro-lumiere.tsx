"use client"

import { motion } from "framer-motion"
import { SiteImage } from '@/editor/components/editor/section-settings/ui/site-image'
import { cn } from '@/lib/utils'
import type { ThemeConfig } from '@/editor/lib/themes'
import type { PhotobookSectionContent } from '@/editor/lib/types'

interface IntroLumiereProps {
  sectionContent: PhotobookSectionContent
  theme: ThemeConfig
}

export function IntroLumiere({ sectionContent, theme }: IntroLumiereProps) {
  const { introduction } = sectionContent
  const imageSettings = introduction.images?.imageSettings?.[0]
  const imageUrl = introduction.images?.image ?? ''
  const hasImage = Boolean(imageUrl)
  const aspectRatio = imageSettings?.aspectRatio ?? 'portrait'
  const frameStyle = imageSettings?.frameStyle ?? 'none'

  return (
    <section
      className={cn(
        '@container overflow-x-hidden py-20 @md:py-28',
        theme.background,
        theme.foreground,
      )}
    >
      <div className="max-w-2xl mx-auto px-8 @md:px-0 text-center space-y-12 @md:space-y-16">

        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.6 }}
          className="flex items-center gap-4"
        >
          <div className="h-px flex-1 bg-current opacity-10" />
          <span className={cn('text-[8px] uppercase tracking-[0.45em] opacity-25 shrink-0', theme.fontBody)}>
            02  ·  Introduction
          </span>
          <div className="h-px flex-1 bg-current opacity-10" />
        </motion.div>

        {/* Title */}
        {introduction.title && (
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className={cn(
              'text-2xl @sm:text-3xl @md:text-4xl font-light italic tracking-tight leading-snug',
              theme.fontTitle,
            )}
          >
            {introduction.title}
          </motion.h2>
        )}

        {/* Quote */}
        {introduction.quote && (
          <motion.blockquote
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.8, delay: 0.15 }}
            className="space-y-3"
          >
            <p
              className={cn(
                'text-lg @md:text-xl leading-relaxed font-light italic opacity-60',
                theme.fontBody,
                theme.lineHeight,
              )}
            >
              &ldquo;{introduction.quote}&rdquo;
            </p>
          </motion.blockquote>
        )}

        {/* Dedication */}
        {introduction.dedication && (
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className={cn('text-[10px] uppercase tracking-[0.35em] opacity-30', theme.fontBody)}
          >
            {introduction.dedication}
          </motion.p>
        )}

        {/* Thin rule between text and photo */}
        {hasImage && (
          <motion.div
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.7 }}
            className="origin-center w-12 h-px bg-current opacity-15 mx-auto"
          />
        )}

        {/* Framed photo */}
        {hasImage && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.9, delay: 0.1 }}
            className="w-full max-w-[280px] @md:max-w-xs mx-auto"
          >
            <div className="border border-current/10 p-[3px]">
              <SiteImage
                src={imageUrl}
                alt={introduction.title ?? 'Introduction'}
                aspectRatio={aspectRatio}
                frameStyle={frameStyle}
                cropData={imageSettings?.cropData}
                unoptimized
                sizes="(max-width: 768px) 80vw, 320px"
              />
            </div>
            {introduction.images?.caption && (
              <p className={cn('mt-2 text-[9px] uppercase tracking-widest opacity-25 text-center', theme.fontBody)}>
                {introduction.images.caption}
              </p>
            )}
          </motion.div>
        )}
      </div>
    </section>
  )
}
