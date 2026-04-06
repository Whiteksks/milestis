'use client'

import type { PortfolioTemplateProps } from '@/editor/lib/template-types'
import { AnimationProvider } from './primitives/animation-context'
import { withSectionMemo } from './primitives/with-section-memo'
import { LiquidGlassHeader as RawLiquidGlassHeader } from './sections/header/liquid-glass-header'
import { LiquidGlassHero as RawLiquidGlassHero } from './sections/hero/liquid-glass-hero'
import { LiquidGlassBio as RawLiquidGlassBio } from './sections/bio/liquid-glass-bio'
import { LiquidGlassFeaturedWork as RawLiquidGlassFeaturedWork } from './sections/featured-work/liquid-glass-featured-work'
import { LiquidGlassVideo as RawLiquidGlassVideo } from './sections/video/liquid-glass-video'
import { LiquidGlassContact as RawLiquidGlassContact } from './sections/contact/liquid-glass-contact'
import { LiquidGlassFooter as RawLiquidGlassFooter } from './sections/footer/liquid-glass-footer'


// Memoize all sections to prevent unnecessary re-renders
const LiquidGlassHeader = withSectionMemo(RawLiquidGlassHeader, 'header')
const LiquidGlassHero = withSectionMemo(RawLiquidGlassHero, 'hero')
const LiquidGlassBio = withSectionMemo(RawLiquidGlassBio, 'bio')
const LiquidGlassFeaturedWork = withSectionMemo(RawLiquidGlassFeaturedWork, 'featuredWork')
const LiquidGlassVideo = withSectionMemo(RawLiquidGlassVideo, 'video')
const LiquidGlassContact = withSectionMemo(RawLiquidGlassContact, 'contact')
const LiquidGlassFooter = withSectionMemo(RawLiquidGlassFooter, 'footer')

export function LiquidGlassTemplateDesign({
  theme,
  sectionVisibility,
  sectionContent,
  handleAnchorClick,
  disableAnimations = false,
}: PortfolioTemplateProps) {
  return (
    <AnimationProvider templateId="liquid-glass" disabled={disableAnimations}>
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
    </AnimationProvider>
  )
}
