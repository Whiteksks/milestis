"use client"

import { motion } from "framer-motion"
import type { PhotobookSectionContent } from '@/editor/lib/types'
import type { ThemeConfig } from '@/editor/lib/themes'
import { cn } from '@/lib/utils'

interface EndingClassicProps {
  sectionContent: PhotobookSectionContent
  theme: ThemeConfig
}

export function EndingClassic({
  sectionContent,
  theme,
}: EndingClassicProps) {
  const { ending } = sectionContent
  const message = ending.text || "The End"
  const signature = ending.signature || ""
  const date = ending.date || ""

  return (
    <section className="min-h-screen flex items-center justify-center relative" style={{ backgroundColor: theme.background }}>
      {/* Текстура бумаги */}
      <div
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%' height='100%' filter='url(%23noise)' opacity='0.4'/%3E%3C/svg%3E")`,
        }}
      />

      <div className="text-center space-y-12 relative z-10 px-6">
        {/* Декоративная линия */}
        <motion.div
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="w-24 h-px mx-auto"
          style={{ backgroundColor: theme.border }}
        />

        {/* Основной текст */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className={cn("text-4xl md:text-5xl font-serif italic", theme.fontTitle)}
          style={{ color: theme.foreground }}
        >
          {message}
        </motion.p>

        {/* Подпись и дата */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6 }}
          className="space-y-2"
        >
          <p className={cn("text-lg font-medium tracking-wide", theme.fontBody)} style={{ color: theme.foreground }}>{signature}</p>
          <p className="text-sm uppercase tracking-widest" style={{ color: theme.mutedText }}>{date}</p>
        </motion.div>

        {/* Декоративная линия */}
        <motion.div
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="w-24 h-px mx-auto"
          style={{ backgroundColor: theme.border }}
        />
      </div>
    </section>
  )
}
