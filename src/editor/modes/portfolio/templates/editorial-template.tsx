'use client'

import type { PortfolioTemplateProps } from '@/editor/lib/template-types'
import { AnimationProvider } from '@/editor/components/templates/primitives/animation-context'
import { withSectionMemo } from '@/editor/components/templates/primitives/with-section-memo'

import { EditorialHeader as RawEditorialHeader } from './sections/header/editorial-header'
import { EditorialHero as RawEditorialHero } from './sections/hero/editorial-hero'
import { EditorialBio as RawEditorialBio } from './sections/bio/editorial-bio'
import { EditorialFeaturedWork as RawEditorialFeaturedWork } from './sections/featured-work/editorial-featured-work'
import { EditorialVideo as RawEditorialVideo } from './sections/video/editorial-video'
import { EditorialContact as RawEditorialContact } from './sections/contact/editorial-contact'
import { EditorialFooter as RawEditorialFooter } from './sections/footer/editorial-footer'

// Memoize all sections to prevent unnecessary re-renders when other sections change
const EditorialHeader = withSectionMemo(RawEditorialHeader, 'header')
const EditorialHero = withSectionMemo(RawEditorialHero, 'hero')
const EditorialBio = withSectionMemo(RawEditorialBio, 'bio')
const EditorialFeaturedWork = withSectionMemo(RawEditorialFeaturedWork, 'featuredWork')
const EditorialVideo = withSectionMemo(RawEditorialVideo, 'video')
const EditorialContact = withSectionMemo(RawEditorialContact, 'contact')
const EditorialFooter = withSectionMemo(RawEditorialFooter, 'footer')

export function EditorialTemplateDesign({
  theme,
  sectionVisibility,
  sectionContent,
  imageContent,
  handleAnchorClick,
  disableAnimations = false,
}: PortfolioTemplateProps) {
  return (
    <AnimationProvider templateId="editorial" disabled={disableAnimations}>
      <>
      {sectionVisibility.showHeader && (
        <EditorialHeader
          theme={theme}
          sectionContent={sectionContent}
          handleAnchorClick={handleAnchorClick}
        />
      )}

      {sectionVisibility.showHero && (
        <EditorialHero theme={theme} sectionContent={sectionContent} imageContent={imageContent} />
      )}

      {sectionVisibility.showBio && (
        <EditorialBio theme={theme} sectionContent={sectionContent} imageContent={imageContent} />
      )}

      {sectionVisibility.showFeaturedWork && (
        <EditorialFeaturedWork theme={theme} sectionContent={sectionContent} imageContent={imageContent} />
      )}

      {sectionVisibility.showVideo && (
        <EditorialVideo theme={theme} sectionContent={sectionContent} />
      )}

      {sectionVisibility.showContact && (
        <EditorialContact theme={theme} sectionContent={sectionContent} />
      )}

      {sectionVisibility.showFooter && (
        <EditorialFooter theme={theme} sectionContent={sectionContent} />
      )}
      </>
    </AnimationProvider>
  )
}


