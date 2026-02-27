'use client'

import { motion } from 'framer-motion'
import type { PortfolioTemplateProps } from '@/editor/components/editor/layout/portfolio-template-shell'
import { cn } from '@/lib/utils'

interface ElegantFooterProps
  extends Pick<PortfolioTemplateProps, 'theme' | 'sectionContent'> {}

export function ElegantFooter({ theme, sectionContent }: ElegantFooterProps) {
  return (
    <motion.footer
      id="footer"
      data-section-id="footer"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 0.8 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className={cn('@container border-t', theme.border, theme.foreground)}
    >
      <div className="@lg:px-16 @md:px-10 px-6 @lg:py-16 @md:py-12 py-10">
        <div className="max-w-7xl mx-auto flex @md:flex-row flex-col @md:justify-between @md:items-center gap-6 text-center @md:text-left">
          <p
            className={cn(
              '@md:text-xs text-[10px] uppercase tracking-widest opacity-30',
              theme.fontBody,
            )}
          >
            {sectionContent.footer.copyright}
          </p>
          {sectionContent.footer.socialLinks &&
            sectionContent.footer.socialLinks.length > 0 && (
              <div className="flex @md:gap-8 gap-6 justify-center">
                {sectionContent.footer.socialLinks.map((link, i) => (
                  <a
                    key={i}
                    href={link.href}
                    className={cn(
                      '@md:text-xs text-[10px] uppercase tracking-widest opacity-30 hover:opacity-60 transition-opacity',
                      theme.fontBody,
                    )}
                  >
                    {link.icon}
                  </a>
                ))}
              </div>
            )}
        </div>
      </div>
    </motion.footer>
  )
}
