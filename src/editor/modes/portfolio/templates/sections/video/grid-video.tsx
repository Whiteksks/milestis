'use client'

import type { PortfolioTemplateProps } from '@/editor/lib/template-types'
import { cn } from '@/lib/utils'
import { SectionWrapper } from '@/editor/components/templates/primitives/section-wrapper'
import { Animate } from '@/editor/components/templates/primitives/animate'

type GridVideoProps = Pick<PortfolioTemplateProps, 'theme' | 'sectionContent'> 

export function GridVideo({ theme, sectionContent }: GridVideoProps) {
  const hasVideo = !!sectionContent.video.videoUrl

  return (
    <SectionWrapper
      id="video"
      themeForeground={theme.foreground}
      className="@container"
    >
      <div className="@lg:px-6 @md:px-5 px-4 py-3">
        <div className="max-w-6xl mx-auto space-y-3">

          {/*   Cinematic video card   */}
          <Animate
            direction="up"
            distance={5}
            scaleOffset={0.99}
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
                    {sectionContent.video.subtitle || ''}
                  </span>
                </div>
              )}
            </div>
          </Animate>

          {/*   Info row   */}
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

          </div>

        </div>
      </div>
    </SectionWrapper>
  )
}

