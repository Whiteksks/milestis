"use client"

import { motion } from "framer-motion"
import type { PhotobookSectionContent } from '@/editor/lib/types'
import type { ThemeConfig } from '@/editor/lib/themes'
import { cn } from '@/lib/utils'

interface IntroCardProps {
  sectionContent: PhotobookSectionContent
  theme: ThemeConfig
}

export function IntroCard({ sectionContent, theme }: IntroCardProps) {
  const { introduction } = sectionContent
  const title = introduction.title || ''
  const quote = introduction.quote || ''
  const dedication = introduction.dedication || ''
  const imageUrl = introduction.images?.image || ''

  return (
    <section className="min-h-screen flex items-center justify-center py-20 px-6" style={{ backgroundColor: theme.background }}>
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="rounded-2xl shadow-2xl overflow-hidden max-w-4xl w-full"
        style={{ backgroundColor: theme.card }}
      >
        <div className="grid md:grid-cols-5">
          {/* Image side */}
          {imageUrl && (
            <div className="md:col-span-2 h-64 md:h-auto">
              <img src={imageUrl} alt="" className="w-full h-full object-cover" />
            </div>
          )}

          {/* Text side */}
          <div className={`${imageUrl ? "md:col-span-3" : "md:col-span-5"} p-10 md:p-14 flex flex-col justify-center`}>
            <div className="space-y-6">
              <div className="inline-block px-3 py-1 text-xs uppercase tracking-wider rounded-full" style={{ backgroundColor: theme.secondary, color: theme.secondaryText }}>
                Introduction
              </div>

              <h2 className={cn("text-3xl md:text-4xl font-serif", theme.fontTitle)} style={{ color: theme.foreground }}>{title}</h2>

              <p className={cn("text-lg leading-relaxed border-l-4 pl-6 italic", theme.fontBody)} style={{ color: theme.mutedText, borderColor: theme.accent }}>{quote}</p>

              <p className="text-sm pt-4" style={{ color: theme.mutedText }}>— {dedication}</p>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  )
}
