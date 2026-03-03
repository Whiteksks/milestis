'use client'

import { motion } from 'framer-motion'
import Image, { type ImageLoader } from 'next/image'
import type { PortfolioTemplateProps } from '@/editor/lib/template-types'
import { cn } from '@/lib/utils'
import { getAspectRatioClass } from '@/editor/lib/aspect-ratios'
import { getFrameStyle } from '@/editor/lib/frame-styles'

const passthroughLoader: ImageLoader = ({ src }) => src

interface ShowcaseBioProps extends Pick<PortfolioTemplateProps, 'theme' | 'sectionContent'> {}

export function ShowcaseBio({ theme, sectionContent }: ShowcaseBioProps) {
  const { title, subtitle, description, image, aspectRatio, frameStyle, achievements } =
    sectionContent.bio

  return (
    <motion.section
      id="bio"
      data-section-id="bio"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.8 }}
      className={cn('@container relative w-full overflow-hidden', theme.foreground)}
    >
      <div className="relative max-w-7xl mx-auto @lg:px-20 @md:px-12 px-6 @lg:py-28 @md:py-20 py-16">
        {/* Section label */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="flex items-center gap-4 mb-14"
        >
          <span className={cn('text-[10px] uppercase tracking-[0.3em] opacity-35', theme.fontBody)}>
            {subtitle || 'About'}
          </span>
          <div className="w-12 h-px bg-current opacity-15" />
        </motion.div>

        {/* Main grid: image + content */}
        <div className="grid grid-cols-1 @lg:grid-cols-12 gap-10 @lg:gap-20 items-start">
          {/* Image */}
          {image && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="@lg:col-span-4 flex justify-start"
            >
              <div
                className={cn(
                  'relative overflow-hidden w-[58vw] max-w-[220px] @md:w-full @md:max-w-xs @lg:max-w-none',
                  getAspectRatioClass(aspectRatio || 'portrait'),
                  getFrameStyle(frameStyle || 'none'),
                  theme.shadow,
                )}
              >
                <Image
                  loader={passthroughLoader}
                  unoptimized
                  src={image}
                  alt={title || 'Profile'}
                  fill
                  sizes="(max-width: 768px) 58vw, 33vw"
                  className="object-cover"
                />
              </div>
            </motion.div>
          )}

          {/* Content */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className={cn(image ? '@lg:col-span-8' : '@lg:col-span-12', 'space-y-8')}
          >
            {/* Name / title */}
            <h2
              className={cn(
                'font-black uppercase leading-tight tracking-tighter',
                '@lg:text-6xl @md:text-5xl text-4xl',
                theme.fontTitle,
              )}
            >
              {title}
            </h2>

            {/* Description */}
            <p
              className={cn(
                'max-w-2xl text-sm @md:text-base opacity-60 font-light leading-relaxed whitespace-pre-line',
                theme.lineHeight,
                theme.fontBody,
              )}
            >
              {description}
            </p>

            {/* Achievements */}
            {achievements && achievements.length > 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="pt-6 border-t border-current/10"
              >
                <p
                  className={cn(
                    'text-[10px] uppercase tracking-widest opacity-30 mb-6',
                    theme.fontBody,
                  )}
                >
                  Highlights
                </p>
                <div className="grid @sm:grid-cols-2 grid-cols-1 gap-4">
                  {achievements.map((item, i) => (
                    <div key={i} className="flex items-start gap-3 group">
                      <span
                        className={cn(
                          'text-[9px] font-bold opacity-25 mt-0.5 shrink-0 group-hover:opacity-70 transition-opacity',
                          theme.fontBody,
                        )}
                      >
                        {String(i + 1).padStart(2, '0')}
                      </span>
                      <p
                        className={cn(
                          'text-xs opacity-55 leading-relaxed group-hover:opacity-80 transition-opacity',
                          theme.fontBody,
                        )}
                      >
                        {item}
                      </p>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </motion.div>
        </div>
      </div>

      {/* Bottom separator */}
      <div className="max-w-7xl mx-auto @lg:px-20 @md:px-12 px-6">
        <div className="h-px w-full bg-current opacity-[0.07]" />
      </div>
    </motion.section>
  )
}
