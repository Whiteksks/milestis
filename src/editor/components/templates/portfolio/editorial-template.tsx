'use client'

import type { PortfolioTemplateProps } from '@/editor/lib/template-types'
import { EditorialHeader } from './sections/header/editorial-header'
import { EditorialHero } from './sections/hero/editorial-hero'
import { EditorialBio } from './sections/bio/editorial-bio'
import { EditorialFeaturedWork } from './sections/featured-work/editorial-featured-work'
import { EditorialVideo } from './sections/video/editorial-video'
import { EditorialContact } from './sections/contact/editorial-contact'
import { EditorialFooter } from './sections/footer/editorial-footer'

export function EditorialTemplateDesign({
  theme,
  sectionVisibility,
  sectionContent,
  handleAnchorClick,
}: PortfolioTemplateProps) {
  return (
    <>
      {sectionVisibility.showHeader && (
        <EditorialHeader
          theme={theme}
          sectionContent={sectionContent}
          handleAnchorClick={handleAnchorClick}
        />
      )}

      {sectionVisibility.showHero && (
        <EditorialHero theme={theme} sectionContent={sectionContent} />
      )}

      {sectionVisibility.showBio && (
        <EditorialBio theme={theme} sectionContent={sectionContent} />
      )}

      {sectionVisibility.showFeaturedWork && (
        <EditorialFeaturedWork theme={theme} sectionContent={sectionContent} />
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
  )
}
