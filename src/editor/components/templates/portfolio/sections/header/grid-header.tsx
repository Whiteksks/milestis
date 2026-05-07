'use client'

import {
  HeaderContent,
  HeaderMenuToggle,
  HeaderMobileDrawer,
  HeaderShell,
} from '../../../primitives/header-primitives'
import type { PortfolioTemplateProps } from '@/editor/lib/template-types'       
import { cn } from '@/lib/utils'

type GridHeaderProps = Pick<PortfolioTemplateProps, 'theme' | 'sectionContent' | 'handleAnchorClick'> 

export function GridHeader({ theme, sectionContent, handleAnchorClick }: GridHeaderProps) {
  const links = sectionContent.header.links ?? []
  const hasLinks = links.length > 0

  return (
    <HeaderShell placement="fixed" className={theme.glassPanel}>
      {({ menu, getLinkProps }) => (
        <>
          <HeaderContent
            width="compact"
            className={cn('px-5 @lg:px-8 h-14 flex items-center justify-between gap-8')}
          >

        {/* Name   bold, left */}
        <a
          {...getLinkProps('#hero', handleAnchorClick)}
          className={cn(
            'flex items-baseline gap-2.5 group shrink-0',
            theme.foreground,
          )}
        >
          <span className={cn(
            'text-sm font-bold tracking-tight opacity-80 group-hover:opacity-100 transition-opacity',
            theme.fontBody,
          )}>
            {sectionContent.header.title}
          </span>
          <span className={cn(
            'hidden @md:inline-flex items-center gap-1 text-[9px] uppercase tracking-widest opacity-25 group-hover:opacity-40 transition-opacity',
            theme.fontBody,
          )}>
          </span>
        </a>

        {/* Desktop nav   pill tabs */}
        {hasLinks && (
          <nav className={cn(
            'hidden @md:flex items-center gap-1 p-1 rounded-full border border-current/10 bg-current/[0.03]',
          )}>
            {links.map((link, i) => (
              <a
                key={i}
                {...getLinkProps(link.href, handleAnchorClick)}
                className={cn(
                  'px-4 py-1.5 text-[11px] uppercase tracking-widest font-medium rounded-full',
                  'opacity-45 hover:opacity-90 hover:bg-current/8 transition-all duration-150',
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
            className={cn('@md:hidden p-2 opacity-50 hover:opacity-100 transition-opacity', theme.foreground)}
            iconSize={15}
          />
        )}
          </HeaderContent>

      {/* Mobile drawer */}
      {hasLinks && (
        <HeaderMobileDrawer menu={menu} className={cn('@md:hidden border-t border-current/8', theme.glassPanel)}>
            <nav className="flex flex-col divide-y divide-current/8">
              {links.map((link, i) => (
                <a
                  key={i}
                  {...getLinkProps(link.href, handleAnchorClick, { closeMenu: true })}
                  className={cn(
                    'px-6 py-4 text-[11px] uppercase tracking-widest font-medium opacity-50 hover:opacity-90 transition-opacity',
                    theme.fontBody,
                    theme.foreground,
                  )}
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
