'use client'

import { motion } from 'framer-motion'
import Image, { type ImageLoader } from 'next/image'
import { ArrowUpRight } from 'lucide-react'
import type { PortfolioTemplateProps } from '@/editor/components/editor/layout/portfolio-template-shell'
import type { FrameStyle } from '@/editor/lib/types'
import { cn } from '@/lib/utils'
import { getFrameStyle } from '@/editor/lib/frame-styles'

const passthroughLoader: ImageLoader = ({ src }) => src

interface BentoFeaturedWorkProps extends Pick<PortfolioTemplateProps, 'theme' | 'sectionContent'> {}

type Project = {
  title: string
  description: string
  image: string
  tags?: string[]
  frameStyle?: FrameStyle
}

// ─── Reusable project card ────────────────────────────────────────────────────

function ProjectCard({
  project,
  index,
  className,
  imgSizes = '(max-width: 768px) 100vw, 50vw',
  titleSize = 'text-sm',
}: {
  project: Project
  index: number
  className?: string
  imgSizes?: string
  titleSize?: string
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.55, delay: index * 0.065, ease: [0.22, 1, 0.36, 1] }}
      className={cn(
        'group relative overflow-hidden rounded-3xl cursor-pointer select-none',
        className,
      )}
    >
      {/* Image */}
      {project.image ? (
        <Image
          loader={passthroughLoader}
          unoptimized
          src={project.image}
          alt={project.title || 'Project'}
          fill
          sizes={imgSizes}
          className={cn(
            'object-cover transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] will-change-transform group-hover:scale-[1.07]',
            getFrameStyle(project.frameStyle || 'none'),
          )}
        />
      ) : (
        <div className="absolute inset-0 bg-current/5" />
      )}

      {/* Always-visible gradient */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/5 to-transparent pointer-events-none" />

      {/* Hover: darken whole card slightly */}
      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/15 transition-colors duration-300 pointer-events-none" />

      {/* Top row — tags & arrow (appears on hover) */}
      <div className={cn(
        'absolute top-0 left-0 right-0 p-4 flex items-start justify-between gap-2',
        'opacity-0 -translate-y-1 group-hover:opacity-100 group-hover:translate-y-0',
        'transition-all duration-300 ease-out',
      )}>
        <div className="flex flex-wrap gap-1 min-w-0">
          {project.tags?.slice(0, 3).map((tag, i) => (
            <span
              key={i}
              className="px-2 py-0.5 text-[9px] font-medium rounded-full bg-black/35 text-white/90 backdrop-blur-md border border-white/10 leading-5 whitespace-nowrap"
            >
              {tag}
            </span>
          ))}
        </div>
        <div className="flex-shrink-0 w-7 h-7 rounded-full bg-white/15 backdrop-blur-md border border-white/15 flex items-center justify-center">
          <ArrowUpRight className="w-3.5 h-3.5 text-white" />
        </div>
      </div>

      {/* Index badge (fades out on hover) */}
      <span className={cn(
        'absolute top-4 right-4 text-[11px] font-mono tabular-nums text-white/30',
        'transition-opacity duration-200 group-hover:opacity-0 pointer-events-none',
      )}>
        {String(index + 1).padStart(2, '0')}
      </span>

      {/* Bottom info */}
      <div className={cn(
        'absolute bottom-0 left-0 right-0 p-5',
        'translate-y-1.5 group-hover:translate-y-0 transition-transform duration-300 ease-out',
      )}>
        <h3 className={cn('text-white font-semibold leading-tight line-clamp-1', titleSize)}>
          {project.title}
        </h3>
        <p className={cn(
          'text-white/50 text-xs mt-1.5 leading-relaxed line-clamp-2',
          'opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-[60ms]',
        )}>
          {project.description}
        </p>
      </div>
    </motion.div>
  )
}

// ─── Main component ───────────────────────────────────────────────────────────

export function BentoFeaturedWork({ theme, sectionContent }: BentoFeaturedWorkProps) {
  const projects = sectionContent.featuredWork.projects ?? []
  const [p1, p2, p3, ...rest] = projects

  return (
    <section
      id="work"
      data-section-id="featured-work"
      className={cn('@container', theme.foreground)}
    >
      <div className="@lg:px-6 @md:px-5 px-4 py-3">
        <div className="max-w-6xl mx-auto space-y-3">

          {/* ── Header ── */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className={cn(
              'rounded-3xl border border-current/8 px-6 py-4 flex items-center justify-between gap-4',
              theme.card,
            )}
          >
            <div className="min-w-0">
              <p className={cn('text-[10px] uppercase tracking-widest opacity-35 mb-0.5', theme.fontBody)}>
                {sectionContent.featuredWork.subtitle || 'Selected work'}
              </p>
              <h2 className={cn('@lg:text-2xl text-xl font-bold tracking-tight', theme.fontTitle)}>
                {sectionContent.featuredWork.title}
              </h2>
            </div>
            <span className={cn('flex-shrink-0 text-[10px] tabular-nums opacity-20', theme.fontBody)}>
              {projects.length.toString().padStart(2, '0')}
            </span>
          </motion.div>

          {/* ── Bento grid ── */}
          {projects.length > 0 && (
            <>
              {/* ─ 1 project: full-width hero ─ */}
              {projects.length === 1 && p1 && (
                <ProjectCard
                  project={p1}
                  index={0}
                  imgSizes="100vw"
                  titleSize="text-xl"
                  className={cn('border border-current/8 min-h-[55vh]', theme.card)}
                />
              )}

              {/* ─ 2 projects: equal halves ─ */}
              {projects.length === 2 && (
                <div className="grid @md:grid-cols-2 grid-cols-1 gap-3">
                  {[p1, p2].map((p, i) => p && (
                    <ProjectCard
                      key={i}
                      project={p}
                      index={i}
                      imgSizes="(max-width: 768px) 100vw, 50vw"
                      titleSize="text-base"
                      className={cn('border border-current/8 min-h-[44vh]', theme.card)}
                    />
                  ))}
                </div>
              )}

              {/* ─ 3+ projects: true 2D bento ─ */}
              {projects.length >= 3 && (
                <div className="grid @lg:grid-cols-12 @md:grid-cols-2 grid-cols-1 gap-3">

                  {/* [1] Featured — 8 cols, row-span-2 */}
                  {p1 && (
                    <ProjectCard
                      project={p1}
                      index={0}
                      imgSizes="(max-width: 768px) 100vw, 67vw"
                      titleSize="text-base"
                      className={cn(
                        'border border-current/8',
                        '@lg:col-span-8 @lg:row-span-2 min-h-[46vh] @lg:min-h-[560px]',
                        theme.card,
                      )}
                    />
                  )}

                  {/* [2] Top-right — 4 cols */}
                  {p2 && (
                    <ProjectCard
                      project={p2}
                      index={1}
                      imgSizes="(max-width: 768px) 100vw, 33vw"
                      titleSize="text-sm"
                      className={cn(
                        'border border-current/8',
                        '@lg:col-span-4 min-h-[30vh] @lg:min-h-[272px]',
                        theme.card,
                      )}
                    />
                  )}

                  {/* [3] Bottom-right — 4 cols */}
                  {p3 && (
                    <ProjectCard
                      project={p3}
                      index={2}
                      imgSizes="(max-width: 768px) 100vw, 33vw"
                      titleSize="text-sm"
                      className={cn(
                        'border border-current/8',
                        '@lg:col-span-4 min-h-[30vh] @lg:min-h-[272px]',
                        theme.card,
                      )}
                    />
                  )}

                  {/* [4+] Bottom row — equal thirds */}
                  {rest.length > 0 && (
                    <div className="@lg:col-span-12 @md:col-span-2 col-span-1 grid @lg:grid-cols-3 @md:grid-cols-2 grid-cols-1 gap-3">
                      {rest.map((project, i) => (
                        <ProjectCard
                          key={i}
                          project={project}
                          index={i + 3}
                          imgSizes="(max-width: 768px) 100vw, 33vw"
                          titleSize="text-sm"
                          className={cn(
                            'border border-current/8 min-h-[30vh]',
                            theme.card,
                          )}
                        />
                      ))}
                    </div>
                  )}

                </div>
              )}
            </>
          )}

        </div>
      </div>
    </section>
  )
}
