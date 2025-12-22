"use client"

import { motion } from 'framer-motion'
import { Calendar, ArrowDown } from 'lucide-react'
import { cn } from '@/lib/utils'
import { ThemeConfig } from '@/editor/lib/themes'
import { PhotobookSectionContent } from '@/editor/lib/types'

interface TimelineCoverProps {
  sectionContent: PhotobookSectionContent
  theme: ThemeConfig
}

export function TimelineCover({ sectionContent, theme }: TimelineCoverProps) {
  const heroImage =
    sectionContent.cover.images?.image ||
    sectionContent.story.images?.[0]?.images?.[0] ||
    undefined

  const heroTitle =
    sectionContent.cover.title ||
    sectionContent.story.title ||
    'Your Story Timeline'

  const heroSubtitle =
    sectionContent.introduction.quote ||
    sectionContent.introduction.dedication ||
    sectionContent.cover.tagline ||
    ''

  return (
    <section className="relative min-h-[70vh] flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 z-0">
        {heroImage && (
          <motion.img
            initial={{ scale: 1.1 }}
            animate={{ scale: 1 }}
            transition={{ duration: 1.5, ease: 'easeOut' }}
            src={heroImage}
            alt="Hero"
            className="w-full h-full object-cover opacity-90"
          />
        )}
        <div className="absolute inset-0 bg-linear-to-b from-background/20 via-background/60 to-background" />
      </div>

      <div className="relative z-10 container mx-auto px-4 text-center space-y-8 py-16">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="space-y-4"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border bg-background/50 backdrop-blur-sm text-xs font-medium uppercase tracking-wider">
            <Calendar className="w-3 h-3" />
            <span>Timeline Story</span>
          </div>
          <h1
            className={cn(
              'text-4xl md:text-6xl lg:text-7xl font-bold tracking-tighter text-foreground drop-shadow-sm',
              theme.fontTitle,
            )}
          >
            {heroTitle}
          </h1>

          <div className="flex justify-center gap-3 text-xs text-muted-foreground">
            {sectionContent.cover.date && <span>{sectionContent.cover.date}</span>}
            {sectionContent.cover.location && (
              <span className="before:mx-1 before:content-['•']">
                {sectionContent.cover.location}
              </span>
            )}
          </div>

          {heroSubtitle && (
            <p className="max-w-2xl mx-auto text-lg md:text-xl text-muted-foreground leading-relaxed">
              {heroSubtitle}
            </p>
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 1 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce"
        >
          <ArrowDown className="w-6 h-6 text-muted-foreground" />
        </motion.div>
      </div>
    </section>
  )
}
