"use client"

import { motion } from "framer-motion"
import type { PhotobookSectionContent } from '@/editor/lib/types'
import type { ThemeConfig } from '@/editor/lib/themes'
import { cn } from '@/lib/utils'

interface IntroMagazineProps {
  sectionContent: PhotobookSectionContent
  theme: ThemeConfig
}

export function IntroMagazine({ sectionContent, theme }: IntroMagazineProps) {
  const { introduction } = sectionContent
  const title = introduction.title || ''
  const quote = introduction.quote || ''
  const dedication = introduction.dedication || ''
  const imageUrl = introduction.images?.image || ''

  const words = title.split(" ")

  return (
    <section className="min-h-screen relative overflow-hidden" style={{ backgroundColor: theme.background }}>
      {/* Background image */}
      {imageUrl && (
        <div className="absolute inset-0">
          <img src={imageUrl} alt="" className="w-full h-full object-cover" />
          <div className="absolute inset-0 opacity-85" style={{ backgroundColor: theme.background }} />
        </div>
      )}

      <div className="relative z-10 min-h-screen flex">
        {/* Left side - Large title */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="flex-1 flex items-center justify-center p-8 md:p-16"
        >
          <div className="space-y-2">
            {words.map((word, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.1 * i }}
                className={cn("text-5xl md:text-6xl lg:text-8xl font-bold uppercase tracking-tight leading-none", theme.fontTitle)}
                style={{
                  color: i % 2 === 0 ? theme.foreground : "transparent",
                  WebkitTextStroke: i % 2 === 0 ? "none" : `2px ${theme.foreground}`,
                }}
              >
                {word}
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Right side - Quote and dedication */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="w-full md:w-96 flex items-center justify-center p-8 md:p-12 backdrop-blur-sm"
          style={{ backgroundColor: `${theme.card}80` }}
        >
          <div className="space-y-8">
            <div className="w-16 h-1" style={{ backgroundColor: theme.foreground }} />

            <p className={cn("text-lg leading-relaxed", theme.fontBody)} style={{ color: theme.foreground }}>"{quote}"</p>

            <div className="pt-4 border-t" style={{ borderColor: theme.border }}>
              <p className="text-xs uppercase tracking-[0.3em]" style={{ color: theme.mutedText }}>{dedication}</p>
            </div>

            {imageUrl && (
              <div className="mt-8 aspect-square w-full max-w-50 overflow-hidden">
                <img
                  src={imageUrl}
                  alt=""
                  className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-500"
                />
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
