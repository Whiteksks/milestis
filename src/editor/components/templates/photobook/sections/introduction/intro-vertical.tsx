"use client"

import { motion } from "framer-motion"
import type { PhotobookSectionContent } from '@/editor/lib/types'
import type { ThemeConfig } from '@/editor/lib/themes'
import { cn } from '@/lib/utils'
import Image, { type ImageLoader } from 'next/image'

const passthroughLoader: ImageLoader = ({ src }) => src

interface IntroVerticalProps {
  sectionContent: PhotobookSectionContent
  theme: ThemeConfig
}

export function IntroVertical({
  sectionContent,
  theme,
}: IntroVerticalProps) {
  const { introduction } = sectionContent
  const title = introduction.title || "Introduction"
  const quote = introduction.quote || ""
  const dedication = introduction.dedication || ""
  const imageUrl = introduction.images?.image || ""

  return (
    <section className="min-h-screen flex" style={{ backgroundColor: theme.background }}>
      {/* Left - Vertical text */}
      <motion.div
        initial={{ opacity: 0, x: -30 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="w-20 md:w-28 shrink-0 flex items-center justify-center"
        style={{ backgroundColor: theme.card }}
      >
        <h2
          className={cn("font-serif text-2xl md:text-3xl tracking-widest whitespace-nowrap", theme.fontTitle)}
          style={{ 
            writingMode: "vertical-rl", 
            textOrientation: "mixed", 
            transform: "rotate(180deg)",
            color: theme.foreground
          }}
        >
          {title}
        </h2>
      </motion.div>

      {/* Center - Content */}
      <div className="flex-1 flex items-center justify-center px-8 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="max-w-xl space-y-8"
        >
          {imageUrl && (
            <div className="w-full aspect-video overflow-hidden rounded-sm">
              <div className="relative w-full h-full">
                <Image
                  loader={passthroughLoader}
                  unoptimized
                  src={imageUrl}
                  alt=""
                  fill
                  sizes="(max-width: 768px) 100vw, 60vw"
                  className="object-cover"
                />
              </div>
            </div>
          )}

          <div className="space-y-6">
            <p
              className={cn("text-lg md:text-xl leading-relaxed font-light", theme.fontBody)}
              style={{ color: theme.mutedText }}
            >
              &quot;{quote}&quot;
            </p>

            <div className="flex items-center gap-4">
              <div className="h-px flex-1" style={{ backgroundColor: theme.muted }} />
              <p className="text-xs uppercase tracking-[0.3em]" style={{ color: theme.mutedText }}>{dedication}</p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
