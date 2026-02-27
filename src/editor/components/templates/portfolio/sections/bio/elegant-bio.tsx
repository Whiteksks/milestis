'use client'

import { motion } from 'framer-motion'
import type { PortfolioTemplateProps } from '@/editor/components/editor/layout/portfolio-template-shell'
import { cn } from '@/lib/utils'
import { getAspectRatioClass } from '@/editor/lib/aspect-ratios'
import { getFrameStyle } from '@/editor/lib/frame-styles'

interface ElegantBioProps extends Pick<PortfolioTemplateProps, 'theme' | 'sectionContent'> {}

export function ElegantBio({ theme, sectionContent }: ElegantBioProps) {
  return (
    <motion.section
      id="bio"
      data-section-id="bio"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-100px' }}
      transition={{ duration: 0.9 }}
      className={cn('@container', theme.foreground)}
    >
      <div className="@lg:px-16 @md:px-10 px-6 @lg:py-32 @md:py-24 py-16">
        <div className="max-w-7xl mx-auto grid @lg:grid-cols-[2fr,3fr] grid-cols-1 @lg:gap-20 gap-12">
          <div className="space-y-8">
            <div
              className={cn(
                'overflow-hidden',
                getAspectRatioClass(sectionContent.bio.imageAspectRatio),
              )}
            >
              <motion.img
                initial={{ scale: 1.1, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1.2 }}
                src={
                  sectionContent.bio.image ||
                  '/placeholder.svg?height=700&width=500'
                }
                alt={sectionContent.bio.title || 'Profile image'}
                className={cn(
                  'w-full h-full object-cover',
                  theme.shadow,
                  getFrameStyle(sectionContent.bio.imageFrameStyle || 'soft'),
                )}
              />
            </div>
          </div>

          <div className="@lg:pt-16 space-y-10">
            <div className="space-y-6">
              <p
                className={cn(
                  '@md:text-xs text-[10px] uppercase tracking-[0.3em] opacity-40',
                  theme.fontBody,
                )}
              >
                {sectionContent.bio.subtitle || 'About the Artist'}
              </p>
              <h3
                className={cn(
                  '@lg:text-5xl @md:text-4xl text-3xl tracking-tight',
                  theme.fontTitle,
                )}
              >
                {sectionContent.bio.title}
              </h3>
              <div className="w-12 h-px bg-current/20" />
            </div>

            <p
              className={cn(
                '@lg:text-lg @md:text-base text-sm opacity-70 whitespace-pre-line',
                theme.lineHeight,
                theme.fontBody,
              )}
            >
              {sectionContent.bio.description}
            </p>

            {sectionContent.bio.achievements &&
              sectionContent.bio.achievements.length > 0 && (
                <div className="pt-8 space-y-4">
                  <p
                    className={cn(
                      '@md:text-xs text-[10px] uppercase tracking-widest opacity-40',
                      theme.fontBody,
                    )}
                  >
                    Notable Achievements
                  </p>
                  <div className="space-y-3">
                    {sectionContent.bio.achievements.map((achievement, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, x: -10 }}
                        whileInView={{ opacity: 0.6, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: i * 0.1 }}
                        className="flex items-start gap-4"
                      >
                        <span className="text-xs opacity-30 mt-1">—</span>
                        <p className={cn('@md:text-sm text-xs', theme.fontBody)}>
                          {achievement}
                        </p>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}
          </div>
        </div>
      </div>
    </motion.section>
  )
}
