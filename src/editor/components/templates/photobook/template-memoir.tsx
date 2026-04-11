'use client'
"use client"

import { cn } from '@/lib/utils'
import type { PhotobookTemplateProps } from '@/editor/lib/template-types'
import { AnimationProvider } from '../primitives/animation-context'
import { withSectionMemo } from '../primitives/with-section-memo'
import { CoverMemoir as RawCoverMemoir } from './sections/cover/cover-memoir'
import { IntroMemoir as RawIntroMemoir } from './sections/introduction/intro-memoir'
import { StoryMemoir as RawStoryMemoir } from './sections/story/story-memoir'
import { GalleryMemoir as RawGalleryMemoir } from './sections/gallery/gallery-memoir'
import { HighlightMemoir as RawHighlightMemoir } from './sections/highlight/highlight-memoir'
import { EndingMemoir as RawEndingMemoir } from './sections/ending/ending-memoir'

const CoverMemoir = withSectionMemo(RawCoverMemoir, 'cover')
const IntroMemoir = withSectionMemo(RawIntroMemoir, 'introduction')
const StoryMemoir = withSectionMemo(RawStoryMemoir, 'story')
const GalleryMemoir = withSectionMemo(RawGalleryMemoir, 'gallery')
const HighlightMemoir = withSectionMemo(RawHighlightMemoir, 'highlight')
const EndingMemoir = withSectionMemo(RawEndingMemoir, 'ending')

export function TemplateMemoirDesign({
  theme,
  sectionVisibility,
  sectionContent,
  disableAnimations = false,
}: PhotobookTemplateProps) {
  return (
    <AnimationProvider templateId="memoir" disabled={disableAnimations}>
      <div className={cn('min-h-screen overflow-x-clip', theme.background, theme.foreground)}>
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
    </AnimationProvider>
  )
}