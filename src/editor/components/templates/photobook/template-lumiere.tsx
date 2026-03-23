"use client"

import { cn } from '@/lib/utils'
import type { PhotobookTemplateProps } from '@/editor/lib/template-types'
import { CoverLumiere } from './sections/cover/cover-lumiere'
import { IntroLumiere } from './sections/introduction/intro-lumiere'
import { StoryLumiere } from './sections/story/story-lumiere'
import { GalleryLumiere } from './sections/gallery/gallery-lumiere'
import { HighlightLumiere } from './sections/highlight/highlight-lumiere'
import { EndingLumiere } from './sections/ending/ending-lumiere'

export function TemplateLumiereDesign({
  theme,
  sectionVisibility,
  sectionContent,
}: PhotobookTemplateProps) {
  return (
    <div className={cn('min-h-screen overflow-x-hidden', theme.background, theme.foreground)}>
      {sectionVisibility.showCover && (
        <CoverLumiere sectionContent={sectionContent} theme={theme} />
      )}

      {sectionVisibility.showIntroduction && (
        <IntroLumiere sectionContent={sectionContent} theme={theme} />
      )}

      {sectionVisibility.showStory && (
        <StoryLumiere sectionContent={sectionContent} theme={theme} />
      )}

      {sectionVisibility.showGallery && (
        <GalleryLumiere sectionContent={sectionContent} theme={theme} />
      )}

      {sectionVisibility.showHighlight && (
        <HighlightLumiere sectionContent={sectionContent} theme={theme} />
      )}

      {sectionVisibility.showEnding && (
        <EndingLumiere sectionContent={sectionContent} theme={theme} />
      )}
    </div>
  )
}
