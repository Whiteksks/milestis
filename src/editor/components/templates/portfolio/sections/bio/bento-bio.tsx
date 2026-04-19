'use client'

import type { PortfolioTemplateProps } from '@/editor/lib/template-types'
import { cn } from '@/lib/utils'
import { SiteImage } from '@/editor/components/editor/section-settings/ui/site-image'

import { SectionWrapper } from '../../../primitives/section-wrapper'
import { Animate } from '../../../primitives/animate'

type BentoBioProps = Pick<PortfolioTemplateProps, 'theme' | 'sectionContent'> 

export function BentoBio({ theme, sectionContent }: BentoBioProps) {
  const achievements = sectionContent.bio.achievements ?? []

  return (
    <SectionWrapper
      id="bio"
      themeForeground={theme.foreground}
      className="@lg:px-6 @md:px-5 px-4 py-3"
    >
      <div className="max-w-6xl mx-auto w-full">

        <div className="grid @lg:grid-cols-12 @md:grid-cols-6 grid-cols-1 gap-3">

          {/* [A] Photo card РІР‚вЂќ tall, 4/12 */}
          <Animate
            delay={0}
            direction="up"
            distance={16}
            scaleOffset={0.96}
            className={cn(
              '@lg:col-span-4 @md:col-span-2 col-span-1',
              'relative rounded-3xl border border-current/8 overflow-hidden min-h-[44vh]',
              theme.card,
            )}
          >
            <SiteImage
              fillParent
              unoptimized
              src={sectionContent.bio.image}
              alt={sectionContent.bio.title || 'Profile'}
              sizes="(max-width: 768px) 100vw, 33vw"
              imageClassName="object-cover transition-transform duration-700 hover:scale-[1.03]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent pointer-events-none" />
          </Animate>

          {/* [B] Content column РІР‚вЂќ 8/12 */}
          <div className="@lg:col-span-8 @md:col-span-4 col-span-1 flex flex-col gap-3">

            {/* [B1] Name + subtitle + description */}
            <Animate
              delay={0.05}
              direction="up"
              distance={14}
              className={cn(
                'rounded-3xl border border-current/8 overflow-hidden p-6 @lg:p-8 flex-1',
                theme.card,
              )}
            >
              <p className={cn('text-[10px] uppercase tracking-widest opacity-40 mb-2', theme.fontBody)}>
                {sectionContent.bio.subtitle || 'About'}
              </p>
              <h2 className={cn('@lg:text-3xl @md:text-2xl text-xl font-bold leading-tight mb-4', theme.fontTitle)}>
                {sectionContent.bio.title}
              </h2>
              <p className={cn('text-sm opacity-60 leading-relaxed', theme.lineHeight, theme.fontBody)}>
                {sectionContent.bio.description}
              </p>
            </Animate>

            {/* [B2] Achievement chips */}
            {achievements.length > 0 && (
              <Animate
                delay={0.12}
                direction="up"
                distance={10}
                className={cn(
                  'rounded-3xl border border-current/8 overflow-hidden p-5',
                  theme.card,
                )}
              >
                <div className="flex flex-wrap gap-2">
                  {achievements.map((item, i) => (
                    <Animate
                      as="span"
                      key={i}
                      delay={0.15 + i * 0.04}
                      direction="none"
                      scaleOffset={0.88}
                      className={cn(
                        'px-3 py-1.5 text-[11px] rounded-full border border-current/12 opacity-65',
                        theme.fontBody,
                      )}
                    >
                      {item}
                    </Animate>
                  ))}
                </div>
              </Animate>
            )}
          </div>

        </div>
      </div>
    </SectionWrapper>
  )
}
