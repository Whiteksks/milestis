'use client'

import { motion } from 'framer-motion'
import type { PortfolioTemplateProps } from '@/editor/lib/template-types'
import { cn } from '@/lib/utils'
import { SocialIconLink } from '@/editor/components/templates/portfolio/social-icon'

interface MinimalFooterProps extends Pick<PortfolioTemplateProps, 'theme' | 'sectionContent'> {}

export function MinimalFooter({ theme, sectionContent }: MinimalFooterProps) {
  const socialLinks = sectionContent.footer.socialLinks ?? []
  return (
    <footer
      id="footer"
      data-section-id="footer"
      className={cn('@container border-t border-current/10', theme.foreground)}
    >
      <div className="max-w-6xl mx-auto px-6 @md:px-10 @lg:px-16 py-8">
        <div className="flex flex-col @md:flex-row items-start @md:items-center justify-between gap-6">
          {/* Left: copyright */}
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className={cn('text-[9px] uppercase tracking-[0.38em] opacity-20 tabular-nums', theme.fontBody)}
          >
            © {new Date().getFullYear()} {sectionContent.footer.copyright}
          </motion.p>

          {/* Right: social icons */}
          {socialLinks.length > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.05 }}
              className="flex items-center gap-5"
            >
              {socialLinks.map((link, i) => (
                <SocialIconLink
                  key={i}
                  href={link.href}
                  slug={link.icon}
                  iconSize={14}
                  className="opacity-25 hover:opacity-60 transition-opacity duration-200"
                />
              ))}
            </motion.div>
          )}

        </div>
      </div>
    </footer>
  )
}
