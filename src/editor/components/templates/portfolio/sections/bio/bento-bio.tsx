'use client'

import { motion } from 'framer-motion'
import Image, { type ImageLoader } from 'next/image'
import type { PortfolioTemplateProps } from '@/editor/lib/template-types'
import { cn } from '@/lib/utils'
import { getFrameStyle } from '@/editor/lib/frame-styles'

const passthroughLoader: ImageLoader = ({ src }) => src

interface BentoBioProps extends Pick<PortfolioTemplateProps, 'theme' | 'sectionContent'> {}

export function BentoBio({ theme, sectionContent }: BentoBioProps) {
  const achievements = sectionContent.bio.achievements ?? []

  return (
    <motion.section
      id="bio"
      data-section-id="bio"
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.6 }}
      className={cn('@container', theme.foreground)}
    >
      <div className="@lg:px-6 @md:px-5 px-4 py-3">
        <div className="max-w-6xl mx-auto">

          <div className="grid @lg:grid-cols-12 @md:grid-cols-6 grid-cols-1 gap-3">

            {/* [A] Photo card — tall, 4/12 */}
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className={cn(
                '@lg:col-span-4 @md:col-span-2 col-span-1',
                'relative rounded-3xl border border-current/8 overflow-hidden min-h-[44vh]',
                theme.card,
              )}
            >
              <Image
                loader={passthroughLoader}
                unoptimized
                src={sectionContent.bio.image || '/placeholder.svg?height=480&width=360'}
                alt={sectionContent.bio.title || 'Profile'}
                fill
                sizes="(max-width: 768px) 100vw, 33vw"
                className={cn(
                  'object-cover transition-transform duration-700 hover:scale-[1.03]',
                  getFrameStyle(sectionContent.bio.frameStyle || 'none'),
                )}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent pointer-events-none" />
            </motion.div>

            {/* [B] Content column — 8/12 */}
            <div className="@lg:col-span-8 @md:col-span-4 col-span-1 flex flex-col gap-3">

              {/* [B1] Name + subtitle + description */}
              <motion.div
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.55, delay: 0.05 }}
                className={cn(
                  'rounded-3xl border border-current/8 overflow-hidden p-6 @lg:p-8 flex-1',
                  theme.card,
                )}
              >
                <p className={cn('text-[10px] uppercase tracking-widest opacity-40 mb-2', theme.fontBody)}>
                  {sectionContent.bio.subtitle || 'About'}
                </p>
                <h2 className={cn('@lg:text-3xl @md:text-2xl text-xl font-bold leading-tight mb-4', theme.fontTitle)}>
                  {sectionContent.bio.title}
                </h2>
                <p className={cn('text-sm opacity-60 leading-relaxed', theme.lineHeight, theme.fontBody)}>
                  {sectionContent.bio.description}
                </p>
              </motion.div>

              {/* [B2] Achievement chips */}
              {achievements.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.12 }}
                  className={cn(
                    'rounded-3xl border border-current/8 overflow-hidden p-5',
                    theme.card,
                  )}
                >
                  <p className={cn('text-[10px] uppercase tracking-widest opacity-35 mb-3', theme.fontBody)}>
                    Skills &amp; Expertise
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {achievements.map((item, i) => (
                      <motion.span
                        key={i}
                        initial={{ opacity: 0, scale: 0.88 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.35, delay: 0.15 + i * 0.04 }}
                        className={cn(
                          'px-3 py-1.5 text-[11px] rounded-full border border-current/12 opacity-65',
                          theme.fontBody,
                        )}
                      >
                        {item}
                      </motion.span>
                    ))}
                  </div>
                </motion.div>
              )}
            </div>

          </div>
        </div>
      </div>
    </motion.section>
  )
}
