'use client'

import type { PortfolioTemplateProps } from '@/editor/lib/template-types'
import { cn } from '@/lib/utils'
import { SlotImage } from '@/editor/image'
import { SectionWrapper } from '@/editor/components/templates/primitives/section-wrapper'
import { Animate } from '@/editor/components/templates/primitives/animate'

type GridBioProps = Pick<PortfolioTemplateProps, 'theme' | 'sectionContent' | 'imageContent'> 

export function GridBio({ theme, sectionContent, imageContent }: GridBioProps) {
  const achievements = sectionContent.bio.achievements ?? []
  const bioImage = imageContent?.bio

  return (
    <SectionWrapper
      id="bio"
      themeForeground={theme.foreground}
      className="@container"
    >
      <div className="max-w-7xl mx-auto px-4 @md:px-6 @lg:px-8">
        
        <Animate
          direction="up"
          distance={20}
          className={cn(
            'relative overflow-hidden rounded-[2rem] border border-current/10 p-6 @lg:p-12 min-h-[40vh] items-center flex',
            theme.card
          )}
        >
          <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/4 w-64 h-64 bg-current/5 blur-[80px] pointer-events-none" />

          <div className="grid grid-cols-1 @lg:grid-cols-12 gap-8 @lg:gap-16 items-center relative z-10 w-full">
            
            <Animate 
              direction="up"
              distance={10}
              delay={0.2}
              className="@lg:col-span-4 flex justify-center @lg:justify-start"
            >
              {bioImage && (
                <SlotImage
                  slotId={bioImage.slotId}
                  value={bioImage.value}
                  templateId="grid"
                  alt={sectionContent.bio.title || 'Profile'}
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="w-full max-w-[280px] @lg:max-w-none transition-transform duration-500 hover:rotate-2 rounded-2xl"
                  imageClassName="object-cover"
                />
              )}
            </Animate>

            <div className="@lg:col-span-8 flex flex-col">
              <div className="space-y-2 mb-6">
                <Animate direction="up" delay={0.25} distance={10}>
                  <span className="text-[10px] uppercase tracking-[0.3em] opacity-40 font-medium">
                    {sectionContent.bio.subtitle || 'Personal Profile'}
                  </span>
                </Animate>
                <Animate direction="up" delay={0.3} distance={10}>
                  <h2 className={cn(
                    'text-3xl @md:text-4xl @lg:text-5xl font-bold leading-tight',
                    theme.fontTitle
                  )}>
                    {sectionContent.bio.title}
                  </h2>
                </Animate>
              </div>

              <Animate direction="up" delay={0.35} distance={10}>
                <p className={cn(
                  'text-base @lg:text-lg opacity-70 leading-relaxed mb-10 max-w-2xl',
                  theme.fontBody
                )}>
                  {sectionContent.bio.description}
                </p>
              </Animate>

              {/* Achievements */}
              {achievements.length > 0 && (
                <div className="grid grid-cols-1 @md:grid-cols-2 gap-4 pt-8 border-t border-current/5">
                  {achievements.map((item, i) => (
                    <Animate key={i} direction="up" delay={0.4 + i * 0.05} distance={10} className="flex items-start gap-3 group">
                      <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-current opacity-30 group-hover:opacity-100 transition-opacity" />
                      <span className={cn('text-sm opacity-60 group-hover:opacity-90 transition-opacity', theme.fontBody)}>
                        {item}
                      </span>
                    </Animate>
                  ))}
                </div>
              )}
            </div>

          </div>
        </Animate>
      </div>
    </SectionWrapper>
  )
}
