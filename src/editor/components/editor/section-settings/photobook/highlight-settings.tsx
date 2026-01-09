"use client"

import { ScrollArea } from '@/components/ui/scroll-area'
import { HighlightImagePanel, HighlightTextPanel } from './highlight-panels'

export function PhotobookHighlightSettings() {
  return (
    <ScrollArea className="h-full">
      <div className="px-6 py-5 space-y-6">
        <div className="space-y-1">
          <h3 className="text-sm font-medium leading-none">Highlight</h3>
          <p className="text-xs text-muted-foreground">Feature a special moment</p>
        </div>

        <div className="space-y-7">
          <HighlightTextPanel />
          <HighlightImagePanel />
        </div>
      </div>
    </ScrollArea>
  )
}

export default PhotobookHighlightSettings