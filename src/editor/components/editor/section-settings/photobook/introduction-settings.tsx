"use client"

import { ScrollArea } from '@/components/ui/scroll-area'
import { IntroductionImagePanel, IntroductionTextPanel } from './introduction-panels'

export function PhotobookIntroductionSettings() {
  return (
    <ScrollArea className="h-full">
      <div className="px-6 py-5 space-y-6">
        <div className="space-y-1">
          <h3 className="text-sm font-medium leading-none">Introduction</h3>
          <p className="text-xs text-muted-foreground">Set the tone for your photobook</p>
        </div>

        <div className="space-y-7">
          <IntroductionTextPanel />
          <IntroductionImagePanel />
        </div>
      </div>
    </ScrollArea>
  )
}

export default PhotobookIntroductionSettings