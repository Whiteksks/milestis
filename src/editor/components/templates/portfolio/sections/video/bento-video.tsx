'use client'

import type { PortfolioTemplateProps } from '@/editor/lib/template-types'
import { cn } from '@/lib/utils'

import { SectionWrapper } from '../../../primitives/section-wrapper'
import { Animate } from '../../../primitives/animate'

type BentoVideoProps = Pick<PortfolioTemplateProps, 'theme' | 'sectionContent'> 

export function BentoVideo({ theme, sectionContent }: BentoVideoProps) {
  const hasVideo = !!sectionContent.video.videoUrl

  return (
    <SectionWrapper
      id="video"
      themeForeground={theme.foreground}
      className="@lg:px-6 @md:px-5 px-4 py-3"
    >
      <div className="max-w-6xl mx-auto w-full">

        {/*   Cinematic video card   */}
        <Animate
          delay={0}
          direction="up"
          distance={16}
          className={cn(
            'relative rounded-3xl border border-current/8 overflow-hidden',
            theme.card,
          )}
        >
          {/* Video / placeholder */}
          <div className="relative aspect-video bg-current/5">
            {hasVideo ? (
              <iframe
                src={sectionContent.video.videoUrl}
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center gap-3">
                {/* Play icon */}
                <div className="w-14 h-14 rounded-full border border-current/20 flex items-center justify-center opacity-30">
                  <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 translate-x-0.5">
                    <polygon points="5,3 19,12 5,21" />
                  </svg>
                </div>
                <span className={cn('text-[10px] uppercase tracking-widest opacity-20', theme.fontBody)}>
                  {sectionContent.video.subtitle || ''}
                </span>
              </div>
            )}
          </div>

          {/* Caption bar */}
          <div className="px-6 py-4 flex items-baseline justify-between gap-6 border-t border-current/8">
            <div>
              <p className={cn('text-[10px] uppercase tracking-widest opacity-35 mb-0.5', theme.fontBody)}>
                {sectionContent.video.subtitle || 'Showreel'}
              </p>
              <h3 className={cn('@lg:text-lg text-base font-semibold', theme.fontTitle)}>
                {sectionContent.video.title}
              </h3>
            </div>
            {sectionContent.video.description && (
              <p className={cn('text-xs opacity-40 max-w-xs text-right hidden @md:block', theme.fontBody)}>
                {sectionContent.video.description}
              </p>
            )}
          </div>

        </Animate>
      </div>
    </SectionWrapper>
  )
}
