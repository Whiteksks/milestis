'use client'

import { motion } from 'framer-motion'
import type { PortfolioTemplateProps } from '@/editor/components/editor/layout/portfolio-template-shell'
import { cn } from '@/lib/utils'

interface ElegantVideoProps extends Pick<PortfolioTemplateProps, 'theme' | 'sectionContent'> {}

export function ElegantVideo({ theme, sectionContent }: ElegantVideoProps) {
  return (
    <motion.section
      id="video"
      data-section-id="video"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-100px' }}
      transition={{ duration: 0.9 }}
      className={cn('@container', theme.muted, theme.foreground)}
    >
      <div className="@lg:px-16 @md:px-10 px-6 @lg:py-32 @md:py-24 py-16">
        <div className="max-w-6xl mx-auto space-y-16">
          <div className="text-center space-y-4">
            <p
              className={cn(
                '@md:text-xs text-[10px] uppercase tracking-[0.3em] opacity-40',
                theme.fontBody,
              )}
            >
              {sectionContent.video.subtitle || 'Watch'}
            </p>
            <h3
              className={cn(
                '@lg:text-5xl @md:text-4xl text-3xl tracking-tight',
                theme.fontTitle,
              )}
            >
              {sectionContent.video.title}
            </h3>
            {sectionContent.video.description && (
              <p
                className={cn(
                  '@md:text-base text-sm opacity-60 max-w-xl mx-auto',
                  theme.lineHeight,
                )}
              >
                {sectionContent.video.description}
              </p>
            )}
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative aspect-video overflow-hidden bg-black/5"
          >
            {sectionContent.video.videoUrl ? (
              <iframe
                src={sectionContent.video.videoUrl}
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <p className={cn('text-sm opacity-20', theme.fontBody)}>
                  Video placeholder
                </p>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </motion.section>
  )
}
