'use client'

import type { PortfolioTemplateProps } from '@/editor/lib/template-types'
import { cn } from '@/lib/utils'
import { SlotImage } from '@/editor/image'
import { SectionWrapper } from '@/editor/components/templates/primitives/section-wrapper'
import { Animate } from '@/editor/components/templates/primitives/animate'

type MinimalHeroProps = Pick<PortfolioTemplateProps, 'theme' | 'sectionContent' | 'imageContent'> 

export function MinimalHero({ theme, sectionContent, imageContent }: MinimalHeroProps) {
  const heroImage = imageContent?.hero
  return (
    <SectionWrapper
      id="hero"
      themeForeground={theme.foreground}
    >
      <div className="max-w-6xl mx-auto px-6 @md:px-10 @lg:px-16 py-16 @md:pt-24">
        <Animate trigger="mount" direction="none" className="w-full h-px bg-current opacity-10 mb-12 origin-left" />

        <div className={cn(heroImage ? 'grid @md:grid-cols-2 grid-cols-1 gap-16 @lg:gap-24 items-start' : 'max-w-3xl')}>
          <div className="space-y-10">
            <Animate direction="left" distance={12} delay={0.1} className="flex items-center gap-4">
              <span className={cn('text-[9px] uppercase tracking-[0.4em] opacity-30', theme.letterSpacing, theme.fontBody)}>
                {sectionContent.hero.subtitle || 'Portfolio'}
              </span>
              <div className="h-px w-8 bg-current opacity-20" />
            </Animate>

            <Animate direction="up" distance={20} delay={0.2}>
              <h1
                className={cn(
                  '@lg:text-[5.5rem] @md:text-6xl text-5xl font-extralight leading-[0.92] tracking-tight',
                  theme.fontTitle,
                )}
              >
                {sectionContent.hero.title}
              </h1>
            </Animate>

            <Animate direction="up" distance={14} delay={0.35}>
              <p className={cn('@md:text-base text-sm opacity-45 font-light leading-relaxed max-w-sm', theme.fontBody)}>
                {sectionContent.hero.description}
              </p>
            </Animate>

            <Animate direction="none" delay={0.5}>
              <div className="flex items-center justify-between pt-8 border-t border-current/10">
                <span className={cn('text-[9px] uppercase tracking-[0.35em] opacity-25', theme.fontBody)}>
                  {sectionContent.hero.subtitle}
                </span>
              </div>
            </Animate>
          </div>

          {heroImage && (
            <Animate direction="up" distance={20} delay={0.3} scaleOffset={0.98}>
              <SlotImage
                slotId={heroImage.slotId}
                value={heroImage.value}
                templateId="minimal"
                alt={sectionContent.hero.title}
                priority
              />
            </Animate>
          )}
        </div>
      </div>
    </SectionWrapper>
  )
}

