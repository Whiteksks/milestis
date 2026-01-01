"use client"

import { motion } from "framer-motion"
import { cn } from '@/lib/utils'
import type { ThemeConfig } from '@/editor/lib/themes'
import type { PhotobookSectionContent } from '@/editor/lib/types'
import Image, { type ImageLoader } from 'next/image'

const passthroughLoader: ImageLoader = ({ src }) => src

interface EndingCircleProps {
  sectionContent: PhotobookSectionContent
  theme: ThemeConfig
}

export function EndingCircle({ sectionContent, theme }: EndingCircleProps) {
  const message = sectionContent.ending.text || 'До новых встреч'
  const signature = sectionContent.ending.signature
  const date = sectionContent.ending.date
  const imageUrl = sectionContent.ending.images?.image

  return (
    <section className="min-h-screen bg-amber-50 flex items-center justify-center px-6">
      <div className="text-center space-y-10">
        {/* Круглое фото */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="relative mx-auto"
        >
          {/* Декоративные кольца */}
          <div className="absolute inset-0 -m-4 rounded-full border border-amber-300/50" />
          <div className="absolute inset-0 -m-8 rounded-full border border-amber-200/30" />

          <div className="w-40 h-40 md:w-52 md:h-52 rounded-full overflow-hidden shadow-xl">
            <div className="relative w-full h-full">
              <Image
                loader={passthroughLoader}
                unoptimized
                src={imageUrl || "/placeholder.svg"}
                alt=""
                fill
                sizes="208px"
                className="object-cover"
              />
            </div>
          </div>
        </motion.div>

        {/* Текст */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="space-y-4"
        >
          <p className={cn('text-2xl md:text-3xl italic text-stone-700', theme.fontTitle)}>{message}</p>
          {(signature || date) && (
            <div className="flex items-center justify-center gap-3 text-sm text-stone-500">
              {signature && <span>{signature}</span>}
              {signature && date && <span className="w-1 h-1 rounded-full bg-stone-400" />}
              {date && <span>{date}</span>}
            </div>
          )}
        </motion.div>
      </div>
    </section>
  )
}
