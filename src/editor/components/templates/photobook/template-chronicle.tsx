"use client"

import { cn } from '@/lib/utils'
import type { PhotobookTemplateProps } from '@/editor/lib/template-types'
import { CoverChronicle } from './sections/cover/cover-chronicle'
import { IntroChronicle } from './sections/introduction/intro-chronicle'
import { StoryChronicle } from './sections/story/story-chronicle'
import { GalleryChronicle } from './sections/gallery/gallery-chronicle'
import { HighlightChronicle } from './sections/highlight/highlight-chronicle'
import { EndingChronicle } from './sections/ending/ending-chronicle'

export function TemplateChronicleDesign({
  theme,
  sectionVisibility,
  sectionContent,
}: PhotobookTemplateProps) {
  return (
    <div className={cn('min-h-screen overflow-x-hidden', theme.background, theme.foreground)}>
      {sectionVisibility.showCover && (
        <CoverChronicle sectionContent={sectionContent} theme={theme} />
      )}

      {sectionVisibility.showIntroduction && (
        <IntroChronicle sectionContent={sectionContent} theme={theme} />
      )}

      {sectionVisibility.showStory && (
        <StoryChronicle sectionContent={sectionContent} theme={theme} />
      )}

      {sectionVisibility.showGallery && (
        <GalleryChronicle sectionContent={sectionContent} theme={theme} />
      )}

      {sectionVisibility.showHighlight && (
        <HighlightChronicle sectionContent={sectionContent} theme={theme} />
      )}

      {sectionVisibility.showEnding && (
        <EndingChronicle sectionContent={sectionContent} theme={theme} />
      )}
    </div>
  )
}
