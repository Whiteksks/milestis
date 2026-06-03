'use client'

import type { PortfolioTemplateProps } from '@/editor/lib/template-types'
import { cn } from '@/lib/utils'
import { SlotImage } from '@/editor/image'
import { SectionWrapper } from '@/editor/components/templates/primitives/section-wrapper'
import { Animate } from '@/editor/components/templates/primitives/animate'

type ElegantHeroProps = Pick<PortfolioTemplateProps, 'theme' | 'sectionContent' | 'imageContent'> 

export function ElegantHero({ theme, sectionContent, imageContent }: ElegantHeroProps) {
  const heroImage = imageContent?.hero
  
  return (
    <SectionWrapper
      id="hero"
      themeForeground={theme.foreground}
      className="@container pt-12 pb-16 @md:pb-24"
    >
      <div className="max-w-5xl mx-auto px-6 @md:px-10 @lg:px-16 text-center">
        <div className="space-y-10">
          <Animate
            delay={0}
            direction="up"
            distance={12}
            className={cn('text-[10px] uppercase tracking-[0.35em] opacity-35', theme.fontBody)}
          >
            <p>{sectionContent.hero.subtitle}</p>
          </Animate>

          <Animate
            direction="up"
            distance={22}
            delay={0.15}
          >
            <h1 className={cn('@lg:text-[5.5rem] @md:text-7xl text-5xl font-extralight tracking-tight leading-none', theme.fontTitle)}>
              {sectionContent.hero.title}
            </h1>
          </Animate>

          <Animate
            direction="up"
            delay={0.3}
          >
            <div className="w-16 h-px bg-current opacity-25 mx-auto origin-center" />
          </Animate>

          <Animate
            direction="up"
            distance={12}
            delay={0.4}
            className={cn('@lg:text-lg @md:text-base text-sm max-w-2xl mx-auto font-light opacity-60', theme.lineHeight, theme.fontBody)}
          >
            <p>{sectionContent.hero.description}</p>
          </Animate>

          {heroImage && (
            <Animate
              direction="up"
              distance={24}
              delay={0.55}
              className="pt-6"
            >
              <SlotImage
                slotId={heroImage.slotId}
                value={heroImage.value}
                templateId="elegant"
                alt={sectionContent.hero.title}
              />
            </Animate>
          )}
        </div>
      </div>
    </SectionWrapper>
  )
}

