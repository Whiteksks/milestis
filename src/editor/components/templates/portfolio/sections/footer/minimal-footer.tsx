'use client'

import { motion } from 'framer-motion'
import type { PortfolioTemplateProps } from '@/editor/components/editor/layout/portfolio-template-shell'
import { cn } from '@/lib/utils'

interface MinimalFooterProps extends Pick<PortfolioTemplateProps, 'theme' | 'sectionContent'> {}

export function MinimalFooter({ theme, sectionContent }: MinimalFooterProps) {
  return (
    <motion.footer
      id="footer"
      data-section-id="footer"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.6 }}
      className={cn('@container border-t border-current/10', theme.foreground)}
    >
      <div className="@lg:px-20 @md:px-12 px-6 py-8 flex flex-col @md:flex-row items-center justify-between gap-4 text-xs opacity-50">
        <p className={cn('tracking-[0.16em]', theme.letterSpacing, theme.fontBody)}>
          © {new Date().getFullYear()} {sectionContent.header.title}. All rights reserved.
        </p>
        <p className={cn('tracking-[0.16em]', theme.letterSpacing, theme.fontBody)}>
          Crafted with intention.
        </p>
      </div>
    </motion.footer>
  )
}
