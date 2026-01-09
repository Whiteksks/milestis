"use client"

import { ScrollArea } from '@/components/ui/scroll-area'
import { CoverImagePanel, CoverMetadataPanel, CoverTextPanel } from './cover-panels'

export function PhotobookCoverSettings() {
  return (
    <ScrollArea className="h-full">
      <div className="px-6 py-5 space-y-6">
        <div className="space-y-1">
          <h3 className="text-sm font-medium leading-none">Cover</h3>
          <p className="text-xs text-muted-foreground">Customize the main cover of your photobook</p>
        </div>

        <div className="space-y-7">
          <CoverTextPanel />
          <CoverMetadataPanel />
          <CoverImagePanel />
        </div>
      </div>
    </ScrollArea>
  )
}

export default PhotobookCoverSettings