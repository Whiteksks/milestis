'use client'

import { motion } from 'framer-motion'
import type { PortfolioTemplateProps } from '@/editor/components/editor/layout/portfolio-template-shell'
import { cn } from '@/lib/utils'

interface EditorialFooterProps extends Pick<PortfolioTemplateProps, 'theme' | 'sectionContent'> {}

export function EditorialFooter({ theme, sectionContent }: EditorialFooterProps) {
  return (
    <motion.footer
      id="footer"
      data-section-id="footer"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.6 }}
      className={cn('@container border-t border-current/10', theme.foreground)}
    >
      <div className="@lg:px-20 @md:px-12 px-6 py-8">
        <div className="max-w-7xl mx-auto flex flex-col @md:flex-row items-start @md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <span
              className={cn(
                'text-[10px] uppercase opacity-20',
                theme.letterSpacing,
                theme.fontBody,
              )}
            >
              Vol. I
            </span>
            <div className="w-px h-3 bg-current opacity-15" />
            <p className={cn('text-[10px] uppercase opacity-30', theme.letterSpacing, theme.fontBody)}>
              {sectionContent.header.title}
            </p>
          </div>

          <p className={cn('text-[10px] uppercase opacity-20', theme.letterSpacing, theme.fontBody)}>
            © {new Date().getFullYear()} — All rights reserved
          </p>
        </div>
      </div>
    </motion.footer>
  )
}
