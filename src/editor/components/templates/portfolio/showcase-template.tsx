'use client'

import type { PortfolioTemplateProps } from '@/editor/lib/template-types'
import { AnimationProvider } from '../primitives/animation-context'
import { withSectionMemo } from '../primitives/with-section-memo'
import { ShowcaseHeader as RawShowcaseHeader } from './sections/header/showcase-header'
import { ShowcaseHero as RawShowcaseHero } from './sections/hero/showcase-hero'
import { ShowcaseBio as RawShowcaseBio } from './sections/bio/showcase-bio'
import { ShowcaseFeaturedWork as RawShowcaseFeaturedWork } from './sections/featured-work/showcase-featured-work'
import { ShowcaseVideo as RawShowcaseVideo } from './sections/video/showcase-video'
import { ShowcaseContact as RawShowcaseContact } from './sections/contact/showcase-contact'
import { ShowcaseFooter as RawShowcaseFooter } from './sections/footer/showcase-footer'


// Memoize all sections to prevent unnecessary re-renders
const ShowcaseHeader = withSectionMemo(RawShowcaseHeader, 'header')
const ShowcaseHero = withSectionMemo(RawShowcaseHero, 'hero')
const ShowcaseBio = withSectionMemo(RawShowcaseBio, 'bio')
const ShowcaseFeaturedWork = withSectionMemo(RawShowcaseFeaturedWork, 'featuredWork')
const ShowcaseVideo = withSectionMemo(RawShowcaseVideo, 'video')
const ShowcaseContact = withSectionMemo(RawShowcaseContact, 'contact')
const ShowcaseFooter = withSectionMemo(RawShowcaseFooter, 'footer')

export function ShowcaseTemplateDesign({
  theme,
  sectionVisibility,
  sectionContent,
  imageContent,
  handleAnchorClick,
  disableAnimations = false,
}: PortfolioTemplateProps) {
  return (
    <AnimationProvider templateId="showcase" disabled={disableAnimations}>
      <>
      {sectionVisibility.showHeader && (
        <ShowcaseHeader
          theme={theme}
          sectionContent={sectionContent}
          imageContent={imageContent}
          handleAnchorClick={handleAnchorClick}
        />
      )}

      {sectionVisibility.showHero && (
        <ShowcaseHero theme={theme} sectionContent={sectionContent} imageContent={imageContent} />
      )}

      {sectionVisibility.showBio && (
        <ShowcaseBio theme={theme} sectionContent={sectionContent} imageContent={imageContent} />
      )}

      {sectionVisibility.showFeaturedWork && (
        <ShowcaseFeaturedWork theme={theme} sectionContent={sectionContent} imageContent={imageContent} />
      )}

      {sectionVisibility.showVideo && (
        <ShowcaseVideo theme={theme} sectionContent={sectionContent} />
      )}

      {sectionVisibility.showContact && (
        <ShowcaseContact theme={theme} sectionContent={sectionContent} />
      )}

      {sectionVisibility.showFooter && (
        <ShowcaseFooter theme={theme} sectionContent={sectionContent} />
      )}
      </>
    </AnimationProvider>
  )
}
