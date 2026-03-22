"use client"

import { useRef } from 'react'
import { cn } from '@/lib/utils'
import type { PhotobookTemplateProps } from '@/editor/lib/template-types'
import { CoverMemoir } from './sections/cover/cover-memoir'
import { IntroMemoir } from './sections/introduction/intro-memoir'
import { StoryMemoir } from './sections/story/story-memoir'
import { GalleryMemoir } from './sections/gallery/gallery-memoir'
import { HighlightMemoir } from './sections/highlight/highlight-memoir'
import { EndingMemoir } from './sections/ending/ending-memoir'

export function TemplateMemoirDesign({
  theme,
  sectionVisibility,
  sectionContent,
}: PhotobookTemplateProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  return (
    <div
      ref={containerRef}
      className={cn('min-h-screen overflow-x-hidden', theme.background, theme.foreground)}
    >
      {sectionVisibility.showCover && (
        <CoverMemoir sectionContent={sectionContent} theme={theme} />
      )}

      {sectionVisibility.showIntroduction && (
        <IntroMemoir sectionContent={sectionContent} theme={theme} />
      )}

      {sectionVisibility.showStory && (
        <StoryMemoir sectionContent={sectionContent} theme={theme} />
      )}

      {sectionVisibility.showGallery && (
        <GalleryMemoir sectionContent={sectionContent} theme={theme} />
      )}

      {sectionVisibility.showHighlight && (
        <HighlightMemoir sectionContent={sectionContent} theme={theme} />
      )}

      {sectionVisibility.showEnding && (
        <EndingMemoir sectionContent={sectionContent} theme={theme} />
      )}
    </div>
  )
}
