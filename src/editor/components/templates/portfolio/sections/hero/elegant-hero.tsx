'use client'

import { motion } from 'framer-motion'
import type { PortfolioTemplateProps } from '@/editor/components/editor/layout/portfolio-template-shell'
import { cn } from '@/lib/utils'
import { getAspectRatioClass } from '@/editor/lib/aspect-ratios'
import { getFrameStyle } from '@/editor/lib/frame-styles'
import Image, { type ImageLoader } from 'next/image'

const passthroughLoader: ImageLoader = ({ src }) => src

interface ElegantHeroProps extends Pick<PortfolioTemplateProps, 'theme' | 'sectionContent'> {}

export function ElegantHero({ theme, sectionContent }: ElegantHeroProps) {
  const heroImage = sectionContent.hero.image
  return (
    <motion.section
      id="hero"
      data-section-id="hero"
      initial={{ opacity: 0, scale: 0.98 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 1, ease: 'easeOut' }}
      className={cn('@container', theme.foreground)}
    >
      <div className="@lg:px-16 @md:px-10 px-6 @lg:py-48 @md:py-36 py-24">
        <div className="max-w-5xl mx-auto text-center space-y-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 0.4, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <p
              className={cn(
                '@md:text-xs text-[10px] uppercase tracking-[0.3em]',
                theme.fontBody,
              )}
            >
              {sectionContent.hero.subtitle}
            </p>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className={cn(
              '@lg:text-[5.5rem] @md:text-7xl text-5xl tracking-tight',
              theme.fontTitle,
              theme.lineHeight,
            )}
          >
            {sectionContent.hero.title}
          </motion.h2>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="w-20 h-px bg-current/30 mx-auto"
          />

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 0.7, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className={cn(
              '@lg:text-lg @md:text-base text-sm max-w-2xl mx-auto',
              theme.lineHeight,
              theme.fontBody,
            )}
          >
            {sectionContent.hero.description}
          </motion.p>

          {heroImage && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 1.0 }}
              className="pt-4"
            >
              <div
                className={cn(
                  'relative w-full overflow-hidden',
                  getAspectRatioClass(sectionContent.hero.imageAspectRatio || 'landscape'),
                  getFrameStyle(sectionContent.hero.imageFrameStyle || 'gallery'),
                )}
              >
                <Image
                  loader={passthroughLoader}
                  unoptimized
                  src={heroImage}
                  alt={sectionContent.hero.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 80vw"
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
