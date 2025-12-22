"use client"

import { motion } from 'framer-motion'
import { Heart, Star } from 'lucide-react'
import { cn } from '@/lib/utils'
import { ThemeConfig } from '@/editor/lib/themes'
import { PhotobookSectionContent } from '@/editor/lib/types'

interface MasonryEndingProps {
  sectionContent: PhotobookSectionContent
  theme: ThemeConfig
}

export function MasonryEnding({ sectionContent, theme }: MasonryEndingProps) {
  return (
    <section className="py-32 bg-background border-t border-border relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-3xl h-full bg-primary/5 blur-3xl rounded-full opacity-50 pointer-events-none" />
      
      <div className="container mx-auto px-6 text-center space-y-10 relative z-10 max-w-3xl">
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          whileInView={{ scale: 1, rotate: 0 }}
          viewport={{ once: true }}
          transition={{ type: "spring", stiffness: 260, damping: 20 }}
          className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-xl"
        >
          <Heart className="h-10 w-10 fill-current" />
        </motion.div>

        <div className="space-y-6">
          <motion.h3 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className={cn('text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight', theme.fontTitle)}
          >
            {sectionContent.ending.text ? 'The End' : 'Thank You'}
          </motion.h3>

          {sectionContent.ending.text && (
            <motion.p 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
              className="text-xl text-muted-foreground font-light leading-relaxed max-w-xl mx-auto"
            >
              {sectionContent.ending.text}
            </motion.p>
          )}
        </div>

        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6 }}
          className="pt-8 border-t border-border/50 flex flex-col items-center gap-3"
        >
          <div className="flex items-center gap-2 text-sm font-medium tracking-widest uppercase text-muted-foreground">
            {sectionContent.ending.date && <span>{sectionContent.ending.date}</span>}
            {sectionContent.ending.date && sectionContent.ending.signature && <span>•</span>}
            {sectionContent.ending.signature && <span>{sectionContent.ending.signature}</span>}
          </div>
          <div className="flex gap-1">
            {[...Array(3)].map((_, i) => (
              <Star key={i} className="w-3 h-3 text-primary/40" />
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}

