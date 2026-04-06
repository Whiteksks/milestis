'use client'

import type { PortfolioTemplateProps } from '@/editor/lib/template-types'
import { cn } from '@/lib/utils'
import { SiteImage } from '@/editor/components/editor/section-settings/ui/site-image'

import { SectionWrapper } from '../../primitives/section-wrapper'
import { FadeIn } from '../../primitives/fade-in'
import { EditorialDivider } from '../../primitives/divider'

interface EditorialHeroProps extends Pick<PortfolioTemplateProps, 'theme' | 'sectionContent'> {}

export function EditorialHero({ theme, sectionContent }: EditorialHeroProps) {
  const heroImage = sectionContent.hero.image
  const heroCropData = sectionContent.hero.cropData

  const descriptionBlock = (
    <div className="space-y-5 max-w-sm">
      <div className="w-10 h-px bg-current opacity-20" />
      <FadeIn
        direction="up"
        distance={16}
        delay={0.4}
        className={cn(
          'text-sm @md:text-base opacity-60 font-light leading-relaxed',
          theme.fontBody,
        )}
      >
        <p>{sectionContent.hero.description}</p>
      </FadeIn>
    </div>
  )

  return (
      <SectionWrapper
        id="hero"
        themeForeground={theme.foreground}
        padded={false} // Custom padding for hero
        className="min-h-[88vh] flex flex-col justify-center overflow-hidden"
      >
        {/* Main grid: 2 cols on desktop, stack on mobile */}
        <div className="flex-1 grid grid-cols-1 @md:grid-cols-2 items-stretch max-w-7xl mx-auto w-full">

          {/* LEFT: label + title + description (desktop only) */}
          <div className="relative z-20 flex flex-col @lg:pl-20 @md:pl-12 pl-6 pr-6 pt-24 @md:pt-32 pb-10 @md:pb-14 w-full">

            {/* Label row */}
            <div className="flex items-center gap-5 mb-10">
              <p className={cn('text-[10px] uppercase opacity-30', theme.letterSpacing, theme.fontBody)}>
                {sectionContent.hero.subtitle || 'Editorial'}
              </p>
              <div className="w-16 h-px bg-current opacity-10" />

            </div>

            {/* Title — overflows onto photo on desktop */}
            <FadeIn
              direction="left"
              distance={-30}
              delay={0.2}
            >
              <h1
                className={cn(
                  'uppercase tracking-tighter leading-[0.85]',
                  '@lg:text-[5rem] @md:text-6xl text-4xl',
                  heroImage ? '@lg:-mr-[65%] @md:-mr-[25%] mr-0' : 'mr-0',
                  theme.fontTitle,
                )}
              >
                {sectionContent.hero.title}
              </h1>
            </FadeIn>

            {/* Description — bottom of left col, desktop only */}
            <div className="mt-auto pt-14 hidden @md:block">
              {descriptionBlock}
            </div>
          </div>

          {/* RIGHT: photo — vertically centered, clears header with top padding */}
          {heroImage && (
            <FadeIn
              direction="right"
              distance={20}
              delay={0.15}
              className="flex items-center justify-center @md:pr-10 @lg:pr-20 px-6 @md:px-0 pt-8 @md:pt-28 @lg:pt-32 pb-8 @md:pb-14 w-full"
            >
              <SiteImage
                src={heroImage}
                alt={sectionContent.hero.title}
                aspectRatio={sectionContent.hero.aspectRatio || 'square'}
                frameStyle={sectionContent.hero.frameStyle || 'none'}
                cropData={heroCropData}
                className="w-full"
                priority
              />
            </FadeIn>
          )}
        </div>

        {/* Description — mobile only, below photo */}
        <div className="@md:hidden max-w-7xl mx-auto w-full @lg:px-20 @md:px-12 px-6 pb-10 pt-4">
          {descriptionBlock}
        </div>

        {/* Bottom rule */}
        <div className="max-w-7xl mx-auto w-full @lg:px-20 @md:px-12 px-6">
          <EditorialDivider />
        </div>
      </SectionWrapper>
  )
}

