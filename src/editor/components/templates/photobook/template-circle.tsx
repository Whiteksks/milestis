"use client"

import type { PhotobookTemplateProps } from '@/editor/lib/template-types'
import { useRef } from 'react'
import { CoverCirclePortrait } from './sections/cover/cover-circle-portrait'
import { IntroCard } from './sections/introduction/intro-card'
import { StoryTimeline } from './sections/story/story-timeline'
import { GalleryCircles } from './sections/gallery/gallery-circles'
import { HighlightCircle } from './sections/highlight/highlight-circle'
import { EndingCircle } from './sections/ending/ending-circle'

export function TemplateCircle({
  theme,
  sectionVisibility,
  sectionContent,
}: PhotobookTemplateProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  return (
    <div className="min-h-screen bg-background text-foreground font-sans selection:bg-primary/20 overflow-x-hidden">
      <main ref={containerRef}>
        {sectionVisibility.showCover && (
          <CoverCirclePortrait sectionContent={sectionContent} theme={theme} />
        )}

        {sectionVisibility.showIntroduction && (
          <IntroCard sectionContent={sectionContent} theme={theme} />
        )}

        {sectionVisibility.showStory && (
          <StoryTimeline sectionContent={sectionContent} theme={theme} />
        )}

        {sectionVisibility.showGallery && (
          <GalleryCircles sectionContent={sectionContent} theme={theme} />
        )}

        {sectionVisibility.showHighlight && (
          <HighlightCircle sectionContent={sectionContent} theme={theme} />
        )}

        {sectionVisibility.showEnding && (
          <EndingCircle sectionContent={sectionContent} theme={theme} />
        )}
      </main>
    </div>
  )
}
