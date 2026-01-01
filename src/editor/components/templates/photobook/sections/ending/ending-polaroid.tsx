"use client"

import { motion } from "framer-motion"
import type { PhotobookSectionContent } from '@/editor/lib/types'
import type { ThemeConfig } from '@/editor/lib/themes'
import { cn } from '@/lib/utils'
import Image, { type ImageLoader } from 'next/image'

const passthroughLoader: ImageLoader = ({ src }) => src

interface EndingPolaroidProps {
  sectionContent: PhotobookSectionContent
  theme: ThemeConfig
}

export function EndingPolaroid({
  sectionContent,
  theme,
}: EndingPolaroidProps) {
  const { ending } = sectionContent
  const message = ending.text || "The End"
  const signature = ending.signature || ""
  const date = ending.date || ""
  const imageUrl = ending.images?.image || ""

  return (
    <section className="min-h-screen flex items-center justify-center px-6" style={{ backgroundColor: theme.background }}>
      <motion.div
        initial={{ rotate: -5, opacity: 0, y: 30 }}
        whileInView={{ rotate: 3, opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, type: "spring" }}
        className="p-4 pb-16 shadow-2xl max-w-sm"
        style={{ backgroundColor: theme.card }}
      >
        {/* Фото */}
        <div className="aspect-square relative overflow-hidden">
          {imageUrl && (
            <Image
              loader={passthroughLoader}
              unoptimized
              src={imageUrl}
              alt=""
              fill
              sizes="320px"
              className="object-cover"
            />
          )}
        </div>

        {/* Подпись от руки */}
        <div className="mt-6 text-center">
          <p className={cn("text-2xl font-serif italic", theme.fontTitle)} style={{ color: theme.foreground }}>{message}</p>
          <p className="mt-2 text-sm" style={{ color: theme.mutedText }}>{signature}</p>
          <p className="mt-1 text-xs opacity-70" style={{ color: theme.mutedText }}>{date}</p>
        </div>
      </motion.div>
    </section>
  )
}
