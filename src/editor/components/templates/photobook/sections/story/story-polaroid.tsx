"use client"

import { motion } from "framer-motion"
import type { PhotobookSectionContent } from '@/editor/lib/types'
import type { ThemeConfig } from '@/editor/lib/themes'
import { cn } from '@/lib/utils'
import Image, { type ImageLoader } from 'next/image'

const passthroughLoader: ImageLoader = ({ src }) => src

interface StoryPolaroidProps {
  sectionContent: PhotobookSectionContent
  theme: ThemeConfig
}

export function StoryPolaroid({
  sectionContent,
  theme,
}: StoryPolaroidProps) {
  const { story } = sectionContent
  const title = story.title || "Our Story"
  const location = story.location || ""

  const items = story.images?.map(slot => ({
    imageUrl: slot.images[0] || "",
    caption: slot.caption || "",
    date: "" 
  })) || []

  const rotations = [-3, 2, -2, 3, -1]

  return (
    <section className="py-16" style={{ backgroundColor: theme.background }}>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-16 px-8"
      >
        <span className="text-8xl font-serif opacity-20" style={{ color: theme.mutedText }}>&quot;</span>
        <h2 className={cn("font-serif text-3xl md:text-4xl -mt-8", theme.fontTitle)} style={{ color: theme.foreground }}>{title}</h2>
        <p className="text-sm mt-3" style={{ color: theme.mutedText }}>{location}</p>
      </motion.div>

      <div className="max-w-5xl mx-auto px-8 space-y-24">
        {items.map((item, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 40, rotate: rotations[index % rotations.length] * 2 }}
            whileInView={{ opacity: 1, y: 0, rotate: rotations[index % rotations.length] }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className={`grid md:grid-cols-2 gap-12 items-center ${index % 2 === 1 ? "md:grid-flow-dense" : ""}`}
          >
            {/* Polaroid card */}
            <div className={`relative ${index % 2 === 1 ? "md:col-start-2" : ""}`}>
              <div className="p-4 pb-16 shadow-2xl" style={{ backgroundColor: theme.card }}>
                <div className="aspect-square overflow-hidden">
                  <div className="relative aspect-square overflow-hidden">
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
                <div className="mt-4 text-center">
                  <p className={cn("font-serif italic text-lg", theme.fontBody)} style={{ color: theme.mutedText }}>{item.date}</p>
                </div>
              </div>
              {/* Stack effect */}
              <div className="absolute inset-0 shadow-xl -z-10 rotate-6 translate-x-2 translate-y-2" style={{ backgroundColor: theme.card }} />
              <div className="absolute inset-0 shadow-lg -z-20 -rotate-3 -translate-x-1 translate-y-1" style={{ backgroundColor: theme.card }} />
            </div>

            {/* Text */}
            <div className={`space-y-6 ${index % 2 === 1 ? "md:col-start-1 md:row-start-1" : ""}`}>
              <div className="pl-6 border-l-2" style={{ borderColor: theme.border }}>
                <p className={cn("text-lg leading-relaxed italic", theme.fontBody)} style={{ color: theme.foreground }}>{item.caption}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  )
}
