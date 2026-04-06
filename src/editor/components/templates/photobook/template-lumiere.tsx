"use client"

import { cn } from '@/lib/utils'
import type { PhotobookTemplateProps } from '@/editor/lib/template-types'
import { AnimationProvider } from '../primitives/animation-context'
import { withSectionMemo } from '../primitives/with-section-memo'
import { CoverLumiere as RawCoverLumiere } from './sections/cover/cover-lumiere'
import { IntroLumiere as RawIntroLumiere } from './sections/introduction/intro-lumiere'
import { StoryLumiere as RawStoryLumiere } from './sections/story/story-lumiere'
import { GalleryLumiere as RawGalleryLumiere } from './sections/gallery/gallery-lumiere'
import { HighlightLumiere as RawHighlightLumiere } from './sections/highlight/highlight-lumiere'
import { EndingLumiere as RawEndingLumiere } from './sections/ending/ending-lumiere'

const CoverLumiere = withSectionMemo(RawCoverLumiere, 'cover')
const IntroLumiere = withSectionMemo(RawIntroLumiere, 'introduction')
const StoryLumiere = withSectionMemo(RawStoryLumiere, 'story')
const GalleryLumiere = withSectionMemo(RawGalleryLumiere, 'gallery')
const HighlightLumiere = withSectionMemo(RawHighlightLumiere, 'highlight')
const EndingLumiere = withSectionMemo(RawEndingLumiere, 'ending')

export function TemplateLumiereDesign({
  theme,
  sectionVisibility,
  sectionContent,
  disableAnimations = false,
}: PhotobookTemplateProps) {
  return (
    <AnimationProvider templateId="lumiere" disabled={disableAnimations}>
      <div className={cn('min-h-screen overflow-x-clip', theme.background, theme.foreground)}>
        {sectionVisibility.showCover && (
          <CoverLumiere sectionContent={sectionContent} theme={theme} />
        )}

        {sectionVisibility.showIntroduction && (
          <IntroLumiere sectionContent={sectionContent} theme={theme} />
        )}

        {sectionVisibility.showStory && (
          <StoryLumiere sectionContent={sectionContent} theme={theme} />
        )}

        {sectionVisibility.showGallery && (
          <GalleryLumiere sectionContent={sectionContent} theme={theme} />
        )}

        {sectionVisibility.showHighlight && (
          <HighlightLumiere sectionContent={sectionContent} theme={theme} />
        )}

        {sectionVisibility.showEnding && (
          <EndingLumiere sectionContent={sectionContent} theme={theme} />
        )}
      </div>
    </AnimationProvider>
  )
}
