'use client'

import { useT } from '@/editor/components/templates/primitives/animation-context'
import {
  HeaderContent,
  HeaderMenuToggle,
  HeaderMobileDropdown,
  HeaderShell,
} from '@/editor/components/templates/primitives/header-primitives'
import type { PortfolioTemplateProps } from '@/editor/lib/template-types'
import { cn } from '@/lib/utils'

type ElegantHeaderProps = Pick<PortfolioTemplateProps, 'theme' | 'sectionContent' | 'handleAnchorClick'> 

export function ElegantHeader({ theme, sectionContent, handleAnchorClick }: ElegantHeaderProps) {
  const t = useT()
  const hasLinks = (sectionContent.header.links ?? []).length > 0
  const links = sectionContent.header.links ?? []

  return (
    <HeaderShell placement="sticky" behavior="sticky" className="transition-all duration-700">
      {({ scrolled, menu, getLinkProps }) => (
        <div
          className={cn(
            'border-b transition-all duration-700',
            scrolled
              ? cn(theme.glassPanel, 'border-current/5')
              : 'bg-transparent border-transparent',
          )}
        >
          <HeaderContent
            width="compact"
            className="px-6 @md:px-10 @lg:px-16 py-5 flex items-center justify-between"
          >
            <a
              {...getLinkProps('#hero', handleAnchorClick)}
              className={cn(
                'text-sm font-light tracking-[0.28em] uppercase opacity-70 hover:opacity-100 transition-opacity duration-300',
                theme.fontTitle,
              )}
            >
              {sectionContent.header.title}
            </a>

            {hasLinks && (
              <nav className="hidden @md:flex items-center gap-10">
                {links.map((link, i) => (
                  <a
                    key={i}
                    {...getLinkProps(link.href, handleAnchorClick)}
                    className={cn(
                      'text-[10px] uppercase tracking-[0.22em] opacity-35 hover:opacity-80 transition-opacity duration-300',
                      theme.fontBody,
                    )}
                  >
                    {link.label}
                  </a>
                ))}
              </nav>
            )}

            {hasLinks && (
              <div className="@md:hidden relative">
                <HeaderMenuToggle
                  menu={menu}
                  className="p-2 opacity-45 hover:opacity-90 transition-opacity"
                />
                <HeaderMobileDropdown
                  menu={menu}
                  transition={t(0.2)}
                  className={cn(
                    'min-w-[148px] py-2',
                    theme.glassPanel,
                    'border border-current/10',
                  )}
                >
                  {links.map((link, i) => (
                    <a
                      key={i}
                      {...getLinkProps(link.href, handleAnchorClick, { closeMenu: true })}
                      className={cn(
                        'block px-5 py-2.5 text-[10px] uppercase tracking-[0.22em] opacity-40 hover:opacity-90 transition-opacity',
                        theme.fontBody,
                      )}
                    >
                      {link.label}
                    </a>
                  ))}
                </HeaderMobileDropdown>
              </div>
            )}
          </HeaderContent>
        </div>
      )}
    </HeaderShell>
  )
}
