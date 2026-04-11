'use client'

import { motion } from 'framer-motion'
import type { PortfolioTemplateProps } from '@/editor/lib/template-types'
import { Animate } from '../../../primitives/animate'
import { cn } from '@/lib/utils'

type LiquidGlassVideoProps = Pick<PortfolioTemplateProps, 'theme' | 'sectionContent'> 

export function LiquidGlassVideo({ theme, sectionContent }: LiquidGlassVideoProps) {
  const { primary, secondary, accent2 } = theme.bgEffectColors

  return (
    <section
      id="video"
      data-section-id="video"
      className="@container relative overflow-hidden py-24 @md:py-32"
      style={{ background: `radial-gradient(ellipse at 50% 50%, ${primary}35 0%, transparent 60%), radial-gradient(ellipse at 90% 10%, ${accent2}30 0%, transparent 50%), #0b0b11` }}
    >
      {/* Blob */}
      <motion.div
        animate={{ scale: [1, 1.15, 1] }}
        transition={{ repeat: Infinity, duration: 9, ease: 'easeInOut', delay: 1 }}
        className="absolute rounded-full pointer-events-none"
        style={{ width: 500, height: 500, top: '-20%', right: '-10%', background: `radial-gradient(circle, ${secondary}45 0%, transparent 70%)`, filter: 'blur(80px)' }}
      />

      <div className="relative z-10 max-w-6xl mx-auto px-6 @md:px-12 @lg:px-20">
        {/* Header */}
        <Animate direction="up" distance={16} className="flex items-end justify-between gap-8 mb-10">
          <div>
            <p className={cn('text-[10px] uppercase tracking-[0.3em] text-white/35 mb-3', theme.fontBody)}>
              {sectionContent.video.subtitle || 'Showreel'}
            </p>
            <h2 className={cn('font-black uppercase leading-none tracking-tighter text-white @lg:text-6xl @md:text-5xl text-4xl', theme.fontTitle)}>
              {sectionContent.video.title}
            </h2>
          </div>
          {sectionContent.video.description && (
            <p className={cn('hidden @md:block max-w-xs text-xs text-white/40 leading-relaxed font-light text-right', theme.fontBody)}>
              {sectionContent.video.description}
            </p>
          )}
          </Animate>

        {sectionContent.video.description && (
          <p className={cn('@md:hidden text-xs text-white/40 leading-relaxed font-light mb-8', theme.fontBody)}>
            {sectionContent.video.description}
          </p>
        )}

        {/* Video glass frame */}
        <div
          className="relative rounded-3xl overflow-hidden aspect-video"
          style={{
            background: 'rgba(255,255,255,0.05)',
            backdropFilter: 'blur(20px) saturate(160%)',
            WebkitBackdropFilter: 'blur(20px) saturate(160%)',
            border: '1px solid rgba(255,255,255,0.14)',
            boxShadow: '0 20px 60px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.20)',
          }}
        >
          {/* Top chromatic line */}
          <div className="absolute top-0 left-8 right-8 h-px z-10 pointer-events-none" style={{ background: `linear-gradient(to right, transparent, ${primary}90 40%, ${secondary}80 60%, transparent)` }} />
          {/* Corner glare */}
          <div className="absolute inset-0 pointer-events-none rounded-3xl" style={{ background: 'linear-gradient(135deg, rgba(255,255,255,0.10) 0%, transparent 40%)' }} />

          {sectionContent.video.videoUrl ? (
            <iframe
              src={sectionContent.video.videoUrl}
              className="absolute inset-0 w-full h-full rounded-3xl"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          ) : (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-5">
              {/* Glass play button */}
              <div
                className="w-18 h-18 rounded-full flex items-center justify-center border border-white/20"
                style={{
                  width: 72, height: 72,
                  background: 'rgba(255,255,255,0.10)',
                  backdropFilter: 'blur(12px)',
                  WebkitBackdropFilter: 'blur(12px)',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.25)',
                }}
              >
                <div className="ml-1 opacity-60" style={{ width: 0, height: 0, borderTop: '10px solid transparent', borderBottom: '10px solid transparent', borderLeft: '16px solid white' }} />
              </div>
              <span className={cn('text-[10px] uppercase tracking-[0.3em] text-white/25', theme.fontBody)}>
                {sectionContent.video.subtitle || ''}
              </span>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
