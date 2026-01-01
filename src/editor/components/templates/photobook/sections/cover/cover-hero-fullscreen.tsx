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

export function CoverHeroFullscreen({
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
    <section className="relative min-h-screen overflow-hidden flex items-center justify-center">
      {/* Background Image with effect */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 2, ease: "easeOut" }}
        className="absolute inset-0"
      >
        {imageUrl && (
          <div className="relative w-full h-full">
            <Image
              loader={passthroughLoader}
              unoptimized
              src={imageUrl}
              alt=""
              fill
              sizes="100vw"
              className="object-cover"
            />
          </div>
        )}
      </motion.div>

      {/* Soft paper-like overlay */}
      <div className="absolute inset-0 bg-amber-50/40 mix-blend-multiply" />
      <div className="absolute inset-0 bg-linear-to-t from-stone-100/80 via-transparent to-stone-50/30" />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center text-center px-8 py-20 max-w-2xl">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.5, delay: 0.3, ease: "easeOut" }}
          className={cn("font-serif text-5xl sm:text-6xl lg:text-7xl text-stone-800 tracking-tight leading-tight", theme.fontTitle)}
          style={{ color: theme.foreground }}
        >
          {title}
        </motion.h1>

        <motion.div
          initial={{ scaleX: 0, opacity: 0 }}
          animate={{ scaleX: 1, opacity: 1 }}
          transition={{ duration: 1, delay: 0.8 }}
          className="w-16 h-px bg-stone-400/60 my-8"
          style={{ backgroundColor: theme.border }}
        />

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.5, delay: 1 }}
          className={cn("font-serif text-stone-600 text-lg sm:text-xl font-light italic tracking-wide leading-relaxed max-w-md", theme.fontBody)}
          style={{ color: theme.mutedText }}
        >
          {subtitle}
        </motion.p>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.5, delay: 1.4 }}
          className="mt-12 flex flex-col items-center gap-1 text-stone-500/80"
          style={{ color: theme.mutedText }}
        >
          <span className="text-xs tracking-[0.25em] uppercase">{dateRange}</span>
          <span className="text-[10px] tracking-[0.2em] uppercase">{location}</span>
        </motion.div>
      </div>

      {/* Paper texture */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        }}
      />
    </section>
  )
}
