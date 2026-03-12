"use client"

import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import { ThemeConfig } from '@/editor/lib/themes'
import { PhotobookSectionContent } from '@/editor/lib/types'
import { PhotoBlockUI } from '../photoblock-ui'

interface TimelineHighlightProps {
  sectionContent: PhotobookSectionContent
  theme: ThemeConfig
}

export function TimelineHighlight({ sectionContent, theme }: TimelineHighlightProps) {
  return (
    <section className="py-24 bg-muted/10 border-y border-border relative">
      <div className="container mx-auto px-4 max-w-5xl">
        <div className="flex flex-col md:flex-row items-center gap-12">
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="flex-1 space-y-6 text-center md:text-left"
          >
            <div className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider mb-2">
              Milestone Moment
            </div>
            
            <h3 className={cn('text-3xl md:text-4xl lg:text-5xl font-bold', theme.fontTitle)}>
              {sectionContent.highlight.title || 'Highlight'}
            </h3>

            {sectionContent.highlight.description && (
              <p className="text-lg text-muted-foreground leading-relaxed">
                {sectionContent.highlight.description}
              </p>
            )}

            {sectionContent.highlight.quote && (
              <div className="pt-4">
                <p className="text-xl italic font-serif text-foreground/80">
                  “{sectionContent.highlight.quote}”
                </p>
              </div>
            )}
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="flex-1 w-full max-w-md"
          >
            {sectionContent.highlight.images?.image && (
              <div className="relative">
                <div className="absolute top-4 left-4 w-full h-full border-2 border-primary/20 rounded-lg z-0" />
                <div className="relative z-10 bg-background p-2 rounded-lg shadow-xl">
                  <PhotoBlockUI
                    block={sectionContent.highlight.images}
                    fallbackAspect="landscape"
                    fallbackFrame="soft"
                  />
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  )
}

