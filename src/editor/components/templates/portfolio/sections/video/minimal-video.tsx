'use client'

import { motion } from 'framer-motion'
import type { PortfolioTemplateProps } from '@/editor/components/editor/layout/portfolio-template-shell'
import { cn } from '@/lib/utils'

interface MinimalVideoProps extends Pick<PortfolioTemplateProps, 'theme' | 'sectionContent'> {}

export function MinimalVideo({ theme, sectionContent }: MinimalVideoProps) {
  return (
    <motion.section
      id="video"
      data-section-id="video"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-100px' }}
      transition={{ duration: 0.8 }}
      className={cn('@container', theme.foreground)}
    >
      <div className="@lg:px-20 @md:px-12 px-6 @lg:py-32 @md:py-24 py-16">
        <div className="max-w-5xl mx-auto space-y-12">
          <div className="text-center space-y-3">
            <p className={cn('text-xs uppercase opacity-40', theme.letterSpacing)}>
              {sectionContent.video.subtitle || 'Showreel'}
            </p>
            <h3
              className={cn(
                '@lg:text-5xl @md:text-4xl text-3xl font-light',
                theme.fontTitle,
              )}
            >
              {sectionContent.video.title}
            </h3>
            {sectionContent.video.description && (
              <p
                className={cn(
                  '@md:text-base text-sm opacity-60 font-light max-w-2xl mx-auto',
                  theme.lineHeight,
                )}
              >
                {sectionContent.video.description}
              </p>
            )}
          </div>

          <div className="relative aspect-video overflow-hidden bg-black/5">
            {sectionContent.video.videoUrl ? (
              <iframe
                src={sectionContent.video.videoUrl}
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <p className={cn('text-sm opacity-30', theme.fontBody)}>
                  Video placeholder
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.section>
  )
}
