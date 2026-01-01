"use client"

import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import { ThemeConfig } from '@/editor/lib/themes'
import { PhotobookSectionContent } from '@/editor/lib/types'
import Image, { type ImageLoader } from 'next/image'

const passthroughLoader: ImageLoader = ({ src }) => src

interface MasonryHighlightProps {
  sectionContent: PhotobookSectionContent
  theme: ThemeConfig
}

export function MasonryHighlight({ sectionContent, theme }: MasonryHighlightProps) {
  return (
    <section className="py-24 border-t border-border bg-muted/30">
      <div className="container mx-auto px-6 max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="space-y-8 text-center lg:text-left order-2 lg:order-1"
          >
            <div className="space-y-4">
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-primary">Highlight</span>
              <h3 className={cn('text-3xl md:text-4xl lg:text-5xl font-bold leading-tight', theme.fontTitle)}>
                {sectionContent.highlight.title || 'A Special Moment'}
              </h3>
            </div>

            {sectionContent.highlight.description && (
              <p className="text-lg text-muted-foreground leading-relaxed">
                {sectionContent.highlight.description}
              </p>
            )}

            {sectionContent.highlight.quote && (
              <blockquote className="border-l-4 border-primary/30 pl-6 py-2 italic text-xl text-foreground/80">
                “{sectionContent.highlight.quote}”
              </blockquote>
            )}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95, rotate: 2 }}
            whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="order-1 lg:order-2"
          >
            {sectionContent.highlight.images?.image ? (
              <div className="relative">
                <div className="absolute -inset-4 bg-primary/5 rounded-4xl -rotate-2" />
                <div className="relative overflow-hidden rounded-2xl border bg-card shadow-2xl aspect-4/3">
                  <Image
                    loader={passthroughLoader}
                    unoptimized
                    src={sectionContent.highlight.images.image}
                    alt=""
                    fill
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    className="object-cover"
                  />
                </div>
              </div>
            ) : (
              <div className="aspect-4/3 bg-muted/50 rounded-2xl flex items-center justify-center border border-dashed">
                <span className="text-muted-foreground">No highlight image</span>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  )
}

