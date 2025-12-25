"use client"

import type { PhotobookTemplateProps } from '@/editor/lib/template-types'
import { useRef } from 'react'
import { CoverPolaroid } from './sections/cover/cover-polaroid'
import { IntroCard } from './sections/introduction/intro-card'
import { StoryPolaroid } from './sections/story/story-polaroid'
import { GalleryPolaroid } from './sections/gallery/gallery-polaroid'
import { HighlightPolaroid } from './sections/highlight/highlight-polaroid'
import { EndingPolaroid } from './sections/ending/ending-polaroid'

export function TemplatePolaroid({
  theme,
  sectionVisibility,
  sectionContent,
  frameStyle: _frameStyle,
}: PhotobookTemplateProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  return (
    <div className="min-h-screen bg-background text-foreground font-sans selection:bg-primary/20 overflow-x-hidden">
      <main ref={containerRef}>
        {sectionVisibility.showCover && (
          <CoverPolaroid sectionContent={sectionContent} theme={theme} />
        )}

        {sectionVisibility.showIntroduction && (
          <IntroCard sectionContent={sectionContent} theme={theme} />
        )}

        {sectionVisibility.showStory && (
          <StoryPolaroid sectionContent={sectionContent} theme={theme} />
        )}

        {sectionVisibility.showGallery && (
          <GalleryPolaroid sectionContent={sectionContent} theme={theme} />
        )}

        {sectionVisibility.showHighlight && (
          <HighlightPolaroid sectionContent={sectionContent} theme={theme} />
        )}

        {sectionVisibility.showEnding && (
          <EndingPolaroid sectionContent={sectionContent} theme={theme} />
        )}
      </main>
    </div>
  )
}
