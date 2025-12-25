"use client"

import { motion } from "framer-motion"
import type { PhotobookSectionContent } from '@/editor/lib/types'
import type { ThemeConfig } from '@/editor/lib/themes'
import { cn } from '@/lib/utils'

interface IntroClassicProps {
  sectionContent: PhotobookSectionContent
  theme: ThemeConfig
}

export function IntroClassic({ sectionContent, theme }: IntroClassicProps) {
  const { introduction } = sectionContent
  const title = introduction.title || ''
  const quote = introduction.quote || ''
  const dedication = introduction.dedication || ''
  const imageUrl = introduction.images?.image || ''

  return (
    <section className="min-h-screen flex items-center justify-center py-20 px-6" style={{ backgroundColor: theme.background }}>
      <div className="max-w-3xl text-center space-y-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="space-y-8"
        >
          <h2 className={cn("text-4xl md:text-5xl lg:text-6xl font-serif tracking-tight", theme.fontTitle)} style={{ color: theme.foreground }}>{title}</h2>

          <div className="relative py-6">
            <span className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-2 text-6xl font-serif select-none" style={{ color: theme.accent }}>
              "
            </span>
            <p className={cn("text-xl md:text-2xl italic font-light leading-relaxed px-8", theme.fontBody)} style={{ color: theme.mutedText }}>{quote}</p>
            <span className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-2 text-6xl font-serif select-none" style={{ color: theme.accent }}>
              "
            </span>
          </div>

          <div className="flex items-center justify-center gap-4">
            <div className="h-px w-16" style={{ backgroundColor: theme.border }} />
            <p className="text-sm uppercase tracking-[0.3em]" style={{ color: theme.mutedText }}>{dedication}</p>
            <div className="h-px w-16" style={{ backgroundColor: theme.border }} />
          </div>
        </motion.div>

        {imageUrl && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="pt-8"
          >
            <div className="relative inline-block">
              <img src={imageUrl} alt="Introduction" className="max-h-100 object-contain shadow-lg rounded-sm" />
            </div>
          </motion.div>
        )}
      </div>
    </section>
  )
}
