'use client'

import { motion } from 'framer-motion'
import type { PortfolioTemplateProps } from '@/editor/lib/template-types'
import { cn } from '@/lib/utils'
import { SlotImage } from '@/editor/image'
import { Animate } from '@/editor/components/templates/primitives/animate'

type LiquidGlassHeroProps = Pick<PortfolioTemplateProps, 'theme' | 'sectionContent' | 'imageContent'> 

export function LiquidGlassHero({ theme, sectionContent, imageContent }: LiquidGlassHeroProps) {
  const heroImage = imageContent?.hero
  const { primary, secondary, accent2 } = theme.bgEffectColors
  return (
    <section
      id="hero"
      data-section-id="hero"
      className="@container relative min-h-screen flex flex-col items-center justify-center overflow-hidden"
      style={{
        background: `radial-gradient(ellipse at 65% 35%, ${primary}50 0%, transparent 55%),
          radial-gradient(ellipse at 15% 75%, ${secondary}40 0%, transparent 55%),
          radial-gradient(ellipse at 85% 85%, ${accent2}30 0%, transparent 50%),
          #07070e`,
      }}
    >
      {/* Deep background orbs   slow, organic drift */}
      <motion.div
        animate={{ x: [0, 50, 18, 0], y: [0, -35, 14, 0], scale: [1, 1.12, 0.96, 1] }}
        transition={{ repeat: Infinity, duration: 18, ease: 'easeInOut' }}
        className="absolute rounded-full pointer-events-none"
        style={{
          width: 750, height: 750, top: '-20%', left: '-18%',
          background: `radial-gradient(circle, ${primary}55 0%, transparent 68%)`,
          filter: 'blur(90px)',
        }}
      />
      <motion.div
        animate={{ x: [0, -45, -18, 0], y: [0, 40, -12, 0], scale: [1, 0.88, 1.06, 1] }}
        transition={{ repeat: Infinity, duration: 22, ease: 'easeInOut', delay: 3 }}
        className="absolute rounded-full pointer-events-none"
        style={{
          width: 650, height: 650, bottom: '-18%', right: '-14%',
          background: `radial-gradient(circle, ${secondary}50 0%, transparent 68%)`,
          filter: 'blur(80px)',
        }}
      />
      <motion.div
        animate={{ x: [0, 28, 0], y: [0, -50, 0], scale: [1, 1.18, 1] }}
        transition={{ repeat: Infinity, duration: 14, ease: 'easeInOut', delay: 6 }}
        className="absolute rounded-full pointer-events-none"
        style={{
          width: 420, height: 420, top: '38%', left: '52%',
          background: `radial-gradient(circle, ${accent2}42 0%, transparent 70%)`,
          filter: 'blur(65px)',
        }}
      />

      {/* Hero image (behind glass) */}
      {heroImage && (
        <Animate trigger="mount" type="scale" scaleOffset={1.06} className="absolute inset-0">
          <SlotImage
            slotId={heroImage.slotId}
            value={heroImage.value}
            templateId="liquid-glass"
            fillParent
            alt={sectionContent.hero.title}
            sizes="100vw"
            imageClassName="object-cover object-center opacity-20"
            priority
          />
          <div
            className="absolute inset-0"
            style={{ background: 'linear-gradient(to bottom, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0.7) 100%)' }}
          />
        </Animate>
      )}

      {/*   Content layout   */}
      <div className="relative z-10 w-full max-w-5xl mx-auto px-6 @md:px-14 pt-28 pb-20 @md:py-32 flex flex-col gap-8">

        {/* Floating subtitle chip */}
        <Animate trigger="mount" delay={0.25} type="scale" scaleOffset={0.9} direction="down" distance={14} className="flex">
          <div
            className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full"
            style={{
              background: 'rgba(255,255,255,0.07)',
              backdropFilter: 'blur(24px) saturate(160%)',
              WebkitBackdropFilter: 'blur(24px) saturate(160%)',
              border: '1px solid rgba(255,255,255,0.14)',
              boxShadow: '0 4px 18px rgba(0,0,0,0.25), inset 0 1px 0 rgba(255,255,255,0.18)',
            }}
          >
            {/* Glowing status dot */}
            <motion.div
              animate={{ opacity: [0.6, 1, 0.6], scale: [1, 1.25, 1] }}
              transition={{ repeat: Infinity, duration: 2.4, ease: 'easeInOut' }}
              className="w-1.5 h-1.5 rounded-full"
              style={{ background: primary, boxShadow: `0 0 7px ${primary}` }}
            />
            <span className={cn('text-[10px] uppercase tracking-[0.3em] text-white/55', theme.fontBody)}>
              {sectionContent.hero.subtitle || 'Portfolio'}
            </span>
          </div>
        </Animate>

        {/* Large title */}
        <Animate
          trigger="mount"
          delay={0.4}
          distance={36}
          as="h1"
          className={cn(
            'font-black uppercase leading-[0.86] tracking-tighter text-white',
            '@lg:text-[5rem] @md:text-[4rem] text-[2.5rem]',
            theme.fontTitle,
          )}
          style={{ textShadow: '0 2px 50px rgba(0,0,0,0.55)' }}
        >
          {sectionContent.hero.title}
        </Animate>

        {/* Glass info card   description + accent row */}
        <div className="relative max-w-xl">
          <div
            className="relative rounded-2xl overflow-hidden p-6 @md:p-7"
            style={{
              background: 'rgba(255,255,255,0.065)',
              backdropFilter: 'blur(36px) saturate(190%) brightness(1.07)',
              WebkitBackdropFilter: 'blur(36px) saturate(190%) brightness(1.07)',
              border: '1px solid rgba(255,255,255,0.14)',
              boxShadow:
                '0 20px 60px rgba(0,0,0,0.4), 0 1px 0 rgba(255,255,255,0.06) inset, inset 0 1px 0 rgba(255,255,255,0.22), inset 1px 0 0 rgba(255,255,255,0.08)',
            }}
          >
            {/* Top edge specular highlight */}
            <div
              className="absolute top-0 left-5 right-5 h-px pointer-events-none"
              style={{ background: 'linear-gradient(to right, transparent, rgba(255,255,255,0.45), transparent)' }}
            />
            {/* Chromatic color tint line */}
            <div
              className="absolute top-0 left-10 right-16 h-[1.5px] rounded-full pointer-events-none opacity-60"
              style={{ background: `linear-gradient(to right, ${primary}cc, ${secondary}99, transparent)` }}
            />
            {/* Corner glare */}
            <div
              className="absolute inset-0 pointer-events-none rounded-2xl"
              style={{
                background:
                  'linear-gradient(135deg, rgba(255,255,255,0.11) 0%, rgba(255,255,255,0.03) 35%, transparent 65%)',
              }}
            />
            {/* Left edge glow */}
            <div
              className="absolute top-4 bottom-4 left-0 w-px pointer-events-none"
              style={{ background: `linear-gradient(to bottom, transparent, ${primary}55, transparent)` }}
            />
            {/* Animated glare sweep */}
            <motion.div
              animate={{ x: ['-120%', '220%'] }}
              transition={{ repeat: Infinity, duration: 4.5, ease: 'easeInOut', repeatDelay: 5 }}
              className="absolute inset-y-0 w-1/3 pointer-events-none"
              style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.055), transparent)', transform: 'skewX(-18deg)' }}
            />

            <Animate
              trigger="mount"
              delay={0.55}
              distance={10}
              as="p"
              className={cn('relative text-sm @md:text-base text-white/62 font-light leading-relaxed', theme.fontBody)}
            >
              {sectionContent.hero.description}
            </Animate>

            {/* Accent row */}
            <div className="relative mt-5 pt-4 border-t border-white/[0.08] flex items-center justify-end">
              <div className="flex gap-2">
                {[primary, secondary, accent2].map((c, i) => (
                  <div
                    key={i}
                    className="w-2 h-2 rounded-full"
                    style={{ background: c }}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

