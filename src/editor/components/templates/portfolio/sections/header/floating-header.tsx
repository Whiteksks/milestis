
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useT } from '../../../primitives/animation-context'
import { Menu, X } from 'lucide-react'
import type { PortfolioTemplateProps } from '@/editor/lib/template-types'
import { cn } from '@/lib/utils'

type FloatingHeaderProps = Pick<PortfolioTemplateProps, 'theme' | 'sectionContent' | 'handleAnchorClick'> 

export function HeaderFloating({ theme, sectionContent, handleAnchorClick }: FloatingHeaderProps) {
  const t = useT();
  const [isOpen, setIsOpen] = useState(false)
  const hasLinks = (sectionContent.header.links ?? []).length > 0

  return (
    <header className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[calc(100%-2rem-var(--canvas-scrollbar-width,0px))] max-w-4xl">
      <div className={cn(
        "rounded-full px-6 h-14 flex items-center justify-between shadow-lg shadow-black/5",
        theme.cardStyle
      )}>
        {/* Logo */}
        <a 
          href="#hero"
          onClick={(e) => handleAnchorClick(e, '#hero')}
          className={cn("text-base font-semibold text-foreground", theme.foreground)}
        >
          {sectionContent.header.title}
        </a>

        {/* Desktop Navigation */}
        <nav className="hidden @md:flex items-center gap-1">
          {(sectionContent.header.links ?? []).map((link, i) => (
            <a
              key={i}
              href={link.href}
              onClick={(e) => handleAnchorClick(e, link.href)}
              className={cn(
                "text-sm text-muted-foreground hover:text-foreground hover:bg-accent px-4 py-2 rounded-full transition-all",
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
            className="@md:hidden p-2 text-foreground hover:bg-accent rounded-full transition-colors"
            aria-label="Toggle menu"
          >
            {isOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        )}
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && hasLinks && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={t(0.2)}
            className={cn(
              "@md:hidden mt-2 rounded-2xl overflow-hidden shadow-lg shadow-black/5",
              theme.cardStyle
            )}
          >
            <nav className="flex flex-col p-2">
              {(sectionContent.header.links ?? []).map((link, i) => (
                <a
                  key={i}
                  href={link.href}
                  onClick={(e) => {
                    handleAnchorClick(e, link.href)
                    setIsOpen(false)
                  }}
                  className={cn(
                    "text-sm text-muted-foreground hover:text-foreground hover:bg-accent px-4 py-3 rounded-xl transition-all",
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
