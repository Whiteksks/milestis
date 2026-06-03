"use client"

import { EndingImagePanel, EndingMessagePanel, EndingSignaturePanel } from './ending-panels'

export function PhotobookEndingSettings() {
  return (
    <div className="space-y-6">
      <EndingMessagePanel />
      <EndingSignaturePanel />
      <EndingImagePanel />
    </div>
  )
}

export default PhotobookEndingSettings