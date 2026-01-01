"use client"

import { motion } from "framer-motion"
import type { PhotobookSectionContent } from '@/editor/lib/types'
import type { ThemeConfig } from '@/editor/lib/themes'
import { cn } from '@/lib/utils'
import Image, { type ImageLoader } from 'next/image'

const passthroughLoader: ImageLoader = ({ src }) => src

interface EndingVerticalProps {
  sectionContent: PhotobookSectionContent
  theme: ThemeConfig
}

export function EndingVertical({
  sectionContent,
  theme,
}: EndingVerticalProps) {
  const { ending } = sectionContent
  const message = ending.text || "The End"
  const signature = ending.signature || "With love"
  const date = ending.date || "2024"
  // ending.images is PhotoBlock (single object)
  const imageUrl = ending.images?.image || ""

  return (
    <section className="min-h-screen relative" style={{ backgroundColor: theme.background }}>
      {/* Background photo */}
      <div className="absolute inset-0">
        {imageUrl && (
          <div className="relative w-full h-full">
            <Image
              loader={passthroughLoader}
              unoptimized
              src={imageUrl}
              alt="Ending background"
              fill
              sizes="100vw"
              className="object-cover"
            />
          </div>
        )}
        <div className="absolute inset-0 bg-linear-to-r from-black/80 via-black/40 to-transparent" />
      </div>

      {/* Vertical text on left */}
      <div className="absolute left-8 md:left-16 top-1/2 -translate-y-1/2 flex items-center gap-8">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="flex flex-col items-center gap-6"
        >
          <div className="w-px h-20" style={{ backgroundColor: theme.muted }} />
          <p
            className="text-xs tracking-[0.4em] uppercase"
            style={{ 
              writingMode: "vertical-rl", 
              textOrientation: "mixed",
              color: theme.mutedText
            }}
          >
            {date}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
        >
          <h2
            className={cn("text-6xl md:text-8xl font-serif", theme.fontTitle)}
            style={{ 
              writingMode: "vertical-rl", 
              textOrientation: "mixed",
              color: theme.foreground
            }}
          >
            {message}
          </h2>
        </motion.div>
      </div>

      {/* Signature bottom right */}
      <motion.p
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.5 }}
        className={cn("absolute bottom-12 right-12 text-sm italic", theme.fontBody)}
        style={{ color: theme.mutedText }}
      >
        {signature}
      </motion.p>
    </section>
  )
}
