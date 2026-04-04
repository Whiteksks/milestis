'use client'

import { motion } from 'framer-motion'
import type { PortfolioTemplateProps } from '@/editor/lib/template-types'
import { cn } from '@/lib/utils'
import { getAspectRatioClass } from '@/editor/lib/aspect-ratios'
import { getFrameStyle } from '@/editor/lib/frame-styles'
import { SiteImage } from '@/editor/components/editor/section-settings/ui/site-image'

interface ElegantFeaturedWorkProps
  extends Pick<PortfolioTemplateProps, 'theme' | 'sectionContent'> {}

export function ElegantFeaturedWork({ theme, sectionContent }: ElegantFeaturedWorkProps) {
  const projects = sectionContent.featuredWork.projects ?? []
  return (
    <section
      id="work"
      data-section-id="featured-work"
      className={cn('@container', theme.foreground)}
    >
      <div className="max-w-5xl mx-auto px-6 @md:px-10 @lg:px-16 py-24 @md:py-36">

        {/* Section heading — left-aligned, sparse */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="mb-24 @md:mb-32"
        >
          <p className={cn('text-[10px] uppercase tracking-[0.4em] opacity-30 mb-4', theme.fontBody)}>
            {sectionContent.featuredWork.subtitle || 'Selected Works'}
          </p>
          <h2 className={cn('@lg:text-7xl @md:text-6xl text-5xl font-thin tracking-tight leading-none', theme.fontTitle)}>
            {sectionContent.featuredWork.title}
          </h2>
        </motion.div>

        {/* Projects — full-width catalog layout */}
        <div className="space-y-32 @md:space-y-44">
          {projects.map((project, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            >
              {/* Full-width image */}
              {project.image && (
                <div className={cn(
                  'relative overflow-hidden w-full mb-8 group',
                  getAspectRatioClass(project.aspectRatio || 'landscape'),
                )}>
                  <SiteImage
                    fillParent
                    unoptimized
                    src={project.image}
                    alt={project.title || 'Project image'}
                    sizes="(max-width: 768px) 100vw, 80vw"
                    cropData={project.cropData}
                    imageClassName={cn(
                      'object-cover group-hover:scale-[1.02] transition-transform duration-1000 ease-out',
                      getFrameStyle(project.frameStyle || 'none'),
                    )}
                  />
                  {/* Ghost index — large typographic ornament */}
                  <span
                    aria-hidden
                    className={cn(
                      'absolute bottom-4 right-5 text-[6rem] @md:text-[9rem] font-thin leading-none opacity-[0.07] select-none pointer-events-none tabular-nums',
                      theme.fontTitle,
                    )}
                  >
                    {String(i + 1).padStart(2, '0')}
                  </span>
                </div>
              )}

              {/* Caption row — two columns: title left, meta right */}
              <div className="flex flex-col @md:flex-row @md:items-end justify-between gap-6">
                <div className="space-y-2 max-w-lg">
                  <h3 className={cn(
                    '@lg:text-4xl @md:text-3xl text-2xl font-extralight tracking-tight leading-none',
                    theme.fontTitle,
                  )}>
                    {project.title}
                  </h3>
                  <p className={cn('text-sm opacity-45 font-light leading-relaxed', theme.fontBody)}>
                    {project.description}
                  </p>
                </div>

                {/* Tags — right-aligned, stacked */}
                {(project.tags ?? []).length > 0 && (
                  <div className="flex flex-wrap @md:flex-col @md:items-end gap-2 @md:gap-1.5 shrink-0">
                    {(project.tags ?? []).slice(0, 4).map((tag, idx) => (
                      <span
                        key={idx}
                        className={cn('text-[9px] uppercase tracking-[0.3em] opacity-25', theme.fontBody)}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
