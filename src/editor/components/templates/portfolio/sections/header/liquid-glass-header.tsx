'use client'

import { motion } from 'framer-motion'
import { useT, useDisabled } from '../../../primitives/animation-context'
import {
  HeaderContent,
  HeaderMenuToggle,
  HeaderMobilePanel,
  HeaderShell,
} from '../../../primitives/header-primitives'
import type { PortfolioTemplateProps } from '@/editor/lib/template-types'
import { cn } from '@/lib/utils'

type LiquidGlassHeaderProps = Pick<PortfolioTemplateProps, 'theme' | 'sectionContent' | 'handleAnchorClick'> 

export function LiquidGlassHeader({ theme, sectionContent, handleAnchorClick }: LiquidGlassHeaderProps) {
  const t = useT()
  const disabled = useDisabled()
  const hasLinks = (sectionContent.header.links ?? []).length > 0

  return (
    <HeaderShell placement="fixed" watchHero className="transition-all duration-500">
      {({ overHero, menu, getLinkProps }) => (
        <>
      {/* Glass bar */}
      <div
        className="mx-3 mt-3 rounded-2xl border border-white/20 transition-all duration-500"
        style={{
          background: overHero
            ? 'rgba(255,255,255,0.08)'
            : 'rgba(255,255,255,0.14)',
          backdropFilter: 'blur(24px) saturate(180%) brightness(1.05)',
          WebkitBackdropFilter: 'blur(24px) saturate(180%) brightness(1.05)',
          boxShadow: '0 4px 24px rgba(0,0,0,0.12), inset 0 1px 0 rgba(255,255,255,0.25), inset 0 -1px 0 rgba(0,0,0,0.06)',
        }}
      >
        {/* Inner glare */}
        <div
          className="absolute inset-0 rounded-2xl pointer-events-none"
          style={{ background: 'linear-gradient(135deg, rgba(255,255,255,0.18) 0%, transparent 60%)' }}
        />

        <HeaderContent width="compact" className="relative px-5 @md:px-10 @lg:px-16 h-14 flex items-center justify-between gap-8">
          {/* Brand */}
          <motion.a
            {...getLinkProps('#hero', handleAnchorClick)}
            initial={disabled ? { opacity: 1, x: 0 } : { opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={disabled ? undefined : t(0.6)}
            className={cn('text-sm font-bold uppercase tracking-[0.28em] text-white drop-shadow-sm', theme.fontTitle)}
          >
            {sectionContent.header.title}
          </motion.a>

          {/* Nav   desktop */}
          <motion.nav
            initial={disabled ? { opacity: 1, y: 0 } : { opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={disabled ? undefined : t(0.6, 0.1)}
            className="hidden @md:flex items-center gap-8"
          >
            {(sectionContent.header.links ?? []).map((link, i) => (
              <a
                key={i}
                {...getLinkProps(link.href, handleAnchorClick)}
                className={cn(
                  'relative text-[11px] uppercase tracking-[0.18em] text-white/65 hover:text-white transition-colors duration-200 group',
                  theme.fontBody,
                )}
              >
                {link.label}
                <span className="absolute -bottom-0.5 left-0 w-0 h-px bg-white group-hover:w-full transition-all duration-300" />
              </a>
            ))}
          </motion.nav>

          {/* Mobile toggle */}
          {hasLinks && (
            <HeaderMenuToggle
              menu={menu}
              className="@md:hidden p-1.5 text-white/70 hover:text-white transition-colors"
              iconSize={18}
            />
          )}
        </HeaderContent>
      </div>

      {/* Mobile menu   separate glass panel */}
      {hasLinks && (
        <HeaderMobilePanel
            menu={menu}
            transition={t(0.2)}
            className="mx-3 mt-2 rounded-2xl overflow-hidden border border-white/15"
            style={{
              background: 'rgba(255,255,255,0.12)',
              backdropFilter: 'blur(24px) saturate(180%)',
              WebkitBackdropFilter: 'blur(24px) saturate(180%)',
              boxShadow: '0 8px 32px rgba(0,0,0,0.18), inset 0 1px 0 rgba(255,255,255,0.22)',
            }}
          >
            <nav className="flex flex-col px-6 py-5 gap-5">
              {(sectionContent.header.links ?? []).map((link, i) => (
                <a
                  key={i}
                  {...getLinkProps(link.href, handleAnchorClick, { closeMenu: true })}
                  className={cn(
                    'text-sm uppercase tracking-[0.18em] text-white/70 hover:text-white transition-colors',
                    theme.fontBody,
                  )}
                >
                  {link.label}
                </a>
              ))}
            </nav>
        </HeaderMobilePanel>
      )}
        </>
      )}
    </HeaderShell>
  )
}
