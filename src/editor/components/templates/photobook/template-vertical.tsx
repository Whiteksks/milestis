"use client"

import type { PhotobookTemplateProps } from '@/editor/lib/template-types'
import { useRef } from 'react'
import { CoverVerticalText } from './sections/cover/cover-vertical-text'
import { IntroVertical } from './sections/introduction/intro-vertical'
import { StoryVertical } from './sections/story/story-vertical'
import { GalleryTimeline } from './sections/gallery/gallery-timeline'
import { HighlightVertical } from './sections/highlight/highlight-vertical'
import { EndingVertical } from './sections/ending/ending-vertical'

export function TemplateVertical({
  theme,
  sectionVisibility,
  sectionContent,
}: PhotobookTemplateProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  return (
    <div className="min-h-screen bg-background text-foreground font-sans selection:bg-primary/20 overflow-x-hidden">
      <main ref={containerRef}>
        {sectionVisibility.showCover && (
          <CoverVerticalText sectionContent={sectionContent} theme={theme} />
        )}

        {sectionVisibility.showIntroduction && (
          <IntroVertical sectionContent={sectionContent} theme={theme} />
        )}

        {sectionVisibility.showStory && (
          <StoryVertical sectionContent={sectionContent} theme={theme} />
        )}

        {sectionVisibility.showGallery && (
          <GalleryTimeline sectionContent={sectionContent} theme={theme} />
        )}

        {sectionVisibility.showHighlight && (
          <HighlightVertical sectionContent={sectionContent} theme={theme} />
        )}

        {sectionVisibility.showEnding && (
          <EndingVertical sectionContent={sectionContent} theme={theme} />
        )}
      </main>
    </div>
  )
}
