'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X } from 'lucide-react'
import type { PortfolioTemplateProps } from '@/editor/components/editor/layout/portfolio-template-shell'
import { cn } from '@/lib/utils'

interface PlayfulHeaderProps
  extends Pick<PortfolioTemplateProps, 'theme' | 'sectionContent' | 'handleAnchorClick'> {}

export function HeaderPlayful({ theme, sectionContent, handleAnchorClick }: PlayfulHeaderProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)
  const hasLinks = (sectionContent.header.links ?? []).length > 0

  return (
    <header className={cn(
      "fixed top-0 left-0 right-0 z-50",
      theme.glassPanel
    )}>
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo with playful letter bounce */}
        <motion.a
          href="#hero"
          onClick={(e) => handleAnchorClick(e, '#hero')}
          className={cn("text-xl font-bold text-foreground", theme.fontTitle)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <span className="inline-flex">
            {sectionContent.header.title.split('').map((letter, i) => (
              <motion.span
                key={i}
                className="inline-block"
                whileHover={{
                  y: -4,
                  color: 'hsl(var(--primary))',
                  transition: { type: 'spring', stiffness: 500, damping: 10 },
                }}
              >
                {letter}
              </motion.span>
            ))}
          </span>
        </motion.a>

        {/* Desktop Navigation */}
        <nav className="hidden @md:flex items-center gap-2 relative">
          {(sectionContent.header.links ?? []).map((link, i) => (
            <motion.a
              key={i}
              href={link.href}
              onClick={(e) => handleAnchorClick(e, link.href)}
              className={cn(
                "relative px-4 py-2 text-sm font-medium text-muted-foreground transition-colors rounded-lg",
                theme.foreground
              )}
              onHoverStart={() => setHoveredIndex(i)}
              onHoverEnd={() => setHoveredIndex(null)}
              whileTap={{ scale: 0.95 }}
            >
              {hoveredIndex === i && (
                <motion.span
                  layoutId="navbar-hover"
                  className="absolute inset-0 bg-accent rounded-lg"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                />
              )}
              <span className="relative z-10">{link.label}</span>
            </motion.a>
          ))}
        </nav>

        {/* Mobile Menu Button */}
        {hasLinks && (
          <motion.button
            onClick={() => setIsOpen(!isOpen)}
            className="@md:hidden p-2 text-foreground"
            aria-label={isOpen ? 'Close menu' : 'Open menu'}
            whileTap={{ scale: 0.9, rotate: 90 }}
          >
            <AnimatePresence mode="wait">
              {isOpen ? (
                <motion.div
                  key="close"
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <X size={22} />
                </motion.div>
              ) : (
                <motion.div
                  key="menu"
                  initial={{ rotate: 90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: -90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <Menu size={22} />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.button>
        )}
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && hasLinks && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
            className={cn(
              "@md:hidden absolute top-full left-0 right-0 overflow-hidden",
              theme.glassPanel
            )}
          >
            <nav className="flex flex-col p-4 gap-2">
              {(sectionContent.header.links ?? []).map((link, i) => (
                <motion.a
                  key={i}
                  href={link.href}
                  onClick={(e) => {
                    handleAnchorClick(e, link.href)
                    setIsOpen(false)
                  }}
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -30 }}
                  transition={{
                    delay: i * 0.1,
                    type: 'spring',
                    stiffness: 400,
                    damping: 25,
                  }}
                  whileHover={{ x: 8 }}
                  whileTap={{ scale: 0.98 }}
                  className={cn(
                    "px-4 py-3 text-lg font-medium text-foreground rounded-xl hover:bg-accent transition-all",
                    theme.foreground
                  )}
                >
                  {link.label}
                </motion.a>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
