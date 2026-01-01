"use client"

import { motion } from "framer-motion"
import type { PhotobookSectionContent } from '@/editor/lib/types'
import type { ThemeConfig } from '@/editor/lib/themes'
import { cn } from '@/lib/utils'
import Image, { type ImageLoader } from 'next/image'

const passthroughLoader: ImageLoader = ({ src }) => src

interface StorySplitProps {
  sectionContent: PhotobookSectionContent
  theme: ThemeConfig
}

export function StorySplit({
  sectionContent,
  theme,
}: StorySplitProps) {
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
          className={`min-h-screen flex flex-col md:flex-row ${index % 2 === 1 ? "md:flex-row-reverse" : ""}`}
        >
          {/* Photo side */}
          <div className="w-full md:w-1/2 relative min-h-[50vh] md:min-h-screen">
            {item.imageUrl && (
              <Image
                loader={passthroughLoader}
                unoptimized
                src={item.imageUrl}
                alt={item.caption || "Story image"}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover"
              />
            )}
          </div>

          {/* Text side */}
          <div className="w-full md:w-1/2 flex items-center justify-center p-8 md:p-12" style={{ backgroundColor: theme.card }}>
            <div className="max-w-md space-y-8">
              {/* Date badge */}
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full" style={{ backgroundColor: theme.muted }}>
                <span className="text-xs font-medium tracking-wide uppercase" style={{ color: theme.accent }}>{item.date}</span>
                {location && index === 0 && (
                  <>
                    <span className="w-1 h-1 rounded-full" style={{ backgroundColor: theme.accent }} />
                    <span className="text-xs" style={{ color: theme.mutedText }}>{location}</span>
                  </>
                )}
              </div>

              {index === 0 && <h2 className={cn("font-serif text-4xl md:text-5xl leading-tight", theme.fontTitle)} style={{ color: theme.foreground }}>{title}</h2>}

              <div className="w-20 h-0.5" style={{ backgroundColor: theme.accent }} />

              <p className={cn("text-lg leading-relaxed", theme.fontBody)} style={{ color: theme.mutedText }}>{item.caption}</p>

              {/* Page number */}
              <div className="pt-4">
                <span className="text-6xl font-serif opacity-30" style={{ color: theme.accent }}>{String(index + 1).padStart(2, "0")}</span>
              </div>
            </div>
          </div>
        </motion.div>
      ))}
    </section>
  )
}
