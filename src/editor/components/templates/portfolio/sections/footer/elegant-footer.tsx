'use client'

import { motion } from 'framer-motion'
import type { PortfolioTemplateProps } from '@/editor/components/editor/layout/portfolio-template-shell'
import { cn } from '@/lib/utils'
import { SocialIconLink } from '@/editor/components/templates/portfolio/social-icon'

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
          {/* Left: copyright */}
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className={cn('text-[10px] uppercase tracking-[0.3em] opacity-25', theme.fontBody)}
          >
            © {new Date().getFullYear()} {sectionContent.footer.copyright}
          </motion.p>

          {/* Right: social icons */}
          {(sectionContent.footer?.socialLinks ?? []).length > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.05 }}
              className="flex items-center gap-6"
            >
              {(sectionContent.footer?.socialLinks ?? []).map((link, i) => (
                <SocialIconLink
                  key={i}
                  href={link.href}
                  slug={link.icon}
                  iconSize={14}
                  className="opacity-25 hover:opacity-60 transition-opacity duration-300"
                />
              ))}
            </motion.div>
          )}
        </div>
      </div>
    </footer>
  )
}
