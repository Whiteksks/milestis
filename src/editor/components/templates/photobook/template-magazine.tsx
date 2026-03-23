"use client"

import { cn } from '@/lib/utils'
import type { PhotobookTemplateProps } from '@/editor/lib/template-types'
import { CoverMagazine } from './sections/cover/cover-magazine'
import { IntroMagazine } from './sections/introduction/intro-magazine'
import { StoryMagazine } from './sections/story/story-magazine'
import { GalleryMagazine } from './sections/gallery/gallery-magazine'
import { HighlightMagazine } from './sections/highlight/highlight-magazine'
import { EndingMagazine } from './sections/ending/ending-magazine'

export function TemplateMagazineDesign({
  theme,
  sectionVisibility,
  sectionContent,
}: PhotobookTemplateProps) {
  return (
    <div className={cn('min-h-screen overflow-x-hidden', theme.background, theme.foreground)}>
      {sectionVisibility.showCover && (
        <CoverMagazine sectionContent={sectionContent} theme={theme} />
      )}

      {sectionVisibility.showIntroduction && (
        <IntroMagazine sectionContent={sectionContent} theme={theme} />
      )}

      {sectionVisibility.showStory && (
        <StoryMagazine sectionContent={sectionContent} theme={theme} />
      )}

      {sectionVisibility.showGallery && (
        <GalleryMagazine sectionContent={sectionContent} theme={theme} />
      )}

      {sectionVisibility.showHighlight && (
        <HighlightMagazine sectionContent={sectionContent} theme={theme} />
      )}

      {sectionVisibility.showEnding && (
        <EndingMagazine sectionContent={sectionContent} theme={theme} />
      )}
    </div>
  )
}
