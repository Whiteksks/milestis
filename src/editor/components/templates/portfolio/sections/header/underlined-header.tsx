'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X } from 'lucide-react'
import type { PortfolioTemplateProps } from '@/editor/components/editor/layout/portfolio-template-shell'
import { cn } from '@/lib/utils'

interface UnderlinedHeaderProps
  extends Pick<PortfolioTemplateProps, 'theme' | 'sectionContent' | 'handleAnchorClick'> {}

export function HeaderUnderlined({ theme, sectionContent, handleAnchorClick }: UnderlinedHeaderProps) {
  const [isOpen, setIsOpen] = useState(false)
  const hasLinks = (sectionContent.header.links ?? []).length > 0

  return (
    <header className={cn(
      "fixed top-0 left-0 right-0 z-50",
      theme.glassPanel
    )}>
      <div className="max-w-6xl mx-auto px-6 h-20 flex items-center justify-between">
        {/* Logo */}
        <a 
          href="#hero"
          onClick={(e) => handleAnchorClick(e, '#hero')}
          className={cn("text-xl font-semibold text-foreground tracking-tight", theme.fontTitle)}
        >
          {sectionContent.header.title}
        </a>

        {/* Desktop Navigation */}
        <nav className="hidden @md:flex items-center gap-10">
          {(sectionContent.header.links ?? []).map((link, i) => (
            <a
              key={i}
              href={link.href}
              onClick={(e) => handleAnchorClick(e, link.href)}
              className={cn(
                "group relative text-sm font-medium text-muted-foreground hover:text-foreground transition-colors py-2",
                theme.foreground
              )}
            >
              {link.label}
              {/* Animated underline */}
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-foreground group-hover:w-full transition-all duration-300 ease-out" />
            </a>
          ))}
        </nav>

        {/* Mobile Menu Button */}
        {hasLinks && (
          <button 
            onClick={() => setIsOpen(!isOpen)} 
            className="@md:hidden p-2 text-foreground" 
            aria-label="Toggle menu"
          >
            {isOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        )}
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && hasLinks && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className={cn(
              "@md:hidden fixed inset-0 top-20 z-40",
              theme.glassPanel
            )}
          >
            <nav className="flex flex-col items-center justify-center h-full gap-8">
              {(sectionContent.header.links ?? []).map((link, i) => (
                <motion.a
                  key={i}
                  href={link.href}
                  onClick={(e) => {
                    handleAnchorClick(e, link.href)
                    setIsOpen(false)
                  }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  transition={{ delay: i * 0.1 }}
                  className={cn(
                    "group relative text-2xl font-medium text-foreground",
                    theme.foreground
                  )}
                >
                  {link.label}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-foreground group-hover:w-full transition-all duration-300" />
                </motion.a>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
