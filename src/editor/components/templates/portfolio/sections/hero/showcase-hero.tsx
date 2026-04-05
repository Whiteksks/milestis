'use client'

import { motion, MotionConfig, type Transition } from 'framer-motion'
import { ArrowDown } from 'lucide-react'
import type { PortfolioTemplateProps } from '@/editor/lib/template-types'
import { cn } from '@/lib/utils'
import { SiteImage } from '@/editor/components/editor/section-settings/ui/site-image'

interface ShowcaseHeroProps extends Pick<PortfolioTemplateProps, 'theme' | 'sectionContent'> {
  disableAnimations?: boolean
}

export function ShowcaseHero({ theme, sectionContent, disableAnimations = false }: ShowcaseHeroProps) {
  const heroImage = sectionContent.hero.image
  const t = (duration: number, delay = 0, ease?: Transition['ease']): Transition =>
    disableAnimations ? { duration: 0, delay: 0 } : { duration, delay, ...(ease !== undefined ? { ease } : {}) }

  return (
    <MotionConfig reducedMotion={disableAnimations ? 'always' : 'user'}>
    <section
      id="hero"
      data-section-id="hero"
      className={cn(
        '@container relative flex flex-col overflow-hidden min-h-screen',
        theme.foreground,
      )}
    >
      {/* Background image — full bleed, all breakpoints */}
      {heroImage && (
        <motion.div
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={t(1.4, 0, 'easeOut')}
          className="absolute inset-0"
        >
          <SiteImage
            fillParent
            unoptimized
            src={heroImage}
            alt={sectionContent.hero.title}
            sizes="100vw"
            imageClassName="object-cover object-center"
            priority
          />
          {/* Gradient: bottom-heavy on mobile, left→right on desktop */}
          <div
            className="absolute inset-0"
            style={{
              background:
                'linear-gradient(to top, rgba(0,0,0,0.90) 0%, rgba(0,0,0,0.55) 45%, rgba(0,0,0,0.20) 100%)',
            }}
          />
          <div
            className="absolute inset-0 hidden @md:block"
            style={{
              background:
                'linear-gradient(to right, rgba(0,0,0,0.80) 0%, rgba(0,0,0,0.40) 55%, transparent 100%)',
            }}
          />
        </motion.div>
      )}

      {/* Content */}
      <div className="relative z-10 flex-1 flex flex-col justify-end @md:justify-center max-w-7xl mx-auto w-full px-6 @md:px-12 @lg:px-20 pt-28 pb-20 @md:pt-32 @md:pb-24">
        {/* Tag pill */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={t(0.6, 0.2)}
          className="mb-5 @md:mb-8 flex items-center gap-3"
        >
          <span
            className={cn(
              'inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.25em]',
              heroImage ? 'text-white/60' : 'opacity-40',
              theme.fontBody,
            )}
          >
            <span className="w-4 h-px bg-current" />
            {sectionContent.hero.subtitle || 'Portfolio'}
          </span>
        </motion.div>

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={t(0.9, 0.3)}
          className={cn(
            'leading-[0.88] uppercase font-black',
            '@lg:text-[6rem] @md:text-[4.5rem] text-[2.8rem]',
            heroImage ? 'text-white' : '',
            theme.fontTitle,
          )}
        >
          {sectionContent.hero.title}
        </motion.h1>

        {/* Description */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={t(0.8, 0.5)}
          className={cn(
            'mt-5 @md:mt-8 max-w-md text-sm @md:text-base leading-relaxed font-light',
            heroImage ? 'text-white/65' : 'opacity-50',
            theme.fontBody,
          )}
        >
          {sectionContent.hero.description}
        </motion.p>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={t(1, 1)}
        className={cn(
          'relative z-10 flex items-center justify-center pb-8',
          heroImage ? 'text-white/40' : 'opacity-30',
        )}
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
        >
          <ArrowDown size={16} />
        </motion.div>
      </motion.div>
    </section>
    </MotionConfig>
  )
}