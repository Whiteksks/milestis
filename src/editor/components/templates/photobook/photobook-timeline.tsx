"use client"

import type { PhotobookTemplateProps } from '@/editor/lib/template-types'
import { useRef } from 'react'
import { TimelineCover } from './sections/cover/timeline-cover'
import { TimelineIntroduction } from './sections/introduction/timeline-introduction'
import { TimelineStory } from './sections/story/timeline-story'
import { TimelineGallery } from './sections/gallery/timeline-gallery'
import { TimelineHighlight } from './sections/highlight/timeline-highlight'
import { TimelineEnding } from './sections/ending/timeline-ending'

export function PhotobookTimelineTemplate({
  theme,
  sectionVisibility,
  sectionContent,
  frameStyle: _frameStyle, // currently unused, per-image frame styles from slots are used
}: PhotobookTemplateProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  return (
    <div className="min-h-screen bg-background text-foreground font-sans selection:bg-primary/20 overflow-x-hidden">
      <main ref={containerRef}>
        {/* COVER as hero section */}
        {sectionVisibility.showCover && (
          <TimelineCover sectionContent={sectionContent} theme={theme} />
        )}

        {/* INTRODUCTION */}
        {sectionVisibility.showIntroduction && (
          <TimelineIntroduction
            sectionContent={sectionContent}
            theme={theme}
            frameStyle={_frameStyle}
          />
        )}

        {/* STORY as timeline section based on story slots */}
        {sectionVisibility.showStory && (
          <TimelineStory sectionContent={sectionContent} theme={theme} />
        )}

        {/* GALLERY */}
        {sectionVisibility.showGallery && (
          <TimelineGallery
            sectionContent={sectionContent}
            theme={theme}
            frameStyle={_frameStyle}
          />
        )}

        {/* HIGHLIGHT */}
        {sectionVisibility.showHighlight && (
          <TimelineHighlight
            sectionContent={sectionContent}
            theme={theme}
            frameStyle={_frameStyle}
          />
        )}

        {/* ENDING / Closing section */}
        {sectionVisibility.showEnding && (
          <TimelineEnding
            sectionContent={sectionContent}
            theme={theme}
            frameStyle={_frameStyle}
          />
        )}
      </main>
    </div>
  )
}


