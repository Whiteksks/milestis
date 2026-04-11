'use client'

import type { PortfolioTemplateProps } from '@/editor/lib/template-types'       
import { cn } from '@/lib/utils'
import { SiteImage } from '@/editor/components/editor/section-settings/ui/site-image'
import { SectionWrapper } from '../../../primitives/section-wrapper'
import { Animate } from '../../../primitives/animate'

export function GridFeaturedWork({ theme, sectionContent }: Pick<PortfolioTemplateProps, 'theme' | 'sectionContent'>) {
  const projects = sectionContent.featuredWork.projects ?? []

  return (
    <SectionWrapper
      id="featured-work"
      themeForeground={theme.foreground}
      padded={false}
      className="@container py-20"
    >
      <div className="max-w-7xl mx-auto px-4 @md:px-6 @lg:px-8">

        {/* Header Section */}
        <Animate direction="up" distance={15} delay={0.1} className="mb-12 flex flex-col gap-4 border-b border-current/10 pb-8">
          <div className="flex justify-between items-end">
            <div>
              <h2 className={cn('text-3xl @md:text-5xl font-bold tracking-tight mb-2', theme.fontTitle)}>
                {sectionContent.featuredWork.title}
              </h2>
              <p className={cn('text-sm uppercase tracking-widest opacity-40', theme.fontBody)}>
                {sectionContent.featuredWork.subtitle || 'Selected Archive'}    
              </p>
            </div>
          </div>
        </Animate>
        <div className="grid grid-cols-1 @md:grid-cols-2 @lg:grid-cols-3 gap-x-6 gap-y-12">
          {projects.map((project, index) => (
            <Animate
              key={index}
              direction="up"
              distance={20}
              delay={(index % 3) * 0.1}
              className="group cursor-pointer"
            >
              {/* Image Wrapper */}
              <div className="relative overflow-hidden">
                <SiteImage
                  unoptimized
                  src={project.image || '/placeholder.svg?height=800&width=600'}
                  alt={project.title || ''}
                  aspectRatio={project.aspectRatio || 'poster'}
                  frameStyle={project.frameStyle || 'none'}
                  cropData={project.cropData}
                  sizes="(max-width: 768px) 100vw, 33vw"
                  imageClassName="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                />
                
                {/* Р СњР С•Р СР ВµРЎР‚ Р С—РЎР‚Р С•Р ВµР С”РЎвЂљР В° Р С—РЎР‚Р С‘ Р Р…Р В°Р Р†Р ВµР Т‘Р ВµР Р…Р С‘Р С‘ (Р С•Р С—РЎвЂ Р С‘Р С•Р Р…Р В°Р В»РЎРЉР Р…Р С•) */}
                <div className="absolute top-4 right-4 h-8 w-8 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity border border-white/20">
                   <span className="text-[10px] text-white font-mono">{(index + 1).toString().padStart(2, '0')}</span>
                </div>
              </div>

              {/* Text Content Below Image */}
              <div className="mt-5 space-y-2">
                <div className="flex justify-between items-start">
                  <h3 className={cn('text-lg font-semibold leading-tight group-hover:underline underline-offset-4 decoration-current/30', theme.fontTitle)}>
                    {project.title}
                  </h3>
                  <svg className="w-4 h-4 opacity-0 -translate-x-2 group-hover:opacity-40 group-hover:translate-x-0 transition-all" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </div>

                {project.tags && project.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {project.tags.slice(0, 3).map((tag, i) => (
                      <span key={i} className="text-[10px] opacity-40 uppercase tracking-wider">
                        {tag}{i !== project.tags!.slice(0, 3).length - 1 && ' РІР‚Сћ'}
                      </span>
                    ))}
                  </div>
                )}

                <p className={cn('text-sm opacity-60 line-clamp-2 font-light leading-relaxed', theme.fontBody)}>
                  {project.description}
                </p>
              </div>
            </Animate>
          ))}
        </div>
      </div>
    </SectionWrapper>
  )
}