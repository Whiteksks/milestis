'use client'

import { motion } from 'framer-motion'
import type { PortfolioTemplateProps } from '@/editor/components/editor/layout/portfolio-template-shell'
import { cn } from '@/lib/utils'

interface ElegantFooterProps
  extends Pick<PortfolioTemplateProps, 'theme' | 'sectionContent'> {}

export function ElegantFooter({ theme, sectionContent }: ElegantFooterProps) {
  return (
    <footer
      id="footer"
      data-section-id="footer"
      className={cn('@container border-t border-current/10', theme.foreground)}
    >
      <div className="max-w-6xl mx-auto px-6 @md:px-10 @lg:px-16 py-10">
        <div className="flex flex-col @md:flex-row items-center justify-between gap-6">
          {/* Brand */}
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className={cn('text-[10px] uppercase tracking-[0.3em] opacity-30', theme.fontTitle)}
          >
            {sectionContent.header.title}
          </motion.p>

          {/* Social links */}
          {(sectionContent.footer?.socialLinks ?? []).length > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.05 }}
              className="flex gap-8"
            >
              {(sectionContent.footer?.socialLinks ?? []).map((link, i) => (
                <a
                  key={i}
                  href={link.href}
                  className={cn('text-[10px] uppercase tracking-[0.2em] opacity-25 hover:opacity-60 transition-opacity', theme.fontBody)}
                >
                  {link.icon}
                </a>
              ))}
            </motion.div>
          )}

          {/* Copyright */}
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className={cn('text-[9px] opacity-20 tabular-nums', theme.fontBody)}
          >
            © {new Date().getFullYear()}
          </motion.p>
        </div>
      </div>
    </footer>
  )
}
