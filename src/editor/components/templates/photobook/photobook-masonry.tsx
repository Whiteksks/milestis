"use client"

import type { PhotobookTemplateProps } from '@/editor/lib/template-types'
import { MasonryCover } from './sections/cover/masonry-cover'
import { MasonryIntroduction } from './sections/introduction/masonry-introduction'
import { MasonryStory } from './sections/story/masonry-story'
import { MasonryGallery } from './sections/gallery/masonry-gallery'
import { MasonryHighlight } from './sections/highlight/masonry-highlight'
import { MasonryEnding } from './sections/ending/masonry-ending'

export default function PhotobookMasonryTemplate({
  theme,
  sectionVisibility,
  sectionContent,
  frameStyle: _frameStyle,
}: PhotobookTemplateProps) {
  const storySlots = sectionContent.story.images || []
  const featured = storySlots.slice(0, 5)
  const longForm = storySlots.slice(5)

  return (
    <div className="min-h-screen bg-background text-foreground font-sans">
      <main>
        {/* COVER as editorial hero */}
        {sectionVisibility.showCover && (
          <MasonryCover sectionContent={sectionContent} theme={theme} />
        )}

        {/* INTRODUCTION */}
        {sectionVisibility.showIntroduction && (
          <MasonryIntroduction sectionContent={sectionContent} theme={theme} />
        )}

        {/* FEATURED STRIP and STORY header */}
        {sectionVisibility.showStory && (
          <MasonryStory
            sectionContent={sectionContent}
            theme={theme}
            featured={featured}
          />
        )}

        {/* COLUMNS SPREAD from remaining story slots + gallery */}
        <MasonryGallery
          sectionContent={sectionContent}
          sectionVisibility={sectionVisibility}
          theme={theme}
          longForm={longForm}
        />

        {/* HIGHLIGHT section */}
        {sectionVisibility.showHighlight && (
          <MasonryHighlight sectionContent={sectionContent} theme={theme} />
        )}

        {/* ENDING note */}
        {sectionVisibility.showEnding && (
          <MasonryEnding sectionContent={sectionContent} theme={theme} />
        )}
      </main>
    </div>
  )
}

