
import type { PortfolioTemplateProps } from '@/editor/lib/template-types'
import { AnimationProvider } from '../primitives/animation-context'
import { withSectionMemo } from '../primitives/with-section-memo'
import { ElegantHero as RawElegantHero } from './sections/hero/elegant-hero'
import { ElegantBio as RawElegantBio } from './sections/bio/elegant-bio'
import { ElegantFeaturedWork as RawElegantFeaturedWork } from './sections/featured-work/elegant-featured-work'
import { ElegantVideo as RawElegantVideo } from './sections/video/elegant-video'
import { ElegantContact as RawElegantContact } from './sections/contact/elegant-contact'
import { ElegantFooter as RawElegantFooter } from './sections/footer/elegant-footer'
import { ElegantHeader as RawElegantHeader } from './sections/header/elegant-header'


// Memoize all sections to prevent unnecessary re-renders
const ElegantHeader = withSectionMemo(RawElegantHeader, 'header')
const ElegantHero = withSectionMemo(RawElegantHero, 'hero')
const ElegantBio = withSectionMemo(RawElegantBio, 'bio')
const ElegantFeaturedWork = withSectionMemo(RawElegantFeaturedWork, 'featuredWork')
const ElegantVideo = withSectionMemo(RawElegantVideo, 'video')
const ElegantContact = withSectionMemo(RawElegantContact, 'contact')
const ElegantFooter = withSectionMemo(RawElegantFooter, 'footer')

export function ElegantTemplateDesign({
  theme,
  sectionVisibility,
  sectionContent,
  handleAnchorClick,
  disableAnimations = false,
}: PortfolioTemplateProps) {
  return (
    <AnimationProvider templateId="elegant" disabled={disableAnimations}>
      <>
      {sectionVisibility.showHeader && (
        <ElegantHeader
          theme={theme}
          sectionContent={sectionContent}
          handleAnchorClick={handleAnchorClick}
        />
      )}

      {sectionVisibility.showHero && (
        <ElegantHero theme={theme} sectionContent={sectionContent} />
      )}

      {sectionVisibility.showBio && (
        <ElegantBio theme={theme} sectionContent={sectionContent} />
      )}

      {sectionVisibility.showFeaturedWork && (
        <ElegantFeaturedWork
          theme={theme}
          sectionContent={sectionContent}
        />
      )}

      {sectionVisibility.showVideo && (
        <ElegantVideo theme={theme} sectionContent={sectionContent} />
      )}

      {sectionVisibility.showContact && (
        <ElegantContact theme={theme} sectionContent={sectionContent} />
      )}

      {sectionVisibility.showFooter && (
        <ElegantFooter theme={theme} sectionContent={sectionContent} />
      )}
      </>
    </AnimationProvider>
  )
}

