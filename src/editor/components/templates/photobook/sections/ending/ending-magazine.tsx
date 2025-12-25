"use client"

import { motion } from "framer-motion"
import type { PhotobookSectionContent } from '@/editor/lib/types'
import type { ThemeConfig } from '@/editor/lib/themes'
import { cn } from '@/lib/utils'

interface EndingMagazineProps {
  sectionContent: PhotobookSectionContent
  theme: ThemeConfig
}

export function EndingMagazine({
  sectionContent,
  theme,
}: EndingMagazineProps) {
  const { ending } = sectionContent
  const message = ending.text || "THE END"
  const signature = ending.signature || ""
  const date = ending.date || ""
  const imageUrl = ending.images?.image || ""

  const words = message.split(" ")

  return (
    <section className="min-h-screen relative">
      {/* Фоновое фото */}
      <div className="absolute inset-0">
        {imageUrl && <img src={imageUrl} alt="" className="w-full h-full object-cover" />}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
      </div>

      {/* Контент снизу */}
      <div className="relative z-10 min-h-screen flex flex-col justify-end p-8 md:p-16">
        {/* Крупные слова */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="space-y-2"
        >
          {words.map((word, index) => (
            <motion.span
              key={index}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className={cn("block text-7xl md:text-9xl font-black uppercase leading-none", theme.fontTitle)}
              style={{
                color: index % 2 === 0 ? "white" : "transparent",
                WebkitTextStroke: index % 2 === 0 ? "none" : "2px white"
              }}
            >
              {word}
            </motion.span>
          ))}
        </motion.div>

        {/* Метаданные */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6 }}
          className="mt-8 flex items-center gap-6 text-white/60"
        >
          <p className={cn("text-sm italic", theme.fontBody)}>{signature}</p>
          <span className="w-px h-4 bg-white/30" />
          <p className="text-xs tracking-widest uppercase">{date}</p>
        </motion.div>
      </div>
    </section>
  )
}
