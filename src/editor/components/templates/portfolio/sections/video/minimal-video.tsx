'use client'

import { motion } from 'framer-motion'
import type { PortfolioTemplateProps } from '@/editor/lib/template-types'
import { cn } from '@/lib/utils'

interface MinimalVideoProps extends Pick<PortfolioTemplateProps, 'theme' | 'sectionContent'> {}

export function MinimalVideo({ theme, sectionContent }: MinimalVideoProps) {
  return (
    <section
      id="video"
      data-section-id="video"
      className={cn('@container', theme.foreground)}
    >
      <div className="max-w-6xl mx-auto px-6 @md:px-10 @lg:px-16 py-20 @md:py-28">
        {/* Section header */}
        <div className="flex items-center justify-between mb-16 border-t border-current/10 pt-8">
          <motion.p
            initial={{ opacity: 0, x: -10 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className={cn('text-[9px] uppercase tracking-[0.4em] opacity-30', theme.letterSpacing, theme.fontBody)}
          >
            {sectionContent.video.subtitle || 'Showreel'}
          </motion.p>
          <motion.span
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className={cn('text-[9px] tabular-nums opacity-20', theme.fontBody)}
          >
            04
          </motion.span>
        </div>

        <div className="space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className={cn('@lg:text-5xl @md:text-4xl text-3xl font-extralight', theme.fontTitle)}>
              {sectionContent.video.title}
            </h2>
            {sectionContent.video.description && (
              <p className={cn('mt-4 @md:text-base text-sm opacity-40 font-light max-w-xl', theme.fontBody)}>
                {sectionContent.video.description}
              </p>
            )}
          </motion.div>

          {/* Video frame — 1px border, no bg fill */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="relative aspect-video border border-current/15 overflow-hidden"
          >
            {sectionContent.video.videoUrl ? (
              <iframe
                src={sectionContent.video.videoUrl}
                className="absolute inset-0 w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            ) : (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
                <div className="w-10 h-10 border border-current/20 flex items-center justify-center">
                  <div style={{ width: 0, height: 0, borderTop: '6px solid transparent', borderBottom: '6px solid transparent', borderLeft: '10px solid currentColor', opacity: 0.3, marginLeft: 2 }} />
                </div>
                <p className={cn('text-[9px] uppercase tracking-[0.3em] opacity-20', theme.fontBody)}>Video</p>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  )
}
   