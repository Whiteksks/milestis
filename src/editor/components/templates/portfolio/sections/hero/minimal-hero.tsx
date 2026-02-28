'use client'

import { motion } from 'framer-motion'
import type { PortfolioTemplateProps } from '@/editor/components/editor/layout/portfolio-template-shell'
import { cn } from '@/lib/utils'
import { getAspectRatioClass } from '@/editor/lib/aspect-ratios'
import { getFrameStyle } from '@/editor/lib/frame-styles'
import Image, { type ImageLoader } from 'next/image'

const passthroughLoader: ImageLoader = ({ src }) => src

interface MinimalHeroProps extends Pick<PortfolioTemplateProps, 'theme' | 'sectionContent'> {}

export function MinimalHero({ theme, sectionContent }: MinimalHeroProps) {
  const heroImage = sectionContent.hero.image
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
        <div
          className={cn(
            heroImage ? 'grid @md:grid-cols-2 grid-cols-1 gap-16 items-center' : '',
          )}
        >
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

          {heroImage && (
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.9, delay: 0.3 }}
            >
              <div
                className={cn(
                  'relative w-full overflow-hidden',
                  getAspectRatioClass(sectionContent.hero.imageAspectRatio || 'portrait'),
                  theme.shadow,
                  getFrameStyle(sectionContent.hero.imageFrameStyle || 'soft'),
                )}
              >
                <Image
                  loader={passthroughLoader}
                  unoptimized
                  src={heroImage}
                  alt={sectionContent.hero.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover"
                />
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </motion.section>
  )
}
