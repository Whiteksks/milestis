"use client"

import type { PhotobookTemplateProps } from '@/editor/lib/template-types'
import { useRef } from 'react'
import { CoverMagazine } from './sections/cover/cover-magazine'
import { IntroMagazine } from './sections/introduction/intro-magazine'
import { StoryMagazine } from './sections/story/story-magazine'
import { GalleryMagazine } from './sections/gallery/gallery-magazine'
import { HighlightMagazine } from './sections/highlight/highlight-magazine'
import { EndingMagazine } from './sections/ending/ending-magazine'

export function TemplateMagazine({
  theme,
  sectionVisibility,
  sectionContent,
}: PhotobookTemplateProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  return (
    <div className="min-h-screen bg-background text-foreground font-sans selection:bg-primary/20 overflow-x-hidden">
      <main ref={containerRef}>
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
      </main>
    </div>
  )
}
