"use client"

import { useContentSelector, useUiSelector } from '@/editor/lib/store'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Check, Upload } from 'lucide-react'
import { useState, useRef } from 'react'
import { cn } from '@/lib/utils'
import Image from 'next/image'

interface MediaPickerModalProps {
  ownerId: string
  onSelectImage?: (url: string) => void
  onSelectImages?: (urls: string[]) => void
}

export function MediaPickerModal({ ownerId, onSelectImage, onSelectImages }: MediaPickerModalProps) {
  const { mediaLibrary, addMediaImage } = useContentSelector((state) => ({
    mediaLibrary: state.mediaLibrary,
    addMediaImage: state.addMediaImage,
  }))
  const { isMediaPickerOpen, mediaPickerOwnerId, openMediaPicker, closeMediaPicker } = useUiSelector((state) => ({
    isMediaPickerOpen: state.isMediaPickerOpen,
    mediaPickerOwnerId: state.mediaPickerOwnerId,
    openMediaPicker: state.openMediaPicker,
    closeMediaPicker: state.closeMediaPicker,
  }))
  const [selectedUrls, setSelectedUrls] = useState<string[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)

  const isMultiSelect = !!onSelectImages

  const isOpen = isMediaPickerOpen && mediaPickerOwnerId === ownerId

  const handleOpenChange = (open: boolean) => {
    if (open) openMediaPicker(ownerId)
    else closeMediaPicker()
  }

  const handleConfirm = () => {
    if (selectedUrls.length > 0) {
      if (isMultiSelect && onSelectImages) {
        onSelectImages(selectedUrls)
      } else if (!isMultiSelect && onSelectImage) {
        onSelectImage(selectedUrls[0])
      }
    }

    setSelectedUrls([])
    closeMediaPicker()
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files) return

    Array.from(files).forEach((file) => {
      const reader = new FileReader()
      reader.onload = (event) => {
        const url = event.target?.result as string
        addMediaImage({
          id: `img-${Date.now()}-${Math.random()}`,
          url,
          name: file.name,
          uploadedAt: new Date(),
        })
      }
      reader.readAsDataURL(file)
    })

    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[80vh] flex flex-col bg-background/95 backdrop-blur-sm border-border shadow-xl p-8 gap-0">
        <DialogHeader className="pb-6 flex flex-row items-center justify-between">
          <div>
            <DialogTitle className="text-xl font-semibold text-foreground tracking-tight">Select Image</DialogTitle>
            <DialogDescription className="text-muted-foreground">
              Choose one of your previously uploaded photos.
            </DialogDescription>
          </div>
          <Button
            variant="outline"
            size="sm"
            className="gap-2 rounded-xl"
            onClick={() => fileInputRef.current?.click()}
          >
            <Upload className="h-4 w-4" />
            Upload
          </Button>
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/*,image/svg+xml"
            className="hidden"
            onChange={handleFileUpload}
          />
        </DialogHeader>

        {/* Scrollable area */}
        <div className="flex-1 min-h-0 overflow-y-auto rounded-2xl border border-border p-4 bg-muted/30">
          {mediaLibrary.length === 0 ? (
            <div className="flex items-center justify-center h-40 text-muted-foreground text-sm font-medium">
              No images yet. Upload images first.
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {mediaLibrary.map((image) => (
                <button
                  key={image.id}
                  type="button"
                  onClick={() => {
                    setSelectedUrls((prev) => {
                      // В режиме одиночного выбора просто заменяем текущее значение
                      if (!isMultiSelect) {
                        return [image.url]
                      }

                      // В мульти-режиме переключаем выбранность
                      if (prev.includes(image.url)) {
                        return prev.filter((u) => u !== image.url)
                      }
                      return [...prev, image.url]
                    })
                  }}
                  className={cn(
                    'relative aspect-square rounded-xl overflow-hidden border cursor-pointer transition-all duration-300',
                    selectedUrls.includes(image.url)
                      ? 'border-ring ring-2 ring-ring ring-offset-2 ring-offset-background'
                      : 'border-border hover:border-ring/50 hover:shadow-md hover:-translate-y-0.5 bg-card'
                  )}
                >
                  <Image
                    src={image.url || "/placeholder.svg"}
                    alt={image.name}
                    fill
                    sizes="(max-width: 768px) 50vw, 160px"
                    className="object-cover"
                  />
                  {selectedUrls.includes(image.url) && (
                    <div className="absolute inset-0 bg-foreground/20 flex items-center justify-center backdrop-blur-[1px]">
                      <div className="bg-foreground text-background rounded-full p-2 shadow-lg transform scale-100 transition-transform">
                        <Check className="h-4 w-4" />
                      </div>
                    </div>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="flex justify-end gap-3 pt-6 border-t border-border/50 mt-0">
          <Button 
            variant="ghost" 
            onClick={closeMediaPicker}
            className="rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted/50"
          >
            Cancel
          </Button>
          <Button 
            onClick={handleConfirm} 
            disabled={selectedUrls.length === 0}
            className="rounded-xl bg-foreground text-background hover:bg-foreground/90 shadow-md px-6 transition-all disabled:opacity-50"
          >
            {isMultiSelect ? 'Use Selected Images' : 'Use Selected'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
