'use client'

import { AnimatePresence, motion } from 'framer-motion'
import { Menu, X } from 'lucide-react'
import { useState } from 'react'
import type { PortfolioTemplateProps } from '@/editor/components/editor/ui/portfolio-template-shell'
import { cn } from '@/lib/utils'

interface ClassicHeaderProps
  extends Pick<
    PortfolioTemplateProps,
    'theme' | 'sectionContent' | 'handleAnchorClick'
  > {}

export function ClassicHeader({
  theme,
  sectionContent,
  handleAnchorClick,
}: ClassicHeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const hasLinks = (sectionContent.header.links ?? []).length > 0

  return (
    <motion.header
      id="header"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className={cn(
        '@container',
        theme.glassPanel,
      )}
    >
      <div className="@lg:px-12 @md:px-8 px-4 @lg:py-4 py-3 flex items-center justify-between max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="flex @lg:flex-1"
        >
          <a
            href="#hero"
            onClick={(e) => handleAnchorClick(e, '#hero')}
            className="group -m-1.5 p-1.5"
          >
            <div className="flex items-center gap-3">
              <motion.div
                whileHover={{ rotate: 90 }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                className="relative w-8 h-8"
              >
                <div
                  className={cn(
                    'absolute inset-0 rounded-sm transform rotate-45',
                    theme.primary,
                  )}
                />
                <div
                  className={cn(
                    'absolute inset-2 rounded-sm transform rotate-45',
                    theme.background,
                  )}
                />
              </motion.div>
              <span
                className={cn(
                  'text-xl font-serif font-semibold tracking-tight transition-opacity duration-300 group-hover:opacity-80',
                  theme.foreground,
                )}
              >
                {sectionContent.header.title}
              </span>
            </div>
          </a>
        </motion.div>

        <nav className="@md:flex hidden gap-8">
          {(sectionContent.header.links ?? []).map((link, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.5,
                delay: index * 0.08,
                ease: [0.22, 1, 0.36, 1],
              }}
            >
              <a
                href={link.href}
                onClick={(e) => handleAnchorClick(e, link.href)}
                className={cn(
                  'relative text-sm font-light tracking-wide py-2',
                  'transition-opacity duration-300 opacity-70 hover:opacity-100',
                  theme.foreground,
                )}
              >
                {link.label}
              </a>
            </motion.div>
          ))}
        </nav>

        {hasLinks && (
          <div className="@md:hidden flex">
            <motion.button
              whileTap={{ scale: 0.95 }}
              aria-label={isMenuOpen ? 'Close navigation' : 'Open navigation'}
              className={cn(
                '-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 transition-colors',
                theme.foreground,
              )}
              onClick={() => setIsMenuOpen((prev) => !prev)}
            >
              <AnimatePresence mode="wait">
                {isMenuOpen ? (
                  <motion.div
                    key="close"
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <X className="h-6 w-6" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="menu"
                    initial={{ rotate: 90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: -90, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Menu className="h-6 w-6" />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>
          </div>
        )}
      </div>

      {hasLinks && (
        <AnimatePresence>
          {isMenuOpen && (
            <motion.nav
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className={cn("@md:hidden overflow-hidden", theme.glassPanel)}
            >
              <motion.div
                initial={{ y: -20 }}
                animate={{ y: 0 }}
                exit={{ y: -20 }}
                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                className="px-4 py-4 flex flex-col gap-1"
              >
                {(sectionContent.header.links ?? []).map((link, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{
                      duration: 0.3,
                      delay: index * 0.04,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                  >
                    <a
                      href={link.href}
                      onClick={(e) => {
                        handleAnchorClick(e, link.href)
                        setIsMenuOpen(false)
                      }}
                      className={cn(
                        'block rounded-lg px-4 py-3 text-base font-light tracking-wide',
                        'transition-all duration-300 opacity-70 hover:opacity-100',
                        theme.foreground,
                        theme.border,
                      )}
                    >
                      {link.label}
                    </a>
                  </motion.div>
                ))}
              </motion.div>
            </motion.nav>
          )}
        </AnimatePresence>
      )}
    </motion.header>
  )
}
