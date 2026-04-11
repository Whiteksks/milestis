'use client'

import type { PortfolioTemplateProps } from '@/editor/lib/template-types'
import { cn } from '@/lib/utils'
import { SiteImage } from '@/editor/components/editor/section-settings/ui/site-image'

// Primitives: The basic building blocks for templates
import { SectionWrapper } from '../../../primitives/section-wrapper'
import { Animate } from '../../../primitives/animate'
import { EditorialLabel, EditorialTitle, EditorialParagraph } from '../../../primitives/portfolio/typography'
import { EditorialDivider } from '../../../primitives/portfolio/divider'

type EditorialBioProps = Pick<PortfolioTemplateProps, 'theme' | 'sectionContent'> 

export function EditorialBio({ theme, sectionContent }: EditorialBioProps) {
  return (
    <SectionWrapper id="bio" themeForeground={theme.foreground}>
      
      {/* Top Label & Line */}
      <EditorialLabel themeFont={theme.fontBody} className="mb-12">
        {sectionContent.bio.subtitle || 'Profile'}
      </EditorialLabel>

      <div className="flex @md:flex-row flex-col gap-10 @lg:gap-16 items-start">
        
        {/* Photo Block (Fixed size) */}
        <Animate direction="none" delay={0.1} type="scale" scaleOffset={0.95} className="flex-shrink-0">
          <SiteImage
            unoptimized
            src={sectionContent.bio.image || '/placeholder.svg?height=176&width=128'}
            alt={sectionContent.bio.title || 'Profile'}
            aspectRatio={sectionContent.bio.aspectRatio || 'portrait'}
            frameStyle={sectionContent.bio.frameStyle || 'none'}
            cropData={sectionContent.bio.cropData}
            sizes="(max-width: 768px) 112px, 128px"
            className={cn('w-48 bg-neutral-100', theme.shadow)}
            imageClassName="object-cover grayscale hover:grayscale-0 transition-all duration-1000 ease-in-out"
          />
        </Animate>

        {/* Content Block */}
        <div className="flex-1 min-w-0">
          <EditorialTitle themeFont={theme.fontTitle} className="mb-6">
            {sectionContent.bio.title}
          </EditorialTitle>

          <div className="max-w-2xl space-y-8">
            <EditorialParagraph themeFont={theme.fontBody} themeLineHeight={theme.lineHeight}>
              {sectionContent.bio.description}
            </EditorialParagraph>

            {/* Achievements / Selected Works */}
            {sectionContent.bio.achievements && sectionContent.bio.achievements.length > 0 && (
              <div className="pt-8 border-t border-current/10">
                <p className={cn('text-[10px] uppercase tracking-widest opacity-30 mb-6', theme.fontBody)}>
                  {sectionContent.bio.subtitle || 'Highlights'}
                </p>
                <div className="grid @sm:grid-cols-2 grid-cols-1 gap-x-12 gap-y-4">
                  {sectionContent.bio.achievements.map((achievement, i) => (
                    <Animate key={i} delay={i * 0.05} direction="up" distance={10} className="group flex items-start gap-4">
                      <span className={cn('text-[9px] mt-1 font-medium opacity-30 group-hover:opacity-100 transition-opacity', theme.fontBody)}>
                        {String(i + 1).padStart(2, '0')}
                      </span>
                      <p className={cn('text-xs opacity-60 leading-snug', theme.fontBody)}>
                        {achievement}
                      </p>
                    </Animate>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Trailing Divider */}
      <div className="mt-16 sm:mt-24">
        <EditorialDivider />
      </div>

    </SectionWrapper>
  )
}
