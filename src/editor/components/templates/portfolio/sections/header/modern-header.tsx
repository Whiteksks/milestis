'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { XIcon, MenuIcon } from 'lucide-react'
import type { PortfolioTemplateProps } from '@/editor/components/editor/ui/portfolio-template-shell'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'

interface ModernHeaderProps
  extends Pick<PortfolioTemplateProps, 'theme' | 'sectionContent' | 'handleAnchorClick'> {}

export function ModernHeader({ theme, sectionContent, handleAnchorClick }: ModernHeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const hasLinks = (sectionContent.header.links ?? []).length > 0

  return (
    <motion.header
      id="header"
      data-section-id="header"
      initial={{ opacity: 0, y: -6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className={cn(
        'sticky top-0 z-40 border-b backdrop-blur-sm',
        theme.border,
        theme.cardStyle,
      )}
    >
      <div
        className={cn(
          'flex items-center justify-center relative py-4',
          'max-w-6xl mx-auto w-full',
          '@lg:px-20 @md:px-14 px-6',
        )}
      >
        {/* Title */}
        <a
          href="#hero"
          onClick={(e) => handleAnchorClick(e, '#hero')}
          className="flex items-center gap-3"
        >
          <h1
            className={cn(
              '@lg:text-3xl @md:text-2xl text-xl font-light tracking-tight opacity-90 text-center',
              theme.fontTitle,
              theme.letterSpacing,
            )}
          >
            {sectionContent.header.title}
          </h1>
        </a>

        {/* Mobile menu button */}
        {hasLinks && (
          <Button
            variant="ghost"
            size="icon"
            aria-label="Toggle menu"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className={cn(
              '@md:hidden rounded-full p-2 transition-all',
              'absolute right-6 top-1/2 -translate-y-1/2',
              theme.transitionStyle,
            )}
          >
            <motion.div
              animate={{ rotate: isMenuOpen ? 90 : 0 }}
              transition={{ duration: 0.3 }}
            >
              {isMenuOpen ? <XIcon /> : <MenuIcon />}
            </motion.div>
          </Button>
        )}
      </div>

      {/* Desktop navigation */}
      {hasLinks && (
        <nav className="hidden @md:flex items-center justify-center gap-10 pb-3">
          {(sectionContent.header.links ?? []).map((link, i) => (
            <a
              key={i}
              href={link.href}
              onClick={(e) => handleAnchorClick(e, link.href)}
              className={cn(
                'relative text-[0.78rem] font-light uppercase tracking-[0.14em] opacity-60 hover:opacity-90 transition-opacity duration-300',
                theme.letterSpacing,
              )}
            >
              {link.label}
            </a>
          ))}
        </nav>
      )}

      {/* Mobile menu */}
      {hasLinks && (
        <motion.nav
          initial={false}
          animate={{
            height: isMenuOpen ? 'auto' : 0,
            opacity: isMenuOpen ? 1 : 0,
          }}
          transition={{ duration: 0.45 }}
          className="overflow-hidden @md:hidden border-t border-white/10 backdrop-blur-xl"
        >
          <div
            className={cn(
              '@lg:px-20 @md:px-12 px-6 py-4 flex flex-col gap-1',
              theme.background,
            )}
          >
            {(sectionContent.header.links ?? []).map((link, i) => (
              <motion.a
                key={i}
                href={link.href}
                onClick={(e) => {
                  handleAnchorClick(e, link.href)
                  setIsMenuOpen(false)
                }}
                initial={{ opacity: 0, x: -6 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.25, delay: i * 0.04 }}
                className={cn(
                  'py-2 text-[0.8rem] font-light uppercase tracking-[0.17em] opacity-75 hover:opacity-95 transition-opacity',
                  theme.letterSpacing,
                )}
              >
                {link.label}
              </motion.a>
            ))}
          </div>
        </motion.nav>
      )}
    </motion.header>
  )
}
