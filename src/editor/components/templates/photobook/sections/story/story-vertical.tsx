"use client"

import { motion } from "framer-motion"
import type { PhotobookSectionContent } from '@/editor/lib/types'
import type { ThemeConfig } from '@/editor/lib/themes'
import { cn } from '@/lib/utils'

interface StoryVerticalProps {
  sectionContent: PhotobookSectionContent
  theme: ThemeConfig
}

export function StoryVertical({
  sectionContent,
  theme,
}: StoryVerticalProps) {
  const { story } = sectionContent
  const title = story.title || "Our Story"
  const location = story.location || ""

  const items = story.images?.map(slot => ({
    imageUrl: slot.images[0] || "",
    caption: slot.caption || "",
    date: ""
  })) || []

  return (
    <section style={{ backgroundColor: theme.background }}>
      {items.map((item, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="min-h-screen relative overflow-hidden"
        >
          {/* Background photo */}
          <div className="absolute inset-0">
            {item.imageUrl && (
              <img 
                src={item.imageUrl} 
                alt={item.caption || "Story image"} 
                className="w-full h-full object-cover"
              />
            )}
            <div className="absolute inset-0 bg-linear-to-r from-black/80 via-black/40 to-transparent" />
          </div>

          {/* Vertical text on left */}
          <div className="absolute left-8 top-1/2 -translate-y-1/2 hidden md:block">
            <span
              className="text-7xl lg:text-8xl font-bold tracking-widest"
              style={{ 
                writingMode: "vertical-rl", 
                textOrientation: "mixed",
                color: theme.muted
              }}
            >
              {index === 0 ? "CHAPTER" : String(index + 1).padStart(2, "0")}
            </span>
          </div>

          {/* Content */}
          <div className="relative z-10 min-h-screen flex items-center">
            <div className="max-w-xl ml-auto mr-8 md:mr-16 p-8">
              <div className="space-y-6">
                {/* Number */}
                <span className="text-9xl font-serif" style={{ color: theme.muted }}>{String(index + 1).padStart(2, "0")}</span>

                {/* Meta */}
                <div className="flex items-center gap-3 text-sm -mt-4" style={{ color: theme.mutedText }}>
                  <span>{item.date}</span>
                  <span className="w-1 h-1 rounded-full" style={{ backgroundColor: theme.mutedText }} />
                  <span>{location}</span>
                </div>

                {/* Title - only first */}
                {index === 0 && <h2 className={cn("font-serif text-4xl", theme.fontTitle)} style={{ color: theme.foreground }}>{title}</h2>}

                {/* Caption */}
                <p className={cn("text-lg leading-relaxed", theme.fontBody)} style={{ color: theme.mutedText }}>{item.caption}</p>
              </div>
            </div>
          </div>
        </motion.div>
      ))}
    </section>
  )
}
