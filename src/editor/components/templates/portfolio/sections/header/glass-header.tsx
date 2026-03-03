'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X } from 'lucide-react'
import type { PortfolioTemplateProps } from '@/editor/lib/template-types'
import { cn } from '@/lib/utils'

interface GlassHeaderProps
  extends Pick<PortfolioTemplateProps, 'theme' | 'sectionContent' | 'handleAnchorClick'> {}

export function HeaderGlass({ theme, sectionContent, handleAnchorClick }: GlassHeaderProps) {
  const [isOpen, setIsOpen] = useState(false)
  const hasLinks = (sectionContent.header.links ?? []).length > 0

  return (
    <header
      className="fixed top-4 left-4 z-50 @container"
      style={{ right: 'calc(1rem + var(--canvas-scrollbar-width, 0px))' }}
    >
      <div className="max-w-6xl mx-auto">
        <div className={cn(
          "rounded-2xl shadow-lg shadow-black/5",
          theme.cardStyle
        )}>
          <div className="px-6 h-16 flex items-center justify-between">
            {/* Logo */}
            <a 
              href="#hero"
              onClick={(e) => handleAnchorClick(e, '#hero')}
              className={cn("text-lg font-semibold text-foreground", theme.foreground)}
            >
              {sectionContent.header.title}
            </a>

            {/* Desktop Navigation */}
            <nav className="hidden @md:flex items-center gap-2">
              {(sectionContent.header.links ?? []).map((link, i) => (
                <a
                  key={i}
                  href={link.href}
                  onClick={(e) => handleAnchorClick(e, link.href)}
                  className={cn(
                    "px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-white/10 rounded-lg transition-all duration-200",
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
                className="@md:hidden p-2 text-foreground hover:bg-white/10 rounded-lg transition-colors"
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
                className="@md:hidden overflow-hidden border-t border-white/10"
              >
                <nav className="flex flex-col p-4 gap-1">
                  {(sectionContent.header.links ?? []).map((link, i) => (
                    <motion.a
                      key={i}
                      href={link.href}
                      onClick={(e) => {
                        handleAnchorClick(e, link.href)
                        setIsOpen(false)
                      }}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className={cn(
                        "px-4 py-3 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-white/10 rounded-lg transition-all",
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
        </div>
      </div>
    </header>
  )
}
