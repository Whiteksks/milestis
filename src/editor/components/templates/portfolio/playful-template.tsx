import type { PortfolioTemplateProps } from "@/editor/components/editor/layout/portfolio-template-shell"
import { ModernVideo } from "./sections/video/modern-video"
import { ModernContact } from "./sections/contact/modern-contact"
import { ModernFooter } from "./sections/footer/modern-footer"
import { HeaderGlass } from "./sections/header/glass-header"
import { MinimalHero } from "./sections/hero/minimal-hero"
import { ElegantBio } from "./sections/bio/elegant-bio"
import { ClassicFeaturedWork } from "./sections/featured-work/classic-featured-work"

export function PlayfulTemplate({
  theme,
  sectionVisibility,
  sectionContent,
  handleAnchorClick,
}: PortfolioTemplateProps) {
  return (
    <>
      {sectionVisibility.showHeader && (
        <HeaderGlass
          theme={theme}
          sectionContent={sectionContent}
          handleAnchorClick={handleAnchorClick}
        />
      )}

      {sectionVisibility.showHero && (
        <MinimalHero theme={theme} sectionContent={sectionContent} />
      )}

      {sectionVisibility.showBio && (
        <ElegantBio theme={theme} sectionContent={sectionContent} />
      )}

      {sectionVisibility.showFeaturedWork && (
        <ClassicFeaturedWork theme={theme} sectionContent={sectionContent} />
      )}

      {sectionVisibility.showVideo && (
        <ModernVideo theme={theme} sectionContent={sectionContent} />
      )}

      {sectionVisibility.showContact && (
        <ModernContact theme={theme} sectionContent={sectionContent} />
      )}

      {sectionVisibility.showFooter && (
        <ModernFooter theme={theme} sectionContent={sectionContent} />
      )}
    </>
  )
}
