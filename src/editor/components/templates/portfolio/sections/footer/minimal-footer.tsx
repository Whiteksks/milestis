'use client'

import type { PortfolioTemplateProps } from '@/editor/lib/template-types'
import { cn } from '@/lib/utils'
import { SocialIconLink } from '@/editor/components/templates/portfolio/social-icon'
import { SectionWrapper } from '../../../primitives/section-wrapper'
import { Animate } from '../../../primitives/animate'

interface MinimalFooterProps extends Pick<PortfolioTemplateProps, 'theme' | 'sectionContent'> {}

export function MinimalFooter({ theme, sectionContent }: MinimalFooterProps) {
  const socialLinks = sectionContent.footer.socialLinks ?? []
  return (
    <SectionWrapper
      id="footer"
      as="footer"
      themeForeground={theme.foreground}
      padded={false}
      className="border-t border-current/10"
    >
      <div className="max-w-6xl mx-auto px-6 @md:px-10 @lg:px-16 py-8">
        <div className="flex flex-col @md:flex-row items-start @md:items-center justify-between gap-6">
          {/* Left: copyright */}
          <Animate
            direction="none"
            as="p"
            className={cn('text-[9px] uppercase tracking-[0.38em] opacity-20 tabular-nums', theme.fontBody)}
          >
            © {new Date().getFullYear()} {sectionContent.footer.copyright}
          </Animate>

          {/* Right: social icons */}
          {socialLinks.length > 0 && (
            <Animate direction="none" delay={0.05} className="flex items-center gap-5">
              {socialLinks.map((link, i) => (
                <SocialIconLink
                  key={i}
                  href={link.href}
                  slug={link.icon}
                  iconSize={14}
                  className="opacity-25 hover:opacity-60 transition-opacity duration-200"
                />
              ))}
            </Animate>
          )}
        </div>
      </div>
    </SectionWrapper>
  )
}
