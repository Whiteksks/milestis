'use client'

import { motion } from 'framer-motion'
import type { PortfolioTemplateProps } from '@/editor/components/editor/layout/portfolio-template-shell'
import { cn } from '@/lib/utils'
import { getAspectRatioClass } from '@/editor/lib/aspect-ratios'
import { getFrameStyle } from '@/editor/lib/frame-styles'
import Image, { type ImageLoader } from 'next/image'

const passthroughLoader: ImageLoader = ({ src }) => src

interface ClassicFeaturedWorkProps extends Pick<PortfolioTemplateProps, 'theme' | 'sectionContent'> {}

export function ClassicFeaturedWork({ theme, sectionContent }: ClassicFeaturedWorkProps) {
  return (
    <motion.section
      id="work"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-100px' }}
      transition={{ duration: 0.8, delay: 0.2 }}
      className="@container"
    >
      <div className="@lg:px-12 @md:px-8 px-4 @lg:py-20 @md:py-16 py-12">
        {sectionContent.featuredWork.subtitle && (
          <p className={cn('text-sm font-medium uppercase tracking-wider text-center mb-2 opacity-60', theme.fontTitle)}>
            {sectionContent.featuredWork.subtitle}
          </p>
        )}
        <h3
          className={cn(
            '@lg:text-4xl @md:text-3xl text-2xl font-bold text-center mb-12',
            theme.fontTitle,
          )}
        >
          {sectionContent.featuredWork.title}
        </h3>
        <div className="grid @lg:grid-cols-3 @md:grid-cols-2 grid-cols-1 gap-8">
          {(sectionContent.featuredWork.projects ?? []).map((project, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              className="group"
            >
              <div
                className={cn(
                  'relative overflow-hidden mb-4',
                  theme.muted,
                  getAspectRatioClass(project.aspectRatio),
                  getFrameStyle(project.frameStyle || 'soft'),
                )}
              >
                <Image
                  loader={passthroughLoader}
                  unoptimized
                  src={project.image || '/placeholder.svg?height=500&width=700'}
                  alt={project.title || 'Project image'}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <h4
                className={cn(
                  '@md:text-xl text-lg font-semibold mb-2',
                  theme.fontTitle,
                )}
              >
                {project.title}
              </h4>
              <p className="text-sm opacity-60 mb-3">{project.description}</p>
              {project.tags && project.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {project.tags.map((tag, j) => (
                    <span
                      key={j}
                      className={cn(
                        'text-xs px-2 py-1',
                        theme.muted,
                        theme.mutedText,
                        theme.radiusMedium,
                      )}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </motion.section>
  )
}
