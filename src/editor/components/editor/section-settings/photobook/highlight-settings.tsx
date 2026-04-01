"use client"

import { ScrollArea } from '@/components/ui/scroll-area'
import { HighlightImagePanel, HighlightTextPanel } from './highlight-panels'

export function PhotobookHighlightSettings() {
  return (
    <ScrollArea className="h-full">
        <div className="space-y-6">
          <HighlightTextPanel />
          <HighlightImagePanel />
        </div>
    </ScrollArea>
  )
}

export default PhotobookHighlightSettings