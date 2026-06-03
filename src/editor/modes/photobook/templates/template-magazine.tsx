'use client'
"use client"

import { cn } from '@/lib/utils'
import type { PhotobookTemplateProps } from '@/editor/lib/template-types'
import { AnimationProvider } from '@/editor/components/templates/primitives/animation-context'
import { withSectionMemo } from '@/editor/components/templates/primitives/with-section-memo'
import { CoverMagazine as RawCoverMagazine } from './sections/cover/cover-magazine'
import { IntroMagazine as RawIntroMagazine } from './sections/introduction/intro-magazine'
import { StoryMagazine as RawStoryMagazine } from './sections/story/story-magazine'
import { GalleryMagazine as RawGalleryMagazine } from './sections/gallery/gallery-magazine'
import { HighlightMagazine as RawHighlightMagazine } from './sections/highlight/highlight-magazine'
import { EndingMagazine as RawEndingMagazine } from './sections/ending/ending-magazine'

const CoverMagazine = withSectionMemo(RawCoverMagazine, 'cover')
const IntroMagazine = withSectionMemo(RawIntroMagazine, 'introduction')
const StoryMagazine = withSectionMemo(RawStoryMagazine, 'story')
const GalleryMagazine = withSectionMemo(RawGalleryMagazine, 'gallery')
const HighlightMagazine = withSectionMemo(RawHighlightMagazine, 'highlight')
const EndingMagazine = withSectionMemo(RawEndingMagazine, 'ending')

export function TemplateMagazineDesign({
  theme,
  sectionVisibility,
  sectionContent,
  imageContent,
  disableAnimations = false,
}: PhotobookTemplateProps) {
  return (
    <AnimationProvider templateId="magazine" disabled={disableAnimations}>
      <div className={cn('min-h-screen overflow-x-clip', theme.background, theme.foreground)}>
        {sectionVisibility.showCover && (
          <CoverMagazine sectionContent={sectionContent} theme={theme} imageContent={imageContent} />
        )}

        {sectionVisibility.showIntroduction && (
          <IntroMagazine sectionContent={sectionContent} theme={theme} imageContent={imageContent} />
        )}

        {sectionVisibility.showStory && (
          <StoryMagazine sectionContent={sectionContent} theme={theme} imageContent={imageContent} />
        )}

        {sectionVisibility.showGallery && (
          <GalleryMagazine sectionContent={sectionContent} theme={theme} imageContent={imageContent} />
        )}

        {sectionVisibility.showHighlight && (
          <HighlightMagazine sectionContent={sectionContent} theme={theme} imageContent={imageContent} />
        )}

        {sectionVisibility.showEnding && (
          <EndingMagazine sectionContent={sectionContent} theme={theme} imageContent={imageContent} />
        )}
      </div>
    </AnimationProvider>
  )
}

