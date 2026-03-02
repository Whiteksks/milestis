'use client'

import { motion } from 'framer-motion'
import type { PortfolioTemplateProps } from '@/editor/components/editor/layout/portfolio-template-shell'
import { cn } from '@/lib/utils'
import { CroppedImage } from '@/editor/components/editor/section-settings/ui/cropped-image'

interface BentoHeroProps extends Pick<PortfolioTemplateProps, 'theme' | 'sectionContent'> {}

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] as const },
})

export function BentoHero({ theme, sectionContent }: BentoHeroProps) {
  const heroImage = sectionContent.hero.image
  const initials = sectionContent.hero.title
    ? sectionContent.hero.title
        .split(' ')
        .map((w: string) => w[0])
        .join('')
        .slice(0, 2)
        .toUpperCase()
    : '?'

  return (
    <section
      id="hero"
      data-section-id="hero"
      className={cn('@container', theme.foreground)}
    >
      <div className="@lg:px-6 @md:px-5 px-4 pt-20 @md:pt-24 pb-3">
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
                <div className="shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-current/10 opacity-60">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span className={cn('text-[10px] uppercase tracking-wider', theme.fontBody)}>Open</span>
                </div>
              </div>
            </motion.div>

            {/* [B] Photo or monogram card */}
            <motion.div
              {...fadeUp(0.1)}
              className={cn(
                '@lg:col-span-5 @md:col-span-2 col-span-1',
                'relative rounded-3xl border border-current/8 overflow-hidden min-h-[52vh]',
                theme.card,
              )}
            >
              {heroImage ? (
                <>
                  <CroppedImage
                    src={heroImage}
                    alt={sectionContent.hero.title}
                    aspectRatio={'portrait'}
                    frameStyle={'none'}
                    fixedAspectRatio
                    cropData={sectionContent.hero.imageCropData}
                    className="transition-transform duration-700 hover:scale-[1.03]"
                    priority
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent pointer-events-none" />
                </>
              ) : (
                <div className="w-full h-full flex items-center justify-center min-h-[52vh]">
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
  )
}
