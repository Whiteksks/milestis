'use client'

import { ArrowUpRight } from 'lucide-react'
import type { PortfolioTemplateProps } from '@/editor/lib/template-types'
import { cn } from '@/lib/utils'
import { getFrameStyle } from '@/editor/lib/config/frame-styles'
import { SlotImage } from '@/editor/image'
import { ProjectPlaceholder } from '@/editor/components/templates/primitives/project-placeholder'
import { getPortfolioFeaturedWorkImage } from '../image-helpers'

import { SectionWrapper } from '@/editor/components/templates/primitives/section-wrapper'
import { Animate } from '@/editor/components/templates/primitives/animate'

type BentoFeaturedWorkProps = Pick<PortfolioTemplateProps, 'theme' | 'sectionContent' | 'imageContent'> 

type Project = BentoFeaturedWorkProps['sectionContent']['featuredWork']['projects'][number]

function ProjectCard({
  project,
  projectImage,
  index,
  className,
  imgSizes = '(max-width: 768px) 100vw, 50vw',
  titleSize = 'text-sm',
}: {
  project: Project
  projectImage?: PortfolioTemplateProps['imageContent'] extends infer T ? T extends { featuredWork: infer _ } ? import('@/editor/modes/portfolio/image/types').PortfolioManagedImage : never : never
  index: number
  className?: string
  imgSizes?: string
  titleSize?: string
}) {
  return (
    <Animate
      delay={index * 0.065}
      direction="up"
      distance={18}
      className={cn(
        'group relative overflow-hidden rounded-3xl cursor-pointer select-none border border-current/8 w-full block visual-card-glow',
        className,
      )}
    >
      {/* Image Slot */}
      {projectImage ? (
        <SlotImage
          slotId={projectImage.slotId}
          value={projectImage.value}
          templateId="bento"
          fillParent
          alt={project.title || 'Project'}
          sizes={imgSizes}
          className={getFrameStyle(projectImage.value.presentation?.frameStyle || 'none')}
          imageClassName={cn(
            'object-cover transition-transform duration-1000 ease-[cubic-bezier(0.25,1,0.5,1)] will-change-transform group-hover:scale-[1.05]',
          )}
        />
      ) : (
        <ProjectPlaceholder seed={project.id} className="absolute inset-0" />
      )}

      {/* Cinematic Ambient Gradients */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-black/5 opacity-90 transition-opacity duration-300 group-hover:opacity-95 pointer-events-none" />
      <div className="absolute inset-0 bg-current/0 group-hover:bg-current/[0.02] transition-colors duration-300 pointer-events-none" />

      {/* Top Floating Badge & Action Button */}
      <div className="absolute top-0 left-0 right-0 p-4 @md:p-5 flex items-center justify-between gap-3 z-10">
        <div className="flex flex-wrap gap-1.5 min-w-0">
          {project.tags?.slice(0, 3).map((tag, i) => (
            <span
              key={i}
              className="px-2.5 py-0.5 text-[9px] font-medium rounded-full bg-black/40 text-white/90 backdrop-blur-md border border-white/10 tracking-wider uppercase whitespace-nowrap"
            >
              {tag}
            </span>
          ))}
        </div>
        
        {/* Dynamic Action Arrow */}
        <div className={cn(
          "w-8 h-8 rounded-full bg-white/10 backdrop-blur-md border border-white/15 flex items-center justify-center shrink-0",
          "opacity-0 scale-90 -rotate-45 group-hover:opacity-100 group-hover:scale-100 group-hover:rotate-0",
          "transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)]",
        )}>
          <ArrowUpRight className="w-4 h-4 text-white" />
        </div>
      </div>

      {/* Bottom Info Section */}
      <div className="absolute bottom-0 left-0 right-0 p-5 @md:p-6 z-10 flex flex-col justify-end min-h-[30%]">
        <h3 className={cn('text-white font-semibold leading-snug tracking-tight transition-transform duration-300 group-hover:-translate-y-1', titleSize)}>
          {project.title}
        </h3>
        
        {project.description && (
          <p className={cn(
            'text-white/60 text-xs mt-1.5 leading-relaxed line-clamp-2 max-w-xl',
            'opacity-0 max-h-0 pointer-events-none transform translate-y-2',
            'group-hover:opacity-100 group-hover:max-h-[50px] group-hover:translate-y-0',
            'transition-all duration-300 ease-out delay-[40ms]',
          )}>
            {project.description}
          </p>
        )}
      </div>
    </Animate>
  )
}

// Main BentoFeaturedWork Component

export function BentoFeaturedWork({ theme, sectionContent, imageContent }: BentoFeaturedWorkProps) {
  const projects = sectionContent.featuredWork.projects ?? []
  const [p1, p2, p3, ...rest] = projects

  return (
    <SectionWrapper
      id="work"
      themeForeground={theme.foreground}
      className="@lg:px-8 @md:px-6 px-4 py-6"
    >
      <div className="max-w-6xl mx-auto space-y-4 w-full">

        {/* Header Block */}
        <Animate
          delay={0}
          direction="up"
          distance={12}
          className={cn(
            'rounded-3xl border border-current/8 px-6 py-5 flex items-center justify-between gap-4',
            theme.card,
          )}
        >
          <div className="min-w-0">
            <p className={cn('text-[10px] uppercase tracking-widest opacity-40 mb-1 block', theme.fontBody)}>
              {sectionContent.featuredWork.subtitle || 'Selected work'}
            </p>
            <h2 className={cn('@lg:text-2xl text-xl font-bold tracking-tight', theme.fontTitle)}>
              {sectionContent.featuredWork.title}
            </h2>
          </div>
        </Animate>

        {/* Dynamic Bento Grid Layout System */}
        {projects.length > 0 && (
          <div className="w-full">
            
            {/* Case 1: Exactly 1 project */}
            {projects.length === 1 && p1 && (
              <ProjectCard
                project={p1}
                projectImage={getPortfolioFeaturedWorkImage(imageContent, p1.id)}
                index={0}
                imgSizes="100vw"
                titleSize="@md:text-2xl text-xl"
                className="min-h-[55vh] @lg:min-h-[600px]"
              />
            )}

            {/* Case 2: Exactly 2 projects */}
            {projects.length === 2 && (
              <div className="grid grid-cols-1 @md:grid-cols-2 gap-4">
                {[p1, p2].map((p, i) => p && (
                  <ProjectCard
                    key={i}
                    project={p}
                    projectImage={getPortfolioFeaturedWorkImage(imageContent, p.id ?? '')}
                    index={i}
                    imgSizes="(max-width: 768px) 100vw, 50vw"
                    titleSize="@md:text-lg text-base"
                    className="min-h-[44vh] @lg:min-h-[500px]"
                  />
                ))}
              </div>
            )}

            {/* Case 3: 3 or more projects (True Flat Grid Structure) */}
            {projects.length >= 3 && (
              <div className="grid grid-cols-1 @md:grid-cols-2 @lg:grid-cols-12 gap-4 auto-rows-auto">

                {/* [1] Primary Hero Block */}
                {p1 && (
                  <ProjectCard
                    project={p1}
                    projectImage={getPortfolioFeaturedWorkImage(imageContent, p1.id)}
                    index={0}
                    imgSizes="(max-width: 768px) 100vw, 66vw"
                    titleSize="@md:text-xl text-lg"
                    className="@lg:col-span-8 @lg:row-span-2 min-h-[46vh] @lg:min-h-[580px]"
                  />
                )}

                {/* [2] Supporting Top Right Block */}
                {p2 && (
                  <ProjectCard
                    project={p2}
                    projectImage={getPortfolioFeaturedWorkImage(imageContent, p2.id)}
                    index={1}
                    imgSizes="(max-width: 768px) 100vw, 33vw"
                    titleSize="text-base"
                    className="@lg:col-span-4 min-h-[30vh] @lg:min-h-[282px]"
                  />
                )}

                {/* [3] Supporting Bottom Right Block */}
                {p3 && (
                  <ProjectCard
                    project={p3}
                    projectImage={getPortfolioFeaturedWorkImage(imageContent, p3.id)}
                    index={2}
                    imgSizes="(max-width: 768px) 100vw, 33vw"
                    titleSize="text-base"
                    className="@lg:col-span-4 min-h-[30vh] @lg:min-h-[282px]"
                  />
                )}

                {/* [4+] Remainder Blocks (Flatted out seamlessly into the grid system) */}
                {rest.map((project, i) => (
                  <ProjectCard
                    key={i}
                    project={project}
                    projectImage={getPortfolioFeaturedWorkImage(imageContent, project.id ?? '')}
                    index={i + 3}
                    imgSizes="(max-width: 768px) 100vw, 33vw"
                    titleSize="text-base"
                    className="@lg:col-span-4 @md:col-span-1 min-h-[32vh] @lg:min-h-[290px]"
                  />
                ))}

              </div>
            )}
          </div>
        )}
      </div>
    </SectionWrapper>
  )
}