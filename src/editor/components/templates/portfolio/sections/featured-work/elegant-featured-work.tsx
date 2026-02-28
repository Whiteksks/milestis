'use client'

import { motion } from 'framer-motion'
import type { PortfolioTemplateProps } from '@/editor/components/editor/layout/portfolio-template-shell'
import { cn } from '@/lib/utils'
import { getAspectRatioClass } from '@/editor/lib/aspect-ratios'
import { getFrameStyle } from '@/editor/lib/frame-styles'

interface ElegantFeaturedWorkProps
  extends Pick<PortfolioTemplateProps, 'theme' | 'sectionContent'> {}

export function ElegantFeaturedWork({
  theme,
  sectionContent,
}: ElegantFeaturedWorkProps) {
  return (
    <motion.section
      id="work"
      data-section-id="featured-work"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-100px' }}
      transition={{ duration: 0.9 }}
      className={cn('@container', theme.foreground)}
    >
      <div className="@lg:px-16 @md:px-10 px-6 @lg:py-32 @md:py-24 py-16">
        <div className="max-w-7xl mx-auto space-y-20">
          <div className="text-center space-y-4">
            <p
              className={cn(
                '@md:text-xs text-[10px] uppercase tracking-[0.3em] opacity-40',
                theme.fontBody,
              )}
            >
              {sectionContent.featuredWork.subtitle || 'Selected Works'}
            </p>
            <h3
              className={cn(
                '@lg:text-6xl @md:text-5xl text-4xl tracking-tight',
                theme.fontTitle,
              )}
            >
              {sectionContent.featuredWork.title}
            </h3>
          </div>

          <div className="space-y-32">
            {(sectionContent.featuredWork.projects ?? []).map((project, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-80px' }}
                transition={{ duration: 0.8, delay: i * 0.1 }}
              >
                <div className="grid @lg:grid-cols-[2fr,3fr] grid-cols-1 @lg:gap-16 gap-8 items-center">
                  <div
                    className={cn(
                      'relative overflow-hidden group',
                      i % 2 === 1 && '@lg:order-2',
                      getAspectRatioClass(project.aspectRatio),
                    )}
                  >
                    <motion.img
                      whileHover={{ scale: 1.03 }}
                      transition={{ duration: 0.6 }}
                      src={
                        project.image ||
                        '/placeholder.svg?height=700&width=900'
                      }
                      alt={project.title || 'Project image'}
                      className={cn(
                        'w-full h-full object-cover',
                        theme.shadow,
                        getFrameStyle(project.frameStyle || 'soft'),
                      )}
                    />
                  </div>

                  <div className={cn('space-y-6', i % 2 === 1 && '@lg:order-1')}>
                    <div className="space-y-3">
                      <p
                        className={cn(
                          '@md:text-xs text-[10px] uppercase tracking-widest opacity-30',
                          theme.fontBody,
                        )}
                      >
                        Project {String(i + 1).padStart(2, '0')}
                      </p>
                      <h4
                        className={cn(
                          '@lg:text-4xl @md:text-3xl text-2xl tracking-tight',
                          theme.fontTitle,
                        )}
                      >
                        {project.title}
                      </h4>
                    </div>

                    <p
                      className={cn(
                        '@md:text-base text-sm opacity-60',
                        theme.lineHeight,
                        theme.fontBody,
                      )}
                    >
                      {project.description}
                    </p>

                    {project.tags && project.tags.length > 0 && (
                      <div className="flex flex-wrap gap-3 pt-2">
                        {project.tags.map((tag, idx) => (
                          <span
                            key={idx}
                            className={cn(
                              'text-xs tracking-wider uppercase opacity-40',
                              theme.fontBody,
                            )}
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </motion.section>
  )
}
