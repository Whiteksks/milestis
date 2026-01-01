"use client"

import { motion } from "framer-motion"
import type { PhotobookSectionContent } from '@/editor/lib/types'
import type { ThemeConfig } from '@/editor/lib/themes'
import { cn } from '@/lib/utils'
import Image, { type ImageLoader } from 'next/image'

const passthroughLoader: ImageLoader = ({ src }) => src

interface HighlightSplitProps {
  sectionContent: PhotobookSectionContent
  theme: ThemeConfig
}

export function HighlightSplit({
  sectionContent,
  theme,
}: HighlightSplitProps) {
  const { highlight } = sectionContent
  const title = highlight.title || "Highlight"
  const description = highlight.description || ""
  
  // highlight.images is PhotoBlock (single object)
  const image = highlight.images?.image || ""

  return (
    <section className="min-h-screen flex flex-col md:flex-row" style={{ backgroundColor: theme.background }}>
      <div className="w-full md:w-1/2 p-8 md:p-16 flex items-center justify-center order-2 md:order-1">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="max-w-md space-y-8"
        >
          <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ backgroundColor: theme.muted }}>
            <span className="text-xl" style={{ color: theme.accent }}>✦</span>
          </div>

          <h2 className={cn("font-serif text-4xl md:text-5xl leading-tight", theme.fontTitle)} style={{ color: theme.foreground }}>{title}</h2>

          <div className="w-24 h-0.5" style={{ backgroundColor: theme.accent }} />

          <p className={cn("text-lg leading-relaxed", theme.fontBody)} style={{ color: theme.mutedText }}>{description}</p>
        </motion.div>
      </div>

      <div className="w-full md:w-1/2 relative min-h-[50vh] md:min-h-screen order-1 md:order-2">
        {image && (
          <Image
            loader={passthroughLoader}
            unoptimized
            src={image}
            alt={title}
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover"
          />
        )}
        
        {/* Decorative border */}
        <div className="absolute inset-8 border border-white/20 pointer-events-none" />
      </div>
    </section>
  )
}
