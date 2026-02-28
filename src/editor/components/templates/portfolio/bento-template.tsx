'use client'

import type { PortfolioTemplateProps } from '@/editor/components/editor/layout/portfolio-template-shell'
import { BentoHeader } from './sections/header/bento-header'
import { BentoHero } from './sections/hero/bento-hero'
import { BentoBio } from './sections/bio/bento-bio'
import { BentoFeaturedWork } from './sections/featured-work/bento-featured-work'
import { BentoVideo } from './sections/video/bento-video'
import { BentoContact } from './sections/contact/bento-contact'
import { BentoFooter } from './sections/footer/bento-footer'

export function BentoTemplateDesign({
  theme,
  sectionVisibility,
  sectionContent,
  handleAnchorClick,
}: PortfolioTemplateProps) {
  return (
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
  )
}
