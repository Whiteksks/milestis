"use client"

import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { StoryHeaderPanel, StoryImagePanel } from './story-panels'

export function PhotobookStorySettings() {
  return (
    <ScrollArea className="h-full">
      <div className="space-y-6">
        <StoryHeaderPanel />

        <Separator className="bg-border/40" />

        <StoryImagePanel />
      </div>
    </ScrollArea>
  )
}

export default PhotobookStorySettings