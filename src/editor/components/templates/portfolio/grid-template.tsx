'use client'

import type { PortfolioTemplateProps } from '@/editor/components/editor/layout/portfolio-template-shell'
import { GridHeader } from './sections/header/grid-header'
import { GridHero } from './sections/hero/grid-hero'
import { GridBio } from './sections/bio/grid-bio'
import { GridFeaturedWork } from './sections/featured-work/grid-featured-work'
import { GridVideo } from './sections/video/grid-video'
import { GridContact } from './sections/contact/grid-contact'
import { GridFooter } from './sections/footer/grid-footer'

export function GridTemplateDesign({
  theme,
  sectionVisibility,
  sectionContent,
  handleAnchorClick,
}: PortfolioTemplateProps) {
  return (
    <>
      {sectionVisibility.showHeader && (
        <GridHeader
          theme={theme}
          sectionContent={sectionContent}
          handleAnchorClick={handleAnchorClick}
        />
      )}
      {sectionVisibility.showHero && (
        <GridHero theme={theme} sectionContent={sectionContent} />
      )}
      {sectionVisibility.showBio && (
        <GridBio theme={theme} sectionContent={sectionContent} />
      )}
      {sectionVisibility.showFeaturedWork && (
        <GridFeaturedWork theme={theme} sectionContent={sectionContent} />
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
  )
}
