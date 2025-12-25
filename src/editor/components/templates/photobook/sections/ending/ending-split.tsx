"use client"

import { motion } from "framer-motion"
import type { PhotobookSectionContent } from '@/editor/lib/types'
import type { ThemeConfig } from '@/editor/lib/themes'
import { cn } from '@/lib/utils'

interface EndingSplitProps {
  sectionContent: PhotobookSectionContent
  theme: ThemeConfig
}

export function EndingSplit({
  sectionContent,
  theme,
}: EndingSplitProps) {
  const { ending } = sectionContent
  const title = ending.text || "The End"
  const subtitle = ending.signature || "Thank you for watching"

  return (
    <section className="min-h-[70vh] flex items-center justify-center relative overflow-hidden" style={{ backgroundColor: theme.background }}>
      {/* Background split */}
      <div className="absolute inset-0 flex">
        <div className="w-1/2 h-full" style={{ backgroundColor: theme.card }} />
        <div className="w-1/2 h-full" style={{ backgroundColor: theme.background }} />
      </div>

      <div className="relative z-10 max-w-2xl mx-auto px-8 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="p-12 md:p-20 shadow-2xl"
          style={{ backgroundColor: theme.card }}
        >
          <div className="space-y-8">
            <div className="w-16 h-0.5 mx-auto" style={{ backgroundColor: theme.accent }} />
            
            <h2 className={cn("font-serif text-5xl md:text-7xl tracking-tight", theme.fontTitle)} style={{ color: theme.foreground }}>{title}</h2>
            
            <p className={cn("text-xl tracking-wide uppercase", theme.fontBody)} style={{ color: theme.mutedText }}>{subtitle}</p>
            
            <div className="w-16 h-0.5 mx-auto" style={{ backgroundColor: theme.accent }} />
          </div>
        </motion.div>
      </div>
    </section>
  )
}
