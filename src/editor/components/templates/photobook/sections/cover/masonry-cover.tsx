"use client"

import { motion } from 'framer-motion'
import { Film } from 'lucide-react'
import { cn } from '@/lib/utils'
import { ThemeConfig } from '@/editor/lib/themes'
import { PhotobookSectionContent } from '@/editor/lib/types'

interface MasonryCoverProps {
  sectionContent: PhotobookSectionContent
  theme: ThemeConfig
}

export function MasonryCover({ sectionContent, theme }: MasonryCoverProps) {
  const heroImage =
    sectionContent.cover.images?.image ||
    sectionContent.story.images?.[0]?.images?.[0] ||
    undefined

  const heroTitle =
    sectionContent.cover.title ||
    sectionContent.story.title ||
    'Your Story'

  const heroSubtitle =
    sectionContent.introduction.quote ||
    sectionContent.introduction.dedication ||
    sectionContent.cover.tagline ||
    ''

  return (
    <section className="relative min-h-[80vh] overflow-hidden flex items-end">
      {heroImage && (
        <>
          <motion.img
            initial={{ scale: 1.15, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1.8, ease: 'easeOut' }}
            src={heroImage}
            alt=""
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-linear-to-b from-black/20 via-black/30 to-background/90 z-10 backdrop-blur-sm" />
        </>
      )}

      <div className="relative z-20 container mx-auto px-6 py-16 flex flex-col items-start gap-6 max-w-4xl">
        <motion.div
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1 }}
          className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-6 py-2 backdrop-blur-xl text-[0.65rem] uppercase tracking-[0.3em] text-white shadow-md"
        >
          <Film className="h-3.5 w-3.5" /> Photobook Masonry
        </motion.div>

        <motion.h1
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1, delay: 0.2 }}
          className={cn(
            'text-white text-4xl sm:text-6xl lg:text-7xl font-semibold drop-shadow-2xl',
            theme.fontTitle,
          )}
        >
          {heroTitle}
        </motion.h1>

        {heroSubtitle && (
          <motion.p
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 1, delay: 0.4 }}
            className="mt-4 text-lg text-white/80 max-w-xl font-light leading-relaxed"
          >
            {heroSubtitle}
          </motion.p>
        )}

        <div className="flex gap-3 text-xs text-white/80">
          {sectionContent.cover.date && <span>{sectionContent.cover.date}</span>}
          {sectionContent.cover.location && (
            <span className="before:mx-1 before:content-['•']">
              {sectionContent.cover.location}
            </span>
          )}
        </div>
      </div>
    </section>
  )
}
