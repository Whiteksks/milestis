'use client'

import { motion } from 'framer-motion'
import type { PortfolioTemplateProps } from '@/editor/components/editor/layout/portfolio-template-shell'
import { cn } from '@/lib/utils'
import { getAspectRatioClass } from '@/editor/lib/aspect-ratios'
import { getFrameStyle } from '@/editor/lib/frame-styles'

interface MinimalBioProps extends Pick<PortfolioTemplateProps, 'theme' | 'sectionContent'> {}

export function MinimalBio({ theme, sectionContent }: MinimalBioProps) {
  return (
    <motion.section
      id="bio"
      data-section-id="bio"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-100px' }}
      transition={{ duration: 0.8, delay: 0.1 }}
      className={cn('@container', theme.muted, theme.foreground)}
    >
      <div className="@lg:px-20 @md:px-12 px-6 @lg:py-32 @md:py-24 py-16">
        <div className="max-w-6xl mx-auto grid @lg:grid-cols-[1fr,2fr] @md:grid-cols-1 gap-16 items-start">
          <div className={cn('relative overflow-hidden', getAspectRatioClass(sectionContent.bio.imageAspectRatio))}>
            <img
              src={sectionContent.bio.image || '/placeholder.svg?height=600&width=450'}
              alt={sectionContent.bio.title || 'Profile image'}
              className={cn(
                'w-full h-full object-cover',
                theme.shadow,
                getFrameStyle(sectionContent.bio.imageFrameStyle || 'soft'),
              )}
            />
          </div>

          <div className="@lg:pt-12 space-y-10">
            <div className="space-y-4">
              <p className={cn('text-xs uppercase opacity-40', theme.letterSpacing)}>
                {sectionContent.bio.subtitle || 'About'}
              </p>
              <h3
                className={cn(
                  '@lg:text-5xl @md:text-4xl text-3xl font-light',
                  theme.fontTitle,
                )}
              >
                {sectionContent.bio.title}
              </h3>
            </div>

            <p
              className={cn(
                '@md:text-lg text-base opacity-70 font-light whitespace-pre-line',
                theme.lineHeight,
                theme.fontBody,
              )}
            >
              {sectionContent.bio.description}
            </p>

            {sectionContent.bio.achievements &&
              sectionContent.bio.achievements.length > 0 && (
                <div className="space-y-3 pt-6 border-t border-current/10">
                  {sectionContent.bio.achievements.map((achievement, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-3 opacity-60"
                    >
                      <div className="w-1.5 h-1.5 rounded-full bg-current opacity-40" />
                      <p
                        className={cn(
                          '@md:text-sm text-xs font-light',
                          theme.fontBody,
                        )}
                      >
                        {achievement}
                      </p>
                    </div>
                  ))}
                </div>
              )}
          </div>
        </div>
      </div>
    </motion.section>
  )
}
