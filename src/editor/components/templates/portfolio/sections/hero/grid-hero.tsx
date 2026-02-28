'use client'

import { motion } from 'framer-motion'
import Image, { type ImageLoader } from 'next/image'
import type { PortfolioTemplateProps } from '@/editor/components/editor/layout/portfolio-template-shell'
import { cn } from '@/lib/utils'
import { getFrameStyle } from '@/editor/lib/frame-styles'
import { getAspectRatioClass } from '@/editor/lib/aspect-ratios'

const passthroughLoader: ImageLoader = ({ src }) => src

interface GridHeroProps extends Pick<PortfolioTemplateProps, 'theme' | 'sectionContent'> {}

export function GridHero({ theme, sectionContent }: GridHeroProps) {
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
      className={cn('@container pt-20 @md:pt-24 pb-3', theme.foreground)}
    >
      <div className="max-w-7xl mx-auto px-4 @md:px-6 @lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className={cn(
            'relative rounded-2xl border border-current/8',
            'p-8 @lg:p-14 min-h-[72vh] flex items-center',
            theme.card,
          )}
        >
          <div className="grid grid-cols-1 @lg:grid-cols-12 gap-10 items-center w-full relative z-10">

            {/* [LEFT] Text */}
            <div className="@lg:col-span-6 space-y-8">
              <div className="space-y-5">
                <div className="flex items-center gap-3">
                  <div className="h-px w-5 bg-current opacity-25" />
                  <span className={cn('text-[10px] uppercase tracking-[0.3em] opacity-50', theme.fontBody)}>
                    {sectionContent.hero.subtitle}
                  </span>
                </div>

                <h1 className={cn(
                  'text-5xl @md:text-6xl @lg:text-7xl font-bold leading-[0.9] tracking-tight',
                  theme.fontTitle,
                )}>
                  {sectionContent.hero.title}
                </h1>

                <p className={cn(
                  'text-base opacity-50 leading-relaxed max-w-sm',
                  theme.fontBody,
                )}>
                  {sectionContent.hero.description}
                </p>
              </div>

              <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full border border-current/10 bg-current/[0.02]">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
                </span>
                <span className={cn('text-[10px] uppercase tracking-widest opacity-55', theme.fontBody)}>
                  Open for opportunities
                </span>
              </div>
            </div>

            {/* [RIGHT] Photo — large */}
            <div className="@lg:col-span-6 flex justify-center @lg:justify-end">
              <div className={cn(
                'relative w-full overflow-hidden rounded-2xl group',
                'transition-transform duration-500 hover:-translate-y-1',
                getAspectRatioClass(sectionContent.hero.imageAspectRatio || 'square'),
              )}>
                {heroImage ? (
                  <Image
                    loader={passthroughLoader}
                    unoptimized
                    src={heroImage}
                    alt={sectionContent.hero.title || 'Hero Image'}
                    fill
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    className={cn(
                      'object-cover transition-[filter] duration-500 group-hover:brightness-105',
                      getFrameStyle(sectionContent.hero.imageFrameStyle || 'none'),
                    )}
                    priority
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center bg-current/[0.03]">
                    <span className={cn('text-8xl font-bold opacity-[0.06] select-none', theme.fontTitle)}>
                      {initials}
                    </span>
                  </div>
                )}
              </div>
            </div>

          </div>
        </motion.div>
      </div>
    </section>
  )
}