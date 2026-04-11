
import type { PortfolioTemplateProps } from '@/editor/lib/template-types'
import { cn } from '@/lib/utils'
import { SocialIconLink } from '@/editor/components/templates/portfolio/social-icon'

import { SectionWrapper } from '../../../primitives/section-wrapper'
import { Animate } from '../../../primitives/animate'
import { EditorialDivider } from '../../../primitives/portfolio/divider'

type EditorialFooterProps = Pick<PortfolioTemplateProps, 'theme' | 'sectionContent'> 

export function EditorialFooter({ theme, sectionContent }: EditorialFooterProps) {
  const socialLinks = sectionContent.footer.socialLinks ?? []
  return (
    <SectionWrapper
      id="footer"
      as="footer"
      themeForeground={theme.foreground}
      padded={false}
    >
      <EditorialDivider className="w-full" />
      <Animate direction="up" distance={20} className="@lg:px-20 @md:px-12 px-6 py-8">
        <div className="max-w-7xl mx-auto flex flex-col @md:flex-row items-start @md:items-center justify-between gap-4">
          {/* Left: copyright */}
          <div className="flex items-center gap-4">
            <p className={cn('text-[10px] uppercase opacity-20', theme.letterSpacing, theme.fontBody)}>
              В© {new Date().getFullYear()} {sectionContent.footer.copyright}
            </p>
          </div>

          {/* Right: social icons */}
          {socialLinks.length > 0 && (
            <div className="flex items-center gap-5">
              {socialLinks.map((link, i) => (
                <SocialIconLink
                  key={i}
                  href={link.href}
                  slug={link.icon}
                  iconSize={13}
                  className="opacity-20 hover:opacity-50 transition-opacity duration-200"
                />
              ))}
            </div>
          )}
        </div>
      </Animate>
    </SectionWrapper>
  )
}

