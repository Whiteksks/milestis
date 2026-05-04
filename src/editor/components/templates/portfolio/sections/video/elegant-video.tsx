'use client'

import type { PortfolioTemplateProps } from '@/editor/lib/template-types'
import { cn } from '@/lib/utils'
import { SectionWrapper } from '../../../primitives/section-wrapper'
import { Animate } from '../../../primitives/animate'

type ElegantVideoProps = Pick<PortfolioTemplateProps, 'theme' | 'sectionContent'> 

export function ElegantVideo({ theme, sectionContent }: ElegantVideoProps) {
  return (
    <SectionWrapper
      id="video"
      themeForeground={theme.foreground}
      className="@container"
    >
      <div className="max-w-6xl mx-auto px-6 @md:px-10 @lg:px-16 py-20 @md:py-28">
        <div className="space-y-14">
          {/* Heading */}
          <div className="text-center space-y-4">
            <Animate
              direction="up"
              distance={10}
              className={cn('text-[10px] uppercase tracking-[0.3em] opacity-35', theme.fontBody)}
            >
              <p>{sectionContent.video.subtitle || 'Watch'}</p>
            </Animate>
            <Animate
              direction="up"
              distance={16}
              delay={0.1}
            >
              <h2 className={cn('@lg:text-5xl @md:text-4xl text-3xl font-extralight tracking-tight', theme.fontTitle)}>
                {sectionContent.video.title}
              </h2>
            </Animate>
            {sectionContent.video.description && (
              <Animate
                direction="up"
                distance={10}
                delay={0.2}
                className={cn('@md:text-base text-sm font-light max-w-xl mx-auto opacity-55', theme.lineHeight, theme.fontBody)}
              >
                <p>{sectionContent.video.description}</p>
              </Animate>
            )}
          </div>

          {/* Video frame   thin ornamental border */}
          <Animate
            direction="up"
            distance={16}
            delay={0.15}
            className="relative aspect-video border border-current/10 overflow-hidden"
          >
            {sectionContent.video.videoUrl ? (
              <iframe
                src={sectionContent.video.videoUrl}
                className="absolute inset-0 w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            ) : (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
                <div className="w-12 h-12 border border-current/15 flex items-center justify-center">
                  <div style={{ width: 0, height: 0, borderTop: '6px solid transparent', borderBottom: '6px solid transparent', borderLeft: '11px solid currentColor', opacity: 0.2, marginLeft: 3 }} />
                </div>
                <p className={cn('text-[9px] uppercase tracking-[0.3em] opacity-20', theme.fontBody)}>Showreel</p>
              </div>
            )}
          </Animate>
        </div>
      </div>
    </SectionWrapper>
  )
}
 