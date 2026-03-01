'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X } from 'lucide-react'
import type { PortfolioTemplateProps } from '@/editor/components/editor/layout/portfolio-template-shell'
import { cn } from '@/lib/utils'

interface LiquidGlassHeaderProps
  extends Pick<PortfolioTemplateProps, 'theme' | 'sectionContent' | 'handleAnchorClick'> {}

export function LiquidGlassHeader({ theme, sectionContent, handleAnchorClick }: LiquidGlassHeaderProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [heroVisible, setHeroVisible] = useState(true)
  const hasLinks = (sectionContent.header.links ?? []).length > 0

  useEffect(() => {
    const hero = document.getElementById('hero')
    if (!hero) return
    const observer = new IntersectionObserver(
      ([entry]) => setHeroVisible(entry.isIntersecting),
      { threshold: 0, rootMargin: '-64px 0px 0px 0px' },
    )
    observer.observe(hero)
    return () => observer.disconnect()
  }, [])

  return (
    <header
      className="fixed top-0 left-0 z-50 transition-all duration-500"
      style={{ right: 'var(--canvas-scrollbar-width, 0px)' }}
    >
      {/* Glass bar */}
      <div
        className="mx-3 mt-3 rounded-2xl border border-white/20 transition-all duration-500"
        style={{
          background: heroVisible
            ? 'rgba(255,255,255,0.08)'
            : 'rgba(255,255,255,0.14)',
          backdropFilter: 'blur(24px) saturate(180%) brightness(1.05)',
          WebkitBackdropFilter: 'blur(24px) saturate(180%) brightness(1.05)',
          boxShadow: '0 4px 24px rgba(0,0,0,0.12), inset 0 1px 0 rgba(255,255,255,0.25), inset 0 -1px 0 rgba(0,0,0,0.06)',
        }}
      >
        {/* Inner glare */}
        <div
          className="absolute inset-0 rounded-2xl pointer-events-none"
          style={{ background: 'linear-gradient(135deg, rgba(255,255,255,0.18) 0%, transparent 60%)' }}
        />

        <div className="relative max-w-7xl mx-auto px-5 @md:px-10 @lg:px-16 h-14 flex items-center justify-between gap-8">
          {/* Brand */}
          <motion.a
            href="#hero"
            onClick={(e) => handleAnchorClick(e, '#hero')}
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className={cn('text-sm font-bold uppercase tracking-[0.28em] text-white drop-shadow-sm', theme.fontTitle)}
          >
            {sectionContent.header.title}
          </motion.a>

          {/* Nav — desktop */}
          <motion.nav
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="hidden @md:flex items-center gap-8"
          >
            {(sectionContent.header.links ?? []).map((link, i) => (
              <a
                key={i}
                href={link.href}
                onClick={(e) => handleAnchorClick(e, link.href)}
                className={cn(
                  'relative text-[11px] uppercase tracking-[0.18em] text-white/65 hover:text-white transition-colors duration-200 group',
                  theme.fontBody,
                )}
              >
                {link.label}
                <span className="absolute -bottom-0.5 left-0 w-0 h-px bg-white group-hover:w-full transition-all duration-300" />
              </a>
            ))}
          </motion.nav>

          {/* Mobile toggle */}
          {hasLinks && (
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="@md:hidden p-1.5 text-white/70 hover:text-white transition-colors"
              aria-label="Toggle menu"
            >
              {isOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          )}
        </div>
      </div>

      {/* Mobile menu — separate glass panel */}
      <AnimatePresence>
        {isOpen && hasLinks && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.97 }}
            transition={{ duration: 0.2 }}
            className="mx-3 mt-2 rounded-2xl overflow-hidden border border-white/15"
            style={{
              background: 'rgba(255,255,255,0.12)',
              backdropFilter: 'blur(24px) saturate(180%)',
              WebkitBackdropFilter: 'blur(24px) saturate(180%)',
              boxShadow: '0 8px 32px rgba(0,0,0,0.18), inset 0 1px 0 rgba(255,255,255,0.22)',
            }}
          >
            <nav className="flex flex-col px-6 py-5 gap-5">
              {(sectionContent.header.links ?? []).map((link, i) => (
                <a
                  key={i}
                  href={link.href}
                  onClick={(e) => {
                    handleAnchorClick(e, link.href)
                    setIsOpen(false)
                  }}
                  className={cn(
                    'text-sm uppercase tracking-[0.18em] text-white/70 hover:text-white transition-colors',
                    theme.fontBody,
                  )}
                >
                  {link.label}
                </a>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
