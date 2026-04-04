'use client'

import { motion } from 'framer-motion'
import type { PortfolioTemplateProps } from '@/editor/lib/template-types'
import { cn } from '@/lib/utils'
import { getAspectRatioClass } from '@/editor/lib/aspect-ratios'
import { getFrameStyle } from '@/editor/lib/frame-styles'
import { SiteImage } from '@/editor/components/editor/section-settings/ui/site-image'

interface LiquidGlassFeaturedWorkProps
  extends Pick<PortfolioTemplateProps, 'theme' | 'sectionContent'> {}

export function LiquidGlassFeaturedWork({ theme, sectionContent }: LiquidGlassFeaturedWorkProps) {
  const projects = sectionContent.featuredWork.projects ?? []
  const { primary, secondary, accent2, subtle } = theme.bgEffectColors

  return (
    <section
      id="work"
      data-section-id="featured-work"
      className="@container relative w-full overflow-hidden py-24 @md:py-32"
      style={{ background: `radial-gradient(ellipse at 20% 30%, ${secondary}45 0%, transparent 55%), radial-gradient(ellipse at 85% 70%, ${primary}40 0%, transparent 55%), #0a0a10` }}
    >
      {/* Blobs */}
      <motion.div
        animate={{ x: [0, -30, 0], y: [0, 25, 0] }}
        transition={{ repeat: Infinity, duration: 11, ease: 'easeInOut' }}
        className="absolute rounded-full pointer-events-none"
        style={{ width: 450, height: 450, bottom: '-10%', left: '-5%', background: `radial-gradient(circle, ${accent2}45 0%, transparent 70%)`, filter: 'blur(70px)' }}
      />

      <div className="relative z-10 max-w-6xl mx-auto px-6 @md:px-12 @lg:px-20">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55 }}
          className="flex items-end justify-between mb-12 gap-6"
        >
          <div>
            <p className={cn('text-[10px] uppercase tracking-[0.3em] text-white/35 mb-3', theme.fontBody)}>
              {sectionContent.featuredWork.subtitle || 'Selected Work'}
            </p>
            <h2
              className={cn(
                'font-black uppercase leading-none tracking-tighter text-white',
                '@lg:text-6xl @md:text-5xl text-4xl',
                theme.fontTitle,
              )}
            >
              {sectionContent.featuredWork.title}
            </h2>
          </div>
          {/* Glass pill count */}
          <div
            className="shrink-0 px-3 py-1.5 rounded-full text-[11px] text-white/45 border border-white/12"
            style={{ background: 'rgba(255,255,255,0.06)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)' }}
          >
            {String(projects.length).padStart(2, '0')} Works
          </div>
        </motion.div>

        {/* Cards grid — first card is wide, rest are equal */}
        <div className="space-y-5">
          {projects.map((project, i) => {
            const isFirst = i === 0
            return (
              <article
                key={i}
                className={cn('relative group rounded-3xl overflow-hidden', isFirst ? 'aspect-video @md:aspect-[16/7]' : '')}
                style={{
                  background: 'rgba(255,255,255,0.05)',
                  backdropFilter: 'blur(28px) saturate(180%)',
                  WebkitBackdropFilter: 'blur(28px) saturate(180%)',
                  border: '1px solid rgba(255,255,255,0.12)',
                  boxShadow: '0 12px 40px rgba(0,0,0,0.28), inset 0 1px 0 rgba(255,255,255,0.18)',
                }}
              >
                {/* Glare */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-3xl" style={{ background: 'linear-gradient(135deg, rgba(255,255,255,0.10) 0%, transparent 55%)' }} />
                <div className="absolute top-0 left-6 right-6 h-px pointer-events-none" style={{ background: `linear-gradient(to right, transparent, ${i % 2 === 0 ? primary : secondary}70 50%, transparent)` }} />

                {/* Non-first: horizontal layout */}
                {!isFirst ? (
                  <div className="flex flex-col @sm:flex-row">
                    {/* Image */}
                    <div className={cn('relative shrink-0 @sm:w-56 @md:w-72 overflow-hidden', getAspectRatioClass(project.aspectRatio || 'landscape'), getFrameStyle(project.frameStyle || 'none'), '@sm:aspect-auto @sm:h-44 @md:h-52')}>
                      {project.image && (
                        <SiteImage
                          fillParent
                          unoptimized
                          src={project.image}
                          alt={project.title}
                          sizes="(max-width: 640px) 100vw, 25vw"
                          cropData={project.cropData}
                          imageClassName="object-cover scale-105 group-hover:scale-100 transition-transform duration-700"
                        />
                      )}
                    </div>
                    {/* Text */}
                    <div className="flex-1 p-6 @md:p-8 flex flex-col justify-center gap-3">
                      <motion.h3
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                        className={cn('text-lg @md:text-2xl font-black uppercase leading-tight text-white', theme.fontTitle)}
                      >
                        {project.title}
                      </motion.h3>
                      <motion.p
                        initial={{ opacity: 0, y: 8 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.08 }}
                        className={cn('text-xs @md:text-sm text-white/50 leading-relaxed line-clamp-2', theme.fontBody)}
                      >
                        {project.description}
                      </motion.p>
                      <div className="flex flex-wrap gap-2 pt-1">
                        {(project.tags ?? []).slice(0, 3).map((tag, idx) => (
                          <span
                            key={idx}
                            className={cn('text-[9px] uppercase tracking-wider px-2.5 py-1 rounded-full text-white/50 border border-white/10', theme.fontBody)}
                            style={{ background: 'rgba(255,255,255,0.06)' }}
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  /* First card — full image with overlay */
                  <>
                    {project.image && (
                      <SiteImage
                        fillParent
                        unoptimized
                        src={project.image}
                        alt={project.title}
                        sizes="100vw"
                        cropData={project.cropData}
                        imageClassName="object-cover scale-105 group-hover:scale-100 transition-transform duration-700"
                      />
                    )}
                    <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.80) 0%, rgba(0,0,0,0.25) 50%, transparent 100%)' }} />
                    {/* Glass text chip */}
                    <div className="absolute bottom-0 left-0 right-0 p-6 @md:p-10">
                      <div
                        className="inline-block rounded-2xl px-5 @md:px-8 py-4 @md:py-6"
                        style={{
                          background: 'rgba(255,255,255,0.08)',
                          backdropFilter: 'blur(20px) saturate(160%)',
                          WebkitBackdropFilter: 'blur(20px) saturate(160%)',
                          border: '1px solid rgba(255,255,255,0.15)',
                          boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.2)',
                        }}
                      >
                        <div className="absolute top-0 left-4 right-4 h-px" style={{ background: `linear-gradient(to right, transparent, ${primary}80, transparent)` }} />
                        <h3 className={cn('text-2xl @md:text-4xl @lg:text-5xl font-black uppercase leading-none tracking-tighter text-white', theme.fontTitle)}>{project.title}</h3>
                        <p className={cn('mt-2 text-xs @md:text-sm text-white/55 line-clamp-2 max-w-2xl', theme.fontBody)}>{project.description}</p>
                      </div>
                    </div>
                  </>
                )}
              </article>
            )
          })}
        </div>
      </div>
    </section>
  )
}
