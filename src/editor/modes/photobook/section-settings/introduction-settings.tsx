"use client"

import { IntroductionImagePanel, IntroductionTextPanel } from './introduction-panels'

export function PhotobookIntroductionSettings() {
  return (
    <div className="space-y-6">
      <IntroductionTextPanel />
      <IntroductionImagePanel />
    </div>
  )
}

export default PhotobookIntroductionSettings