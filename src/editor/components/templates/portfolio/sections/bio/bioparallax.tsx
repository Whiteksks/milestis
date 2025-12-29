'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { cn } from '@/lib/utils'
import type { PortfolioTemplateProps } from '@/editor/components/editor/ui/portfolio-template-shell'
import { useCanvasScrollContainer } from '@/editor/components/editor/canvas-scroll-context'
import { getAspectRatioClass } from '@/editor/lib/aspect-ratios'
import { getFrameStyle } from '@/editor/lib/frame-styles'

type BioParallaxProps = Pick<PortfolioTemplateProps, 'theme' | 'sectionContent'>

function clamp01(value: number) {
  return Math.min(1, Math.max(0, value))
}

function useSectionParallaxY(sectionRef: React.RefObject<HTMLElement | null>, strengthPx = 60) {
  const scrollRef = useCanvasScrollContainer()
  const [y, setY] = useState(0)

  useEffect(() => {
    const sectionEl = sectionRef.current
    if (!sectionEl) return

    const containerEl = scrollRef?.current
    let rafId = 0

    const update = () => {
      rafId = 0
      const rect = sectionEl.getBoundingClientRect()

      const viewportHeight = containerEl?.clientHeight ?? window.innerHeight
      const total = viewportHeight + rect.height
      const progress = total > 0 ? (viewportHeight - rect.top) / total : 0
      const t = clamp01(progress)

      const nextY = (t - 0.5) * strengthPx
      setY(Math.round(nextY))
    }

    const scheduleUpdate = () => {
      if (rafId) return
      rafId = window.requestAnimationFrame(update)
    }

    update()

    if (containerEl) {
      containerEl.addEventListener('scroll', scheduleUpdate, { passive: true })
    } else {
      window.addEventListener('scroll', scheduleUpdate, { passive: true })
    }
    window.addEventListener('resize', scheduleUpdate)

    return () => {
      if (containerEl) {
        containerEl.removeEventListener('scroll', scheduleUpdate)
      } else {
        window.removeEventListener('scroll', scheduleUpdate)
      }
      window.removeEventListener('resize', scheduleUpdate)
      if (rafId) window.cancelAnimationFrame(rafId)
    }
  }, [scrollRef, sectionRef, strengthPx])

  return y
}

export function BioParallaxFramer({ theme, sectionContent }: BioParallaxProps) {
  const sectionRef = useRef<HTMLElement>(null)
  const canvasScrollRef = useCanvasScrollContainer()

  const { scrollYProgress } = useScroll({
    container: (canvasScrollRef ?? undefined) as unknown as React.RefObject<HTMLElement> | undefined,
    target: sectionRef as unknown as React.RefObject<HTMLElement>,
    offset: ['start end', 'end start'],
  })

  const parallaxStrengthPx = 200
  const y = useTransform(scrollYProgress, [0, 1], [-parallaxStrengthPx / 2, parallaxStrengthPx / 2])

  return (
    <motion.section
      id="bio"
      ref={sectionRef}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-100px' }}
      transition={{ duration: 0.8, delay: 0.2 }}
      className="@container"
    >
      <div className="@lg:px-12 @md:px-8 px-4 @lg:py-20 @md:py-16 py-12">
        <div className="max-w-4xl mx-auto grid @md:grid-cols-2 grid-cols-1 gap-8 items-center">
          <div>
            <div
              className={cn(
                'relative overflow-hidden',
                theme.shadow,
                getFrameStyle(sectionContent.bio.imageFrameStyle || 'soft'),
              )}
            >
              <motion.img
                src={sectionContent.bio.image || '/placeholder.svg?height=600&width=600'}
                alt={sectionContent.bio.title || 'Profile image'}
                className={cn('w-full object-cover', getAspectRatioClass(sectionContent.bio.imageAspectRatio))}
                style={{
                  y,
                  scale: 1.08,
                  willChange: 'transform',
                }}
              />
            </div>
          </div>
          <div>
            {sectionContent.bio.subtitle && (
              <p className={cn('text-sm font-medium uppercase tracking-wider mb-2 opacity-60', theme.fontTitle)}>
                {sectionContent.bio.subtitle}
              </p>
            )}
            <h3 className={cn('@lg:text-4xl @md:text-3xl text-2xl font-bold mb-4', theme.fontTitle)}>
              {sectionContent.bio.title}
            </h3>
            <p className={cn('@md:text-base text-sm opacity-70 mb-6', theme.lineHeight)}>
              {sectionContent.bio.description}
            </p>
            {sectionContent.bio.achievements && sectionContent.bio.achievements.length > 0 && (
              <ul className="space-y-2">
                {sectionContent.bio.achievements.map((achievement, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm opacity-60">
                    <span className={theme.foreground}>•</span>
                    <span>{achievement}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </motion.section>
  )
}
