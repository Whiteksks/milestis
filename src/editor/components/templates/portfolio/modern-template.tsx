import type { PortfolioTemplateProps } from "@/editor/components/editor/ui/portfolio-template-shell"
import { ModernHeader } from "./sections/header/modern-header"
import { ModernParallaxHero } from "./sections/hero/modern-hero"
import { ModernParallaxBio } from "./sections/bio/modern-bio"
import { ModernFeaturedWork } from "./sections/featured-work/modern-featured-work"
import { ModernVideo } from "./sections/video/modern-video"
import { ModernContact } from "./sections/contact/modern-contact"
import { ModernFooter } from "./sections/footer/modern-footer"

export function ModernParallaxTemplate({
  theme,
  sectionVisibility,
  sectionContent,
  handleAnchorClick,
}: PortfolioTemplateProps) {
  return (
    <>
      {sectionVisibility.showHeader && (
        <ModernHeader
          theme={theme}
          sectionContent={sectionContent}
          handleAnchorClick={handleAnchorClick}
        />
      )}

      {sectionVisibility.showHero && (
        <ModernParallaxHero theme={theme} sectionContent={sectionContent} />
      )}

      {sectionVisibility.showBio && (
        <ModernParallaxBio theme={theme} sectionContent={sectionContent} />
      )}

      {sectionVisibility.showFeaturedWork && (
        <ModernFeaturedWork theme={theme} sectionContent={sectionContent} />
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
