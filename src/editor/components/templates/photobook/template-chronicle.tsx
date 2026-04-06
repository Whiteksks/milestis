"use client"

import { cn } from '@/lib/utils'
import type { PhotobookTemplateProps } from '@/editor/lib/template-types'
import { AnimationProvider } from '../primitives/animation-context'
import { withSectionMemo } from '../primitives/with-section-memo'
import { CoverChronicle as RawCoverChronicle } from './sections/cover/cover-chronicle'
import { IntroChronicle as RawIntroChronicle } from './sections/introduction/intro-chronicle'
import { StoryChronicle as RawStoryChronicle } from './sections/story/story-chronicle'
import { GalleryChronicle as RawGalleryChronicle } from './sections/gallery/gallery-chronicle'
import { HighlightChronicle as RawHighlightChronicle } from './sections/highlight/highlight-chronicle'
import { EndingChronicle as RawEndingChronicle } from './sections/ending/ending-chronicle'

const CoverChronicle = withSectionMemo(RawCoverChronicle, 'cover')
const IntroChronicle = withSectionMemo(RawIntroChronicle, 'introduction')
const StoryChronicle = withSectionMemo(RawStoryChronicle, 'story')
const GalleryChronicle = withSectionMemo(RawGalleryChronicle, 'gallery')
const HighlightChronicle = withSectionMemo(RawHighlightChronicle, 'highlight')
const EndingChronicle = withSectionMemo(RawEndingChronicle, 'ending')

export function TemplateChronicleDesign({
  theme,
  sectionVisibility,
  sectionContent,
  disableAnimations = false,
}: PhotobookTemplateProps) {
  return (
    <AnimationProvider templateId="chronicle" disabled={disableAnimations}>
      <div className={cn('min-h-screen overflow-x-clip', theme.background, theme.foreground)}>
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
    </AnimationProvider>
  )
}
