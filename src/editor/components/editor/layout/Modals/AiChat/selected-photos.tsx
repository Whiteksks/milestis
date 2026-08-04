'use client'

import { X } from 'lucide-react'
import Image from 'next/image'

interface SelectedPhotosProps {
  selectedUrls: string[]
  isPickerOpen: boolean
  onRemove: (url: string) => void
}

export function SelectedPhotos({ selectedUrls, isPickerOpen, onRemove }: SelectedPhotosProps) {
  if (selectedUrls.length === 0 || isPickerOpen) return null

  return (
    <div className="shrink-0 flex gap-2 px-3 py-2 overflow-x-auto border-t border-border bg-muted/30">
      {selectedUrls.map((url, i) => (
        <div
          key={i}
          className="relative shrink-0 h-9 w-9 rounded-lg overflow-hidden border border-border"
        >
          <Image src={url} alt="" fill unoptimized sizes="36px" className="object-cover" />
          <button
            onClick={() => onRemove(url)}
            className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-foreground text-background flex items-center justify-center hover:bg-foreground/80 transition-colors"
          >
            <X className="h-2.5 w-2.5" />
          </button>
        </div>
      ))}
    </div>
  )
}
