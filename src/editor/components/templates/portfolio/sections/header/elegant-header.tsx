'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { XIcon, MenuIcon } from 'lucide-react'
import type { PortfolioTemplateProps } from '@/editor/components/editor/ui/portfolio-template-shell'
import { cn } from '@/lib/utils'
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
      initial={{ opacity: 0, y: -6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.22, 0.11, 0.23, 1] }}
      className={cn(
        // Оставим здесь только стили, отвечающие за позиционирование и фон по всей ширине.
        'sticky top-0 z-40 backdrop-blur-xl',
        'supports-backdrop-filter:backdrop-blur-2xl',
        theme.background,
      )}
    >
      {/* Контейнер для содержимого и нижней линии.
          Он ограничивает ширину (max-w-6xl), центрирует контент (mx-auto),
          и теперь именно он имеет нижний border-b. 
      */}
      <div 
        className={cn(
          'max-w-6xl mx-auto',
          'border-b border-current/10/40', // Нижняя линия теперь здесь
          '@lg:px-24 @md:px-16 px-6' // Отступы по бокам для меньших экранов
        )}
      >
        <div className="py-4 flex items-center justify-between">
          <a
            href="#hero"
            onClick={(e) => handleAnchorClick(e, '#hero')}
            className="flex items-center gap-3"
          >
            <h1
              className={cn(
                '@lg:text-3xl @md:text-2xl text-xl font-light tracking-tight opacity-90',
                theme.fontTitle,
                theme.letterSpacing,
              )}
            >
              {sectionContent.header.title}
            </h1>
          </a>

          {/* Desktop nav — calm & elegant */}
          <nav className="hidden @md:flex items-center gap-10">
            {(sectionContent.header.links ?? []).map((link, i) => (
              <a
                key={i}
                href={link.href}
                onClick={(e) => handleAnchorClick(e, link.href)}
                className={cn(
                  'relative text-[0.78rem] font-light uppercase tracking-[0.14em] opacity-55 hover:opacity-80 transition-opacity duration-300',
                  theme.letterSpacing,
                )}
              >
                {link.label}

                {/* subtle underline, always hidden unless hover */}
                <span
                  className="pointer-events-none absolute left-0 -bottom-1 w-full h-px 
                  bg-current/30 opacity-0 group-hover:opacity-40 transition-opacity duration-300"
                />
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
              <motion.div
                animate={{ rotate: isMenuOpen ? 90 : 0 }}
                transition={{ duration: 0.35, ease: 'easeOut' }}
              >
                {isMenuOpen ? <XIcon /> : <MenuIcon />}
              </motion.div>
            </Button>
          )}
        </div>
      </div>

      {hasLinks && (
        <motion.nav
          initial={false}
          animate={{
            height: isMenuOpen ? 'auto' : 0,
            opacity: isMenuOpen ? 1 : 0,
          }}
          transition={{ duration: 0.45, ease: [0.22, 0.11, 0.23, 1] }}
          // Убираем border-t отсюда, т.к. он должен быть внутри
          className="@md:hidden overflow-hidden backdrop-blur-xl"
        >
          <div 
             className={cn(
              // На мобильном меню мы также центрируем контент, но для избежания
              // двойного border-t, мы добавим его только внутрь этого контейнера.
              'border-t border-current/10', // Нижняя линия для меню
              'max-w-6xl mx-auto',
              '@lg:px-20 @md:px-12 px-6 py-4 flex flex-col gap-0.5',
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
                transition={{ duration: 0.3, delay: i * 0.04 }}
                className={cn(
                  'py-2 text-[0.8rem] font-light uppercase tracking-[0.17em] opacity-70 hover:opacity-90 transition-opacity',
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