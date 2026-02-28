'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X } from 'lucide-react'
import type { PortfolioTemplateProps } from '@/editor/components/editor/layout/portfolio-template-shell'
import { cn } from '@/lib/utils'

interface GridHeaderProps
  extends Pick<PortfolioTemplateProps, 'theme' | 'sectionContent' | 'handleAnchorClick'> {}

export function GridHeader({ theme, sectionContent, handleAnchorClick }: GridHeaderProps) {
  const [isOpen, setIsOpen] = useState(false)
  const links = sectionContent.header.links ?? []
  const hasLinks = links.length > 0

  return (
    <header
      className={cn('fixed top-0 left-0 z-50', theme.glassPanel)}
      style={{ right: 'var(--canvas-scrollbar-width, 0px)' }}
    >
      <div className={cn(
        'max-w-6xl mx-auto px-5 @lg:px-8 h-14 flex items-center justify-between gap-8',
      )}>

        {/* Name — bold, left */}
        <a
          href="#hero"
          onClick={(e) => handleAnchorClick(e, '#hero')}
          className={cn(
            'flex items-baseline gap-2.5 group shrink-0',
            theme.foreground,
          )}
        >
          <span className={cn(
            'text-sm font-bold tracking-tight opacity-80 group-hover:opacity-100 transition-opacity',
            theme.fontBody,
          )}>
            {sectionContent.header.title}
          </span>
          <span className={cn(
            'hidden @md:inline-flex items-center gap-1 text-[9px] uppercase tracking-widest opacity-25 group-hover:opacity-40 transition-opacity',
            theme.fontBody,
          )}>
          </span>
        </a>

        {/* Desktop nav — pill tabs */}
        {hasLinks && (
          <nav className={cn(
            'hidden @md:flex items-center gap-1 p-1 rounded-full border border-current/10 bg-current/[0.03]',
          )}>
            {links.map((link, i) => (
              <a
                key={i}
                href={link.href}
                onClick={(e) => handleAnchorClick(e, link.href)}
                className={cn(
                  'px-4 py-1.5 text-[11px] uppercase tracking-widest font-medium rounded-full',
                  'opacity-45 hover:opacity-90 hover:bg-current/8 transition-all duration-150',
                  theme.fontBody,
                  theme.foreground,
                )}
              >
                {link.label}
              </a>
            ))}
          </nav>
        )}

        {/* Mobile toggle */}
        {hasLinks && (
          <button
            onClick={() => setIsOpen(!isOpen)}
            className={cn('@md:hidden p-2 opacity-50 hover:opacity-100 transition-opacity', theme.foreground)}
            aria-label="Toggle menu"
          >
            {isOpen ? <X size={15} /> : <Menu size={15} />}
          </button>
        )}
      </div>

      {/* Mobile drawer */}
      <AnimatePresence>
        {isOpen && hasLinks && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className={cn('@md:hidden overflow-hidden border-t border-current/8', theme.glassPanel)}
          >
            <nav className="flex flex-col divide-y divide-current/8">
              {links.map((link, i) => (
                <a
                  key={i}
                  href={link.href}
                  onClick={(e) => { handleAnchorClick(e, link.href); setIsOpen(false) }}
                  className={cn(
                    'px-6 py-4 text-[11px] uppercase tracking-widest font-medium opacity-50 hover:opacity-90 transition-opacity',
                    theme.fontBody,
                    theme.foreground,
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
