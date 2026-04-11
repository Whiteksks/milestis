
import type { PortfolioTemplateProps } from '@/editor/lib/template-types'
import { cn } from '@/lib/utils'
import { SiteImage } from '@/editor/components/editor/section-settings/ui/site-image'
import { SectionWrapper } from '../../../primitives/section-wrapper'
import { Animate } from '../../../primitives/animate'

type ElegantHeroProps = Pick<PortfolioTemplateProps, 'theme' | 'sectionContent'> 

export function ElegantHero({ theme, sectionContent }: ElegantHeroProps) {
  const heroImage = sectionContent.hero.image
  
  return (
    <SectionWrapper
      id="hero"
      themeForeground={theme.foreground}
      padded={false}
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
              <SiteImage
                src={heroImage}
                alt={sectionContent.hero.title}
                aspectRatio={sectionContent.hero.aspectRatio || 'wide'}
                frameStyle={sectionContent.hero.frameStyle || 'none'}
                cropData={sectionContent.hero.cropData}
              />
            </Animate>
          )}
        </div>
      </div>
    </SectionWrapper>
  )
}
