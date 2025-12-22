"use client"

import { motion } from 'framer-motion'
import { Heart, CircleDot } from 'lucide-react'
import { cn } from '@/lib/utils'
import { ThemeConfig } from '@/editor/lib/themes'
import { PhotobookSectionContent, FrameStyle } from '@/editor/lib/types'
import { PhotoBlockUI } from '../photoblock-ui'

interface TimelineEndingProps {
  sectionContent: PhotobookSectionContent
  theme: ThemeConfig
  frameStyle: FrameStyle
}

export function TimelineEnding({ sectionContent, theme, frameStyle }: TimelineEndingProps) {
  return (
    <section className="py-32 bg-background relative overflow-hidden">
      {/* Timeline ending line */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-24 bg-linear-to-b from-border to-transparent" />

      <div className="container mx-auto px-4 text-center space-y-12 max-w-3xl relative z-10">
        <motion.div
          initial={{ scale: 0 }}
          whileInView={{ scale: 1 }}
          viewport={{ once: true }}
          transition={{ type: "spring", stiffness: 200, damping: 20 }}
          className="mx-auto flex flex-col items-center gap-4"
        >
          <div className="p-4 rounded-full bg-muted border-2 border-background shadow-inner">
            <CircleDot className="w-8 h-8 text-primary" />
          </div>
          <div className="h-8 w-px bg-border" />
        </motion.div>

        <div className="space-y-6">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className={cn('text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight', theme.fontTitle)}
          >
            {sectionContent.ending.text ? 'The End' : 'Thank You'}
          </motion.h2>

          {sectionContent.ending.text && (
            <motion.p 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="text-xl text-muted-foreground leading-relaxed max-w-xl mx-auto"
            >
              {sectionContent.ending.text}
            </motion.p>
          )}
        </div>

        {sectionContent.ending.images?.image && (
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            className="mt-8 flex justify-center"
          >
            <div className="p-3 bg-white shadow-xl rotate-2 rounded-xl">
              <PhotoBlockUI
                block={sectionContent.ending.images}
                fallbackAspect="portrait"
                fallbackFrame={frameStyle}
              />
            </div>
          </motion.div>
        )}

        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6 }}
          className="pt-12 flex flex-col items-center gap-4"
        >
          <div className="w-16 h-px bg-border" />
          <div className="text-sm font-medium text-muted-foreground flex items-center gap-2">
            {sectionContent.ending.date && <span>{sectionContent.ending.date}</span>}
            {sectionContent.ending.signature && (
              <>
                <span className="w-1 h-1 rounded-full bg-primary/50" />
                <span className="font-serif italic">{sectionContent.ending.signature}</span>
              </>
            )}
          </div>
        </motion.div>
      </div>
    </section>
  )
}

