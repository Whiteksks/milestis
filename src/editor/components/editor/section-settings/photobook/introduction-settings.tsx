"use client"

import { ScrollArea } from '@/components/ui/scroll-area'
import { IntroductionImagePanel, IntroductionTextPanel } from './introduction-panels'

export function PhotobookIntroductionSettings() {
  return (
    <ScrollArea className="h-full">
      <div className="space-y-6">
        <IntroductionTextPanel />
        <IntroductionImagePanel />
      </div>
    </ScrollArea>
  )
}

export default PhotobookIntroductionSettings