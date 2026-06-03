'use client'

import { motion } from 'framer-motion'
import { useT } from '@/editor/components/templates/primitives/animation-context'
import {
  HeaderContent,
  HeaderMenuToggle,
  HeaderMobileDropdown,
  HeaderShell,
} from '@/editor/components/templates/primitives/header-primitives'
import type { PortfolioTemplateProps } from '@/editor/lib/template-types'
import { cn } from '@/lib/utils'

type MinimalHeaderProps = Pick<PortfolioTemplateProps, 'theme' | 'sectionContent' | 'handleAnchorClick'> 

export function HeaderMinimal({ theme, sectionContent, handleAnchorClick }: MinimalHeaderProps) {
  const t = useT()
  const hasLinks = (sectionContent.header.links ?? []).length > 0

  return (
    <HeaderShell placement="fixed" className="bg-transparent">
      {({ menu, getLinkProps }) => (
        <HeaderContent width="compact" className={cn('px-6 @md:px-10 @lg:px-16 h-14 flex items-center justify-between', theme.foreground)}>
        {/* Brand */}
        <motion.a
          {...getLinkProps('#hero', handleAnchorClick)}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={t(0.7)}
          className={cn('text-[11px] uppercase tracking-[0.38em] font-medium hover:opacity-50 transition-opacity duration-300', theme.fontTitle)}
        >
          {sectionContent.header.title}
        </motion.a>

        {/* Desktop nav */}
        <motion.nav
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={t(0.7, 0.1 )}
          className="hidden @md:flex items-center gap-10"
        >
          {(sectionContent.header.links ?? []).map((link, i) => (
            <a
              key={i}
              {...getLinkProps(link.href, handleAnchorClick)}
              className={cn(
                'text-[10px] uppercase tracking-[0.24em] opacity-35 hover:opacity-100 transition-opacity duration-200',
                theme.fontBody,
              )}
            >
              {link.label}
            </a>
          ))}
        </motion.nav>

        {/* Mobile toggle + floating dropdown */}
        {hasLinks && (
          <div className="@md:hidden relative">
            <HeaderMenuToggle
              menu={menu}
              className="p-1.5 opacity-40 hover:opacity-100 transition-opacity"
            />

            <HeaderMobileDropdown
              menu={menu}
              transition={t(0.15)}
              className={cn('min-w-[148px] border border-current/10 overflow-hidden', theme.glassPanel)}
            >
                  <nav className="flex flex-col py-1.5">
                    {(sectionContent.header.links ?? []).map((link, i) => (
                      <a
                        key={i}
                        {...getLinkProps(link.href, handleAnchorClick, { closeMenu: true })}
                        className={cn('px-5 py-3 text-[10px] uppercase tracking-[0.24em] opacity-45 hover:opacity-100 transition-opacity', theme.fontBody)}
                      >
                        {link.label}
                      </a>
                    ))}
                  </nav>
            </HeaderMobileDropdown>
          </div>
        )}
        </HeaderContent>
      )}
    </HeaderShell>
  )
}
