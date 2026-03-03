'use client'

import { motion } from 'framer-motion'
import type { PortfolioTemplateProps } from '@/editor/lib/template-types'
import { cn } from '@/lib/utils'

interface GridVideoProps extends Pick<PortfolioTemplateProps, 'theme' | 'sectionContent'> {}

export function GridVideo({ theme, sectionContent }: GridVideoProps) {
  const hasVideo = !!sectionContent.video.videoUrl

  return (
    <motion.section
      id="video"
      data-section-id="video"
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.6 }}
      className={cn('@container', theme.foreground)}
    >
      <div className="@lg:px-6 @md:px-5 px-4 py-3">
        <div className="max-w-6xl mx-auto space-y-3">

          {/* ── Cinematic video card ── */}
          <motion.div
            initial={{ opacity: 0, scale: 0.99 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.65 }}
            className={cn(
              'relative rounded-2xl border border-current/8 overflow-hidden',
              theme.card,
            )}
          >
            {/* Video embed with aspect-video */}
            <div className="relative aspect-video">
              {hasVideo ? (
                <iframe
                  src={sectionContent.video.videoUrl}
                  className="absolute inset-0 w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              ) : (
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-current/[0.03]">
                  <div className={cn(
                    'w-16 h-16 rounded-full border border-current/20 flex items-center justify-center opacity-30',
                  )}>
                    <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 translate-x-0.5">
                      <polygon points="5,3 19,12 5,21" />
                    </svg>
                  </div>
                  <span className={cn('text-[10px] uppercase tracking-widest opacity-20', theme.fontBody)}>
                    Showreel
                  </span>
                </div>
              )}
            </div>
          </motion.div>

          {/* ── Info row ── */}
          <div className={cn(
            'rounded-2xl border border-current/8 px-6 py-4',
            'grid @lg:grid-cols-[1fr,1fr,auto] @md:grid-cols-2 grid-cols-1 gap-4 items-start',
            theme.card,
          )}>
            <div>
              <p className={cn('text-[10px] uppercase tracking-widest opacity-35 mb-1', theme.fontBody)}>
                {sectionContent.video.subtitle || 'Showreel'}
              </p>
              <h3 className={cn('@lg:text-lg text-base font-semibold leading-snug', theme.fontTitle)}>
                {sectionContent.video.title}
              </h3>
            </div>
            {sectionContent.video.description && (
              <p className={cn('text-xs opacity-50 leading-relaxed', theme.fontBody)}>
                {sectionContent.video.description}
              </p>
            )}
            <span className={cn(
              'hidden @lg:block text-[10px] uppercase tracking-widest opacity-20 shrink-0 self-center',
              theme.fontBody,
            )}>
              16 : 9
            </span>
          </div>

        </div>
      </div>
    </motion.section>
  )
}
