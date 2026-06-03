'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import type { PortfolioTemplateProps } from '@/editor/lib/template-types'
import { cn } from '@/lib/utils'
import { SlotImage } from '@/editor/image'
import { ProjectPlaceholder } from '@/editor/components/templates/primitives/project-placeholder'
import { getPortfolioFeaturedWorkImage } from '../image-helpers'
import { Animate } from '@/editor/components/templates/primitives/animate'

export function LiquidGlassFeaturedWork({ theme, sectionContent, imageContent }: Pick<PortfolioTemplateProps, 'theme' | 'sectionContent' | 'imageContent'>) {
  const projects = sectionContent.featuredWork.projects ?? []
  const { primary, secondary } = theme.bgEffectColors

  return (
    <section
      id="work"
      data-section-id="work"
      className="@container relative w-full overflow-hidden py-20 @md:py-32 bg-[#08080c]"
    >
      <div className="absolute inset-0 pointer-events-none opacity-30">
        <div className="absolute inset-0" 
             style={{ backgroundImage: `radial-gradient(circle at 15% 25%, ${primary}15, transparent 40%), radial-gradient(circle at 85% 75%, ${secondary}15, transparent 40%)` }} />
      </div>

      <div className="relative z-10 max-w-[1400px] mx-auto px-6 @md:px-12">
        <header className="mb-12 @md:mb-20">
          <Animate
            direction="up"
            distance={15}
            as="h2"
            className={cn("text-5xl @md:text-8xl font-black uppercase tracking-tighter text-white leading-[0.8]", theme.fontTitle)}
          >
            {sectionContent.featuredWork.title}
          </Animate>
        </header>

          <div className="grid grid-cols-1 @md:grid-cols-12 gap-6 @md:gap-10 items-stretch">
            {projects.map((project, i) => (
            <ProjectCard key={i} project={project} projectImage={getPortfolioFeaturedWorkImage(imageContent, project.id)} index={i} theme={theme} />
          ))}
        </div>
      </div>
    </section>
  )
}

function ProjectCard({ project, projectImage, index, theme }: { project: PortfolioTemplateProps['sectionContent']['featuredWork']['projects'][number], projectImage?: import('@/editor/modes/portfolio/image/types').PortfolioManagedImage, index: number, theme: PortfolioTemplateProps['theme'] }) {
  const [showInfo, setShowInfo] = useState(false)
  const isFeatured = index % 3 === 0
  const hasDescription = !!project.description && project.description.trim() !== ''
  
  return (
    <Animate
      as="article"
      direction="up"
      distance={25}
      delay={0.05}
      className={cn(
        "group relative rounded-[2.5rem] overflow-hidden flex flex-col cursor-pointer bg-[#111] transform-gpu",
        isFeatured ? "@md:col-span-12 aspect-[21/9]" : "@md:col-span-6 aspect-square"
      )}
    >
      <div className="absolute inset-0 z-0 overflow-hidden">
        {projectImage ? (
          <SlotImage
            slotId={projectImage.slotId}
            value={projectImage.value}
            templateId="liquid-glass"
            fillParent
            alt={project.title}
            className={projectImage.value.presentation?.frameStyle ? 'overflow-hidden' : undefined}
            imageClassName="object-cover transition-transform duration-1000 ease-[cubic-bezier(0.2,1,0.3,1)] group-hover:scale-103"
          />
        ) : (
          <ProjectPlaceholder seed={project.id} className="absolute inset-0 opacity-40" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/20 to-transparent" />
      </div>

      <div className="absolute top-4 left-4 right-4 @md:top-8 @md:left-8 z-20 flex justify-between items-start">
        <div className="px-5 py-3 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-2xl shadow-xl">
          <h3 className={cn("text-sm @md:text-xl font-bold text-white tracking-tight leading-none", theme.fontTitle)}>
            {project.title}
          </h3>
        </div>

        <div className="flex gap-2 items-center">
          {project.tags?.[0] && (
            <div className="hidden @md:block px-3 py-1.5 rounded-full border border-white/5 bg-black/40 backdrop-blur-md text-[9px] text-white/40 uppercase tracking-widest">
              {project.tags[0]}
            </div>
          )}
          
          {hasDescription && (
            <button 
              onClick={(e) => { e.stopPropagation(); setShowInfo(!showInfo); }}
              className="@lg:hidden h-9 w-9 flex items-center justify-center rounded-full border border-white/15 bg-white/10 backdrop-blur-xl text-white active:scale-90 transition-all shadow-lg"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/>
              </svg>
            </button>
          )}
        </div>
      </div>

      <AnimatePresence>
        {showInfo && hasDescription && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-30 p-8 flex flex-col justify-end @lg:hidden bg-black/60 backdrop-blur-lg"
            onClick={() => setShowInfo(false)}
          >
             <motion.p 
               initial={{ y: 10 }}
               animate={{ y: 0 }}
               className={cn("text-sm text-white/90 leading-relaxed font-light", theme.fontBody)}
             >
               {project.description}
             </motion.p>
          </motion.div>
        )}
      </AnimatePresence>

      {hasDescription && (
        <div className="hidden @lg:flex relative z-10 mt-auto p-10 opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-500 ease-out">
          <p className={cn("text-base text-white/50 max-w-lg leading-relaxed font-light", theme.fontBody)}>
            {project.description}
          </p>
        </div>
      )}

      <div className="hidden @lg:block absolute inset-0 z-40 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-1000 bg-gradient-to-tr from-white/5 via-transparent to-transparent" />
    </Animate>
  )
}

