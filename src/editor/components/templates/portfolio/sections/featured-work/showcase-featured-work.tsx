'use client'

import { motion } from 'framer-motion'
import Image, { type ImageLoader } from 'next/image'
import type { PortfolioTemplateProps } from '@/editor/lib/template-types'
import { cn } from '@/lib/utils'
import { getAspectRatioClass } from '@/editor/lib/aspect-ratios'
import { getFrameStyle } from '@/editor/lib/frame-styles'

const passthroughLoader: ImageLoader = ({ src }) => src

interface ShowcaseFeaturedWorkProps
  extends Pick<PortfolioTemplateProps, 'theme' | 'sectionContent'> {}

export function ShowcaseFeaturedWork({ theme, sectionContent }: ShowcaseFeaturedWorkProps) {
  const projects = sectionContent.featuredWork.projects ?? []
  const [featured, ...rest] = projects

  return (
    <motion.section
      id="work"
      data-section-id="featured-work"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.8 }}
      className={cn('@container w-full', theme.foreground)}
    >
      <div className="max-w-7xl mx-auto @lg:px-20 @md:px-12 px-6 @lg:py-28 @md:py-20 py-16">
        {/* Section header */}
        <div className="flex items-end justify-between mb-10 @md:mb-16 gap-6">
          <div>
            <p className={cn('text-[10px] uppercase tracking-[0.3em] opacity-35 mb-3', theme.fontBody)}>
              {sectionContent.featuredWork.subtitle || 'Selected Work'}
            </p>
            <h2
              className={cn(
                'font-black uppercase leading-none tracking-tighter',
                '@lg:text-6xl @md:text-5xl text-4xl',
                theme.fontTitle,
              )}
            >
              {sectionContent.featuredWork.title}
            </h2>
          </div>
          <span className={cn('text-[10px] opacity-25 shrink-0 mb-1', theme.fontBody)}>
            {String(projects.length).padStart(2, '0')} Projects
          </span>
        </div>

        {/* Featured project — full-width cinema card */}
        {featured && (
          <motion.article
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.8 }}
            className="group mb-6 @md:mb-8"
          >
            <div className="relative overflow-hidden aspect-video bg-current/5">
              {featured.image && (
                <Image
                  loader={passthroughLoader}
                  unoptimized
                  src={featured.image}
                  alt={featured.title}
                  fill
                  sizes="100vw"
                  className="object-cover scale-105 group-hover:scale-100 transition-transform duration-700 ease-out"
                />
              )}
              {/* Overlay gradient */}
              <div
                className="absolute inset-0 transition-opacity duration-500 group-hover:opacity-80"
                style={{
                  background:
                    'linear-gradient(to top, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.2) 50%, transparent 100%)',
                }}
              />
              {/* Text overlay */}
              <div className="absolute bottom-0 left-0 right-0 p-5 @md:p-10">
                <div className="flex items-end justify-between gap-3">
                  <div className="min-w-0">
                    <h3
                      className={cn(
                        'text-white font-black uppercase leading-none tracking-tighter',
                        '@lg:text-5xl @md:text-4xl text-2xl',
                        theme.fontTitle,
                      )}
                    >
                      {featured.title}
                    </h3>
                  </div>
                  <div className="hidden @md:flex flex-wrap gap-2 mb-1">
                    {(featured.tags ?? []).slice(0, 3).map((tag, i) => (
                      <span
                        key={i}
                        className={cn(
                          'text-[9px] uppercase tracking-wider px-2.5 py-1 border border-white/20 text-white/60',
                          theme.fontBody,
                        )}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
                <p
                  className={cn(
                    'mt-2 @md:mt-3 max-w-2xl text-white/55 text-xs @md:text-sm leading-relaxed font-light line-clamp-2 @md:line-clamp-3',
                    theme.fontBody,
                  )}
                >
                  {featured.description}
                </p>
              </div>
            </div>
          </motion.article>
        )}

        {/* Remaining projects — 2-column grid */}
        {rest.length > 0 && (
          <div className="grid @md:grid-cols-2 gap-6 @md:gap-8">
            {rest.map((project, i) => (
              <motion.article
                key={i + 1}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.7, delay: i * 0.1 }}
                className="group"
              >
                {/* Image */}
                <div
                  className={cn(
                    'relative overflow-hidden mb-5 bg-current/5',
                    getAspectRatioClass(project.aspectRatio || 'landscape'),
                    getFrameStyle(project.frameStyle || 'none'),
                  )}
                >
                  {project.image && (
                    <Image
                      loader={passthroughLoader}
                      unoptimized
                      src={project.image}
                      alt={project.title}
                      fill
                      sizes="(max-width: 768px) 100vw, 50vw"
                      className="object-cover scale-105 group-hover:scale-100 transition-transform duration-700 ease-out"
                    />
                  )}
                  {/* subtle hover tint */}
                  <div className="absolute inset-0 bg-current opacity-0 group-hover:opacity-5 transition-opacity duration-300" />
                </div>

                {/* Meta */}
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <h3
                      className={cn(
                        'text-base @md:text-xl font-black uppercase leading-tight line-clamp-2',
                        theme.fontTitle,
                      )}
                    >
                      {project.title}
                    </h3>
                    <p className={cn('mt-2 text-xs opacity-50 leading-snug line-clamp-2', theme.fontBody)}>
                      {project.description}
                    </p>
                  </div>
                  <div className="hidden @sm:flex flex-col gap-1.5 shrink-0">
                    {(project.tags ?? []).slice(0, 2).map((tag, idx) => (
                      <span
                        key={idx}
                        className={cn(
                          'text-[9px] uppercase tracking-wider px-2 py-0.5 border border-current/15 opacity-50',
                          theme.fontBody,
                        )}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
        )}
      </div>

      {/* Bottom separator */}
      <div className="max-w-7xl mx-auto @lg:px-20 @md:px-12 px-6">
        <div className="h-px w-full bg-current opacity-[0.07]" />
      </div>
    </motion.section>
  )
}
