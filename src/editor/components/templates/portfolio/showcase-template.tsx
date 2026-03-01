'use client'

import type { PortfolioTemplateProps } from '@/editor/components/editor/layout/portfolio-template-shell'
import { ShowcaseHeader } from './sections/header/showcase-header'
import { ShowcaseHero } from './sections/hero/showcase-hero'
import { ShowcaseBio } from './sections/bio/showcase-bio'
import { ShowcaseFeaturedWork } from './sections/featured-work/showcase-featured-work'
import { ShowcaseVideo } from './sections/video/showcase-video'
import { ShowcaseContact } from './sections/contact/showcase-contact'
import { ShowcaseFooter } from './sections/footer/showcase-footer'

export function ShowcaseTemplateDesign({
  theme,
  sectionVisibility,
  sectionContent,
  handleAnchorClick,
}: PortfolioTemplateProps) {
  return (
    <>
      {sectionVisibility.showHeader && (
        <ShowcaseHeader
          theme={theme}
          sectionContent={sectionContent}
          handleAnchorClick={handleAnchorClick}
        />
      )}

      {sectionVisibility.showHero && (
        <ShowcaseHero theme={theme} sectionContent={sectionContent} />
      )}

      {sectionVisibility.showBio && (
        <ShowcaseBio theme={theme} sectionContent={sectionContent} />
      )}

      {sectionVisibility.showFeaturedWork && (
        <ShowcaseFeaturedWork theme={theme} sectionContent={sectionContent} />
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
  )
}
