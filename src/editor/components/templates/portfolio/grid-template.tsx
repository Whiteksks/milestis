'use client'

import type { PortfolioTemplateProps } from '@/editor/lib/template-types'
import { AnimationProvider } from '../primitives/animation-context'
import { withSectionMemo } from '../primitives/with-section-memo'
import { GridHeader as RawGridHeader } from './sections/header/grid-header'
import { GridHero as RawGridHero } from './sections/hero/grid-hero'
import { GridBio as RawGridBio } from './sections/bio/grid-bio'
import { GridFeaturedWork as RawGridFeaturedWork } from './sections/featured-work/grid-featured-work'
import { GridVideo as RawGridVideo } from './sections/video/grid-video'
import { GridContact as RawGridContact } from './sections/contact/grid-contact'
import { GridFooter as RawGridFooter } from './sections/footer/grid-footer'


// Memoize all sections to prevent unnecessary re-renders
const GridHeader = withSectionMemo(RawGridHeader, 'header')
const GridHero = withSectionMemo(RawGridHero, 'hero')
const GridBio = withSectionMemo(RawGridBio, 'bio')
const GridFeaturedWork = withSectionMemo(RawGridFeaturedWork, 'featuredWork')
const GridVideo = withSectionMemo(RawGridVideo, 'video')
const GridContact = withSectionMemo(RawGridContact, 'contact')
const GridFooter = withSectionMemo(RawGridFooter, 'footer')

export function GridTemplateDesign({
  theme,
  sectionVisibility,
  sectionContent,
  imageContent,
  handleAnchorClick,
  disableAnimations = false,
}: PortfolioTemplateProps) {
  return (
    <AnimationProvider templateId="grid" disabled={disableAnimations}>
      <>
      {sectionVisibility.showHeader && (
        <GridHeader
          theme={theme}
          sectionContent={sectionContent}
          handleAnchorClick={handleAnchorClick}
        />
      )}
      {sectionVisibility.showHero && (
        <GridHero theme={theme} sectionContent={sectionContent} imageContent={imageContent} />
      )}
      {sectionVisibility.showBio && (
        <GridBio theme={theme} sectionContent={sectionContent} imageContent={imageContent} />
      )}
      {sectionVisibility.showFeaturedWork && (
        <GridFeaturedWork theme={theme} sectionContent={sectionContent} imageContent={imageContent} />
      )}
      {sectionVisibility.showVideo && (
        <GridVideo theme={theme} sectionContent={sectionContent} />
      )}
      {sectionVisibility.showContact && (
        <GridContact theme={theme} sectionContent={sectionContent} />
      )}
      {sectionVisibility.showFooter && (
        <GridFooter theme={theme} sectionContent={sectionContent} />
      )}
      </>
    </AnimationProvider>
  )
}
