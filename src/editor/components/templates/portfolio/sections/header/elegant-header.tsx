
import { motion, AnimatePresence } from 'framer-motion'
import { useT } from '../../../primitives/animation-context'
import { useState, useEffect, useRef } from 'react'
import { MenuIcon, XIcon } from 'lucide-react'
import type { PortfolioTemplateProps } from '@/editor/lib/template-types'
import { cn } from '@/lib/utils'

type ElegantHeaderProps = Pick<PortfolioTemplateProps, 'theme' | 'sectionContent' | 'handleAnchorClick'> 

export function ElegantHeader({ theme, sectionContent, handleAnchorClick }: ElegantHeaderProps) {
  const t = useT();
  const [scrolled, setScrolled] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const hasLinks = (sectionContent.header.links ?? []).length > 0
  const heroRef = useRef<Element | null>(null)

  useEffect(() => {
    heroRef.current = document.querySelector('#hero')
    if (!heroRef.current) return
    const observer = new IntersectionObserver(
      ([entry]) => setScrolled(!entry.isIntersecting),
      { threshold: 0, rootMargin: '-56px 0px 0px 0px' },
    )
    observer.observe(heroRef.current)
    return () => observer.disconnect()
  }, [])

  return (
    <header
      id="header"
      data-section-id="header"
      className={cn(
        '@container sticky top-0 z-40 transition-all duration-700',
        scrolled ? cn(theme.glassPanel, 'border-b border-current/5') : 'bg-transparent',
      )}
    >
      <div className="max-w-6xl mx-auto px-6 @md:px-10 @lg:px-16 py-5 flex items-center justify-between">
        <a
          href="#hero"
          onClick={(e) => handleAnchorClick(e, '#hero')}
          className={cn('text-sm font-light tracking-[0.28em] uppercase opacity-70 hover:opacity-100 transition-opacity duration-300', theme.fontTitle)}
        >
          {sectionContent.header.title}
        </a>

        {/* Desktop nav */}
        <nav className="hidden @md:flex items-center gap-10">
          {(sectionContent.header.links ?? []).map((link, i) => (
            <a
              key={i}
              href={link.href}
              onClick={(e) => handleAnchorClick(e, link.href)}
              className={cn('text-[10px] uppercase tracking-[0.22em] opacity-35 hover:opacity-80 transition-opacity duration-300', theme.fontBody)}
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Mobile toggle */}
        {hasLinks && (
          <div className="@md:hidden relative">
            <button
              aria-label="Toggle menu"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 opacity-45 hover:opacity-90 transition-opacity"
            >
              {isMenuOpen ? <XIcon size={16} /> : <MenuIcon size={16} />}
            </button>
            <AnimatePresence>
              {isMenuOpen && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.96, y: -4 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.96, y: -4 }}
                  transition={t(0.2)}
                  style={{ transformOrigin: 'top right' }}
                  className={cn(
                    'absolute right-0 top-full mt-2 min-w-[148px] py-2 z-50',
                    theme.glassPanel,
                    'border border-current/10',
                  )}
                >
                  {(sectionContent.header.links ?? []).map((link, i) => (
                    <a
                      key={i}
                      href={link.href}
                      onClick={(e) => {
                        handleAnchorClick(e, link.href)
                        setIsMenuOpen(false)
                      }}
                      className={cn('block px-5 py-2.5 text-[10px] uppercase tracking-[0.22em] opacity-40 hover:opacity-90 transition-opacity', theme.fontBody)}
                    >
                      {link.label}
                    </a>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
      </div>
    </header>
  )
}