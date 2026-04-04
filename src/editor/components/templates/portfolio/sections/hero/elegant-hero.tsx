'use client'

import { motion, MotionConfig, type Transition } from 'framer-motion'
import type { PortfolioTemplateProps } from '@/editor/lib/template-types'
import { cn } from '@/lib/utils'
import { SiteImage } from '@/editor/components/editor/section-settings/ui/site-image'

interface ElegantHeroProps extends Pick<PortfolioTemplateProps, 'theme' | 'sectionContent'> {
  disableAnimations?: boolean
}

export function ElegantHero({ theme, sectionContent, disableAnimations = false }: ElegantHeroProps) {
  const heroImage = sectionContent.hero.image
  const t = (duration: number, delay = 0, ease?: Transition['ease']): Transition =>
    disableAnimations ? { duration: 0, delay: 0 } : { duration, delay, ...(ease !== undefined ? { ease } : {}) }
  return (
    <MotionConfig reducedMotion={disableAnimations ? 'always' : 'user'}>
    <section
      id="hero"
      data-section-id="hero"
      className={cn('@container', theme.foreground)}
    >
      <div className="max-w-5xl mx-auto px-6 @md:px-10 @lg:px-16 pt-12 pb-16 @md:pb-24 text-center">
        <div className="space-y-10">
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 0.35, y: 0 }}
            viewport={{ once: true }}
            transition={t(0.8, 0, [0.16, 1, 0.3, 1])}
            className={cn('text-[10px] uppercase tracking-[0.35em]', theme.fontBody)}
          >
            {sectionContent.hero.subtitle}
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 22 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={t(0.9, 0.15, [0.16, 1, 0.3, 1])}
            className={cn('@lg:text-[5.5rem] @md:text-7xl text-5xl font-extralight tracking-tight leading-none', theme.fontTitle)}
          >
            {sectionContent.hero.title}
          </motion.h1>

          <motion.div
            initial={{ scaleX: 0, opacity: 0 }}
            whileInView={{ scaleX: 1, opacity: 1 }}
            viewport={{ once: true }}
            transition={t(0.6, 0.3)}
            className="w-16 h-px bg-current/25 mx-auto origin-center"
          />

          <motion.p
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 0.6, y: 0 }}
            viewport={{ once: true }}
            transition={t(0.8, 0.4, [0.16, 1, 0.3, 1])}
            className={cn('@lg:text-lg @md:text-base text-sm max-w-2xl mx-auto font-light', theme.lineHeight, theme.fontBody)}
          >
            {sectionContent.hero.description}
          </motion.p>

          {heroImage && (
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={t(1, 0.55, [0.16, 1, 0.3, 1])}
              className="pt-6"
            >
              <SiteImage
                src={heroImage}
                alt={sectionContent.hero.title}
                aspectRatio={sectionContent.hero.aspectRatio || 'landscape'}
                frameStyle={sectionContent.hero.frameStyle || 'none'}
                cropData={sectionContent.hero.cropData}
              />
            </motion.div>
          )}
        </div>
      </div>
    </section>
    </MotionConfig>
  )
}
