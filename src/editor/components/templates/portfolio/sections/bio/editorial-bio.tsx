'use client'

import { motion } from 'framer-motion'
import Image, { type ImageLoader } from 'next/image'
import type { PortfolioTemplateProps } from '@/editor/components/editor/layout/portfolio-template-shell'
import { cn } from '@/lib/utils'
import { getAspectRatioClass } from '@/editor/lib/aspect-ratios'
import { getFrameStyle } from '@/editor/lib/frame-styles'

const passthroughLoader: ImageLoader = ({ src }) => src

interface EditorialBioProps extends Pick<PortfolioTemplateProps, 'theme' | 'sectionContent'> {}

export function EditorialBio({ theme, sectionContent }: EditorialBioProps) {
  return (
    <motion.section
      id="bio"
      data-section-id="bio"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.8 }}
      className={cn('@container w-full', theme.foreground)}
    >
      <div className="max-w-7xl mx-auto @lg:px-20 @md:px-12 px-6 @lg:py-16 @md:py-14 py-10">
        
        {/* Верхняя линия и метка секции */}
        <div className="flex items-center gap-6 mb-12">
          <span className={cn('text-[10px] uppercase tracking-[0.2em] opacity-40', theme.fontBody)}>
            {sectionContent.bio.subtitle || 'Profile'}
          </span>
          <div className="flex-1 h-px bg-current opacity-10" />
        </div>

        <div className="flex @md:flex-row flex-col gap-10 @lg:gap-16 items-start">
          
          {/* Контейнер для фото — теперь строго фиксирован */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="flex-shrink-0"
          >
            <div
              className={cn(
                'relative w-48 overflow-hidden bg-neutral-100',
                getAspectRatioClass(sectionContent.bio.imageAspectRatio || 'portrait'),
                theme.shadow,
                getFrameStyle(sectionContent.bio.imageFrameStyle || 'none'),
              )}
            >
              <Image
                loader={passthroughLoader}
                unoptimized
                src={sectionContent.bio.image || '/placeholder.svg?height=176&width=128'}
                alt={sectionContent.bio.title || 'Profile'}
                fill
                sizes="(max-width: 768px) 112px, 128px"
                className="object-cover grayscale hover:grayscale-0 transition-all duration-1000 ease-in-out"
              />
            </div>
          </motion.div>

          {/* Контентная часть */}
          <div className="flex-1 min-w-0">
            <h3
              className={cn(
                'text-2xl @md:text-3xl @lg:text-4xl font-bold uppercase leading-tight mb-6',
                theme.fontTitle,
              )}
            >
              {sectionContent.bio.title}
            </h3>

            <div className="max-w-2xl space-y-8">
              <p
                className={cn(
                  'text-sm @md:text-base opacity-70 font-light whitespace-pre-line leading-relaxed',
                  theme.lineHeight,
                  theme.fontBody,
                )}
              >
                {sectionContent.bio.description}
              </p>

              {/* Список достижений / Selected Works */}
              {sectionContent.bio.achievements && sectionContent.bio.achievements.length > 0 && (
                <div className="pt-8 border-t border-current/10">
                  <p className={cn('text-[10px] uppercase tracking-widest opacity-30 mb-6', theme.fontBody)}>
                    Selected Achievements
                  </p>
                  <div className="grid @sm:grid-cols-2 grid-cols-1 gap-x-12 gap-y-4">
                    {sectionContent.bio.achievements.map((achievement, i) => (
                      <div key={i} className="group flex items-start gap-4">
                        <span className={cn('text-[9px] mt-1 font-medium opacity-30 group-hover:opacity-100 transition-opacity', theme.fontBody)}>
                          {String(i + 1).padStart(2, '0')}
                        </span>
                        <p className={cn('text-xs opacity-60 leading-snug', theme.fontBody)}>
                          {achievement}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Финальная разделительная линия */}
      <div className="max-w-7xl mx-auto @lg:px-20 @md:px-12 px-6">
        <div className="w-full h-px bg-current opacity-5" />
      </div>
    </motion.section>
  )
}