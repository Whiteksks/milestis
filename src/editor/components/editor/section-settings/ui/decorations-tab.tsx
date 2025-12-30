"use client"

import { ScrollArea } from '@/components/ui/scroll-area'
import { DecorationsSettingsPanel } from '@/editor/components/editor/layout/sidebar/decorations-settings-panel'

export function DecorationsTab() {
  return (
    <ScrollArea className="flex-1 overflow-y-auto">
      <div className="px-6 py-5 space-y-6">
        <DecorationsSettingsPanel />
      </div>
    </ScrollArea>
  )
}
