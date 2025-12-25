"use client"

import { motion } from "framer-motion"
import type { PhotobookSectionContent } from '@/editor/lib/types'
import type { ThemeConfig } from '@/editor/lib/themes'
import { cn } from '@/lib/utils'

interface StoryClassicProps {
  sectionContent: PhotobookSectionContent
  theme: ThemeConfig
}

export function StoryClassic({
  sectionContent,
  theme,
}: StoryClassicProps) {
  const { story } = sectionContent
  const title = story.title || "Our Story"
  const location = story.location || ""

  const items = story.images?.map(slot => ({
    imageUrl: slot.images[0] || "",
    caption: slot.caption || "",
    date: "" 
  })) || []

  return (
    <section className="py-16" style={{ backgroundColor: theme.background }}>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-16 px-8"
      >
        <h2 className={cn("font-serif text-4xl md:text-5xl", theme.fontTitle)} style={{ color: theme.foreground }}>{title}</h2>
        <p className="text-sm mt-3 tracking-widest uppercase" style={{ color: theme.mutedText }}>{location}</p>
        <div className="w-20 h-px mx-auto mt-6" style={{ backgroundColor: theme.border }} />
      </motion.div>

      {/* Stories */}
      <div className="max-w-5xl mx-auto px-8 space-y-24">
        {items.map((item, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className={`flex flex-col ${index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"} items-center gap-12 md:gap-20`}
          >
            {/* Image */}
            <div className="flex-1 w-full">
              <div className="relative p-4 shadow-lg rotate-1 hover:rotate-0 transition-transform duration-500" style={{ backgroundColor: theme.card }}>
                <div className="aspect-[4/5] overflow-hidden relative">
                  {item.imageUrl && <img src={item.imageUrl} alt="" className="w-full h-full object-cover" />}
                </div>
              </div>
            </div>

            {/* Text */}
            <div className="flex-1 text-center md:text-left space-y-6">
              {item.date && <span className="text-xs font-bold tracking-widest uppercase" style={{ color: theme.mutedText }}>{item.date}</span>}
              <p className={cn("text-lg md:text-xl leading-relaxed font-serif italic", theme.fontBody)} style={{ color: theme.foreground }}>
                {item.caption}
              </p>
              <div className={`w-12 h-px ${index % 2 === 0 ? "mx-auto md:mx-0" : "mx-auto md:ml-auto"}`} style={{ backgroundColor: theme.border }} />
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  )
}
