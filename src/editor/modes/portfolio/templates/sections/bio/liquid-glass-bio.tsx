'use client'

import { motion } from 'framer-motion'
import type { PortfolioTemplateProps } from '@/editor/lib/template-types'
import { cn } from '@/lib/utils'
import { SlotImage } from '@/editor/image'
import { Animate } from '@/editor/components/templates/primitives/animate'

type LiquidGlassBioProps = Pick<PortfolioTemplateProps, 'theme' | 'sectionContent' | 'imageContent'> 

export function LiquidGlassBio({ theme, sectionContent, imageContent }: LiquidGlassBioProps) {
  const { title, subtitle, description, achievements } = sectionContent.bio
  const bioImage = imageContent?.bio
  const { primary, secondary, accent2 } = theme.bgEffectColors

  return (
    <section
      id="bio"
      data-section-id="bio"
      className="@container relative w-full overflow-hidden py-24 @md:py-32"
      style={{ background: `radial-gradient(ellipse at 80% 20%, ${primary}40 0%, transparent 55%), radial-gradient(ellipse at 10% 80%, ${secondary}35 0%, transparent 50%), #0c0c12` }}
    >
      <motion.div
        animate={{ scale: [1, 1.12, 1], opacity: [0.4, 0.6, 0.4] }}
        transition={{ repeat: Infinity, duration: 8, ease: 'easeInOut' }}
        className="absolute rounded-full pointer-events-none"
        style={{ width: 400, height: 400, top: '10%', right: '-5%', background: `radial-gradient(circle, ${accent2}50 0%, transparent 70%)`, filter: 'blur(70px)' }}
      />

      <div className="relative z-10 max-w-6xl mx-auto px-6 @md:px-12 @lg:px-20">
          <Animate direction="left" distance={20} className="flex items-center gap-4 mb-12">
          <div
            className="px-3 py-1.5 rounded-full border border-white/15 text-[10px] uppercase tracking-[0.28em] text-white/50"
            style={{ background: 'rgba(255,255,255,0.06)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)' }}
          >
            {subtitle || 'About'}
          </div>
        </Animate>

        <div
          className="relative rounded-3xl overflow-hidden"
          style={{
            background: 'rgba(255,255,255,0.06)',
            backdropFilter: 'blur(32px) saturate(180%)',
            WebkitBackdropFilter: 'blur(32px) saturate(180%)',
            border: '1px solid rgba(255,255,255,0.14)',
            boxShadow: '0 20px 60px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.22), inset 0 -1px 0 rgba(0,0,0,0.08)',
          }}
        >
          <div className="absolute inset-0 rounded-3xl pointer-events-none" style={{ background: 'linear-gradient(135deg, rgba(255,255,255,0.12) 0%, transparent 50%)' }} />
          <div className="absolute top-0 left-8 right-8 h-px pointer-events-none" style={{ background: `linear-gradient(to right, transparent, ${primary}88, transparent)` }} />

          <div className="flex flex-col @md:flex-row gap-0">
            {bioImage && (
              <div className="shrink-0 relative @md:rounded-r-none rounded-t-3xl @md:rounded-l-3xl overflow-hidden">
                <SlotImage
                  slotId={bioImage.slotId}
                  value={bioImage.value}
                  templateId="liquid-glass"
                  alt={title || 'Profile'}
                  sizes="(max-width: 768px) 100vw, 320px"
                  className="@md:w-64 @lg:w-80 w-full"
                  imageClassName="object-cover"
                />
                <div className="absolute inset-0 pointer-events-none" style={{ background: 'linear-gradient(to right, transparent 70%, rgba(0,0,0,0.4) 100%)' }} />
              </div>
            )}

            <div className="flex-1 p-7 @md:p-10 @lg:p-14 space-y-6">
              <Animate
                direction="up"
                distance={16}
                as="h2"
                className={cn(
                  'font-black uppercase leading-tight tracking-tighter text-white',
                  '@lg:text-5xl @md:text-4xl text-3xl',
                  theme.fontTitle,
                )}
                style={{ textShadow: '0 2px 20px rgba(0,0,0,0.3)' }}
              >
                {title}
              </Animate>

              <Animate
                direction="up"
                distance={12}
                delay={0.1}
                as="p"
                className={cn('text-sm @md:text-base text-white/55 font-light leading-relaxed whitespace-pre-line', theme.lineHeight, theme.fontBody)}
              >
                {description}
              </Animate>

              {achievements && achievements.length > 0 && (
                <Animate
                  direction="up"
                  distance={10}
                  delay={0.2}
                  className="pt-6 border-t border-white/10"
                >
                  <p className={cn('text-[10px] uppercase tracking-widest text-white/30 mb-5', theme.fontBody)}>
                    {subtitle || 'Highlights'}
                  </p>
                  <div className="grid @sm:grid-cols-2 grid-cols-1 gap-3">
                    {achievements.map((item, i) => (
                      <div key={i} className="flex items-start gap-3 group">
                        {/* Glass pill bullet */}
                        <div
                          className="mt-1 shrink-0 w-1.5 h-1.5 rounded-full"
                          style={{ background: i % 2 === 0 ? primary : secondary, boxShadow: `0 0 6px ${i % 2 === 0 ? primary : secondary}` }}
                        />
                        <p className={cn('text-xs text-white/50 leading-relaxed group-hover:text-white/75 transition-colors', theme.fontBody)}>
                          {item}
                        </p>
                      </div>
                    ))}
                  </div>
                </Animate>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

