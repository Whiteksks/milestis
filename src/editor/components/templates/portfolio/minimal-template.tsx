'use client'

import { cn } from '@/lib/utils'
import type { PortfolioTemplateProps } from '@/editor/components/editor/layout/portfolio-template-shell'
import { MinimalHero } from './sections/hero/minimal-hero'
import { MinimalBio } from './sections/bio/minimal-bio'
import { MinimalFeaturedWork } from './sections/featured-work/minimal-featured-work'
import { MinimalVideo } from './sections/video/minimal-video'
import { MinimalContact } from './sections/contact/minimal-contact'
import { MinimalFooter } from './sections/footer/minimal-footer'
import { HeaderMinimal } from './sections/header/minimal-header'

export function MinimalTemplateDesign({
  theme,
  sectionVisibility,
  sectionContent,
  handleAnchorClick,
}: PortfolioTemplateProps) {
  return (
    <>
      {sectionVisibility.showHeader && (
        <HeaderMinimal
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
  )
}
