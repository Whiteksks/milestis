'use client'

import { motion } from 'framer-motion'
import type { PortfolioTemplateProps } from '@/editor/components/editor/layout/portfolio-template-shell'
import { cn } from '@/lib/utils'

interface ShowcaseFooterProps extends Pick<PortfolioTemplateProps, 'theme' | 'sectionContent'> {}

export function ShowcaseFooter({ theme, sectionContent }: ShowcaseFooterProps) {
  return (
    <motion.footer
      id="footer"
      data-section-id="footer"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.6 }}
      className={cn(
        '@container border-t border-current/10 relative overflow-hidden',
        theme.foreground,
      )}
    >
      {/* Faded watermark */}
      <div
        aria-hidden
        className={cn(
          'absolute inset-0 flex items-center justify-center pointer-events-none select-none',
          theme.fontTitle,
        )}
      >
        <span className="text-[5rem] @sm:text-[8rem] @md:text-[12rem] @lg:text-[18rem] font-black uppercase leading-none opacity-[0.025] tracking-tighter text-center">
          {sectionContent.header.title}
        </span>
      </div>

      <div className="relative @lg:px-20 @md:px-12 px-8 py-14 @md:py-16">
        <div className="max-w-7xl mx-auto flex flex-col items-center gap-8 text-center">
          {/* Brand name */}
          <p
            className={cn(
              'text-sm font-bold uppercase tracking-[0.4em] opacity-70',
              theme.fontTitle,
            )}
          >
            {sectionContent.header.title}
          </p>

          {/* Nav links */}
          {(sectionContent.header.links ?? []).length > 0 && (
            <nav className="flex flex-wrap justify-center gap-6">
              {(sectionContent.header.links ?? []).map((link, i) => (
                <a
                  key={i}
                  href={link.href}
                  className={cn(
                    'text-[10px] uppercase tracking-[0.2em] opacity-30 hover:opacity-70 transition-opacity',
                    theme.fontBody,
                  )}
                >
                  {link.label}
                </a>
              ))}
            </nav>
          )}

          {/* Copyright */}
          <p
            className={cn(
              'text-[10px] uppercase tracking-[0.15em] opacity-20',
              theme.fontBody,
            )}
          >
            © {new Date().getFullYear()} {sectionContent.header.title} — All rights reserved
          </p>
        </div>
      </div>
    </motion.footer>
  )
}
