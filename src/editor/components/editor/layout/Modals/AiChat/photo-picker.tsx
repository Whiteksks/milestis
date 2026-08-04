'use client'

import { Upload, Loader2, Check } from 'lucide-react'
import { cn } from '@/lib/utils'
import Image from 'next/image'
import {
  getProjectImageDisplayUrl,
  getProjectImageSelectUrl,
  type ProjectImageDoc,
  type UploadingEntry,
} from '@/editor/hooks/use-project-images'

interface PhotoPickerProps {
  isPickerOpen: boolean
  selectedUrls: string[]
  images: ProjectImageDoc[]
  pendingUploads: UploadingEntry[]
  onToggle: (url: string) => void
  onUploadClick: () => void
}

export function PhotoPicker({
  isPickerOpen,
  selectedUrls,
  images,
  pendingUploads,
  onToggle,
  onUploadClick,
}: PhotoPickerProps) {
  if (!isPickerOpen) return null

  return (
    <div className="shrink-0 border-t border-border bg-muted/30">
      <div className="flex gap-2 p-2 overflow-x-auto">
        <button
          type="button"
          onClick={onUploadClick}
          className="shrink-0 h-[52px] w-[52px] rounded-xl border-2 border-dashed border-border/60 flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-border transition-colors"
        >
          <Upload className="h-4 w-4" />
        </button>

        {pendingUploads.map((u) => (
          <div
            key={u.id}
            className="relative shrink-0 h-[52px] w-[52px] rounded-xl overflow-hidden border border-border"
          >
            <Image
              src={u.previewUrl}
              alt={u.name}
              fill
              unoptimized
              sizes="52px"
              className="object-cover opacity-50"
            />
            <div className="absolute inset-0 flex items-center justify-center bg-background/40">
              <Loader2 className="h-4 w-4 animate-spin text-foreground/70" />
            </div>
          </div>
        ))}

        {images.map((img) => {
          const displayUrl = getProjectImageDisplayUrl(img)
          const selectUrl = getProjectImageSelectUrl(img)
          const isSelected = selectedUrls.includes(selectUrl)
          return (
            <button
              key={img.id}
              type="button"
              onClick={() => onToggle(selectUrl)}
              className={cn(
                'relative shrink-0 h-[52px] w-[52px] rounded-xl overflow-hidden border-2 transition-all',
                isSelected ? 'border-foreground' : 'border-transparent',
              )}
            >
              <Image src={displayUrl} alt="" fill unoptimized sizes="52px" className="object-cover" />
              {isSelected && (
                <div className="absolute inset-0 bg-foreground/30 flex items-center justify-center">
                  <div className="flex h-5 w-5 items-center justify-center rounded-full bg-foreground">
                    <Check className="h-3 w-3 text-background" />
                  </div>
                </div>
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}
