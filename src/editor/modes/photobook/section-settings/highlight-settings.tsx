"use client"

import { HighlightImagePanel, HighlightTextPanel } from './highlight-panels'

export function PhotobookHighlightSettings() {
  return (
    <div className="space-y-6">
      <HighlightTextPanel />
      <HighlightImagePanel />
    </div>
  )
}

export default PhotobookHighlightSettings