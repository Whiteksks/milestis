"use client"

import { StoryHeaderPanel, StoryImagePanel } from './story-panels'

export function PhotobookStorySettings() {
  return (
    <div className="space-y-6">
      <StoryHeaderPanel />
      <StoryImagePanel />
    </div>
  )
}

export default PhotobookStorySettings