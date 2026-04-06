'use client'

import type { PortfolioTemplateProps } from '@/editor/lib/template-types'
import { AnimationProvider } from './primitives/animation-context'
import { withSectionMemo } from './primitives/with-section-memo'
import { BentoHeader as RawBentoHeader } from './sections/header/bento-header'
import { BentoHero as RawBentoHero } from './sections/hero/bento-hero'
import { BentoBio as RawBentoBio } from './sections/bio/bento-bio'
import { BentoFeaturedWork as RawBentoFeaturedWork } from './sections/featured-work/bento-featured-work'
import { BentoVideo as RawBentoVideo } from './sections/video/bento-video'
import { BentoContact as RawBentoContact } from './sections/contact/bento-contact'
import { BentoFooter as RawBentoFooter } from './sections/footer/bento-footer'


// Memoize all sections to prevent unnecessary re-renders
const BentoHeader = withSectionMemo(RawBentoHeader, 'header')
const BentoHero = withSectionMemo(RawBentoHero, 'hero')
const BentoBio = withSectionMemo(RawBentoBio, 'bio')
const BentoFeaturedWork = withSectionMemo(RawBentoFeaturedWork, 'featuredWork')
const BentoVideo = withSectionMemo(RawBentoVideo, 'video')
const BentoContact = withSectionMemo(RawBentoContact, 'contact')
const BentoFooter = withSectionMemo(RawBentoFooter, 'footer')

export function BentoTemplateDesign({
  theme,
  sectionVisibility,
  sectionContent,
  handleAnchorClick,
  disableAnimations = false,
}: PortfolioTemplateProps) {
  return (
    <AnimationProvider templateId="bento" disabled={disableAnimations}>
      <>
      {sectionVisibility.showHeader && (
        <BentoHeader
          theme={theme}
          sectionContent={sectionContent}
          handleAnchorClick={handleAnchorClick}
        />
      )}
      {sectionVisibility.showHero && (
        <BentoHero theme={theme} sectionContent={sectionContent} />
      )}
      {sectionVisibility.showBio && (
        <BentoBio theme={theme} sectionContent={sectionContent} />
      )}
      {sectionVisibility.showFeaturedWork && (
        <BentoFeaturedWork theme={theme} sectionContent={sectionContent} />
      )}
      {sectionVisibility.showVideo && (
        <BentoVideo theme={theme} sectionContent={sectionContent} />
      )}
      {sectionVisibility.showContact && (
        <BentoContact theme={theme} sectionContent={sectionContent} />
      )}
      {sectionVisibility.showFooter && (
        <BentoFooter theme={theme} sectionContent={sectionContent} />
      )}
      </>
    </AnimationProvider>
  )
}
