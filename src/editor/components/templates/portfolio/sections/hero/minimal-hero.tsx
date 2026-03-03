'use client'

import { motion } from 'framer-motion'
import type { PortfolioTemplateProps } from '@/editor/lib/template-types'
import { cn } from '@/lib/utils'
import { CroppedImage } from '@/editor/components/editor/section-settings/ui/cropped-image'

interface MinimalHeroProps extends Pick<PortfolioTemplateProps, 'theme' | 'sectionContent'> {}

export function MinimalHero({ theme, sectionContent }: MinimalHeroProps) {
  const heroImage = sectionContent.hero.image
  return (
    <section
      id="hero"
      data-section-id="hero"
      className={cn('@container', theme.foreground)}
    >
      <div className="max-w-6xl mx-auto px-6 @md:px-10 @lg:px-16 py-16 @md:pt-24">
        {/* Top hairline */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="w-full h-px bg-current opacity-10 mb-12 origin-left"
        />

        <div className={cn(heroImage ? 'grid @md:grid-cols-2 grid-cols-1 gap-16 @lg:gap-24 items-start' : 'max-w-3xl')}>
          <div className="space-y-10">
            {/* Section label */}
            <motion.div
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="flex items-center gap-4"
            >
              <span className={cn('text-[9px] uppercase tracking-[0.4em] opacity-30', theme.letterSpacing, theme.fontBody)}>
                {sectionContent.hero.subtitle || 'Portfolio'}
              </span>
              <div className="h-px w-8 bg-current opacity-20" />
            </motion.div>

            {/* Title */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.75, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className={cn(
                '@lg:text-[5.5rem] @md:text-6xl text-5xl font-extralight leading-[0.92] tracking-tight',
                theme.fontTitle,
              )}
            >
              {sectionContent.hero.title}
            </motion.h1>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, delay: 0.35 }}
              className={cn('@md:text-base text-sm opacity-45 font-light leading-relaxed max-w-sm', theme.fontBody)}
            >
              {sectionContent.hero.description}
            </motion.p>

            {/* Bottom rule + index */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="flex items-center justify-between pt-8 border-t border-current/10"
            >
              <span className={cn('text-[9px] uppercase tracking-[0.35em] opacity-25', theme.fontBody)}>Scroll to explore</span>
              <span className={cn('text-[9px] tabular-nums opacity-20', theme.fontBody)}>01</span>
            </motion.div>
          </div>

          {heroImage && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            >
              <CroppedImage
                src={heroImage}
                alt={sectionContent.hero.title}
                aspectRatio={sectionContent.hero.aspectRatio || 'portrait'}
                frameStyle={sectionContent.hero.frameStyle || 'none'}
                cropData={sectionContent.hero.cropData}
                priority
              />
            </motion.div>
          )}
        </div>
      </div>
    </section>
  )
}
