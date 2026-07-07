'use client'

import type { PortfolioTemplateProps } from '@/editor/lib/template-types'
import { cn } from '@/lib/utils'
import { SocialIconLink } from '../../social-icon'

import { SectionWrapper } from '@/editor/components/templates/primitives/section-wrapper'

type BentoFooterProps = Pick<PortfolioTemplateProps, 'theme' | 'sectionContent'> 

export function BentoFooter({ theme, sectionContent }: BentoFooterProps) {
  const socialLinks = sectionContent.footer.socialLinks ?? []

  return (
    <SectionWrapper
      id="footer"
      as="footer"
      themeForeground={theme.foreground}
      className="@lg:px-6 @md:px-5 px-4 pt-3 pb-6"
    >
      <div className="max-w-6xl mx-auto w-full">
        <div
          className={cn(
            'rounded-3xl border border-current/8 px-6 py-5 flex @md:flex-row flex-col items-start @md:items-center justify-between gap-4',
            theme.card,
          )}
        >
          <p className={cn('text-[10px] uppercase tracking-[0.2em] opacity-25', theme.fontBody)}>
            © {new Date().getFullYear()} {sectionContent.footer.copyright}
          </p>

          {socialLinks.length > 0 && (
            <div className="flex items-center gap-4">
              {socialLinks.map((link, i) => (
                <SocialIconLink
                  key={i}
                  href={link.href}
                  slug={link.icon}
                  iconSize={15}
                  className="opacity-40 hover:opacity-75 transition-opacity duration-200"
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </SectionWrapper>
  )
}
