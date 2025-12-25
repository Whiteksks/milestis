"use client"

import type { PhotobookTemplateProps } from '@/editor/lib/template-types'
import { useRef } from 'react'
import { CoverHeroFullscreen } from './sections/cover/cover-hero-fullscreen'
import { IntroClassic } from './sections/introduction/intro-classic'
import { StoryClassic } from './sections/story/story-classic'
import { GalleryMasonry } from './sections/gallery/gallery-masonry'
import { HighlightClassic } from './sections/highlight/highlight-classic'
import { EndingClassic } from './sections/ending/ending-classic'

export function TemplateClassic({
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
          <CoverHeroFullscreen sectionContent={sectionContent} theme={theme} />
        )}

        {sectionVisibility.showIntroduction && (
          <IntroClassic sectionContent={sectionContent} theme={theme} />
        )}

        {sectionVisibility.showStory && (
          <StoryClassic sectionContent={sectionContent} theme={theme} />
        )}

        {sectionVisibility.showGallery && (
          <GalleryMasonry sectionContent={sectionContent} theme={theme} />
        )}

        {sectionVisibility.showHighlight && (
          <HighlightClassic sectionContent={sectionContent} theme={theme} />
        )}

        {sectionVisibility.showEnding && (
          <EndingClassic sectionContent={sectionContent} theme={theme} />
        )}
      </main>
    </div>
  )
}
