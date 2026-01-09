"use client"

import { ScrollArea } from '@/components/ui/scroll-area'
import { StoryHeaderPanel, StoryMomentsPanel, StoryTextPanel } from './story-panels'

export function PhotobookStorySettings() {
  return (
    <ScrollArea className="h-full">
      <div className="px-6 py-5 space-y-8">
        <div className="space-y-1">
          <h3 className="text-sm font-medium leading-none">Story</h3>
          <p className="text-xs text-muted-foreground">Write text and group photos by moments</p>
        </div>

        <StoryHeaderPanel />

        <div className="h-px bg-border/40 w-full" />

        <StoryTextPanel />

        <div className="h-px bg-border/40 w-full" />

        <StoryMomentsPanel />
      </div>
    </ScrollArea>
  )
}

export default PhotobookStorySettings