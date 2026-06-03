"use client"

import { GalleryHeaderPanel, GalleryImagesPanel } from './gallery-panels'

export function PhotobookGallerySettings() {
  return (
    <div className="space-y-6">
      <GalleryHeaderPanel />
      <GalleryImagesPanel />
    </div>
  )
}

export default PhotobookGallerySettings