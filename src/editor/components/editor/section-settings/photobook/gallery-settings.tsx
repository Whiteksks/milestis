"use client"

import { ScrollArea } from '@/components/ui/scroll-area'
import { GalleryHeaderPanel, GalleryImagesPanel } from './gallery-panels'

export function PhotobookGallerySettings() {
  return (
    <ScrollArea className="h-full">
      <div className="px-6 py-5 space-y-6">
        <div className="space-y-1">
          <h3 className="text-sm font-medium leading-none">Gallery</h3>
          <p className="text-xs text-muted-foreground">Manage your photo collection</p>
        </div>

        <div className="space-y-7">
          <GalleryHeaderPanel />
          <GalleryImagesPanel />
        </div>
      </div>
    </ScrollArea>
  )
}

export default PhotobookGallerySettings