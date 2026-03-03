'use client'

import type { PortfolioTemplateProps } from '@/editor/lib/template-types'
import { LiquidGlassHeader } from './sections/header/liquid-glass-header'
import { LiquidGlassHero } from './sections/hero/liquid-glass-hero'
import { LiquidGlassBio } from './sections/bio/liquid-glass-bio'
import { LiquidGlassFeaturedWork } from './sections/featured-work/liquid-glass-featured-work'
import { LiquidGlassVideo } from './sections/video/liquid-glass-video'
import { LiquidGlassContact } from './sections/contact/liquid-glass-contact'
import { LiquidGlassFooter } from './sections/footer/liquid-glass-footer'

export function LiquidGlassTemplateDesign({
  theme,
  sectionVisibility,
  sectionContent,
  handleAnchorClick,
}: PortfolioTemplateProps) {
  return (
    <>
      {sectionVisibility.showHeader && (
        <LiquidGlassHeader
          theme={theme}
          sectionContent={sectionContent}
          handleAnchorClick={handleAnchorClick}
        />
      )}
      {sectionVisibility.showHero && (
        <LiquidGlassHero theme={theme} sectionContent={sectionContent} />
      )}
      {sectionVisibility.showBio && (
        <LiquidGlassBio theme={theme} sectionContent={sectionContent} />
      )}
      {sectionVisibility.showFeaturedWork && (
        <LiquidGlassFeaturedWork theme={theme} sectionContent={sectionContent} />
      )}
      {sectionVisibility.showVideo && (
        <LiquidGlassVideo theme={theme} sectionContent={sectionContent} />
      )}
      {sectionVisibility.showContact && (
        <LiquidGlassContact theme={theme} sectionContent={sectionContent} />
      )}
      {sectionVisibility.showFooter && (
        <LiquidGlassFooter theme={theme} sectionContent={sectionContent} />
      )}
    </>
  )
}
