'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useT, useDisabled } from '../../../primitives/animation-context'
import { Menu, X } from 'lucide-react'
import type { PortfolioTemplateProps } from '@/editor/lib/template-types'
import { cn } from '@/lib/utils'

type ShowcaseHeaderProps = Pick<PortfolioTemplateProps, 'theme' | 'sectionContent' | 'imageContent' | 'handleAnchorClick'> 

export function ShowcaseHeader({ theme, sectionContent, imageContent, handleAnchorClick }: ShowcaseHeaderProps) {
  const t = useT();
  const disabled = useDisabled()
  const [isOpen, setIsOpen] = useState(false)
  const [heroVisible, setHeroVisible] = useState(true)
  const hasLinks = (sectionContent.header.links ?? []).length > 0
  const hasHeroImage = !!imageContent?.hero?.value.asset.src

  // White text only while the hero section is still intersecting the viewport
  const isOverHero = hasHeroImage && heroVisible

  useEffect(() => {
    // In preview mode the overlay renders another copy of the template, so
    // there are two #hero elements in the document simultaneously.
    // getElementById returns the first one (editor canvas), which is wrong.
    // Instead: locate the nearest [data-scroll-root] ancestor of THIS header
    // (added by PreviewOverlay) and query #hero only within it.
    // In published / canvas mode there is no [data-scroll-root], so we fall
    // back to document-wide getElementById.
    const scrollRoot = document.querySelector<HTMLElement>('[data-scroll-root]') ?? null
    const hero: HTMLElement | null = scrollRoot
      ? (scrollRoot.querySelector<HTMLElement>('#hero') ?? document.getElementById('hero'))
      : document.getElementById('hero')
    if (!hero) return

    const observer = new IntersectionObserver(
      ([entry]) => setHeroVisible(entry.isIntersecting),
      { threshold: 0, rootMargin: '-64px 0px 0px 0px', root: scrollRoot },
    )
    observer.observe(hero)
    return () => observer.disconnect()
  }, [])

  return (
    <header
      className={cn(
        'fixed top-0 left-0 z-50 transition-all duration-500',
      )}
      style={{ right: 'var(--canvas-scrollbar-width, 0px)' }}
    >
      <div className="max-w-7xl mx-auto px-6 @md:px-12 @lg:px-20 h-16 flex items-center justify-between gap-8">
        {/* Brand */}
        <motion.a
          href="#hero"
          onClick={(e) => handleAnchorClick(e, '#hero')}
          initial={disabled ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={disabled ? undefined : t(0.6)}
          className={cn(
            'text-sm font-bold uppercase tracking-[0.3em] transition-colors duration-500',
            theme.fontTitle,
            isOverHero ? 'text-white' : theme.foreground,
          )}
        >
          {sectionContent.header.title}
        </motion.a>

        {/* Nav   desktop */}
        <motion.nav
          initial={disabled ? { opacity: 1, y: 0 } : { opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={disabled ? undefined : t(0.6, 0.1)}
          className="hidden @md:flex items-center gap-10"
        >
          {(sectionContent.header.links ?? []).map((link, i) => (
            <a
              key={i}
              href={link.href}
              onClick={(e) => handleAnchorClick(e, link.href)}
              className={cn(
                'relative text-[11px] uppercase tracking-[0.2em] transition-all duration-500 group',
                theme.fontBody,
                isOverHero
                  ? 'text-white/70 hover:text-white'
                  : 'opacity-50 hover:opacity-100',
              )}
            >
              {link.label}
              <span className="absolute -bottom-0.5 left-0 w-0 h-px bg-current group-hover:w-full transition-all duration-300" />
            </a>
          ))}
        </motion.nav>

        {/* Mobile toggle + dropdown */}
        {hasLinks && (
          <div className="@md:hidden relative">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className={cn(
                'p-2 transition-all duration-500',
                isOverHero ? 'text-white/70 hover:text-white' : 'opacity-60 hover:opacity-100',
              )}
              aria-label="Toggle menu"
            >
              {isOpen ? <X size={18} /> : <Menu size={18} />}
            </button>

            <AnimatePresence>
              {isOpen && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.94, y: -6 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.94, y: -6 }}
                  transition={t(0.18)}
                  className="absolute right-0 top-full mt-2 min-w-[160px] rounded-xl overflow-hidden"
                  style={{ transformOrigin: 'top right' }}
                >
                  <div className={cn('border border-current/10', theme.glassPanel)}>
                    <nav className="flex flex-col py-2">
                      {(sectionContent.header.links ?? []).map((link, i) => (
                        <a
                          key={i}
                          href={link.href}
                          onClick={(e) => {
                            handleAnchorClick(e, link.href)
                            setIsOpen(false)
                          }}
                          className={cn(
                            'px-5 py-2 text-[12px] uppercase tracking-[0.2em] opacity-60 hover:opacity-100 transition-opacity',
                            theme.fontBody,
                          )}
                        >
                          {link.label}
                        </a>
                      ))}
                    </nav>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
      </div>
    </header>
  )
}
