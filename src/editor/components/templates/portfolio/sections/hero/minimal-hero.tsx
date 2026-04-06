'use client'

import { motion } from 'framer-motion'
import { useT, useDisabled } from '../../primitives/animation-context'
import type { PortfolioTemplateProps } from '@/editor/lib/template-types'
import { cn } from '@/lib/utils'
import { SiteImage } from '@/editor/components/editor/section-settings/ui/site-image'
import { SectionWrapper } from '../../primitives/section-wrapper'
import { FadeIn } from '../../primitives/fade-in'

interface MinimalHeroProps extends Pick<PortfolioTemplateProps, 'theme' | 'sectionContent'> {}

export function MinimalHero({ theme, sectionContent }: MinimalHeroProps) {
  const heroImage = sectionContent.hero.image
  const t = useT()
  const disabled = useDisabled()

  return (
    <SectionWrapper
      id="hero"
      themeForeground={theme.foreground}
      padded={false}
    >
      <div className="max-w-6xl mx-auto px-6 @md:px-10 @lg:px-16 py-16 @md:pt-24">
        {/* Top hairline — scaleX reveal, skips animation when disabled */}
        <motion.div
          initial={{ scaleX: disabled ? 1 : 0 }}
          animate={{ scaleX: 1 }}
          transition={disabled ? undefined : t(0.8, 0, [0.16, 1, 0.3, 1])}
          className="w-full h-px bg-current opacity-10 mb-12 origin-left"
        />

        <div className={cn(heroImage ? 'grid @md:grid-cols-2 grid-cols-1 gap-16 @lg:gap-24 items-start' : 'max-w-3xl')}>
          <div className="space-y-10">
            {/* Section label */}
            <FadeIn direction="left" distance={12} delay={0.1} className="flex items-center gap-4">
              <span className={cn('text-[9px] uppercase tracking-[0.4em] opacity-30', theme.letterSpacing, theme.fontBody)}>
                {sectionContent.hero.subtitle || 'Portfolio'}
              </span>
              <div className="h-px w-8 bg-current opacity-20" />
            </FadeIn>

            {/* Title */}
            <FadeIn direction="up" distance={20} delay={0.2}>
              <h1
                className={cn(
                  '@lg:text-[5.5rem] @md:text-6xl text-5xl font-extralight leading-[0.92] tracking-tight',
                  theme.fontTitle,
                )}
              >
                {sectionContent.hero.title}
              </h1>
            </FadeIn>

            {/* Description */}
            <FadeIn direction="up" distance={14} delay={0.35}>
              <p className={cn('@md:text-base text-sm opacity-45 font-light leading-relaxed max-w-sm', theme.fontBody)}>
                {sectionContent.hero.description}
              </p>
            </FadeIn>

            {/* Bottom rule */}
            <FadeIn direction="none" delay={0.5}>
              <div className="flex items-center justify-between pt-8 border-t border-current/10">
                <span className={cn('text-[9px] uppercase tracking-[0.35em] opacity-25', theme.fontBody)}>
                  {sectionContent.hero.subtitle}
                </span>
              </div>
            </FadeIn>
          </div>

          {heroImage && (
            <FadeIn direction="up" distance={20} delay={0.3} scaleOffset={0.98}>
              <SiteImage
                src={heroImage}
                alt={sectionContent.hero.title}
                aspectRatio={sectionContent.hero.aspectRatio || 'portrait'}
                frameStyle={sectionContent.hero.frameStyle || 'none'}
                cropData={sectionContent.hero.cropData}
                priority
              />
            </FadeIn>
          )}
        </div>
      </div>
    </SectionWrapper>
  )
}
