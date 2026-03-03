'use client'

import { motion } from 'framer-motion'
import Image, { type ImageLoader } from 'next/image'
import type { PortfolioTemplateProps } from '@/editor/lib/template-types'
import { cn } from '@/lib/utils'
import { getFrameStyle } from '@/editor/lib/frame-styles'
import { getAspectRatioClass } from '@/editor/lib/aspect-ratios'

const passthroughLoader: ImageLoader = ({ src }) => src

interface GridBioProps extends Pick<PortfolioTemplateProps, 'theme' | 'sectionContent'> {}

export function GridBio({ theme, sectionContent }: GridBioProps) {
  const achievements = sectionContent.bio.achievements ?? []

  return (
    <motion.section
      id="bio"
      data-section-id="bio"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}
      className={cn('py-6 @container', theme.foreground)}
    >
      <div className="max-w-7xl mx-auto px-4 @md:px-6 @lg:px-8">
        
        {/* Основная оболочка-карточка */}
        <div className={cn(
          'relative overflow-hidden rounded-[2rem] border border-current/10 p-6 @lg:p-12',
          theme.card // Используем системный фон карточки
        )}>
          
          {/* Декоративный элемент на фоне (опционально) */}
          <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/4 w-64 h-64 bg-current/5 blur-[80px] pointer-events-none" />

          <div className="grid grid-cols-1 @lg:grid-cols-12 gap-8 @lg:gap-16 items-center relative z-10">
            
            {/* [A] Левая колонка: Компактное фото */}
            <motion.div 
              className="@lg:col-span-4 flex justify-center @lg:justify-start"
              initial={{ scale: 0.95, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <div className={cn(
                'relative w-full max-w-[280px] @lg:max-w-none transition-transform duration-500 hover:rotate-2',
                getAspectRatioClass(sectionContent.bio.aspectRatio || 'portrait'),
              )}>
                <Image
                  loader={passthroughLoader}
                  unoptimized
                  src={sectionContent.bio.image || '/placeholder.svg?height=600&width=480'}
                  alt={sectionContent.bio.title || 'Profile'}
                  fill
                  className={cn(
                    'object-cover rounded-2xl',
                    getFrameStyle(sectionContent.bio.frameStyle || 'none'),
                  )}
                />
              </div>
            </motion.div>

            {/* [B] Правая колонка: Инфо */}
            <div className="@lg:col-span-8 flex flex-col">
              <div className="space-y-2 mb-6">
                <span className="text-[10px] uppercase tracking-[0.3em] opacity-40 font-medium">
                  {sectionContent.bio.subtitle || 'Personal Profile'}
                </span>
                <h2 className={cn(
                  'text-3xl @md:text-4xl @lg:text-5xl font-bold leading-tight',
                  theme.fontTitle
                )}>
                  {sectionContent.bio.title}
                </h2>
              </div>

              <p className={cn(
                'text-base @lg:text-lg opacity-70 leading-relaxed mb-10 max-w-2xl',
                theme.fontBody
              )}>
                {sectionContent.bio.description}
              </p>

              {/* Achievements как горизонтальный скролл или сетка */}
              {achievements.length > 0 && (
                <div className="grid grid-cols-1 @md:grid-cols-2 gap-4 pt-8 border-t border-current/5">
                  {achievements.map((item, i) => (
                    <div key={i} className="flex items-start gap-3 group">
                      <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-current opacity-30 group-hover:opacity-100 transition-opacity" />
                      <span className={cn('text-sm opacity-60 group-hover:opacity-90 transition-opacity', theme.fontBody)}>
                        {item}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>
        </div>
      </div>
    </motion.section>
  )
}