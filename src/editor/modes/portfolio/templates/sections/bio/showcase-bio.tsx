'use client'

import { SectionWrapper } from '@/editor/components/templates/primitives/section-wrapper'
import { Animate } from '@/editor/components/templates/primitives/animate'
import type { PortfolioTemplateProps } from '@/editor/lib/template-types'
import { cn } from '@/lib/utils'
import { SlotImage } from '@/editor/image'

type ShowcaseBioProps = Pick<PortfolioTemplateProps, 'theme' | 'sectionContent' | 'imageContent'> 

export function ShowcaseBio({ theme, sectionContent, imageContent }: ShowcaseBioProps) {
  const { title, subtitle, description, achievements } = sectionContent.bio
  const bioImage = imageContent?.bio

  return (
    <SectionWrapper
      id="bio"
      className={cn('relative w-full overflow-hidden', theme.foreground)}
    >
      <div className="relative max-w-7xl mx-auto @lg:px-20 @md:px-12 px-6 @lg:py-28 @md:py-20 py-16">
        <Animate direction="left" distance={20} className="flex items-center gap-4 mb-14">
          <span className={cn('text-[10px] uppercase tracking-[0.3em] opacity-35', theme.fontBody)}>
            {subtitle || 'About'}
          </span>
          <div className="w-12 h-px bg-current opacity-15" />
        </Animate>

        <div className="grid grid-cols-1 @lg:grid-cols-12 gap-10 @lg:gap-20 items-start">
          {bioImage && (
            <Animate direction="up" distance={30} delay={0.1} className="@lg:col-span-4 flex justify-start">
              <SlotImage
                  slotId={bioImage.slotId}
                  value={bioImage.value}
                  templateId="showcase"
                  alt={title || 'Profile'}
                  sizes="(max-width: 768px) 58vw, 33vw"
                  className={cn('w-[58vw] max-w-[220px] @md:w-full @md:max-w-xs @lg:max-w-none', theme.shadow)}
                  imageClassName="object-cover"
                />
            </Animate>
          )}

          <Animate direction="up" distance={30} delay={0.2} className={cn(bioImage ? '@lg:col-span-8' : '@lg:col-span-12', 'space-y-8')}>
            <h2
              className={cn(
                'font-black uppercase leading-tight tracking-tighter',
                '@lg:text-6xl @md:text-5xl text-4xl',
                theme.fontTitle,
              )}
            >
              {title}
            </h2>
            <p
              className={cn(
                'max-w-2xl text-sm @md:text-base opacity-60 font-light leading-relaxed whitespace-pre-line',
                theme.lineHeight,
                theme.fontBody,
              )}
            >
              {description}
            </p>

            {achievements && achievements.length > 0 && (
              <Animate direction="none" delay={0.3} className="pt-6 border-t border-current/10">
                <p
                  className={cn(
                    'text-[10px] uppercase tracking-widest opacity-30 mb-6',
                    theme.fontBody,
                  )}
                >
                  {subtitle || 'Highlights'}
                </p>
                <div className="grid @sm:grid-cols-2 grid-cols-1 gap-4">
                  {achievements.map((item, i) => (
                    <div key={i} className="flex items-start gap-3 group">
                      <span
                        className={cn(
                          'text-[9px] font-bold opacity-25 mt-0.5 shrink-0 group-hover:opacity-70 transition-opacity',
                          theme.fontBody,
                        )}
                      >
                        {String(i + 1).padStart(2, '0')}
                      </span>
                      <p
                        className={cn(
                          'text-xs opacity-55 leading-relaxed group-hover:opacity-80 transition-opacity',
                          theme.fontBody,
                        )}
                      >
                        {item}
                      </p>
                    </div>
                  ))}
                </div>
              </Animate>
            )}
          </Animate>
        </div>
      </div>

      <div className="max-w-7xl mx-auto @lg:px-20 @md:px-12 px-6">
        <div className="h-px w-full bg-current opacity-[0.07]" />
      </div>
    </SectionWrapper>
  )
}

