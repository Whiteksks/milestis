'use client'

import type { PortfolioTemplateProps } from '@/editor/lib/template-types'
import { cn } from '@/lib/utils'
import { SiteImage } from '@/editor/components/editor/section-settings/ui/site-image'
import { SectionWrapper } from '../../primitives/section-wrapper'
import { FadeIn } from '../../primitives/fade-in'

interface GridBioProps extends Pick<PortfolioTemplateProps, 'theme' | 'sectionContent'> {}

export function GridBio({ theme, sectionContent }: GridBioProps) {
  const achievements = sectionContent.bio.achievements ?? []

  return (
    <SectionWrapper
      id="bio"
      themeForeground={theme.foreground}
      padded={false}
      className="@container"
    >
      <div className="max-w-7xl mx-auto px-4 @md:px-6 @lg:px-8">
        
        {/* Основная оболочка-карточка */}
        <FadeIn
          direction="up"
          distance={20}
          className={cn(
            'relative overflow-hidden rounded-[2rem] border border-current/10 p-6 @lg:p-12 min-h-[40vh] items-center flex',
            theme.card
          )}
        >
          {/* Декоративный элемент на фоне (опционально) */}
          <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/4 w-64 h-64 bg-current/5 blur-[80px] pointer-events-none" />

          <div className="grid grid-cols-1 @lg:grid-cols-12 gap-8 @lg:gap-16 items-center relative z-10 w-full">
            
            {/* [A] Левая колонка: Компактное фото */}
            <FadeIn 
              direction="up"
              distance={10}
              delay={0.2}
              className="@lg:col-span-4 flex justify-center @lg:justify-start"
            >
              <SiteImage
                unoptimized
                src={sectionContent.bio.image || '/placeholder.svg?height=600&width=480'}
                alt={sectionContent.bio.title || 'Profile'}
                aspectRatio={sectionContent.bio.aspectRatio || 'portrait'}
                frameStyle={sectionContent.bio.frameStyle || 'none'}
                cropData={sectionContent.bio.cropData}
                sizes="(max-width: 768px) 100vw, 33vw"
                className="w-full max-w-[280px] @lg:max-w-none transition-transform duration-500 hover:rotate-2 rounded-2xl"
                imageClassName="object-cover"
              />
            </FadeIn>

            {/* [B] Правая колонка: Инфо */}
            <div className="@lg:col-span-8 flex flex-col">
              <div className="space-y-2 mb-6">
                <FadeIn direction="up" delay={0.25} distance={10}>
                  <span className="text-[10px] uppercase tracking-[0.3em] opacity-40 font-medium">
                    {sectionContent.bio.subtitle || 'Personal Profile'}
                  </span>
                </FadeIn>
                <FadeIn direction="up" delay={0.3} distance={10}>
                  <h2 className={cn(
                    'text-3xl @md:text-4xl @lg:text-5xl font-bold leading-tight',
                    theme.fontTitle
                  )}>
                    {sectionContent.bio.title}
                  </h2>
                </FadeIn>
              </div>

              <FadeIn direction="up" delay={0.35} distance={10}>
                <p className={cn(
                  'text-base @lg:text-lg opacity-70 leading-relaxed mb-10 max-w-2xl',
                  theme.fontBody
                )}>
                  {sectionContent.bio.description}
                </p>
              </FadeIn>

              {/* Achievements как горизонтальный скролл или сетка */}
              {achievements.length > 0 && (
                <div className="grid grid-cols-1 @md:grid-cols-2 gap-4 pt-8 border-t border-current/5">
                  {achievements.map((item, i) => (
                    <FadeIn key={i} direction="up" delay={0.4 + i * 0.05} distance={10} className="flex items-start gap-3 group">
                      <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-current opacity-30 group-hover:opacity-100 transition-opacity" />
                      <span className={cn('text-sm opacity-60 group-hover:opacity-90 transition-opacity', theme.fontBody)}>
                        {item}
                      </span>
                    </FadeIn>
                  ))}
                </div>
              )}
            </div>

          </div>
        </FadeIn>
      </div>
    </SectionWrapper>
  )
}