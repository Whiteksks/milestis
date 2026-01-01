'use client'

import { motion } from 'framer-motion'
import type { PortfolioTemplateProps } from '@/editor/components/editor/layout/portfolio-template-shell'
import { cn } from '@/lib/utils'
import { getAspectRatioClass } from '@/editor/lib/aspect-ratios'
import { getFrameStyle } from '@/editor/lib/frame-styles'
import Image, { type ImageLoader } from 'next/image'

const passthroughLoader: ImageLoader = ({ src }) => src

interface MinimalFeaturedWorkProps
  extends Pick<PortfolioTemplateProps, 'theme' | 'sectionContent'> {}

export function MinimalFeaturedWork({ theme, sectionContent }: MinimalFeaturedWorkProps) {
  return (
    <motion.section
      id="work"
      data-section-id="featured-work"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-100px' }}
      transition={{ duration: 0.8 }}
      className={cn('@container', theme.background, theme.foreground)}
    >
      <div className="@lg:px-20 @md:px-12 px-6 @lg:py-32 @md:py-24 py-16">
        <div className="max-w-6xl mx-auto space-y-16">
          <div className="text-center space-y-3">
            <p className={cn('text-xs uppercase opacity-40', theme.letterSpacing)}>
              {sectionContent.featuredWork.subtitle || 'Portfolio'}
            </p>
            <h3
              className={cn(
                '@lg:text-6xl @md:text-5xl text-4xl font-light',
                theme.fontTitle,
              )}
            >
              {sectionContent.featuredWork.title}
            </h3>
          </div>

          <div className="space-y-24">
            {(sectionContent.featuredWork.projects ?? []).map((project, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.6, delay: i * 0.15 }}
                className="grid @lg:grid-cols-2 grid-cols-1 gap-12 items-center"
              >
                {i % 2 === 0 ? (
                  <>
                    <div
                      className={cn(
                        'relative overflow-hidden',
                        getAspectRatioClass(project.aspectRatio),
                      )}
                    >
                      <Image
                        loader={passthroughLoader}
                        unoptimized
                        src={project.image || '/placeholder.svg?height=600&width=800'}
                        alt={project.title || 'Project image'}
                        fill
                        sizes="(max-width: 768px) 100vw, 50vw"
                        className={cn(
                          'object-cover hover:scale-105 transition-transform duration-700',
                          theme.shadow,
                          getFrameStyle(project.frameStyle || 'soft'),
                        )}
                      />
                    </div>
                    <div className="space-y-6">
                      <h4
                        className={cn(
                          '@lg:text-4xl @md:text-3xl text-2xl font-light',
                          theme.fontTitle,
                        )}
                      >
                        {project.title}
                      </h4>
                      <p
                        className={cn(
                          '@md:text-base text-sm opacity-60 font-light',
                          theme.lineHeight,
                          theme.fontBody,
                        )}
                      >
                        {project.description}
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {project.tags?.map((tag, idx) => (
                          <span
                            key={idx}
                            className={cn(
                              'px-3 py-1 text-xs border border-current/10 opacity-50',
                              theme.radiusMedium,
                              theme.letterSpacing,
                            )}
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="space-y-6 @lg:order-1 order-2">
                      <h4
                        className={cn(
                          '@lg:text-4xl @md:text-3xl text-2xl font-light',
                          theme.fontTitle,
                        )}
                      >
                        {project.title}
                      </h4>
                      <p
                        className={cn(
                          '@md:text-base text-sm opacity-60 font-light',
                          theme.lineHeight,
                          theme.fontBody,
                        )}
                      >
                        {project.description}
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {project.tags?.map((tag, idx) => (
                          <span
                            key={idx}
                            className={cn(
                              'px-3 py-1 text-xs border border-current/10 opacity-50',
                              theme.radiusMedium,
                              theme.letterSpacing,
                            )}
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div
                      className={cn(
                        'relative overflow-hidden @lg:order-2 order-1',
                        getAspectRatioClass(project.aspectRatio),
                      )}
                    >
                      <Image
                        loader={passthroughLoader}
                        unoptimized
                        src={project.image || '/placeholder.svg?height=600&width=800'}
                        alt={project.title || 'Project image'}
                        fill
                        sizes="(max-width: 768px) 100vw, 50vw"
                        className={cn(
                          'object-cover hover:scale-105 transition-transform duration-700',
                          theme.shadow,
                          getFrameStyle(project.frameStyle || 'soft'),
                        )}
                      />
                    </div>
                  </>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </motion.section>
  )
}
