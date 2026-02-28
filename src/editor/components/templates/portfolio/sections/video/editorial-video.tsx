'use client'

import { motion } from 'framer-motion'
import type { PortfolioTemplateProps } from '@/editor/components/editor/layout/portfolio-template-shell'
import { cn } from '@/lib/utils'

interface EditorialVideoProps extends Pick<PortfolioTemplateProps, 'theme' | 'sectionContent'> {}

export function EditorialVideo({ theme, sectionContent }: EditorialVideoProps) {
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
      <div className="@lg:px-20 @md:px-12 px-6 @lg:py-24 @md:py-20 py-14">
        <div className="max-w-7xl mx-auto space-y-14">

          {/* Section header — left-aligned editorial style */}
          <div className="flex items-center gap-6">
            <span
              className={cn(
                'text-[10px] uppercase opacity-30',
                theme.letterSpacing,
                theme.fontBody,
              )}
            >
              {sectionContent.video.subtitle || 'Showreel'}
            </span>
            <div className="flex-1 h-px bg-current opacity-10" />
          </div>

          <div className="space-y-6">
            <h3
              className={cn(
                '@lg:text-5xl @md:text-4xl text-3xl font-bold uppercase leading-tight tracking-tight',
                theme.fontTitle,
              )}
            >
              {sectionContent.video.title}
            </h3>

            {sectionContent.video.description && (
              <p
                className={cn(
                  '@md:text-sm text-xs opacity-50 font-light max-w-lg',
                  theme.lineHeight,
                  theme.fontBody,
                )}
              >
                {sectionContent.video.description}
              </p>
            )}
          </div>

          {/* Full-width video — no border radius, raw */}
          <div className="relative aspect-video overflow-hidden bg-current/5">
            {sectionContent.video.videoUrl ? (
              <iframe
                src={sectionContent.video.videoUrl}
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <span className={cn('text-xs uppercase opacity-20', theme.letterSpacing, theme.fontBody)}>
                  Video placeholder
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Bottom rule */}
      <div className="@lg:px-20 @md:px-12 px-6">
        <div className="max-w-7xl mx-auto border-t border-current/10" />
      </div>
    </motion.section>
  )
}
