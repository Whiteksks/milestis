'use client'

import type { PortfolioTemplateProps } from '@/editor/lib/template-types'       
import { cn } from '@/lib/utils'
import { SocialIconLink } from '@/editor/components/templates/portfolio/social-icon'
import { SectionWrapper } from '../../../primitives/section-wrapper'
import { Animate } from '../../../primitives/animate'

type GridFooterProps = Pick<PortfolioTemplateProps, 'theme' | 'sectionContent'> 

export function GridFooter({ theme, sectionContent }: GridFooterProps) {        
  const socialLinks = sectionContent.footer.socialLinks ?? []

  return (
    <SectionWrapper
      id="footer"
      themeForeground={theme.foreground}
      padded={false}
      className="@container"
    >
      <div className="@lg:px-6 @md:px-5 px-4 pt-3 pb-6">
        <div className="max-w-6xl mx-auto">
          <Animate
            direction="up"
            distance={5}
            className={cn(
              'rounded-2xl border border-current/8 px-6 py-5',
              'flex @md:flex-row flex-col items-start @md:items-center justify-between gap-4',
              theme.card,
            )}>
            <p className={cn('text-[10px] uppercase tracking-[0.2em] opacity-25', theme.fontBody)}>
              Р’В© {new Date().getFullYear()} {sectionContent.footer.copyright}
            </p>

            {/* Right: social icons */}
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

          </Animate>
        </div>
      </div>
    </SectionWrapper>
  )
}
