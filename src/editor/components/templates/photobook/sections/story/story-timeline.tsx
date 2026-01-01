"use client"

import { motion } from "framer-motion"
import type { PhotobookSectionContent } from '@/editor/lib/types'
import type { ThemeConfig } from '@/editor/lib/themes'
import { cn } from '@/lib/utils'
import Image, { type ImageLoader } from 'next/image'

const passthroughLoader: ImageLoader = ({ src }) => src

interface StoryTimelineProps {
  sectionContent: PhotobookSectionContent
  theme: ThemeConfig
}

export function StoryTimeline({
  sectionContent,
  theme,
}: StoryTimelineProps) {
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
        <p className="text-sm mt-3" style={{ color: theme.mutedText }}>{location}</p>
      </motion.div>

      <div className="max-w-6xl mx-auto px-8 relative">
        {/* Timeline line */}
        <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-px md:-translate-x-1/2" style={{ backgroundColor: theme.border }} />

        {/* Items */}
        <div className="space-y-16">
          {items.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              className={`flex flex-col md:flex-row gap-8 md:gap-16 items-center ${
                index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
              }`}
            >
              {/* Date/Text Side */}
              <div className={`flex-1 ${index % 2 === 0 ? "md:text-right pl-16 md:pl-0" : "md:text-left pl-16 md:pl-0"}`}>
                <div className="relative">
                  {/* Dot on timeline */}
                  <div className={`absolute top-2 w-3 h-3 rounded-full border-2 bg-white z-10
                    ${index % 2 === 0 
                      ? "-left-10.5 md:-right-10.5 md:left-auto" 
                      : "-left-10.5 md:-left-10.5"
                    }`}
                    style={{ borderColor: theme.accent }}
                  />
                  
                  {item.date && <span className="text-xs font-bold tracking-widest uppercase block mb-2" style={{ color: theme.mutedText }}>{item.date}</span>}
                  <p className={cn("text-lg font-serif italic", theme.fontBody)} style={{ color: theme.foreground }}>{item.caption}</p>
                </div>
              </div>

              {/* Image Side */}
              <div className="flex-1 w-full pl-16 md:pl-0">
                <div className="aspect-3/2 overflow-hidden rounded-sm shadow-md relative" style={{ boxShadow: theme.shadow }}>
                  {item.imageUrl && (
                    <Image
                      loader={passthroughLoader}
                      unoptimized
                      src={item.imageUrl}
                      alt=""
                      fill
                      sizes="(max-width: 768px) 100vw, 50vw"
                      className="object-cover"
                    />
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
