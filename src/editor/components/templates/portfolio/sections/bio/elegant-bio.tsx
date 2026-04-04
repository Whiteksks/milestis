'use client'

import { motion } from 'framer-motion'
import type { PortfolioTemplateProps } from '@/editor/lib/template-types'
import { cn } from '@/lib/utils'
import { getFrameStyle } from '@/editor/lib/frame-styles'
import { SiteImage } from '@/editor/components/editor/section-settings/ui/site-image'

interface ElegantBioProps extends Pick<PortfolioTemplateProps, 'theme' | 'sectionContent'> {}
export function ElegantBio({ theme, sectionContent }: ElegantBioProps) {
  return (
    <section id="bio" data-section-id="bio" className={cn('@container', theme.foreground)}>
      <div className="max-w-5xl mx-auto px-6 @md:px-10 py-20 @md:py-32">
        
        <div className="flex flex-col @lg:flex-row items-start gap-12 @lg:gap-20">
          
          {/* Фото: остается компактным (240px), но плотно прижато к сетке */}
          <div className="shrink-0 @lg:sticky @lg:top-32">
            <div className={cn(
              'relative w-[180px] @md:w-[220px] @lg:w-[240px] aspect-[4/5] overflow-hidden shadow-sm', 
              getFrameStyle(sectionContent.bio.frameStyle || 'soft')
            )}>
              <SiteImage
                fillParent
                unoptimized
                src={sectionContent.bio.image || '/placeholder.svg?height=600&width=480'}
                alt={sectionContent.bio.title || 'Profile image'}
                sizes="(max-width: 768px) 100vw, 240px"
                cropData={sectionContent.bio.cropData}
                imageClassName="object-cover"
              />
            </div>
          </div>

          {/* Текст: теперь он "главный" */}
          <div className="flex-1 space-y-10">
            <div className="space-y-6">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="space-y-3"
              >
                <p className={cn('text-[10px] uppercase tracking-[0.4em] opacity-40', theme.fontBody)}>
                  {sectionContent.bio.subtitle || 'About the Artist'}
                </p>
                <h2 className={cn('text-3xl @md:text-4xl @lg:text-5xl font-extralight tracking-tight', theme.fontTitle)}>
                  {sectionContent.bio.title}
                </h2>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 0.8, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="max-w-2xl"
              >
                <p className={cn('text-base @md:text-lg font-light leading-relaxed whitespace-pre-line', theme.fontBody)}>
                  {sectionContent.bio.description}
                </p>
              </motion.div>
            </div>

            {/* Achievements: делаем их компактным списком внизу */}
            {(sectionContent.bio.achievements ?? []).length > 0 && (
              <div className="grid @sm:grid-cols-2 gap-x-8 gap-y-4 pt-4 border-t border-current/10">
                {(sectionContent.bio.achievements ?? []).map((achievement, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 0.6 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    className="flex items-baseline gap-3"
                  >
                    <span className="text-[10px] opacity-40">0{i + 1}</span>
                    <p className={cn('text-xs @md:text-sm font-light', theme.fontBody)}>{achievement}</p>
                  </motion.div>
                ))}
              </div>
            )}
          </div>

        </div>
      </div>
    </section>
  )
}