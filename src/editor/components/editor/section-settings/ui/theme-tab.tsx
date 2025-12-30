"use client"

import { ScrollArea } from '@/components/ui/scroll-area'
import { ThemeSettingsPanel } from '../../layout/sidebar/theme-settings-panel'

export function ThemeTab() {
  return (
    <ScrollArea className="flex-1 overflow-y-auto">
      <div className="px-6 py-5 space-y-6">
        <ThemeSettingsPanel />
      </div>
    </ScrollArea>
  )
}
