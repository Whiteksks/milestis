"use client"

import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import { ThemeConfig } from '@/editor/lib/themes'
import { PhotobookSectionContent } from '@/editor/lib/types'

interface MasonryIntroductionProps {
  sectionContent: PhotobookSectionContent
  theme: ThemeConfig
}

export function MasonryIntroduction({ sectionContent, theme }: MasonryIntroductionProps) {
  return (
    <section className="py-20 border-b border-border bg-background/90 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,var(--tw-gradient-stops))] from-primary/5 via-background to-background opacity-50" />
      
      <div className="container mx-auto px-6 max-w-4xl text-center space-y-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="space-y-6"
        >
          {sectionContent.introduction.title && (
            <h2 className={cn('text-3xl sm:text-4xl md:text-5xl font-semibold tracking-tight', theme.fontTitle)}>
              {sectionContent.introduction.title}
            </h2>
          )}

          {sectionContent.introduction.quote && (
            <div className="relative inline-block">
              <span className="absolute -top-4 -left-6 text-4xl text-primary/20 font-serif">“</span>
              <p className="text-lg md:text-xl italic text-muted-foreground font-light leading-relaxed px-4">
                {sectionContent.introduction.quote}
              </p>
              <span className="absolute -bottom-4 -right-6 text-4xl text-primary/20 font-serif">”</span>
            </div>
          )}

          {sectionContent.introduction.dedication && (
            <div className="flex items-center justify-center gap-4 pt-4">
              <div className="h-px w-12 bg-border" />
              <p className="text-sm uppercase tracking-widest text-muted-foreground">
                {sectionContent.introduction.dedication}
              </p>
              <div className="h-px w-12 bg-border" />
            </div>
          )}
        </motion.div>

        {sectionContent.introduction.images?.image && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mt-8 flex justify-center"
          >
            <div className="relative p-2 bg-background rounded-xl shadow-xl rotate-1 hover:rotate-0 transition-transform duration-500">
              <div className="overflow-hidden rounded-lg border bg-slate-100 w-full max-w-xs aspect-4/5">
                <img
                  src={sectionContent.introduction.images.image}
                  className="w-full h-full object-cover"
                  alt=""
                />
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </section>
  )
}

