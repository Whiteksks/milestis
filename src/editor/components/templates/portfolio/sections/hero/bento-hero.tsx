'use client'

import { motion, MotionConfig } from 'framer-motion'
import type { PortfolioTemplateProps } from '@/editor/lib/template-types'
import { cn } from '@/lib/utils'
import { SiteImage } from '@/editor/components/editor/section-settings/ui/site-image'

interface BentoHeroProps extends Pick<PortfolioTemplateProps, 'theme' | 'sectionContent'> {
  disableAnimations?: boolean
}

export function BentoHero({ theme, sectionContent, disableAnimations = false }: BentoHeroProps) {
  const heroImage = sectionContent.hero.image
  const initials = sectionContent.hero.title
    ? sectionContent.hero.title
        .split(' ')
        .map((w: string) => w[0])
        .join('')
        .slice(0, 2)
        .toUpperCase()
    : '?'
  const fadeUp = (delay = 0) => ({
    initial: { opacity: 0, y: 24 },
    animate: { opacity: 1, y: 0 },
    transition: disableAnimations
      ? { duration: 0, delay: 0 }
      : { duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] as const },
  })

  return (
    <MotionConfig reducedMotion={disableAnimations ? 'always' : 'user'}>
    <section
      id="hero"
      data-section-id="hero"
      className={cn('@container', theme.foreground)}
    >
      <div className="@lg:px-6 @md:px-5 px-4 pt-20 @md:pt-24 pb-4">
        <div className="max-w-6xl mx-auto">

          {/* ── Bento grid: Row 1 ── */}
          <div className="grid @lg:grid-cols-12 @md:grid-cols-6 grid-cols-1 gap-3">

            {/* [A] Title / intro card */}
            <motion.div
              {...fadeUp(0)}
              className={cn(
                '@lg:col-span-7 @md:col-span-4 col-span-1',
                'relative rounded-3xl border border-current/8 overflow-hidden',
                'flex flex-col justify-between p-8 @lg:p-10 min-h-[52vh]',
                theme.card,
              )}
            >
              {/* Role chip */}
              <span className={cn(
                'self-start inline-flex items-center px-3 py-1 text-[10px] uppercase tracking-widest',
                'rounded-full border border-current/12 opacity-45',
                theme.fontBody,
              )}>
                {sectionContent.hero.subtitle}
              </span>

              {/* Big heading */}
              <h1 className={cn(
                '@lg:text-[5rem] @md:text-6xl text-5xl font-bold leading-[0.92] tracking-tight',
                theme.fontTitle,
              )}>
                {sectionContent.hero.title}
              </h1>

              {/* Bottom row: description + status */}
              <div className="flex items-end justify-between gap-4 flex-wrap">
                <p className={cn(
                  'text-xs opacity-50 leading-relaxed max-w-xs',
                  theme.lineHeight, theme.fontBody,
                )}>
                  {sectionContent.hero.description}
                </p>

              </div>
            </motion.div>

            {/* [B] Photo or monogram card */}
            <motion.div
              {...fadeUp(0.1)}
              className={cn(
                '@lg:col-span-5 @md:col-span-2 col-span-1',
                'relative rounded-3xl border border-current/8 overflow-hidden min-h-[52vh] flex items-center justify-center',
                theme.card,
              )}
            >
              {heroImage ? (
                <>
                  <SiteImage
                    src={heroImage}
                    alt={sectionContent.hero.title}
                    aspectRatio={sectionContent.hero.aspectRatio || 'portrait'}
                    frameStyle={sectionContent.hero.frameStyle || 'none'}
                    cropData={sectionContent.hero.cropData}
                    className="transition-transform duration-700 hover:scale-[1.03]"
                    priority
                  />
                  <div className="absolute inset-0 pointer-events-none" />
                </>
              ) : (
                <div className="w-full h-full flex items-center justify-center min-h-[54vh]">
                  <span className={cn(
                    '@lg:text-8xl @md:text-6xl text-5xl font-bold opacity-[0.06] select-none',
                    theme.fontTitle,
                  )}>
                    {initials}
                  </span>
                </div>
              )}
            </motion.div>

          </div>
        </div>
      </div>
    </section>
    </MotionConfig>
  )
}
