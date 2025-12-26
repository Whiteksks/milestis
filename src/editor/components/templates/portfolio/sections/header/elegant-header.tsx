'use client'

import { motion } from 'framer-motion'
import { useState } from 'react'
import type { PortfolioTemplateProps } from '@/editor/components/editor/ui/portfolio-template-shell'
import { cn } from '@/lib/utils'
import { MenuIcon, XIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface ElegantHeaderProps
  extends Pick<PortfolioTemplateProps, 'theme' | 'sectionContent' | 'handleAnchorClick'> {}

export function ElegantHeader({ theme, sectionContent, handleAnchorClick }: ElegantHeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const hasLinks = (sectionContent.header.links ?? []).length > 0

  return (
    <motion.header
      id="header"
      data-section-id="header"
      initial={{ opacity: 0, y: -16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, ease: 'easeOut' }}
      className={cn(
        'sticky top-0 z-40',
        theme.glassPanel,
      )}
    >
      {/* 1. Внешний контейнер (для фона и бордера) - без padding */}
      <div className="@lg:px-24 @md:px-14 px-6 py-4">
        
        {/* 2. Внутренний контейнер (для ограничения ширины и центрирования) */}
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <a
            href="#hero"
            onClick={(e) => handleAnchorClick(e, '#hero')}
            className="group flex items-center gap-3"
          >
            <h1
              className={cn(
                '@lg:text-3xl @md:text-2xl text-xl font-medium tracking-tight',
                theme.fontTitle,
                theme.letterSpacing,
              )}
            >
              {sectionContent.header.title}
            </h1>
          </a>

          {/* Desktop nav without hover animations */}
          <nav className="hidden @md:flex items-center gap-10">
            {(sectionContent.header.links ?? []).map((link, i) => (
              <a
                key={i}
                href={link.href}
                onClick={(e) => handleAnchorClick(e, link.href)}
                className={cn(
                  'relative text-[0.75rem] uppercase tracking-[0.18em] opacity-60 hover:opacity-100 transition-opacity',
                  theme.letterSpacing,
                )}
              >
                {link.label}
              </a>
            ))}
          </nav>

          {hasLinks && (
            <Button
              variant="ghost"
              size="icon"
              aria-label="Toggle menu"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="@md:hidden rounded-full p-2 hover:bg-current/5 transition-all"
            >
              {isMenuOpen ? <XIcon /> : <MenuIcon />}
            </Button>
          )}
        </div>
      </div>

      {/* Mobile menu */}
      {hasLinks && (
        <motion.nav
          initial={false}
          animate={{
            height: isMenuOpen ? 'auto' : 0,
            opacity: isMenuOpen ? 1 : 0,
          }}
          transition={{
            duration: 0.45,
            ease: 'easeInOut',
          }}
          className={cn("@md:hidden overflow-hidden", theme.glassPanel)}
        >
          <div
            className={cn(
              '@lg:px-20 @md:px-12 px-6 py-4 flex flex-col gap-2',
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
                className={cn(
                  'py-2 text-[0.75rem] uppercase tracking-[0.2em] opacity-60 hover:opacity-100 transition-opacity',
                  theme.letterSpacing,
                )}
              >
                {link.label}
              </a>
            ))}
          </div>
        </motion.nav>
      )}
    </motion.header>
  )
}