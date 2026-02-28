'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X } from 'lucide-react'
import type { PortfolioTemplateProps } from '@/editor/components/editor/layout/portfolio-template-shell'
import { cn } from '@/lib/utils'

interface BentoHeaderProps
  extends Pick<PortfolioTemplateProps, 'theme' | 'sectionContent' | 'handleAnchorClick'> {}

export function BentoHeader({ theme, sectionContent, handleAnchorClick }: BentoHeaderProps) {
  const [isOpen, setIsOpen] = useState(false)
  const links = sectionContent.header.links ?? []
  const hasLinks = links.length > 0

  return (
    <header
      className={cn('fixed top-0 left-0 z-50', theme.glassPanel)}
      style={{ right: 'var(--canvas-scrollbar-width, 0px)' }}
    >
      <div className="max-w-6xl mx-auto px-5 h-14 flex items-center justify-between gap-6">

        {/* Logo / name */}
        <a
          href="#hero"
          onClick={(e) => handleAnchorClick(e, '#hero')}
          className={cn('text-sm font-bold tracking-tight opacity-80 hover:opacity-100 transition-opacity', theme.foreground, theme.fontBody)}
        >
          {sectionContent.header.title}
        </a>

        {/* Desktop pill nav */}
        {hasLinks && (
          <nav className={cn(
            'hidden @md:flex items-center gap-0.5 px-2 py-1.5 rounded-full border border-current/10',
            theme.card,
          )}>
            {links.map((link, i) => (
              <a
                key={i}
                href={link.href}
                onClick={(e) => handleAnchorClick(e, link.href)}
                className={cn(
                  'px-3.5 py-1 text-[11px] font-medium rounded-full opacity-60 hover:opacity-100 hover:bg-current/8 transition-all duration-150',
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
            className={cn('@md:hidden p-2 opacity-60 hover:opacity-100 transition-opacity', theme.foreground)}
            aria-label="Toggle menu"
          >
            {isOpen ? <X size={16} /> : <Menu size={16} />}
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
            <nav className="flex flex-col px-5 py-3 gap-0.5">
              {links.map((link, i) => (
                <a
                  key={i}
                  href={link.href}
                  onClick={(e) => { handleAnchorClick(e, link.href); setIsOpen(false) }}
                  className={cn('py-2.5 px-2 text-sm font-medium opacity-60 hover:opacity-100 transition-opacity rounded-xl', theme.fontBody, theme.foreground)}
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

