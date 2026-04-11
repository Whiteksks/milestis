'use client'

import type { PortfolioTemplateProps } from '@/editor/lib/template-types'
import { cn } from '@/lib/utils'
import { SiteImage } from '@/editor/components/editor/section-settings/ui/site-image'
import { SectionWrapper } from '../../../primitives/section-wrapper'
import { Animate } from '../../../primitives/animate'

type MinimalBioProps = Pick<PortfolioTemplateProps, 'theme' | 'sectionContent'> 

export function MinimalBio({ theme, sectionContent }: MinimalBioProps) {
  const { title, subtitle, description, image, aspectRatio, frameStyle, achievements, cropData } = sectionContent.bio
  return (
    <SectionWrapper
      id="bio"
      themeForeground={theme.foreground}
      padded={false}
    >
      <div className="max-w-3xl mx-auto px-6 @md:px-10 py-20 @md:py-28">
        {/* Section header row */}
        <div className="flex items-center justify-between mb-16 border-t border-current/10 pt-8">
          <Animate
            direction="left"
            distance={10}
            as="p"
            className={cn('text-[9px] uppercase tracking-[0.4em] opacity-30', theme.letterSpacing, theme.fontBody)}
          >
            {subtitle || 'About'}
          </Animate>
        </div>

        {/* Identity block РІР‚вЂќ centered, stacked: photo РІвЂ вЂ™ name РІвЂ вЂ™ subtitle */}
        <div className="flex flex-col items-center text-center gap-5 mb-16">
          {image && (
            <Animate direction="none" scaleOffset={0.96} delay={0.1}>
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
            </Animate>
          )}

          <div className="space-y-2">
            <Animate
              direction="up"
              distance={10}
              delay={0.15}
              as="h2"
              className={cn('@lg:text-5xl @md:text-4xl text-3xl font-extralight leading-none tracking-tight', theme.fontTitle)}
            >
              {title}
            </Animate>
            {subtitle && (
              <Animate
                direction="none"
                delay={0.2}
                as="p"
                className={cn('text-[9px] uppercase tracking-[0.5em] opacity-25', theme.fontBody)}
              >
                {subtitle}
              </Animate>
            )}
          </div>
        </div>

        {/* Description block РІР‚вЂќ centered container, left-aligned text */}
        <div className="max-w-xl mx-auto space-y-10">
          <Animate
            direction="up"
            distance={12}
            delay={0.1}
            as="p"
            className={cn('@md:text-base text-sm opacity-50 font-light leading-relaxed whitespace-pre-line', theme.lineHeight, theme.fontBody)}
          >
            {description}
          </Animate>

          {achievements && achievements.length > 0 && (
            <Animate
              direction="up"
              distance={10}
              delay={0.2}
              className="pt-8 border-t border-current/10 space-y-5"
            >
              {achievements.map((item, i) => (
                <div key={i}>
                  <p className={cn('@md:text-sm text-xs font-light opacity-50 leading-relaxed', theme.fontBody)}>{item}</p>
                </div>
              ))}
            </Animate>
          )}
        </div>
      </div>
    </SectionWrapper>
  )
}
