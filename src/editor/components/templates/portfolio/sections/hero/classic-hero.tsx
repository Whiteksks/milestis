'use client'

import { motion } from 'framer-motion'
import type { PortfolioTemplateProps } from '@/editor/components/editor/ui/portfolio-template-shell'
import { cn } from '@/lib/utils'

interface ClassicHeroProps extends Pick<PortfolioTemplateProps, 'theme' | 'sectionContent'> {}

export function ClassicHero({ theme, sectionContent }: ClassicHeroProps) {
  return (
    <motion.section
      id="hero"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-100px' }}
      transition={{ duration: 0.8 }}
      className="@container"
    >
      <div className="@lg:px-12 @md:px-8 px-4 @lg:py-24 @md:py-16 py-12 text-center">
        <h2
          className={cn(
            '@lg:text-6xl @md:text-5xl text-4xl font-bold mb-4',
            theme.fontTitle,
          )}
        >
          {sectionContent.hero.title}
        </h2>
        <p className="@lg:text-xl @md:text-lg text-base opacity-70 max-w-2xl mx-auto mb-6">
          {sectionContent.hero.subtitle}
        </p>
        <p className="@md:text-base text-sm opacity-60 max-w-xl mx-auto">
          {sectionContent.hero.description}
        </p>
      </div>
    </motion.section>
  )
}
