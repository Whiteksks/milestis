"use client"

import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { StoryHeaderPanel, StoryImagePanel } from './story-panels'

export function PhotobookStorySettings() {
  return (
    <ScrollArea className="h-full">
      <div className="px-6 py-5 space-y-8">
        <div className="space-y-1">
          <h3 className="text-sm font-medium leading-none">Story</h3>
          <p className="text-xs text-muted-foreground">Write the story with a photo and text</p>
        </div>

        <StoryHeaderPanel />

        <Separator className="bg-border/40" />

        <StoryImagePanel />
      </div>
    </ScrollArea>
  )
}

export default PhotobookStorySettings