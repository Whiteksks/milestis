'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X } from 'lucide-react'
import type { PortfolioTemplateProps } from '@/editor/components/editor/layout/portfolio-template-shell'
import { cn } from '@/lib/utils'

interface EditorialHeaderProps
  extends Pick<PortfolioTemplateProps, 'theme' | 'sectionContent' | 'handleAnchorClick'> {}

export function EditorialHeader({ theme, sectionContent, handleAnchorClick }: EditorialHeaderProps) {
  const [isOpen, setIsOpen] = useState(false)
  const hasLinks = (sectionContent.header.links ?? []).length > 0

  return (
    <header
      className={cn('fixed top-0 left-0 z-50 border-b border-current/10', theme.glassPanel)}
      style={{ right: 'var(--canvas-scrollbar-width, 0px)' }}
    >
      <div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between gap-8">
        {/* Left: issue marker + brand */}
        <div className="flex items-center gap-4">
          <span
            className={cn(
              'text-[10px] uppercase opacity-30',
              theme.letterSpacing,
              theme.fontBody,
            )}
          >
            Vol. I
          </span>
          <div className="w-px h-4 bg-current opacity-20" />
          <a
            href="#hero"
            onClick={(e) => handleAnchorClick(e, '#hero')}
            className={cn(
              'text-xs uppercase tracking-[0.25em] font-medium',
              theme.fontBody,
              theme.foreground,
            )}
          >
            {sectionContent.header.title}
          </a>
        </div>

        {/* Right: nav */}
        <nav className="hidden @md:flex items-center gap-8">
          {(sectionContent.header.links ?? []).map((link, i) => (
            <a
              key={i}
              href={link.href}
              onClick={(e) => handleAnchorClick(e, link.href)}
              className={cn(
                'text-[11px] uppercase tracking-[0.2em] opacity-50 hover:opacity-100 transition-opacity',
                theme.fontBody,
              )}
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Mobile toggle */}
        {hasLinks && (
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="@md:hidden p-2 opacity-60 hover:opacity-100 transition-opacity"
            aria-label="Toggle menu"
          >
            {isOpen ? <X size={16} /> : <Menu size={16} />}
          </button>
        )}
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {isOpen && hasLinks && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className={cn('@md:hidden overflow-hidden border-t border-current/10', theme.glassPanel)}
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
                    'text-xs uppercase tracking-[0.2em] opacity-70 hover:opacity-100 transition-opacity',
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
