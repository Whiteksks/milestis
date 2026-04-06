'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useT } from '../../../primitives/animation-context'
import { Menu, X } from 'lucide-react'
import type { PortfolioTemplateProps } from '@/editor/lib/template-types'
import { cn } from '@/lib/utils'

interface MinimalHeaderProps
  extends Pick<PortfolioTemplateProps, 'theme' | 'sectionContent' | 'handleAnchorClick'> {}

export function HeaderMinimal({ theme, sectionContent, handleAnchorClick }: MinimalHeaderProps) {
  const t = useT();
  const [isOpen, setIsOpen] = useState(false)
  const hasLinks = (sectionContent.header.links ?? []).length > 0

  return (
    <header
      className="fixed top-0 left-0 z-50 bg-transparent"
      style={{ right: 'var(--canvas-scrollbar-width, 0px)' }}
    >

      <div className={cn('max-w-6xl mx-auto px-6 @md:px-10 @lg:px-16 h-14 flex items-center justify-between', theme.foreground)}>
        {/* Brand */}
        <motion.a
          href="#hero"
          onClick={(e) => handleAnchorClick(e, '#hero')}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={t(0.7)}
          className={cn('text-[11px] uppercase tracking-[0.38em] font-medium hover:opacity-50 transition-opacity duration-300', theme.fontTitle)}
        >
          {sectionContent.header.title}
        </motion.a>

        {/* Desktop nav */}
        <motion.nav
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={t(0.7, 0.1 )}
          className="hidden @md:flex items-center gap-10"
        >
          {(sectionContent.header.links ?? []).map((link, i) => (
            <a
              key={i}
              href={link.href}
              onClick={(e) => handleAnchorClick(e, link.href)}
              className={cn(
                'text-[10px] uppercase tracking-[0.24em] opacity-35 hover:opacity-100 transition-opacity duration-200',
                theme.fontBody,
              )}
            >
              {link.label}
            </a>
          ))}
        </motion.nav>

        {/* Mobile toggle + floating dropdown */}
        {hasLinks && (
          <div className="@md:hidden relative">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-1.5 opacity-40 hover:opacity-100 transition-opacity"
              aria-label="Toggle menu"
            >
              {isOpen ? <X size={16} /> : <Menu size={16} />}
            </button>

            <AnimatePresence>
              {isOpen && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.96, y: -4 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.96, y: -4 }}
                  transition={t(0.15)}
                  className={cn('absolute right-0 top-full mt-2 min-w-[148px] border border-current/10 overflow-hidden', theme.glassPanel)}
                  style={{ transformOrigin: 'top right' }}
                >
                  <nav className="flex flex-col py-1.5">
                    {(sectionContent.header.links ?? []).map((link, i) => (
                      <a
                        key={i}
                        href={link.href}
                        onClick={(e) => { handleAnchorClick(e, link.href); setIsOpen(false) }}
                        className={cn('px-5 py-3 text-[10px] uppercase tracking-[0.24em] opacity-45 hover:opacity-100 transition-opacity', theme.fontBody)}
                      >
                        {link.label}
                      </a>
                    ))}
                  </nav>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
      </div>
    </header>
  )
}