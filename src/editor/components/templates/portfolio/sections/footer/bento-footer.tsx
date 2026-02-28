'use client'

import { motion } from 'framer-motion'
import type { PortfolioTemplateProps } from '@/editor/components/editor/layout/portfolio-template-shell'
import { cn } from '@/lib/utils'

interface BentoFooterProps extends Pick<PortfolioTemplateProps, 'theme' | 'sectionContent'> {}

export function BentoFooter({ theme, sectionContent }: BentoFooterProps) {
  const socialLinks = sectionContent.footer.socialLinks ?? []

  return (
    <motion.footer
      id="footer"
      data-section-id="footer"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className={cn('@container', theme.foreground)}
    >
      <div className="@lg:px-6 @md:px-5 px-4 pt-3 pb-6">
        <div className="max-w-6xl mx-auto">
          <div className={cn(
            'rounded-3xl border border-current/8 px-6 py-5 flex @md:flex-row flex-col items-start @md:items-center justify-between gap-4',
            theme.card,
          )}>

            {/* Left: name */}
            <p className={cn('text-sm font-bold opacity-60', theme.fontBody)}>
              {sectionContent.header.title}
            </p>

            {/* Center: social links */}
            {socialLinks.length > 0 && (
              <div className="flex items-center gap-2">
                {socialLinks.map((link, i) => (
                  <a
                    key={i}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={cn(
                      'px-3 py-1.5 text-[10px] uppercase tracking-wider rounded-full border border-current/12 opacity-45 hover:opacity-70 transition-opacity',
                      theme.fontBody,
                    )}
                  >
                    {link.icon}
                  </a>
                ))}
              </div>
            )}

            {/* Right: copyright */}
            <p className={cn('text-[10px] opacity-25 shrink-0', theme.fontBody)}>
              © {new Date().getFullYear()}
            </p>

          </div>
        </div>
      </div>
    </motion.footer>
  )
}
