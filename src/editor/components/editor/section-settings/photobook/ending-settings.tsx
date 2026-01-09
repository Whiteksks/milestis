"use client"

import { ScrollArea } from '@/components/ui/scroll-area'
import { EndingImagePanel, EndingMessagePanel, EndingSignaturePanel } from './ending-panels'

export function PhotobookEndingSettings() {
  return (
    <ScrollArea className="h-full">
      <div className="px-6 py-5 space-y-6">
        <div className="space-y-1">
          <h3 className="text-sm font-medium leading-none">Ending</h3>
          <p className="text-xs text-muted-foreground">A final thought or signature</p>
        </div>

        <div className="space-y-7">
          <EndingMessagePanel />
          <EndingSignaturePanel />
          <EndingImagePanel />
        </div>
      </div>
    </ScrollArea>
  )
}

export default PhotobookEndingSettings