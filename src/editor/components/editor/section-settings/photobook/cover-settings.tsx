"use client"

import { ScrollArea } from '@/components/ui/scroll-area'
import { CoverImagePanel, CoverMetadataPanel, CoverTextPanel } from './cover-panels'

export function PhotobookCoverSettings() {
  return (
    <ScrollArea className="h-full">
      <div className="space-y-6">
        <CoverTextPanel />
        <CoverMetadataPanel />
        <CoverImagePanel />
      </div>
    </ScrollArea>
  )
}

export default PhotobookCoverSettings