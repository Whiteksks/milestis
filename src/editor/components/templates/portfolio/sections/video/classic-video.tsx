'use client'

import { motion } from 'framer-motion'
import type { PortfolioTemplateProps } from '@/editor/components/editor/ui/portfolio-template-shell'
import { cn } from '@/lib/utils'

interface ClassicVideoProps extends Pick<PortfolioTemplateProps, 'theme' | 'sectionContent'> {}

export function ClassicVideo({ theme, sectionContent }: ClassicVideoProps) {
  return (
    <motion.section
      id="video"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-100px' }}
      transition={{ duration: 0.8 }}
      className="@container"
    >
      <div className="@lg:px-12 @md:px-8 px-4 @lg:py-20 @md:py-16 py-12">
        <div className="max-w-4xl mx-auto text-center">
          {sectionContent.video.subtitle && (
            <p className={cn('text-sm font-medium uppercase tracking-wider mb-2 opacity-60', theme.fontTitle)}>
              {sectionContent.video.subtitle}
            </p>
          )}
          <h3
            className={cn(
              '@lg:text-4xl @md:text-3xl text-2xl font-bold mb-4',
              theme.fontTitle,
            )}
          >
            {sectionContent.video.title}
          </h3>
          <p className="@md:text-base text-sm opacity-60 mb-8">
            {sectionContent.video.description}
          </p>
          <div
            className={cn(
              'aspect-video w-full overflow-hidden',
              theme.radiusMedium,
              theme.shadow,
            )}
          >
            {sectionContent.video.videoUrl && (
              <iframe
                src={sectionContent.video.videoUrl}
                title="Video"
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            )}
          </div>
        </div>
      </div>
    </motion.section>
  )
}
