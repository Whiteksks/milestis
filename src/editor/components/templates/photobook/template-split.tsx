"use client"

import type { PhotobookTemplateProps } from '@/editor/lib/template-types'
import { useRef } from 'react'
import { CoverSplit } from './sections/cover/cover-split'
import { IntroSplitText } from './sections/introduction/intro-split-text'
import { StorySplit } from './sections/story/story-split'
import { GalleryMinimal } from './sections/gallery/gallery-minimal'
import { HighlightSplit } from './sections/highlight/highlight-split'
import { EndingSplit } from './sections/ending/ending-split'

export function TemplateSplit({
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
          <CoverSplit sectionContent={sectionContent} theme={theme} />
        )}

        {sectionVisibility.showIntroduction && (
          <IntroSplitText sectionContent={sectionContent} theme={theme} />
        )}

        {sectionVisibility.showStory && (
          <StorySplit sectionContent={sectionContent} theme={theme} />
        )}

        {sectionVisibility.showGallery && (
          <GalleryMinimal sectionContent={sectionContent} theme={theme} />
        )}

        {sectionVisibility.showHighlight && (
          <HighlightSplit sectionContent={sectionContent} theme={theme} />
        )}

        {sectionVisibility.showEnding && (
          <EndingSplit sectionContent={sectionContent} theme={theme} />
        )}
      </main>
    </div>
  )
}
