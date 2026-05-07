'use client'

import {
  HeaderContent,
  HeaderMenuToggle,
  HeaderMobileDrawer,
  HeaderShell,
} from '../../../primitives/header-primitives'
import type { PortfolioTemplateProps } from '@/editor/lib/template-types'
import { cn } from '@/lib/utils'

type BentoHeaderProps = Pick<PortfolioTemplateProps, 'theme' | 'sectionContent' | 'handleAnchorClick'> 

export function BentoHeader({ theme, sectionContent, handleAnchorClick }: BentoHeaderProps) {
  const links = sectionContent.header.links ?? []
  const hasLinks = links.length > 0

  return (
    <HeaderShell placement="fixed" className={theme.glassPanel}>
      {({ menu, getLinkProps }) => (
        <>
          <HeaderContent width="compact" className="px-5 h-14 flex items-center justify-between gap-6">

        {/* Logo / name */}
        <a
          {...getLinkProps('#hero', handleAnchorClick)}
          className={cn('text-sm font-bold tracking-tight opacity-80 hover:opacity-100 transition-opacity', theme.foreground, theme.fontBody)}
        >
          {sectionContent.header.title}
        </a>

        {/* Desktop pill nav */}
        {hasLinks && (
          <nav className={cn(
            'hidden @md:flex items-center gap-0.5 px-2 py-1.5 rounded-full border border-current/10',
            theme.card,
          )}>
            {links.map((link, i) => (
              <a
                key={i}
                {...getLinkProps(link.href, handleAnchorClick)}
                className={cn(
                  'px-3.5 py-1 text-[11px] font-medium rounded-full opacity-60 hover:opacity-100 hover:bg-current/8 transition-all duration-150',
                  theme.fontBody,
                  theme.foreground,
                )}
              >
                {link.label}
              </a>
            ))}
          </nav>
        )}

        {/* Mobile toggle */}
        {hasLinks && (
          <HeaderMenuToggle
            menu={menu}
            className={cn('@md:hidden p-2 opacity-60 hover:opacity-100 transition-opacity', theme.foreground)}
          />
        )}
          </HeaderContent>

      {/* Mobile drawer */}
      {hasLinks && (
        <HeaderMobileDrawer menu={menu} className={cn('@md:hidden border-t border-current/8', theme.glassPanel)}>
            <nav className="flex flex-col px-5 py-3 gap-0.5">
              {links.map((link, i) => (
                <a
                  key={i}
                  {...getLinkProps(link.href, handleAnchorClick, { closeMenu: true })}
                  className={cn('py-2.5 px-2 text-sm font-medium opacity-60 hover:opacity-100 transition-opacity rounded-xl', theme.fontBody, theme.foreground)}
                >
                  {link.label}
                </a>
              ))}
            </nav>
        </HeaderMobileDrawer>
      )}
        </>
      )}
    </HeaderShell>
  )
}

