"use client"

import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import { ThemeConfig } from '@/editor/lib/themes'
import { PhotobookSectionContent } from '@/editor/lib/types'
import { PhotoBlockUI } from '../photoblock-ui'

interface TimelineIntroductionProps {
  sectionContent: PhotobookSectionContent
  theme: ThemeConfig
}

export function TimelineIntroduction({ sectionContent, theme }: TimelineIntroductionProps) {
  return (
    <section className="relative py-20 bg-background overflow-hidden">
      {/* Vertical line connecting from top */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-20 bg-linear-to-b from-transparent to-border" />
      
      <div className="container mx-auto px-4 max-w-4xl relative z-10">
        <div className="flex flex-col items-center text-center space-y-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="w-3 h-3 rounded-full bg-primary ring-4 ring-background border border-primary/20"
          />

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="space-y-6 max-w-2xl"
          >
            {sectionContent.introduction.title && (
              <h2 className={cn('text-3xl md:text-4xl font-bold tracking-tight', theme.fontTitle)}>
                {sectionContent.introduction.title}
              </h2>
            )}

            {sectionContent.introduction.quote && (
              <p className="text-lg md:text-xl italic text-muted-foreground font-serif leading-relaxed">
                “{sectionContent.introduction.quote}”
              </p>
            )}

            {sectionContent.introduction.dedication && (
              <p className="text-sm font-medium uppercase tracking-widest text-primary/80">
                {sectionContent.introduction.dedication}
              </p>
            )}
          </motion.div>

          {sectionContent.introduction.images?.image && (
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="mt-8 relative"
            >
              <div className="absolute -inset-4 bg-muted rounded-full blur-2xl opacity-50" />
              <div className="relative">
                <PhotoBlockUI
                  block={sectionContent.introduction.images}
                  fallbackAspect="landscape"
                  fallbackFrame="soft"
                />
              </div>
            </motion.div>
          )}
        </div>
      </div>
      
      {/* Vertical line continuing down */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-px h-20 bg-linear-to-b from-border to-transparent" />
    </section>
  )
}

