import type { PortfolioTemplateProps } from '@/editor/components/editor/layout/portfolio-template-shell'
import { ClassicHeader } from './sections/header/classic-header'
import { ClassicHero } from './sections/hero/classic-hero'
import { ClassicBio } from './sections/bio/classic-bio'
import { ClassicFeaturedWork } from './sections/featured-work/classic-featured-work'
import { ClassicVideo } from './sections/video/classic-video'
import { ClassicContact } from './sections/contact/classic-contact'
import { ClassicFooter } from './sections/footer/classic-footer'
import { BioParallaxFramer } from './sections/bio/bioparallax'

export function ClassicTemplateDesign({
  theme,
  sectionVisibility,
  sectionContent,
  handleAnchorClick,
}: PortfolioTemplateProps) {
  return (
    <>
      {sectionVisibility.showHeader && (
        <ClassicHeader
          theme={theme}
          sectionContent={sectionContent}
          handleAnchorClick={handleAnchorClick}
        />
      )}

      {sectionVisibility.showHero && (
        <ClassicHero theme={theme} sectionContent={sectionContent} />
      )}


      {sectionVisibility.showFeaturedWork && (
        <ClassicFeaturedWork theme={theme} sectionContent={sectionContent} />
      )}

      {sectionVisibility.showBio && (
        <BioParallaxFramer theme={theme} sectionContent={sectionContent} />
      )}

      {sectionVisibility.showVideo && (
        <ClassicVideo theme={theme} sectionContent={sectionContent} />
      )}

      {sectionVisibility.showContact && (
        <ClassicContact theme={theme} sectionContent={sectionContent} />
      )}

      {sectionVisibility.showFooter && (
        <ClassicFooter theme={theme} sectionContent={sectionContent} />
      )}
    </>
  )
}
