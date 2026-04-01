"use client"

import { CoverImagePanel, CoverMetadataPanel, CoverTextPanel } from './cover-panels'

export function PhotobookCoverSettings() {
  return (
    <div className="space-y-6">
      <CoverTextPanel />
      <CoverMetadataPanel />
      <CoverImagePanel />
    </div>
  )
}

export default PhotobookCoverSettings