'use client'

import type { PortfolioTemplateProps } from '@/editor/lib/template-types'
import { cn } from '@/lib/utils'
import { SlotImage } from '@/editor/image'
import { SectionWrapper } from '@/editor/components/templates/primitives/section-wrapper'
import { Animate } from '@/editor/components/templates/primitives/animate'

type ElegantBioProps = Pick<PortfolioTemplateProps, 'theme' | 'sectionContent' | 'imageContent'> 

export function ElegantBio({ theme, sectionContent, imageContent }: ElegantBioProps) {
  const bioImage = imageContent?.bio
  return (
    <SectionWrapper
      id="bio"
      themeForeground={theme.foreground}
      className="@container"
    >
      <div className="max-w-5xl mx-auto px-6 @md:px-10 py-20 @md:py-32">
        <div className="flex flex-col @lg:flex-row items-start gap-12 @lg:gap-20">
          
          {bioImage && (
            <Animate
              delay={0.1}
              direction="right"
              distance={20}
              className="shrink-0 @lg:sticky @lg:top-32"
            >
              <SlotImage
                slotId={bioImage.slotId}
                value={bioImage.value}
                templateId="elegant"
                alt={sectionContent.bio.title || 'Profile image'}
                sizes="(max-width: 768px) 100vw, 240px"
                className="w-[180px] @md:w-[220px] @lg:w-[240px] shadow-sm"
                imageClassName="object-cover"
              />
            </Animate>
          )}

          <div className="flex-1 space-y-10">
            <div className="space-y-6">
              <Animate
                direction="up"
                distance={15}
                delay={0.2}
                className="space-y-3"
              >
                <p className={cn('text-[10px] uppercase tracking-[0.4em] opacity-40', theme.fontBody)}>
                  {sectionContent.bio.subtitle || 'About the Artist'}
                </p>
                <h2 className={cn('text-3xl @md:text-4xl @lg:text-5xl font-extralight tracking-tight', theme.fontTitle)}>
                  {sectionContent.bio.title}
                </h2>
              </Animate>

              <Animate
                direction="up"
                distance={15}
                delay={0.3}
                className="max-w-2xl"
              >
                <p className={cn('text-base @md:text-lg font-light leading-relaxed whitespace-pre-line opacity-80', theme.fontBody)}>
                  {sectionContent.bio.description}
                </p>
              </Animate>
            </div>

            {/* Achievements: Р Т‘Р ВµР В»Р В°Р ВµР С Р С‘РЎвЂ¦ Р С”Р С•Р СР С—Р В°Р С”РЎвЂљР Р…РЎвЂ№Р С РЎРѓР С—Р С‘РЎРѓР С”Р С•Р С Р Р†Р Р…Р С‘Р В·РЎС“ */}
            {(sectionContent.bio.achievements ?? []).length > 0 && (
              <div className="grid @sm:grid-cols-2 gap-x-8 gap-y-4 pt-4 border-t border-current/10">
                {(sectionContent.bio.achievements ?? []).map((achievement, i) => (
                  <Animate
                    key={i}
                    direction="up"
                    distance={10}
                    delay={0.4 + i * 0.1}
                    className="flex items-baseline gap-3 opacity-60"
                  >
                    <span className="text-[10px] opacity-40">0{i + 1}</span>
                    <p className={cn('text-xs @md:text-sm font-light', theme.fontBody)}>{achievement}</p>
                  </Animate>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </SectionWrapper>
  )
}

