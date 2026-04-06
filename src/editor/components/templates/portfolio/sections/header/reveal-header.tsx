'use client'

import { useState } from 'react'
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from 'framer-motion'
import { useT } from '../../primitives/animation-context'
import { Menu, X, ChevronUp } from 'lucide-react'
import { Button } from '@/components/ui/button'
import type { PortfolioTemplateProps } from '@/editor/lib/template-types'
import { cn } from '@/lib/utils'

interface RevealHeaderProps
  extends Pick<
    PortfolioTemplateProps,
    'theme' | 'sectionContent' | 'handleAnchorClick'
  > {}

export function RevealHeader({
  theme,
  sectionContent,
  handleAnchorClick,
}: RevealHeaderProps) {
  const t = useT();
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isVisible, setIsVisible] = useState(true)
  const [lastScrollY, setLastScrollY] = useState(0)
  const [hasScrolled, setHasScrolled] = useState(false)
  const { scrollY } = useScroll()

  const links = sectionContent.header.links ?? []
  const hasLinks = links.length > 0

  useMotionValueEvent(scrollY, 'change', (latest) => {
    if (latest > 100) {
      setHasScrolled(true)
      setIsVisible(latest <= lastScrollY)
    } else {
      setHasScrolled(false)
      setIsVisible(true)
    }
    setLastScrollY(latest)
  })

  return (
    <>
      <motion.header
        id="header"
        initial={{ y: 0 }}
        animate={{ y: isVisible ? 0 : -100 }}
        transition={t(0.3)}
        className={cn(
          '@container fixed top-0 left-0 z-40 transition-shadow duration-300',
          hasScrolled && theme.shadow,
        )}
        style={{ right: 'var(--canvas-scrollbar-width, 0px)' }}
      >
        <div
          className={cn(
            'transition-colors duration-300',
            hasScrolled
              ? cn(theme.cardStyle, theme.border)
              : 'bg-transparent',
          )}
        >
          <div className="@lg:px-12 @md:px-8 px-4 py-4 max-w-6xl mx-auto">
            <div className="flex items-center justify-between">
              {/* Logo */}
              <motion.a
                href="#hero"
                onClick={(e) => handleAnchorClick(e, '#hero')}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={cn(
                  'text-xl font-bold tracking-tight',
                  theme.foreground,
                  theme.fontTitle,
                )}
              >
                {sectionContent.header.title}
              </motion.a>

              {/* Desktop navigation */}
              {hasLinks && (
                <nav className="@md:flex hidden items-center gap-4">
                  {links.map((link, index) => (
                    <motion.a
                      key={index}
                      href={link.href}
                      onClick={(e) => handleAnchorClick(e, link.href)}
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{
                        delay: index * 0.06,
                        duration: 0.3,
                        ease: [0.22, 1, 0.36, 1],
                      }}
                      className={cn(
                        'px-4 py-2 text-sm rounded-lg transition-colors',
                        theme.foreground,
                      )}
                    >
                      {link.label}
                    </motion.a>
                  ))}
                </nav>
              )}

              {/* Mobile menu button */}
              {hasLinks && (
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  aria-label={isMenuOpen ? 'Close navigation' : 'Open navigation'}
                  onClick={() => setIsMenuOpen((v) => !v)}
                  className={cn('@md:hidden', theme.foreground)}
                >
                  <AnimatePresence mode="wait">
                    {isMenuOpen ? (
                      <motion.div
                        key="close"
                        initial={{ rotate: -90, opacity: 0 }}
                        animate={{ rotate: 0, opacity: 1 }}
                        exit={{ rotate: 90, opacity: 0 }}
                        transition={t(0.25)}
                      >
                        <X className="w-5 h-5" />
                      </motion.div>
                    ) : (
                      <motion.div
                        key="menu"
                        initial={{ rotate: 90, opacity: 0 }}
                        animate={{ rotate: 0, opacity: 1 }}
                        exit={{ rotate: -90, opacity: 0 }}
                        transition={t(0.25)}
                      >
                        <Menu className="w-5 h-5" />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.button>
              )}
            </div>
          </div>
        </div>

        {/* Scroll-up indicator */}
        <AnimatePresence>
          {hasScrolled && isVisible && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-full pt-2"
            >
              <div
                className={cn(
                  'flex items-center gap-1 text-xs px-3 py-1 rounded-full border shadow-sm',
                  theme.foreground,
                  theme.cardStyle,
                  theme.border,
                )}
              >
                <ChevronUp className="w-3 h-3" />
                <span>Скролл вверх</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>

      {/* Mobile menu */}
      <AnimatePresence>
        {isMenuOpen && hasLinks && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={t(0.2)}
            className="@container @md:hidden fixed top-16 left-0 z-30 px-4"
            style={{ right: 'var(--canvas-scrollbar-width, 0px)' }}
          >
            <div
              className={cn(
                'p-4 mt-2 rounded-xl shadow-xl',
                theme.cardStyle,
                theme.border,
              )}
            >
              <nav className="flex flex-col gap-2">
                {links.map((link, index) => (
                  <motion.a
                    key={index}
                    href={link.href}
                    onClick={(e) => {
                      handleAnchorClick(e, link.href)
                      setIsMenuOpen(false)
                    }}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05, duration: 0.3 }}
                    className={cn(
                      'px-4 py-3 rounded-lg transition-colors',
                      theme.foreground,
                    )}
                  >
                    {link.label}
                  </motion.a>
                ))}
              </nav>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
