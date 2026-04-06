'use client'

import { cn } from '@/lib/utils'
import type { PortfolioTemplateProps } from '@/editor/lib/template-types'
import { AnimationProvider } from '../primitives/animation-context'
import { withSectionMemo } from '../primitives/with-section-memo'
import { MinimalHero as RawMinimalHero } from './sections/hero/minimal-hero'
import { MinimalBio as RawMinimalBio } from './sections/bio/minimal-bio'
import { MinimalFeaturedWork as RawMinimalFeaturedWork } from './sections/featured-work/minimal-featured-work'
import { MinimalVideo as RawMinimalVideo } from './sections/video/minimal-video'
import { MinimalContact as RawMinimalContact } from './sections/contact/minimal-contact'
import { MinimalFooter as RawMinimalFooter } from './sections/footer/minimal-footer'
import { HeaderMinimal as RawMinimalHeader } from './sections/header/minimal-header'

// Memoize all sections to prevent unnecessary re-renders
const MinimalHeader = withSectionMemo(RawMinimalHeader, 'header')
const MinimalHero = withSectionMemo(RawMinimalHero, 'hero')
const MinimalBio = withSectionMemo(RawMinimalBio, 'bio')
const MinimalFeaturedWork = withSectionMemo(RawMinimalFeaturedWork, 'featuredWork')
const MinimalVideo = withSectionMemo(RawMinimalVideo, 'video')
const MinimalContact = withSectionMemo(RawMinimalContact, 'contact')
const MinimalFooter = withSectionMemo(RawMinimalFooter, 'footer')

export function MinimalTemplateDesign({
  theme,
  sectionVisibility,
  sectionContent,
  handleAnchorClick,
  disableAnimations = false,
}: PortfolioTemplateProps) {
  return (
    <AnimationProvider templateId="minimal" disabled={disableAnimations}>
      <>
      {sectionVisibility.showHeader && (
        <MinimalHeader
          theme={theme}
          sectionContent={sectionContent}
          handleAnchorClick={handleAnchorClick}
        />
      )}

      {sectionVisibility.showHero && (
        <MinimalHero theme={theme} sectionContent={sectionContent} />
      )}

      {sectionVisibility.showBio && (
        <MinimalBio theme={theme} sectionContent={sectionContent} />
      )}

      {sectionVisibility.showFeaturedWork && (
        <MinimalFeaturedWork theme={theme} sectionContent={sectionContent} />
      )}

      {sectionVisibility.showVideo && (
        <MinimalVideo theme={theme} sectionContent={sectionContent} />
      )}

      {sectionVisibility.showContact && (
        <MinimalContact theme={theme} sectionContent={sectionContent} />
      )}

      {sectionVisibility.showFooter && (
        <MinimalFooter theme={theme} sectionContent={sectionContent} />
      )}
      </>
    </AnimationProvider>
  )
}
