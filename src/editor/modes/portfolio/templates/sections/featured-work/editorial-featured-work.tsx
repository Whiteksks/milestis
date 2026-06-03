'use client'

import type { PortfolioTemplateProps } from '@/editor/lib/template-types'
import { cn } from '@/lib/utils'
import { getAspectRatioClass } from '@/editor/lib/config/aspect-ratios'
import { getFrameStyle } from '@/editor/lib/config/frame-styles'
import { SlotImage } from '@/editor/image'
import { ProjectPlaceholder } from '@/editor/components/templates/primitives/project-placeholder'
import { getPortfolioFeaturedWorkImage, toCanonicalAspectRatio } from '../image-helpers'

import { SectionWrapper } from '@/editor/components/templates/primitives/section-wrapper'
import { Animate } from '@/editor/components/templates/primitives/animate'
import { EditorialTitle, EditorialParagraph } from '@/editor/components/templates/primitives/portfolio/typography'
import { EditorialDivider } from '@/editor/components/templates/primitives/portfolio/divider'

type EditorialFeaturedWorkProps = Pick<PortfolioTemplateProps, 'theme' | 'sectionContent' | 'imageContent'> 

export function EditorialFeaturedWork({ theme, sectionContent, imageContent }: EditorialFeaturedWorkProps) {
  const projects = sectionContent.featuredWork.projects ?? []

  return (
    <SectionWrapper id="work" themeForeground={theme.foreground}>
      <div className="max-w-7xl mx-auto @lg:px-20 @md:px-12 px-6 @lg:py-24 @md:py-20 py-14">
        
        {/* Header Block */}
        <Animate direction="up" delay={0.1} className="flex flex-col @md:flex-row @md:items-end justify-between gap-6 mb-20 w-full">
          <div className="space-y-4 flex-shrink-0">
            <span className={cn('text-[10px] uppercase tracking-[0.2em] opacity-40', theme.fontBody)}>
              {sectionContent.featuredWork.subtitle || 'Selected Projects'}
            </span>
            <EditorialTitle themeFont={theme.fontTitle} className="text-3xl @md:text-4xl @lg:text-5xl">
              {sectionContent.featuredWork.title}
            </EditorialTitle>
          </div>
          <div className="h-px flex-1 bg-current opacity-10 hidden @md:block mx-10 mb-4" />
          <span className={cn('text-[10px] opacity-40 mb-1 flex-shrink-0', theme.fontBody)}>
            {String(projects.length).padStart(2, '0')}
          </span>
        </Animate>

        {/* List of Projects */}
        <div className="space-y-32 @md:space-y-40">
          {projects.map((project, i) => {
            const isEven = i % 2 === 0
            const projectImage = getPortfolioFeaturedWorkImage(imageContent, project.id)
            return (
              <Animate
                key={i}
                as="article"
                direction="up"
                distance={40}
                delay={0}
                className="group"
              >
                <div className="grid grid-cols-1 @lg:grid-cols-12 gap-8 @lg:gap-16 items-center">
                  
                  {/* Content (Text)   Order changes via order-last/first */}
                  <div className={cn(
                    '@lg:col-span-5 space-y-6',
                    isEven ? '@lg:order-first' : '@lg:order-last'
                  )}>
                    <div className="space-y-2">
                      <span className={cn('text-[10px] font-bold opacity-30', theme.fontBody)}>
                        {String(i + 1).padStart(2, '0')}
                      </span>
                      <h4 className={cn('text-2xl @md:text-3xl font-bold uppercase leading-none', theme.fontTitle)}>
                        {project.title}
                      </h4>
                    </div>
                    
                    <EditorialParagraph themeFont={theme.fontBody}>
                      {project.description}
                    </EditorialParagraph>

                    <div className="flex flex-wrap gap-2 pt-2">
                      {project.tags?.map((tag, idx) => (
                        <span key={idx} className={cn('text-[9px] uppercase tracking-wider px-2 py-1 border border-current/10 opacity-50', theme.fontBody)}>
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Image */}
                  <div className="@lg:col-span-7">
                    <div
                      className={cn(
                        'relative overflow-hidden bg-neutral-100',
                        getAspectRatioClass(toCanonicalAspectRatio(projectImage?.value.presentation?.ratio, 'wide')),
                        theme.shadow,
                        getFrameStyle(projectImage?.value.presentation?.frameStyle || 'none'),
                      )}
                    >
                      {!projectImage ? (
                        <ProjectPlaceholder seed={project.id} className="absolute inset-0" />
                      ) : (
                        <SlotImage
                          slotId={projectImage.slotId}
                          value={projectImage.value}
                          templateId="editorial"
                          fillParent
                          alt={project.title}
                          sizes="(max-width: 768px) 100vw, 58vw"
                          imageClassName="object-cover grayscale-[0.4] group-hover:grayscale-0 transition-all duration-700 ease-out scale-[1.04] group-hover:scale-100"
                        />
                      )}
                      {/* Hover overlay   subtle darkening from bottom */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    </div>
                  </div>

                </div>
              </Animate>
            )
          })}
        </div>
      </div>

      {/* Trailing line */}
      <div className="max-w-7xl mx-auto w-full @lg:px-20 @md:px-12 px-6">
        <EditorialDivider />
      </div>
    </SectionWrapper>
  )
}

