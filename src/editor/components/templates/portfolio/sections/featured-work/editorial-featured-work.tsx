'use client'

import { motion } from 'framer-motion'
import Image, { type ImageLoader } from 'next/image'
import type { PortfolioTemplateProps } from '@/editor/components/editor/layout/portfolio-template-shell'
import { cn } from '@/lib/utils'
import { getAspectRatioClass } from '@/editor/lib/aspect-ratios'
import { getFrameStyle } from '@/editor/lib/frame-styles'

const passthroughLoader: ImageLoader = ({ src }) => src

interface EditorialFeaturedWorkProps
  extends Pick<PortfolioTemplateProps, 'theme' | 'sectionContent'> {}

export function EditorialFeaturedWork({ theme, sectionContent }: EditorialFeaturedWorkProps) {
  const projects = sectionContent.featuredWork.projects ?? []

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
      <div className="max-w-7xl mx-auto @lg:px-20 @md:px-12 px-6 @lg:py-24 @md:py-20 py-14">
        
        {/* Шапка секции */}
        <div className="flex flex-col @md:flex-row @md:items-end justify-between gap-6 mb-20">
          <div className="space-y-4">
            <span className={cn('text-[10px] uppercase tracking-[0.2em] opacity-40', theme.fontBody)}>
              {sectionContent.featuredWork.subtitle || 'Selected Projects'}
            </span>
            <h3 className={cn('text-3xl @md:text-4xl @lg:text-5xl font-bold uppercase tracking-tighter', theme.fontTitle)}>
              {sectionContent.featuredWork.title}
            </h3>
          </div>
          <div className="h-px flex-1 bg-current opacity-10 hidden @md:block mx-10 mb-4" />
          <span className={cn('text-[10px] opacity-40 mb-1', theme.fontBody)}>
            {projects.length} VOLUME — 2024
          </span>
        </div>

        {/* Список проектов */}
        <div className="space-y-32 @md:space-y-40">
          {projects.map((project, i) => {
            const isEven = i % 2 === 0
            return (
              <motion.article
                key={i}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-100px' }}
                transition={{ duration: 0.8, delay: i * 0.1 }}
                className="group"
              >
                <div className="grid grid-cols-1 @lg:grid-cols-12 gap-8 @lg:gap-16 items-center">
                  
                  {/* Контент (Текст) — Порядок меняется через order-last/first */}
                  <div className={cn(
                    '@lg:col-span-5 space-y-6',
                    isEven ? '@lg:order-first' : '@lg:order-last'
                  )}>
                    <div className="space-y-2">
                      <span className={cn('text-[10px] font-bold opacity-30', theme.fontBody)}>
                        {String(i + 1).padStart(2, '0')}
                      </span>
                      <h4 className={cn('text-2xl @md:text-3xl font-bold uppercase leading-none', theme.fontTitle)}>
                        {project.title}
                      </h4>
                    </div>
                    
                    <p className={cn('text-sm @md:text-base opacity-60 leading-relaxed font-light', theme.fontBody)}>
                      {project.description}
                    </p>

                    <div className="flex flex-wrap gap-2 pt-2">
                      {project.tags?.map((tag, idx) => (
                        <span key={idx} className={cn('text-[9px] uppercase tracking-wider px-2 py-1 border border-current/10 opacity-50', theme.fontBody)}>
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Изображение */}
                  <div className="@lg:col-span-7">
                    <motion.div 
                      whileHover={{ scale: 0.98 }}
                      transition={{ duration: 0.5 }}
                      className={cn(
                        'relative overflow-hidden bg-neutral-100',
                        getAspectRatioClass(project.aspectRatio || 'landscape'),
                        theme.shadow,
                        getFrameStyle(project.frameStyle || 'none'),
                      )}
                    >
                      <Image
                        loader={passthroughLoader}
                        unoptimized
                        src={project.image || '/placeholder.svg?height=600&width=1000'}
                        alt={project.title}
                        fill
                        className="object-cover grayscale-[0.5] group-hover:grayscale-0 transition-all duration-1000 ease-in-out scale-105 group-hover:scale-100"
                      />
                    </motion.div>
                  </div>

                </div>
              </motion.article>
            )
          })}
        </div>
      </div>

      {/* Линия внизу */}
      <div className="max-w-7xl mx-auto @lg:px-20 @md:px-12 px-6">
        <div className="w-full h-px bg-current opacity-10" />
      </div>
    </motion.section>
  )
}