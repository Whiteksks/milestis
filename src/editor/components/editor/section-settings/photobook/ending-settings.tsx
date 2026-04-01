"use client"

import { ScrollArea } from '@/components/ui/scroll-area'
import { EndingImagePanel, EndingMessagePanel, EndingSignaturePanel } from './ending-panels'

export function PhotobookEndingSettings() {
  return (
    <ScrollArea className="h-full">
      <div className="space-y-6">
        <EndingMessagePanel />
        <EndingSignaturePanel />
        <EndingImagePanel />
      </div>
    </ScrollArea>
  )
}

export default PhotobookEndingSettings