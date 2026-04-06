'use client'

import type { PortfolioTemplateProps } from '@/editor/lib/template-types'
import { cn } from '@/lib/utils'
import { SiteImage } from '@/editor/components/editor/section-settings/ui/site-image'

import { SectionWrapper } from '../../primitives/section-wrapper'
import { FadeIn } from '../../primitives/fade-in'

interface GridHeroProps extends Pick<PortfolioTemplateProps, 'theme' | 'sectionContent'> {}

export function GridHero({ theme, sectionContent }: GridHeroProps) {
  const heroImage = sectionContent.hero.image
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
      padded={false}
      className="@container pt-20 @md:pt-24 pb-3"
    >
      <div className="max-w-7xl mx-auto px-4 @md:px-6 @lg:px-8 w-full">
        <FadeIn
          delay={0}
          direction="up"
          distance={30}
          className={cn(
            'relative rounded-2xl border border-current/8',
            'p-8 @lg:p-14 min-h-[72vh] flex items-center',
            theme.card,
          )}
        >
          <div className="grid grid-cols-1 @lg:grid-cols-12 gap-10 items-center w-full relative z-10">

            {/* [LEFT] Text */}
            <div className="@lg:col-span-6 space-y-8">
              <div className="space-y-5">
                <div className="flex items-center gap-3">
                  <div className="h-px w-5 bg-current opacity-25" />
                  <span className={cn('text-[10px] uppercase tracking-[0.3em] opacity-50', theme.fontBody)}>
                    {sectionContent.hero.subtitle}
                  </span>
                </div>

                <h1 className={cn(
                  'text-5xl @md:text-6xl @lg:text-7xl font-bold leading-[0.9] tracking-tight',
                  theme.fontTitle,
                )}>
                  {sectionContent.hero.title}
                </h1>

                <p className={cn(
                  'text-base opacity-50 leading-relaxed max-w-sm',
                  theme.fontBody,
                )}>
                  {sectionContent.hero.description}
                </p>
              </div>


            </div>

            {/* [RIGHT] Photo — large */}
            <div className="@lg:col-span-6 flex justify-center @lg:justify-end">
              <div className="w-full transition-transform duration-500 hover:-translate-y-1">
                {heroImage ? (
                  <SiteImage
                    src={heroImage}
                    alt={sectionContent.hero.title || 'Hero Image'}
                    aspectRatio={sectionContent.hero.aspectRatio || 'square'}
                    frameStyle={sectionContent.hero.frameStyle || 'none'}
                    cropData={sectionContent.hero.cropData}
                    priority
                  />
                ) : (
                  <div className={cn(
                    'relative w-full overflow-hidden rounded-2xl bg-current/[0.03]',
                    'aspect-square flex items-center justify-center',
                  )}>
                    <span className={cn('text-8xl font-bold opacity-[0.06] select-none', theme.fontTitle)}>
                      {initials}
                    </span>
                  </div>
                )}
              </div>
            </div>

          </div>
        </FadeIn>
      </div>
    </SectionWrapper>
  )
}
