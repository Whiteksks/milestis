'use client'

import {
  HeaderContent,
  HeaderMenuToggle,
  HeaderMobileDrawer,
  HeaderShell,
} from '@/editor/components/templates/primitives/header-primitives'
import type { PortfolioTemplateProps } from '@/editor/lib/template-types'
import { cn } from '@/lib/utils'

type EditorialHeaderProps = Pick<PortfolioTemplateProps, 'theme' | 'sectionContent' | 'handleAnchorClick'> 

export function EditorialHeader({ theme, sectionContent, handleAnchorClick }: EditorialHeaderProps) {
  const hasLinks = (sectionContent.header.links ?? []).length > 0

  return (
    <HeaderShell placement="fixed" className={cn('border-b border-current/10', theme.glassPanel)}>
      {({ menu, getLinkProps }) => (
        <>
          <HeaderContent width="compact" className="px-6 h-14 flex items-center justify-between gap-8">
        {/* Left: issue marker + brand */}
        <div className="flex items-center gap-4">
          <span
            className={cn(
              'text-[10px] uppercase opacity-30',
              theme.letterSpacing,
              theme.fontBody,
            )}
          >
            Vol. I
          </span>
          <div className="w-px h-4 bg-current opacity-20" />
          <a
            {...getLinkProps('#hero', handleAnchorClick)}
            className={cn(
              'text-xs uppercase tracking-[0.25em] font-medium',
              theme.fontBody,
              theme.foreground,
            )}
          >
            {sectionContent.header.title}
          </a>
        </div>

        {/* Right: nav */}
        <nav className="hidden @md:flex items-center gap-8">
          {(sectionContent.header.links ?? []).map((link, i) => (
            <a
              key={i}
              {...getLinkProps(link.href, handleAnchorClick)}
              className={cn(
                'text-[11px] uppercase tracking-[0.2em] opacity-50 hover:opacity-100 transition-opacity',
                theme.fontBody,
              )}
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Mobile toggle */}
        {hasLinks && (
          <HeaderMenuToggle
            menu={menu}
            className="@md:hidden p-2 opacity-60 hover:opacity-100 transition-opacity"
          />
        )}
          </HeaderContent>

      {/* Mobile menu */}
      {hasLinks && (
        <HeaderMobileDrawer menu={menu} className={cn('@md:hidden border-t border-current/10', theme.glassPanel)}>
            <nav className="flex flex-col px-6 py-5 gap-5">
              {(sectionContent.header.links ?? []).map((link, i) => (
                <a
                  key={i}
                  {...getLinkProps(link.href, handleAnchorClick, { closeMenu: true })}
                  className={cn(
                    'text-xs uppercase tracking-[0.2em] opacity-70 hover:opacity-100 transition-opacity',
                    theme.fontBody,
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

