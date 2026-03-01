'use client'

import { motion } from 'framer-motion'
import type { PortfolioTemplateProps } from '@/editor/components/editor/layout/portfolio-template-shell'
import { cn } from '@/lib/utils'

interface MinimalFooterProps extends Pick<PortfolioTemplateProps, 'theme' | 'sectionContent'> {}

export function MinimalFooter({ theme, sectionContent }: MinimalFooterProps) {
  return (
    <footer
      id="footer"
      data-section-id="footer"
      className={cn('@container border-t border-current/10', theme.foreground)}
    >
      <div className="max-w-6xl mx-auto px-6 @md:px-10 @lg:px-16 py-8">
        <div className="flex flex-col @md:flex-row items-start @md:items-center justify-between gap-6">
          {/* Brand */}
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className={cn('text-[10px] uppercase tracking-[0.38em] opacity-35', theme.fontTitle)}
          >
            {sectionContent.header.title}
          </motion.p>

          {/* Nav links */}
          {(sectionContent.header.links ?? []).length > 0 && (
            <motion.nav
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.05 }}
              className="flex flex-wrap gap-7"
            >
              {(sectionContent.header.links ?? []).map((link, i) => (
                <a
                  key={i}
                  href={link.href}
                  className={cn('text-[9px] uppercase tracking-[0.26em] opacity-25 hover:opacity-60 transition-opacity', theme.fontBody)}
                >
                  {link.label}
                </a>
              ))}
            </motion.nav>
          )}

          {/* Copyright */}
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className={cn('text-[9px] opacity-20 tabular-nums', theme.fontBody)}
          >
            © {new Date().getFullYear()}
          </motion.p>
        </div>
      </div>
    </footer>
  )
}
