'use client'

import { motion } from 'framer-motion'
import Image, { type ImageLoader } from 'next/image'
import type { PortfolioTemplateProps } from '@/editor/components/editor/layout/portfolio-template-shell'
import { cn } from '@/lib/utils'
import { getAspectRatioClass } from '@/editor/lib/aspect-ratios'
import { getFrameStyle } from '@/editor/lib/frame-styles'

const passthroughLoader: ImageLoader = ({ src }) => src

interface EditorialHeroProps extends Pick<PortfolioTemplateProps, 'theme' | 'sectionContent'> {}

export function EditorialHero({ theme, sectionContent }: EditorialHeroProps) {
  const heroImage = sectionContent.hero.image

  const descriptionBlock = (
    <div className="space-y-5 max-w-sm">
      <div className="w-10 h-px bg-current opacity-20" />
      <motion.p
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.4 }}
        className={cn(
          'text-sm @md:text-base opacity-60 font-light leading-relaxed',
          theme.fontBody,
        )}
      >
        {sectionContent.hero.description}
      </motion.p>
    </div>
  )

  return (
    <motion.section
      id="hero"
      data-section-id="hero"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
        className={cn(
        '@container relative overflow-hidden min-h-[88vh] max-w-7xl mx-auto flex flex-col justify-center',
        theme.foreground,
        )}
    >
      {/* Main grid: 2 cols on desktop, stack on mobile */}
      <div className="flex-1 grid grid-cols-1 @md:grid-cols-2 items-stretch">

        {/* LEFT: label + title + description (desktop only) */}
        <div className="relative z-20 flex flex-col @lg:pl-20 @md:pl-12 pl-6 pr-6 pt-24 @md:pt-32 pb-10 @md:pb-14">

          {/* Label row */}
          <div className="flex items-center gap-5 mb-10">
            <p className={cn('text-[10px] uppercase opacity-30', theme.letterSpacing, theme.fontBody)}>
              {sectionContent.hero.subtitle || 'Editorial'}
            </p>
            <div className="w-16 h-px bg-current opacity-10" />
            <p className={cn('text-[10px] uppercase opacity-20', theme.letterSpacing, theme.fontBody)}>
              N°01
            </p>
          </div>

          {/* Title — overflows onto photo on desktop */}
          <motion.h1
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.9, delay: 0.2 }}
            className={cn(
              'uppercase tracking-tighter leading-[0.85]',
              '@lg:text-[5rem] @md:text-6xl text-4xl',
              heroImage ? '@lg:-mr-[65%] @md:-mr-[25%] mr-0' : 'mr-0',
              theme.fontTitle,
            )}
          >
            {sectionContent.hero.title}
          </motion.h1>

          {/* Description — bottom of left col, desktop only */}
          <div className="mt-auto pt-14 hidden @md:block">
            {descriptionBlock}
          </div>
        </div>

        {/* RIGHT: photo — vertically centered, clears header with top padding */}
        {heroImage && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1.1, delay: 0.15 }}
            className="flex items-center justify-center @md:pr-10 @lg:pr-20 px-6 @md:px-0 pt-8 @md:pt-28 @lg:pt-32 pb-8 @md:pb-14"
          >
            {/* Aspect-ratio container — centered both axes */}
            <div
              className={cn(
                'relative w-full overflow-hidden',
                getAspectRatioClass(sectionContent.hero.imageAspectRatio || 'portrait'),
                getFrameStyle(sectionContent.hero.imageFrameStyle || 'none'),
              )}
            >
              <Image
                loader={passthroughLoader}
                unoptimized
                src={heroImage}
                alt={sectionContent.hero.title}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover"
                priority
              />
            </div>
          </motion.div>
        )}
      </div>

      {/* Description — mobile only, below photo */}
      <div className="@md:hidden @lg:px-20 @md:px-12 px-6 pb-10 pt-4">
        {descriptionBlock}
      </div>

      {/* Bottom rule */}
      <div className="@lg:px-20 @md:px-12 px-6">
        <div className="max-w-7xl mx-auto border-t border-current/10" />
      </div>
    </motion.section>
  )
}