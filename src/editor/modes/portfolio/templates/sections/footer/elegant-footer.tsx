'use client'

import type { PortfolioTemplateProps } from '@/editor/lib/template-types'
import { cn } from '@/lib/utils'
import { SocialIconLink } from '../../social-icon'
import { SectionWrapper } from '@/editor/components/templates/primitives/section-wrapper'

type ElegantFooterProps = Pick<PortfolioTemplateProps, 'theme' | 'sectionContent'> 

export function ElegantFooter({ theme, sectionContent }: ElegantFooterProps) {
  return (
    <SectionWrapper
      id="footer"
      as="footer"
      themeForeground={theme.foreground}
      className="border-t border-current/10"
    >
      <div className="max-w-6xl mx-auto px-6 @md:px-10 @lg:px-16 py-10">
        <div className="flex flex-col @md:flex-row items-center justify-between gap-6">
          {/* Left: copyright */}
          <div
            className={cn('text-[10px] uppercase tracking-[0.3em] opacity-35', theme.fontBody)}
          >
            <p>© {new Date().getFullYear()} {sectionContent.footer.copyright}</p>
          </div>

          {/* Right: social icons */}
          {(sectionContent.footer?.socialLinks ?? []).length > 0 && (
            <div className="flex items-center gap-6">
              {(sectionContent.footer?.socialLinks ?? []).map((link, i) => (
                <SocialIconLink
                  key={i}
                  href={link.href}
                  slug={link.icon}
                  iconSize={14}
                  className="opacity-25 hover:opacity-60 transition-opacity duration-300"
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </SectionWrapper>
  )
}
