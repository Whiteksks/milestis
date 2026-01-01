"use client"

import { motion } from "framer-motion"
import type { PhotobookSectionContent } from '@/editor/lib/types'
import type { ThemeConfig } from '@/editor/lib/themes'
import { cn } from '@/lib/utils'
import Image, { type ImageLoader } from 'next/image'

const passthroughLoader: ImageLoader = ({ src }) => src

interface CoverProps {
  sectionContent: PhotobookSectionContent
  theme: ThemeConfig
}

export function CoverCirclePortrait({
  sectionContent,
  theme,
}: CoverProps) {
  const { cover } = sectionContent
  const title = cover.title
  const subtitle = cover.subtitle || cover.tagline || ''
  const dateRange = cover.date || ''
  const location = cover.location || ''
  const imageUrl = cover.images?.image || ''

  return (
    <section className="relative min-h-screen overflow-hidden flex items-center justify-center" style={{ backgroundColor: theme.background }}>
      {/* Subtle background pattern */}
      <div
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, ${theme.foreground} 1px, transparent 0)`,
          backgroundSize: "40px 40px",
        }}
      />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center text-center px-8 py-20">
        {/* Circle frame with photo */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          className="relative mb-12"
        >
          {/* Decorative ring */}
          <div className="absolute -inset-4 rounded-full border" style={{ borderColor: theme.border }} />
          <div className="absolute -inset-8 rounded-full border opacity-30" style={{ borderColor: theme.border }} />

          <div className="w-64 h-64 sm:w-80 sm:h-80 rounded-full overflow-hidden shadow-2xl ring-4 ring-white" style={{ boxShadow: theme.shadow }}>
            {imageUrl && (
              <div className="relative w-full h-full">
                <Image
                  loader={passthroughLoader}
                  unoptimized
                  src={imageUrl}
                  alt=""
                  fill
                  sizes="320px"
                  className="object-cover"
                />
              </div>
            )}
          </div>

          {/* Small decorative element */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 1 }}
            className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-8 h-8 bg-white rounded-full shadow-md flex items-center justify-center"
          >
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: theme.accent }} />
          </motion.div>
        </motion.div>

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 0.4, ease: "easeOut" }}
          className={cn("font-serif text-4xl sm:text-5xl lg:text-6xl tracking-tight leading-tight", theme.fontTitle)}
          style={{ color: theme.foreground }}
        >
          {title}
        </motion.h1>

        {/* Decorative flourish */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.8 }}
          className="flex items-center gap-3 my-6"
        >
          <div className="w-12 h-px" style={{ backgroundColor: theme.border }} />
          <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: theme.mutedText }} />
          <div className="w-12 h-px" style={{ backgroundColor: theme.border }} />
        </motion.div>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.2, delay: 1 }}
          className={cn("font-serif text-lg sm:text-xl font-light italic tracking-wide max-w-sm", theme.fontBody)}
          style={{ color: theme.mutedText }}
        >
          {subtitle}
        </motion.p>

        {/* Date & Location */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.2, delay: 1.3 }}
          className="mt-10 flex items-center gap-4"
          style={{ color: theme.mutedText }}
        >
          <span className="text-xs tracking-[0.2em] uppercase">{dateRange}</span>
          <span className="opacity-50">|</span>
          <span className="text-xs tracking-[0.2em] uppercase">{location}</span>
        </motion.div>
      </div>
    </section>
  )
}
