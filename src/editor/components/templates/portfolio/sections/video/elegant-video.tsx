'use client'

import { motion } from 'framer-motion'
import type { PortfolioTemplateProps } from '@/editor/components/editor/layout/portfolio-template-shell'
import { cn } from '@/lib/utils'

interface ElegantVideoProps extends Pick<PortfolioTemplateProps, 'theme' | 'sectionContent'> {}

export function ElegantVideo({ theme, sectionContent }: ElegantVideoProps) {
  return (
    <section
      id="video"
      data-section-id="video"
      className={cn('@container', theme.foreground)}
    >
      <div className="max-w-6xl mx-auto px-6 @md:px-10 @lg:px-16 py-20 @md:py-28">
        <div className="space-y-14">
          {/* Heading */}
          <div className="text-center space-y-4">
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 0.35, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className={cn('text-[10px] uppercase tracking-[0.3em]', theme.fontBody)}
            >
              {sectionContent.video.subtitle || 'Watch'}
            </motion.p>
            <motion.h2
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
              className={cn('@lg:text-5xl @md:text-4xl text-3xl font-extralight tracking-tight', theme.fontTitle)}
            >
              {sectionContent.video.title}
            </motion.h2>
            {sectionContent.video.description && (
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 0.55, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: 0.2 }}
                className={cn('@md:text-base text-sm font-light max-w-xl mx-auto', theme.lineHeight, theme.fontBody)}
              >
                {sectionContent.video.description}
              </motion.p>
            )}
          </div>

          {/* Video frame — thin ornamental border */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.15 }}
            className="relative aspect-video border border-current/10 overflow-hidden"
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
                <div className="w-12 h-12 border border-current/15 flex items-center justify-center">
                  <div style={{ width: 0, height: 0, borderTop: '6px solid transparent', borderBottom: '6px solid transparent', borderLeft: '11px solid currentColor', opacity: 0.2, marginLeft: 3 }} />
                </div>
                <p className={cn('text-[9px] uppercase tracking-[0.3em] opacity-20', theme.fontBody)}>Showreel</p>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  )
}
 