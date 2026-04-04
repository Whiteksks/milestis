'use client'

import { motion } from 'framer-motion'
import type { PortfolioTemplateProps } from '@/editor/lib/template-types'
import { cn } from '@/lib/utils'
import { SiteImage } from '@/editor/components/editor/section-settings/ui/site-image'

interface MinimalFeaturedWorkProps
  extends Pick<PortfolioTemplateProps, 'theme' | 'sectionContent'> {}

export function MinimalFeaturedWork({ theme, sectionContent }: MinimalFeaturedWorkProps) {
  const projects = sectionContent.featuredWork.projects ?? []
  return (
    <section
      id="work"
      data-section-id="featured-work"
      className={cn('@container', theme.foreground)}
    >
      <div className="max-w-6xl mx-auto px-6 @md:px-10 @lg:px-16 py-20 @md:py-28">

        {/* Section header — consistent with bio: label left, number right */}
        <div className="flex items-center justify-between mb-20 border-t border-current/10 pt-8">
          <motion.p
            initial={{ opacity: 0, x: -10 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className={cn('text-[9px] uppercase tracking-[0.4em] opacity-30', theme.letterSpacing, theme.fontBody)}
          >
            {sectionContent.featuredWork.subtitle || 'Selected Work'}
          </motion.p>
          <motion.span
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className={cn('text-[9px] tabular-nums opacity-20', theme.fontBody)}
          >
            03
          </motion.span>
        </div>

        {/* Project list — alternating editorial layout */}
        <div className="space-y-0">
          {projects.map((project, i) => (
            <div key={i} className="border-t border-current/10 last:border-b">
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                className={cn(
                  'flex flex-col @lg:flex-row gap-10 @lg:gap-16 py-12 @md:py-16',
                  i % 2 === 1 && '@lg:flex-row-reverse',
                )}
              >
                {/* Image — compact fixed width, hover scoped to image only */}
                {project.image && (
                  <div className="@lg:w-[42%] w-full shrink-0 group">
                    <SiteImage
                      unoptimized
                      src={project.image}
                      alt={project.title}
                      aspectRatio={project.aspectRatio || 'landscape'}
                      frameStyle={project.frameStyle || 'none'}
                      cropData={project.cropData}
                      sizes="(max-width: 768px) 100vw, 42vw"
                      imageClassName="object-cover group-hover:scale-[1.03] transition-transform duration-700 ease-out"
                    />
                  </div>
                )}

                {/* Content — 2/5 width, stacked vertically with generous spacing */}
                <div className="@lg:w-2/5 flex flex-col justify-between gap-8">
                  <div className="space-y-5">
                    {/* Index above title */}
                    <span className={cn('block text-[9px] tabular-nums opacity-20', theme.fontBody)}>
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <h3
                      className={cn(
                        '@lg:text-4xl @md:text-3xl text-2xl font-extralight leading-none tracking-tight',
                        theme.fontTitle,
                      )}
                    >
                      {project.title}
                    </h3>
                    <p className={cn('text-sm opacity-40 font-light leading-relaxed', theme.fontBody)}>
                      {project.description}
                    </p>
                  </div>

                  {/* Tags — bottom of content, kept secondary */}
                  {(project.tags ?? []).length > 0 && (
                    <div className="flex flex-wrap gap-x-4 gap-y-2">
                      {(project.tags ?? []).slice(0, 4).map((tag, idx) => (
                        <span
                          key={idx}
                          className={cn('text-[9px] uppercase tracking-[0.25em] opacity-25', theme.fontBody)}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </motion.div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
