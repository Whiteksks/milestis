"use client"

import { motion } from "framer-motion"
import type { PhotobookSectionContent } from '@/editor/lib/types'
import type { ThemeConfig } from '@/editor/lib/themes'
import { cn } from '@/lib/utils'

interface GalleryMinimalProps {
  sectionContent: PhotobookSectionContent
  theme: ThemeConfig
}

export function GalleryMinimal({
  sectionContent,
  theme,
}: GalleryMinimalProps) {
  const { gallery } = sectionContent
  const title = gallery.title || "Gallery"
  
  // gallery.images is PhotoBlock[]
  // PhotoBlock has image: string
  const images = gallery.images?.map(block => block.image) || []

  return (
    <section className="py-24 px-4 md:px-8" style={{ backgroundColor: theme.background }}>
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className={cn("font-serif text-3xl md:text-4xl mb-4", theme.fontTitle)} style={{ color: theme.foreground }}>{title}</h2>
          <div className="w-16 h-0.5 mx-auto" style={{ backgroundColor: theme.accent }} />
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {images.map((image, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="aspect-3/4 relative group overflow-hidden"
            >
              {image && (
                <img 
                  src={image} 
                  alt={`Gallery image ${index + 1}`} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
