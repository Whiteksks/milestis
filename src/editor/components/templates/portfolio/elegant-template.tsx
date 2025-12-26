import { cn } from '@/lib/utils'
import type { PortfolioTemplateProps } from '@/editor/components/editor/ui/portfolio-template-shell'
import { ElegantHero } from './sections/hero/elegant-hero'
import { ElegantBio } from './sections/bio/elegant-bio'
import { ElegantFeaturedWork } from './sections/featured-work/elegant-featured-work'
import { ElegantVideo } from './sections/video/elegant-video'
import { ElegantContact } from './sections/contact/elegant-contact'
import { ElegantFooter } from './sections/footer/elegant-footer'
import { ElegantHeader } from './sections/header/elegant-header'

export function ElegantTemplateDesign({
  theme,
  sectionVisibility,
  sectionContent,
  handleAnchorClick,
}: PortfolioTemplateProps) {
  return (
    <div className={cn(theme.background, theme.foreground)}>
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
    </div>
  )
}

