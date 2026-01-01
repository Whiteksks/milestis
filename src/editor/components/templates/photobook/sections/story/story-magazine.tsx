"use client"

import { motion } from "framer-motion"
import type { PhotobookSectionContent } from '@/editor/lib/types'
import type { ThemeConfig } from '@/editor/lib/themes'
import { cn } from '@/lib/utils'
import Image, { type ImageLoader } from 'next/image'

const passthroughLoader: ImageLoader = ({ src }) => src

interface StoryMagazineProps {
  sectionContent: PhotobookSectionContent
  theme: ThemeConfig
}

export function StoryMagazine({
  sectionContent,
  theme,
}: StoryMagazineProps) {
  const { story } = sectionContent
  const title = story.title || "Our Story"
  const location = story.location || ""

  const items = story.images?.map(slot => ({
    imageUrl: slot.images[0] || "",
    caption: slot.caption || "",
    date: "" 
  })) || []

  const words = title.split(" ")

  return (
    <section>
      {items.map((item, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="min-h-screen relative overflow-hidden"
          style={{ backgroundColor: theme.background, color: theme.foreground }}
        >
          {/* Background photo */}
          <div className="absolute inset-0 opacity-40">
            {item.imageUrl && (
              <Image
                loader={passthroughLoader}
                unoptimized
                src={item.imageUrl}
                alt=""
                fill
                sizes="100vw"
                className="object-cover"
              />
            )}
          </div>

          {/* Content */}
          <div className="relative z-10 min-h-screen flex flex-col justify-between p-8 md:p-16">
            {/* Top */}
            <div className="flex justify-between items-start">
              <span className="text-sm tracking-[0.3em] uppercase" style={{ color: theme.mutedText }}>{item.date}</span>
              <span className="text-sm tracking-[0.3em] uppercase" style={{ color: theme.mutedText }}>{location}</span>
            </div>

            {/* Center */}
            <div className="flex flex-col items-center justify-center flex-1 py-16">
              {index === 0 ? (
                words.map((word, i) => (
                  <span
                    key={i}
                    className={cn("text-6xl md:text-8xl lg:text-9xl font-bold tracking-tight leading-none", theme.fontTitle)}
                    style={{
                      color: i % 2 === 0 ? theme.foreground : "transparent",
                      WebkitTextStroke: i % 2 !== 0 ? `2px ${theme.foreground}` : "none"
                    }}
                  >
                    {word}
                  </span>
                ))
              ) : (
                <span className="text-[200px] font-serif opacity-10" style={{ color: theme.foreground }}>{String(index + 1).padStart(2, "0")}</span>
              )}
            </div>

            {/* Bottom */}
            <p className={cn("leading-relaxed max-w-xl text-center mx-auto", theme.fontBody)} style={{ color: theme.mutedText }}>{item.caption}</p>
          </div>
        </motion.div>
      ))}
    </section>
  )
}
