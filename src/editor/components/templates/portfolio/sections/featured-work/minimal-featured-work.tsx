'use client'

import type { PortfolioTemplateProps } from '@/editor/lib/template-types'
import { cn } from '@/lib/utils'
import { SlotImage } from '@/editor/image'
import { ProjectPlaceholder } from '../../../primitives/project-placeholder'
import { getPortfolioFeaturedWorkImage } from '../image-helpers'
import { SectionWrapper } from '../../../primitives/section-wrapper'
import { Animate } from '../../../primitives/animate'

type MinimalFeaturedWorkProps = Pick<PortfolioTemplateProps, 'theme' | 'sectionContent' | 'imageContent'> 

export function MinimalFeaturedWork({ theme, sectionContent, imageContent }: MinimalFeaturedWorkProps) {
  const projects = sectionContent.featuredWork.projects ?? []
  return (
    <SectionWrapper
      id="work"
      themeForeground={theme.foreground}
    >
      <div className="max-w-6xl mx-auto px-6 @md:px-10 @lg:px-16 py-20 @md:py-28">

        {/* Section header */}
        <div className="flex items-center justify-between mb-20 border-t border-current/10 pt-8">
          <Animate
            direction="left"
            distance={10}
            as="p"
            className={cn('text-[9px] uppercase tracking-[0.4em] opacity-30', theme.letterSpacing, theme.fontBody)}
          >
            {sectionContent.featuredWork.subtitle || 'Selected Work'}
          </Animate>
        </div>

        {/* Project list   alternating editorial layout */}
        <div className="space-y-0">
          {projects.map((project, i) => (
            (() => {
              const projectImage = getPortfolioFeaturedWorkImage(imageContent, project.id)
              return (
            <div key={i} className="border-t border-current/10 last:border-b">
              <Animate
                direction="up"
                distance={16}
                delay={0.05}
                className={cn(
                  'flex flex-col @lg:flex-row gap-10 @lg:gap-16 py-12 @md:py-16',
                  i % 2 === 1 && '@lg:flex-row-reverse',
                )}
              >
                {/* Image */}
                <div className="@lg:w-[42%] w-full shrink-0 group">
                  {!projectImage && (
                    <div className="w-full" style={{ aspectRatio: '16/9' }}>
                      <ProjectPlaceholder seed={project.id} className="w-full h-full" />
                    </div>
                  )}
                  {projectImage && (
                    <SlotImage
                      slotId={projectImage.slotId}
                      value={projectImage.value}
                      templateId="minimal"
                      alt={project.title}
                      sizes="(max-width: 768px) 100vw, 42vw"
                      imageClassName="object-cover group-hover:scale-[1.03] transition-transform duration-700 ease-out"
                    />
                  )}
                </div>

                {/* Content */}
                <div className="@lg:w-2/5 flex flex-col justify-between gap-8">
                  <div className="space-y-5">
                    <h3
                      className={cn(
                        '@lg:text-4xl @md:text-3xl text-2xl font-extralight leading-none tracking-tight',
                        theme.fontTitle,
                      )}
                    >
                      {project.title}
                    </h3>
                    <p className={cn('text-sm opacity-40 font-light leading-relaxed', theme.fontBody)}>
                      {project.description}
                    </p>
                  </div>

                  {/* Tags */}
                  {(project.tags ?? []).length > 0 && (
                    <div className="flex flex-wrap gap-x-4 gap-y-2">
                      {(project.tags ?? []).slice(0, 4).map((tag, idx) => (
                        <span
                          key={idx}
                          className={cn('text-[9px] uppercase tracking-[0.25em] opacity-25', theme.fontBody)}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </Animate>
            </div>
              )
            })()
          ))}
        </div>
      </div>
    </SectionWrapper>
  )
}
