'use client'

import { motion } from 'framer-motion'
import type { PortfolioTemplateProps } from '@/editor/components/editor/layout/portfolio-template-shell'
import { cn } from '@/lib/utils'
import { SocialIconLink } from '@/editor/components/templates/portfolio/social-icon'

interface ShowcaseFooterProps extends Pick<PortfolioTemplateProps, 'theme' | 'sectionContent'> {}

export function ShowcaseFooter({ theme, sectionContent }: ShowcaseFooterProps) {
  const socialLinks = sectionContent.footer.socialLinks ?? []
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
        <div className="max-w-7xl mx-auto flex flex-col @md:flex-row items-center justify-between gap-6">
          {/* Left: copyright */}
          <p className={cn('text-[10px] uppercase tracking-[0.15em] opacity-20', theme.fontBody)}>
            © {new Date().getFullYear()} {sectionContent.footer.copyright}
          </p>

          {/* Right: social icons */}
          {socialLinks.length > 0 && (
            <div className="flex items-center gap-6">
              {socialLinks.map((link, i) => (
                <SocialIconLink
                  key={i}
                  href={link.href}
                  slug={link.icon}
                  iconSize={16}
                  className="opacity-30 hover:opacity-70 transition-opacity duration-200"
                />
              ))}
            </div>
          )}

        </div>
      </div>
    </motion.footer>
  )
}
