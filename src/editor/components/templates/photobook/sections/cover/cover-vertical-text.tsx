"use client"

import { motion } from "framer-motion"
import type { PhotobookSectionContent } from '@/editor/lib/types'
import type { ThemeConfig } from '@/editor/lib/themes'
import { cn } from '@/lib/utils'

interface CoverVerticalTextProps {
  sectionContent: PhotobookSectionContent
  theme: ThemeConfig
}

export function CoverVerticalText({
  sectionContent,
  theme,
}: CoverVerticalTextProps) {
  const { cover } = sectionContent
  const title = cover.title || "Title"
  const subtitle = cover.subtitle || "Subtitle"
  const dateRange = cover.date || "2024"
  const location = cover.location || "Location" 
  // cover.images is PhotoBlock (single object)
  const imageUrl = cover.images?.image || ""

  return (
    <section className="relative min-h-screen w-full overflow-hidden" style={{ backgroundColor: theme.background }}>
      {/* Photo */}
      {imageUrl && (
        <img 
          src={imageUrl} 
          alt={title} 
          className="absolute inset-0 w-full h-full object-cover"
        />
      )}

      {/* Gradient overlay for readability */}
      <div className="absolute inset-0 bg-linear-to-r from-black/90 via-black/40 to-transparent" />

      {/* Content with vertical text */}
      <div className="relative z-10 flex min-h-screen">
        {/* Left side - vertical text */}
        <div className="flex items-center justify-center w-24 md:w-32 shrink-0">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, delay: 0.5 }}
            className="transform -rotate-90 whitespace-nowrap"
          >
            <span className="font-mono text-xs tracking-[0.4em] uppercase" style={{ color: theme.mutedText }}>
              {dateRange} — {location}
            </span>
          </motion.div>
        </div>

        {/* Center content */}
        <div className="flex flex-1 flex-col justify-center px-8 py-20">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, delay: 0.3 }}
            className={cn("font-serif text-6xl md:text-8xl lg:text-9xl tracking-tight leading-none", theme.fontTitle)}
            style={{ color: theme.foreground }}
          >
            {title}
          </motion.h1>

          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="w-24 h-0.5 my-8 origin-left"
            style={{ backgroundColor: theme.accent }}
          />

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1 }}
            className={cn("font-serif text-xl md:text-2xl italic max-w-md", theme.fontBody)}
            style={{ color: theme.mutedText }}
          >
            {subtitle}
          </motion.p>
        </div>
      </div>
    </section>
  )
}
