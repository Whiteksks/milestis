'use client'

import { motion } from 'framer-motion'
import type { PortfolioTemplateProps } from '@/editor/lib/template-types'
import { cn } from '@/lib/utils'
import { SiteImage } from '@/editor/components/editor/section-settings/ui/site-image'

interface MinimalBioProps extends Pick<PortfolioTemplateProps, 'theme' | 'sectionContent'> {}

export function MinimalBio({ theme, sectionContent }: MinimalBioProps) {
  const { title, subtitle, description, image, aspectRatio, frameStyle, achievements, cropData } = sectionContent.bio
  return (
    <section
      id="bio"
      data-section-id="bio"
      className={cn('@container', theme.foreground)}
    >
      <div className="max-w-3xl mx-auto px-6 @md:px-10 py-20 @md:py-28">
        {/* Section header row */}
        <div className="flex items-center justify-between mb-16 border-t border-current/10 pt-8">
          <motion.p
            initial={{ opacity: 0, x: -10 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className={cn('text-[9px] uppercase tracking-[0.4em] opacity-30', theme.letterSpacing, theme.fontBody)}
          >
            {subtitle || 'About'}
          </motion.p>

        </div>

        {/* Identity block — centered, stacked: photo → name → subtitle */}
        <div className="flex flex-col items-center text-center gap-5 mb-16">
          {image && (
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            >
              <SiteImage
                  unoptimized
                  src={image}
                  alt={title || 'Profile'}
                  aspectRatio={aspectRatio || 'portrait'}
                  frameStyle={frameStyle || 'none'}
                  cropData={cropData}
                  sizes="160px"
                  className="w-[160px]"
                  imageClassName="object-cover"
                />
            </motion.div>
          )}

          <div className="space-y-2">
            <motion.h2
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className={cn('@lg:text-5xl @md:text-4xl text-3xl font-extralight leading-none tracking-tight', theme.fontTitle)}
            >
              {title}
            </motion.h2>
            {subtitle && (
              <motion.p
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.15 }}
                className={cn('text-[9px] uppercase tracking-[0.5em] opacity-25', theme.fontBody)}
              >
                {subtitle}
              </motion.p>
            )}
          </div>
        </div>

        {/* Description block — centered container, left-aligned text */}
        <div className="max-w-xl mx-auto space-y-10">
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.65, delay: 0.1 }}
            className={cn('@md:text-base text-sm opacity-50 font-light leading-relaxed whitespace-pre-line', theme.lineHeight, theme.fontBody)}
          >
            {description}
          </motion.p>

          {achievements && achievements.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="pt-8 border-t border-current/10 space-y-5"
            >
              {achievements.map((item, i) => (
                <div key={i}>
                  <p className={cn('@md:text-sm text-xs font-light opacity-50 leading-relaxed', theme.fontBody)}>{item}</p>
                </div>
              ))}
            </motion.div>
          )}
        </div>
      </div>
    </section>
  )
}
