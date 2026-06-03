'use client'

import { motion } from 'framer-motion'
import { useT, useDisabled } from '@/editor/components/templates/primitives/animation-context'
import {
  HeaderContent,
  HeaderMenuToggle,
  HeaderMobileDropdown,
  HeaderShell,
} from '@/editor/components/templates/primitives/header-primitives'
import type { PortfolioTemplateProps } from '@/editor/lib/template-types'
import { cn } from '@/lib/utils'

type ShowcaseHeaderProps = Pick<PortfolioTemplateProps, 'theme' | 'sectionContent' | 'imageContent' | 'handleAnchorClick'> 

export function ShowcaseHeader({ theme, sectionContent, imageContent, handleAnchorClick }: ShowcaseHeaderProps) {
  const t = useT()
  const disabled = useDisabled()
  const hasLinks = (sectionContent.header.links ?? []).length > 0
  const hasHeroImage = !!imageContent?.hero?.value.asset.src

  return (
    <HeaderShell placement="fixed" watchHero={hasHeroImage} className="transition-all duration-500">
      {({ overHero, menu, getLinkProps }) => {
        const isOverHero = hasHeroImage && overHero

        return (
          <HeaderContent width="compact" className="px-6 @md:px-12 @lg:px-20 h-16 flex items-center justify-between gap-8">
        {/* Brand */}
        <motion.a
          {...getLinkProps('#hero', handleAnchorClick)}
          initial={disabled ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={disabled ? undefined : t(0.6)}
          className={cn(
            'text-sm font-bold uppercase tracking-[0.3em] transition-colors duration-500',
            theme.fontTitle,
            isOverHero ? 'text-white' : theme.foreground,
          )}
        >
          {sectionContent.header.title}
        </motion.a>

        {/* Nav   desktop */}
        <motion.nav
          initial={disabled ? { opacity: 1, y: 0 } : { opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={disabled ? undefined : t(0.6, 0.1)}
          className="hidden @md:flex items-center gap-10"
        >
          {(sectionContent.header.links ?? []).map((link, i) => (
            <a
              key={i}
              {...getLinkProps(link.href, handleAnchorClick)}
              className={cn(
                'relative text-[11px] uppercase tracking-[0.2em] transition-all duration-500 group',
                theme.fontBody,
                isOverHero
                  ? 'text-white/70 hover:text-white'
                  : 'opacity-50 hover:opacity-100',
              )}
            >
              {link.label}
              <span className="absolute -bottom-0.5 left-0 w-0 h-px bg-current group-hover:w-full transition-all duration-300" />
            </a>
          ))}
        </motion.nav>

        {/* Mobile toggle + dropdown */}
        {hasLinks && (
          <div className="@md:hidden relative">
            <HeaderMenuToggle
              menu={menu}
              className={cn(
                'transition-all duration-500',
                isOverHero ? 'text-white/70 hover:text-white' : 'opacity-60 hover:opacity-100',
              )}
              iconSize={18}
            />

            <HeaderMobileDropdown
              menu={menu}
              transition={t(0.18)}
              className="min-w-[160px] rounded-xl overflow-hidden"
              scale={0.94}
              yOffset={-6}
            >
                  <div className={cn('border border-current/10', theme.glassPanel)}>
                    <nav className="flex flex-col py-2">
                      {(sectionContent.header.links ?? []).map((link, i) => (
                        <a
                          key={i}
                          {...getLinkProps(link.href, handleAnchorClick, { closeMenu: true })}
                          className={cn(
                            'px-5 py-2 text-[12px] uppercase tracking-[0.2em] opacity-60 hover:opacity-100 transition-opacity',
                            theme.fontBody,
                          )}
                        >
                          {link.label}
                        </a>
                      ))}
                    </nav>
                  </div>
            </HeaderMobileDropdown>
          </div>
        )}
          </HeaderContent>
        )
      }}
    </HeaderShell>
  )
}

