'use client'

import { motion } from 'framer-motion'
import type { PortfolioTemplateProps } from '@/editor/components/editor/ui/portfolio-template-shell'
import { cn } from '@/lib/utils'
import { getAspectRatioClass } from '@/editor/lib/aspect-ratios'
import { getFrameStyle } from '@/editor/lib/frame-styles'

interface ClassicBioProps extends Pick<PortfolioTemplateProps, 'theme' | 'sectionContent'> {}

export function ClassicBio({ theme, sectionContent }: ClassicBioProps) {
  return (
    <motion.section
      id="bio"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-100px' }}
      transition={{ duration: 0.8, delay: 0.2 }}
      className="@container"
    >
      <div className="@lg:px-12 @md:px-8 px-4 @lg:py-20 @md:py-16 py-12">
        <div className="max-w-4xl mx-auto grid @md:grid-cols-2 grid-cols-1 gap-8 items-center">
          <div>
            <img
              src={sectionContent.bio.image || '/placeholder.svg?height=600&width=600'}
              alt={sectionContent.bio.title || 'Profile image'}
              className={cn(
                'w-full object-cover',
                getAspectRatioClass(sectionContent.bio.imageAspectRatio),
                theme.shadow,
                getFrameStyle(sectionContent.bio.imageFrameStyle || 'soft'),
              )}
            />
          </div>
          <div>
            {sectionContent.bio.subtitle && (
              <p className={cn('text-sm font-medium uppercase tracking-wider mb-2 opacity-60', theme.fontTitle)}>
                {sectionContent.bio.subtitle}
              </p>
            )}
            <h3
              className={cn(
                '@lg:text-4xl @md:text-3xl text-2xl font-bold mb-4',
                theme.fontTitle,
              )}
            >
              {sectionContent.bio.title}
            </h3>
            <p
              className={cn(
                '@md:text-base text-sm opacity-70 mb-6',
                theme.lineHeight,
              )}
            >
              {sectionContent.bio.description}
            </p>
            {sectionContent.bio.achievements &&
              sectionContent.bio.achievements.length > 0 && (
                <ul className="space-y-2">
                  {sectionContent.bio.achievements.map((achievement, i) => (
                    <li
                      key={i}
                      className="flex items-start gap-2 text-sm opacity-60"
                    >
                      <span className={theme.foreground}>•</span>
                      <span>{achievement}</span>
                    </li>
                  ))}
                </ul>
              )}
          </div>
        </div>
      </div>
    </motion.section>
  )
}
