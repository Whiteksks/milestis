"use client"

import { cn } from '@/lib/utils'
import type { PhotobookTemplateProps } from '@/editor/lib/template-types'
import { AnimationProvider } from '../primitives/animation-context'
import { withSectionMemo } from '../primitives/with-section-memo'
import { CoverSoleil as RawCoverSoleil } from './sections/cover/cover-soleil'
import { IntroSoleil as RawIntroSoleil } from './sections/introduction/intro-soleil'
import { StorySoleil as RawStorySoleil } from './sections/story/story-soleil'
import { GallerySoleil as RawGallerySoleil } from './sections/gallery/gallery-soleil'
import { HighlightSoleil as RawHighlightSoleil } from './sections/highlight/highlight-soleil'
import { EndingSoleil as RawEndingSoleil } from './sections/ending/ending-soleil'

const CoverSoleil = withSectionMemo(RawCoverSoleil, 'cover')
const IntroSoleil = withSectionMemo(RawIntroSoleil, 'introduction')
const StorySoleil = withSectionMemo(RawStorySoleil, 'story')
const GallerySoleil = withSectionMemo(RawGallerySoleil, 'gallery')
const HighlightSoleil = withSectionMemo(RawHighlightSoleil, 'highlight')
const EndingSoleil = withSectionMemo(RawEndingSoleil, 'ending')

export function TemplateSoleilDesign({
  theme,
  sectionVisibility,
  sectionContent,
  disableAnimations = false,
}: PhotobookTemplateProps) {
  return (
    <AnimationProvider templateId="soleil" disabled={disableAnimations}>
      <div className={cn('min-h-screen overflow-x-clip', theme.background, theme.foreground)}>
        {sectionVisibility.showCover && (
          <CoverSoleil sectionContent={sectionContent} theme={theme} />
        )}

        {sectionVisibility.showIntroduction && (
          <IntroSoleil sectionContent={sectionContent} theme={theme} />
        )}

        {sectionVisibility.showStory && (
          <StorySoleil sectionContent={sectionContent} theme={theme} />
        )}

        {sectionVisibility.showGallery && (
          <GallerySoleil sectionContent={sectionContent} theme={theme} />
        )}

        {sectionVisibility.showHighlight && (
          <HighlightSoleil sectionContent={sectionContent} theme={theme} />
        )}

        {sectionVisibility.showEnding && (
          <EndingSoleil sectionContent={sectionContent} theme={theme} />
        )}
      </div>
    </AnimationProvider>
  )
}
