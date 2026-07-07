'use client'

import type { PortfolioTemplateProps } from '@/editor/lib/template-types'
import { cn } from '@/lib/utils'
import { SlotImage } from '@/editor/image'

import { SectionWrapper } from '@/editor/components/templates/primitives/section-wrapper'
import { Animate } from '@/editor/components/templates/primitives/animate'

type BentoHeroProps = Pick<PortfolioTemplateProps, 'theme' | 'sectionContent' | 'imageContent'> 

export function BentoHero({ theme, sectionContent, imageContent }: BentoHeroProps) {
  const heroImage = imageContent?.hero
  const initials = sectionContent.hero.title
    ? sectionContent.hero.title
        .split(' ')
        .map((w: string) => w[0])
        .join('')
        .slice(0, 2)
        .toUpperCase()
    : '?'

  return (
    <SectionWrapper
      id="hero"
      themeForeground={theme.foreground}
      className="@lg:px-6 @md:px-5 px-4 pt-20 @md:pt-24 pb-4"
    >
      <div className="max-w-6xl mx-auto w-full">
        <div className="grid @lg:grid-cols-12 @md:grid-cols-6 grid-cols-1 gap-3">
          <Animate
            delay={0}
            direction="up"
            distance={24}
            className={cn(
              '@lg:col-span-7 @md:col-span-4 col-span-1',
              'relative rounded-3xl border border-current/8 overflow-hidden',
              'flex flex-col justify-between p-8 @lg:p-10 min-h-[52vh]',
              theme.card,
            )}
          >
            <span className={cn(
              'self-start inline-flex items-center px-3 py-1 text-[10px] uppercase tracking-widest',
              'rounded-full border border-current/12 opacity-45',
              theme.fontBody,
            )}>
              {sectionContent.hero.subtitle}
            </span>

            <h1 className={cn(
              '@lg:text-[5rem] @md:text-6xl text-5xl font-bold leading-[0.92] tracking-tight',
              theme.fontTitle,
            )}>
              {sectionContent.hero.title}
            </h1>

            <div className="flex items-end justify-between gap-4 flex-wrap">
              <p className={cn(
                'text-xs opacity-50 leading-relaxed max-w-xs',
                theme.lineHeight, theme.fontBody,
              )}>
                {sectionContent.hero.description}
              </p>

            </div>
          </Animate>

          <Animate
            delay={0.1}
            direction="up"
            distance={24}
            className={cn(
              '@lg:col-span-5 @md:col-span-2 col-span-1',
              'relative rounded-3xl border border-current/8 overflow-hidden min-h-[52vh] flex items-center justify-center',
              theme.card,
            )}
          >
            {heroImage ? (
              <>
                <SlotImage
                  slotId={heroImage.slotId}
                  value={heroImage.value}
                  templateId="bento"
                  alt={sectionContent.hero.title}
                  className="transition-transform duration-700 hover:scale-[1.03]"
                  priority
                />
                <div className="absolute inset-0 pointer-events-none" />
              </>
            ) : (
              <div className="w-full h-full flex items-center justify-center min-h-[54vh]">
                <span className={cn(
                  '@lg:text-8xl @md:text-6xl text-5xl font-bold opacity-[0.06] select-none',
                  theme.fontTitle,
                )}>
                  {initials}
                </span>
              </div>
            )}
          </Animate>

        </div>
      </div>
    </SectionWrapper>
  )
}


