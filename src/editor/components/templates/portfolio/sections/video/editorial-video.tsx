'use client'

import type { PortfolioTemplateProps } from '@/editor/lib/template-types'
import { cn } from '@/lib/utils'

import { SectionWrapper } from '../../../primitives/section-wrapper'
import { Animate } from '../../../primitives/animate'
import { EditorialLabel, EditorialTitle, EditorialParagraph } from '../../../primitives/portfolio/typography'
import { EditorialDivider } from '../../../primitives/portfolio/divider'

interface EditorialVideoProps extends Pick<PortfolioTemplateProps, 'theme' | 'sectionContent'> {}

export function EditorialVideo({ theme, sectionContent }: EditorialVideoProps) {
  return (
    <SectionWrapper id="video" themeForeground={theme.foreground} padded={false}>
      <div className="@lg:px-20 @md:px-12 px-6 @lg:py-24 @md:py-20 py-14">
        <div className="max-w-7xl mx-auto space-y-14">

          {/* Section header — left-aligned editorial style */}
          <EditorialLabel themeFont={theme.fontBody}>
            {sectionContent.video.subtitle || 'Showreel'}
          </EditorialLabel>

          <div className="space-y-6">
            <Animate direction="left" delay={0.1}>
              <EditorialTitle themeFont={theme.fontTitle} className="@lg:text-5xl @md:text-4xl text-3xl tracking-tight">
                {sectionContent.video.title}
              </EditorialTitle>
            </Animate>

            {sectionContent.video.description && (
              <Animate direction="up" delay={0.2}>
                <EditorialParagraph themeFont={theme.fontBody} themeLineHeight={theme.lineHeight} className="@md:text-sm text-xs opacity-50 max-w-lg">
                  {sectionContent.video.description}
                </EditorialParagraph>
              </Animate>
            )}
          </div>

          {/* Full-width video — no border radius, raw */}
          <Animate direction="up" delay={0.3} className="relative aspect-video overflow-hidden bg-current/5">
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
          </Animate>
        </div>
      </div>

      {/* Bottom rule */}
      <div className="max-w-7xl mx-auto w-full @lg:px-20 @md:px-12 px-6">
        <EditorialDivider />
      </div>
    </SectionWrapper>
  )
}

