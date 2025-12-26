'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X } from 'lucide-react'
import type { PortfolioTemplateProps } from '@/editor/components/editor/ui/portfolio-template-shell'
import { cn } from '@/lib/utils'

interface MinimallHeaderProps
  extends Pick<PortfolioTemplateProps, 'theme' | 'sectionContent' | 'handleAnchorClick'> {}

export function HeaderMinimal({ theme, sectionContent, handleAnchorClick }: MinimallHeaderProps) {
  const [isOpen, setIsOpen] = useState(false)
  const hasLinks = (sectionContent.header.links ?? []).length > 0

  return (
    <header className={cn(
      "fixed top-0 left-0 right-0 z-50",
      theme.glassPanel
    )}>
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <a 
          href="#hero"
          onClick={(e) => handleAnchorClick(e, '#hero')}
          className={cn("text-lg font-medium text-foreground", theme.foreground)}
        >
          {sectionContent.header.title}
        </a>

        {/* Desktop Navigation */}
        <nav className="hidden @md:flex items-center gap-8">
          {(sectionContent.header.links ?? []).map((link, i) => (
            <a
              key={i}
              href={link.href}
              onClick={(e) => handleAnchorClick(e, link.href)}
              className={cn(
                "text-sm text-muted-foreground hover:text-foreground transition-colors",
                theme.foreground
              )}
            >
              {link.label}
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
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className={cn(
              "@md:hidden overflow-hidden",
              theme.glassPanel
            )}
          >
            <nav className="flex flex-col px-6 py-4 gap-4">
              {(sectionContent.header.links ?? []).map((link, i) => (
                <a
                  key={i}
                  href={link.href}
                  onClick={(e) => {
                    handleAnchorClick(e, link.href)
                    setIsOpen(false)
                  }}
                  className={cn(
                    "text-sm text-muted-foreground hover:text-foreground transition-colors",
                    theme.foreground
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
