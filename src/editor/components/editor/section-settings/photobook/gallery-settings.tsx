"use client"

import { ScrollArea } from '@/components/ui/scroll-area'
import { GalleryHeaderPanel, GalleryImagesPanel } from './gallery-panels'

export function PhotobookGallerySettings() {
  return (
    <ScrollArea className="h-full">
      <div className="space-y-6">
        <GalleryHeaderPanel />
        <GalleryImagesPanel />
      </div>
    </ScrollArea>
  )
}

export default PhotobookGallerySettings