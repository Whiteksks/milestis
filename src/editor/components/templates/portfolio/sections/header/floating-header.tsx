'use client'

import { motion } from 'framer-motion'
import { useT } from '../../../primitives/animation-context'
import {
  HeaderContent,
  HeaderMenuToggle,
  HeaderMobilePanel,
  HeaderShell,
} from '../../../primitives/header-primitives'
import type { PortfolioTemplateProps } from '@/editor/lib/template-types'
import { cn } from '@/lib/utils'

type FloatingHeaderProps = Pick<PortfolioTemplateProps, 'theme' | 'sectionContent' | 'handleAnchorClick'> 

export function HeaderFloating({ theme, sectionContent, handleAnchorClick }: FloatingHeaderProps) {
  const t = useT()
  const hasLinks = (sectionContent.header.links ?? []).length > 0

  return (
    <HeaderShell placement="floating">
      {({ menu, getLinkProps }) => (
        <HeaderContent width="compact" className="max-w-4xl">
      <div className={cn(
        "rounded-full px-6 h-14 flex items-center justify-between shadow-lg shadow-black/5",
        theme.cardStyle
      )}>
        {/* Logo */}
        <a 
          {...getLinkProps('#hero', handleAnchorClick)}
          className={cn("text-base font-semibold text-foreground", theme.foreground)}
        >
          {sectionContent.header.title}
        </a>

        {/* Desktop Navigation */}
        <nav className="hidden @md:flex items-center gap-1">
          {(sectionContent.header.links ?? []).map((link, i) => (
            <a
              key={i}
              {...getLinkProps(link.href, handleAnchorClick)}
              className={cn(
                "text-sm text-muted-foreground hover:text-foreground hover:bg-accent px-4 py-2 rounded-full transition-all",
                theme.foreground
              )}
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Mobile Menu Button */}
        {hasLinks && (
          <HeaderMenuToggle
            menu={menu}
            className="@md:hidden p-2 text-foreground hover:bg-accent rounded-full transition-colors"
            iconSize={18}
          />
        )}
      </div>

      {/* Mobile Menu */}
      {hasLinks && (
        <HeaderMobilePanel
            menu={menu}
            transition={t(0.2)}
            className={cn(
              "@md:hidden mt-2 rounded-2xl overflow-hidden shadow-lg shadow-black/5",
              theme.cardStyle
            )}
          >
            <nav className="flex flex-col p-2">
              {(sectionContent.header.links ?? []).map((link, i) => (
                <a
                  key={i}
                  {...getLinkProps(link.href, handleAnchorClick, { closeMenu: true })}
                  className={cn(
                    "text-sm text-muted-foreground hover:text-foreground hover:bg-accent px-4 py-3 rounded-xl transition-all",
                    theme.foreground
                  )}
                >
                  {link.label}
                </a>
              ))}
            </nav>
        </HeaderMobilePanel>
      )}
        </HeaderContent>
      )}
    </HeaderShell>
  )
}
