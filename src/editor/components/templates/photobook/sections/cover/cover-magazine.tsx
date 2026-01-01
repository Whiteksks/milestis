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

export function CoverMagazine({ sectionContent, theme }: CoverProps) {
  const { cover } = sectionContent
  const title = cover.title
  const subtitle = cover.subtitle || cover.tagline || ''
  const dateRange = cover.date || ''
  const location = cover.location || ''
  const imageUrl = cover.images?.image || ''

  const titleWords = title.split(" ")

  return (
    <section className="relative min-h-screen w-full overflow-hidden" style={{ backgroundColor: theme.background }}>
      {/* Photo with effect */}
      {imageUrl && (
        <Image
          loader={passthroughLoader}
          unoptimized
          src={imageUrl}
          alt=""
          fill
          sizes="100vw"
          className="object-cover"
        />
      )}

      {/* Light overlay */}
      <div className="absolute inset-0 bg-linear-to-t from-stone-900/60 via-transparent to-stone-900/30" />

      {/* Magazine style layout */}
      <div className="absolute inset-0 flex flex-col justify-between p-8 md:p-12">
        {/* Top - Magazine header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="flex items-start justify-between"
        >
          <div>
            <p className="font-sans text-xs tracking-[0.5em] uppercase text-white/70 mb-1">Family Edition</p>
            <p className="font-mono text-xs text-white/50">{dateRange}</p>
          </div>
          <div className="text-right">
            <p className="font-sans text-xs tracking-[0.3em] uppercase text-white/70">{location}</p>
          </div>
        </motion.div>

        {/* Center - Large stacked title */}
        <div className="flex-1 flex items-center justify-start md:justify-center">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.3 }}
            className="space-y-0"
          >
            {titleWords.map((word, index) => (
              <motion.h1
                key={index}
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.4 + index * 0.15 }}
                className={cn("font-serif text-6xl md:text-8xl lg:text-9xl font-bold tracking-tight leading-[0.85] uppercase", theme.fontTitle)}
                style={{
                  color: index % 2 === 1 ? "transparent" : "white",
                  textShadow: "2px 2px 20px rgba(0,0,0,0.3)",
                  WebkitTextStroke: index % 2 === 1 ? "1px white" : "none",
                  WebkitTextFillColor: index % 2 === 1 ? "transparent" : "white",
                }}
              >
                {word}
              </motion.h1>
            ))}
          </motion.div>
        </div>

        {/* Bottom - Subtitle and details */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="flex items-end justify-between"
        >
          <p className={cn("font-serif text-lg md:text-xl text-white/90 italic max-w-xs", theme.fontBody)}>{subtitle}</p>
          <div className="hidden md:flex flex-col items-end gap-1">
            <div className="w-12 h-px bg-white/40" />
            <p className="font-mono text-[10px] tracking-widest uppercase text-white/50">Photobook</p>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
