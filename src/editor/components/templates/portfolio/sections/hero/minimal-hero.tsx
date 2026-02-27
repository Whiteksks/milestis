'use client'

import { motion } from 'framer-motion'
import type { PortfolioTemplateProps } from '@/editor/components/editor/layout/portfolio-template-shell'
import { cn } from '@/lib/utils'

interface MinimalHeroProps extends Pick<PortfolioTemplateProps, 'theme' | 'sectionContent'> {}

export function MinimalHero({ theme, sectionContent }: MinimalHeroProps) {
  return (
    <motion.section
      id="hero"
      data-section-id="hero"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-100px' }}
      transition={{ duration: 0.8 }}
      className={cn('@container', theme.foreground)}
    >
      <div className="@lg:px-20 @md:px-12 px-6 @lg:py-40 @md:py-32 py-24 max-w-6xl mx-auto">
        <div className="space-y-8">
          <p
            className={cn(
              '@md:text-sm text-xs uppercase opacity-40',
              theme.letterSpacing,
              theme.fontBody,
            )}
          >
            {sectionContent.hero.subtitle}
          </p>
          <h2
            className={cn(
              '@lg:text-7xl @md:text-5xl text-4xl font-extralight',
              theme.lineHeight,
              theme.fontTitle,
            )}
          >
            {sectionContent.hero.title}
          </h2>
          <p
            className={cn(
              '@lg:text-xl @md:text-lg text-base opacity-50 max-w-2xl font-light',
              theme.lineHeight,
              theme.fontBody,
            )}
          >
            {sectionContent.hero.description}
          </p>
        </div>
      </div>
    </motion.section>
  )
}
