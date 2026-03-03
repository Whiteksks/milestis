'use client'

import { motion } from 'framer-motion'
import type { PortfolioTemplateProps } from '@/editor/lib/template-types'
import { cn } from '@/lib/utils'

interface ShowcaseVideoProps extends Pick<PortfolioTemplateProps, 'theme' | 'sectionContent'> {}

export function ShowcaseVideo({ theme, sectionContent }: ShowcaseVideoProps) {
  return (
    <motion.section
      id="video"
      data-section-id="video"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.8 }}
      className={cn('@container', theme.foreground)}
    >
      <div className="max-w-7xl mx-auto @lg:px-20 @md:px-12 px-6 @lg:py-28 @md:py-20 py-16">
        {/* Header row */}
        <div className="flex items-end justify-between gap-8 mb-10">
          <div>
            <p
              className={cn(
                'text-[10px] uppercase tracking-[0.3em] opacity-35 mb-3',
                theme.fontBody,
              )}
            >
              {sectionContent.video.subtitle || 'Showreel'}
            </p>
            <h2
              className={cn(
                'font-black uppercase leading-none tracking-tighter',
                '@lg:text-6xl @md:text-5xl text-4xl',
                theme.fontTitle,
              )}
            >
              {sectionContent.video.title}
            </h2>
          </div>
          {sectionContent.video.description && (
            <p
              className={cn(
                'hidden @md:block max-w-xs text-xs opacity-45 leading-relaxed font-light text-right',
                theme.fontBody,
              )}
            >
              {sectionContent.video.description}
            </p>
          )}
        </div>

        {/* Mobile description */}
        {sectionContent.video.description && (
          <p
            className={cn(
              '@md:hidden text-xs opacity-45 leading-relaxed font-light mb-8',
              theme.fontBody,
            )}
          >
            {sectionContent.video.description}
          </p>
        )}

        {/* Video — cinematic aspect ratio, no border-radius */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="relative aspect-video w-full overflow-hidden bg-current/5"
        >
          {sectionContent.video.videoUrl ? (
            <iframe
              src={sectionContent.video.videoUrl}
              className="absolute inset-0 w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          ) : (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
              {/* Decorative play button placeholder */}
              <div className="w-16 h-16 rounded-full border border-current/20 flex items-center justify-center">
                <div
                  className="w-0 h-0 ml-1 opacity-20"
                  style={{
                    borderTop: '8px solid transparent',
                    borderBottom: '8px solid transparent',
                    borderLeft: '14px solid currentColor',
                  }}
                />
              </div>
              <span className={cn('text-[10px] uppercase tracking-[0.3em] opacity-20', theme.fontBody)}>
                Video Placeholder
              </span>
            </div>
          )}
        </motion.div>
      </div>

      {/* Bottom separator */}
      <div className="max-w-7xl mx-auto @lg:px-20 @md:px-12 px-6">
        <div className="h-px w-full bg-current opacity-[0.07]" />
      </div>
    </motion.section>
  )
}
