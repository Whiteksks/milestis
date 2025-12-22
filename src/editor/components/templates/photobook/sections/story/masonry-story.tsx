"use client"

import { motion } from 'framer-motion'
import { Sparkles } from 'lucide-react'
import { cn } from '@/lib/utils'
import { ThemeConfig } from '@/editor/lib/themes'
import { PhotobookSectionContent } from '@/editor/lib/types'
import { FeaturedCard } from '../masonry-ui'

interface MasonryStoryProps {
  sectionContent: PhotobookSectionContent
  theme: ThemeConfig
  featured: any[]
}

export function MasonryStory({ sectionContent, theme, featured }: MasonryStoryProps) {
  return (
    <>
      {/* FEATURED STRIP from first story slots */}
      {featured.length > 0 && (
        <section className="py-16 bg-linear-to-b from-muted/20 to-background border-b border-border">
          <div className="container mx-auto px-6 mb-10 max-w-350">
            <div className="flex items-center justify-between mb-6">
              <h2 className={cn('text-3xl sm:text-4xl font-semibold', theme.fontTitle)}>
                Избранные моменты
              </h2>
              <p className="text-xs text-muted-foreground uppercase tracking-[0.25em] flex items-center gap-1">
                <Sparkles className="h-3.5 w-3.5 text-primary" /> curated
              </p>
            </div>

            <div className="overflow-x-auto sm:overflow-visible">
              <div className="grid grid-flow-col sm:grid-flow-row sm:grid-cols-2 lg:grid-cols-5 gap-6">
                {featured.map((slot, i) => (
                  <motion.div
                    key={slot.id}
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: i * 0.1 }}
                    className={cn(
                      'rounded-2xl overflow-hidden border border-border shadow-lg bg-background/70 backdrop-blur-xl hover:scale-105 hover:shadow-2xl transition-transform duration-300',
                      i % 2 === 0 ? 'h-72' : 'h-56',
                    )}
                  >
                    <FeaturedCard slot={slot} theme={theme} />
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* STORY header (title/date/location/paragraphs) */}
      <section className="py-12">
        <div className="container mx-auto px-6 max-w-3xl space-y-4">
          {sectionContent.story.title && (
            <h3 className={cn('text-2xl md:text-3xl font-semibold', theme.fontTitle)}>
              {sectionContent.story.title}
            </h3>
          )}

          <div className="text-xs text-slate-500 flex gap-3">
            {sectionContent.story.date && <span>{sectionContent.story.date}</span>}
            {sectionContent.story.location && <span>{sectionContent.story.location}</span>}
          </div>

          {sectionContent.story.paragraphs?.map((p, i) => (
            <p key={i} className="text-sm text-slate-700 leading-relaxed">
              {p}
            </p>
          ))}
        </div>
      </section>
    </>
  )
}
