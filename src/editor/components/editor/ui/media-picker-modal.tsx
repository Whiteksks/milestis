"use client"

import { useContentStore, useUiStore } from '@/editor/lib/store'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Check } from 'lucide-react'
import { useState } from 'react'
import { cn } from '@/lib/utils'

interface MediaPickerModalProps {
  onSelectImage?: (url: string) => void
  onSelectImages?: (urls: string[]) => void
}

export function MediaPickerModal({ onSelectImage, onSelectImages }: MediaPickerModalProps) {
  const { mediaLibrary } = useContentStore()
  const { isMediaPickerOpen, toggleMediaPicker } = useUiStore()
  const [selectedUrls, setSelectedUrls] = useState<string[]>([])

  const isMultiSelect = !!onSelectImages

  const handleConfirm = () => {
    if (selectedUrls.length > 0) {
      if (isMultiSelect && onSelectImages) {
        onSelectImages(selectedUrls)
      } else if (!isMultiSelect && onSelectImage) {
        onSelectImage(selectedUrls[0])
      }
    }

    setSelectedUrls([])
    toggleMediaPicker()
  }

  return (
    <Dialog open={isMediaPickerOpen} onOpenChange={toggleMediaPicker}>
      <DialogContent className="sm:max-w-2xl max-h-[80vh] flex flex-col bg-white/95 backdrop-blur-xl border-slate-100 shadow-2xl p-8 gap-0">
        <DialogHeader className="pb-6">
          <DialogTitle className="text-xl font-medium text-slate-900 tracking-tight">Select Image</DialogTitle>
          <DialogDescription className="text-slate-500">
            Choose one of your previously uploaded photos.
          </DialogDescription>
        </DialogHeader>

        {/* Scrollable area */}
        <div className="flex-1 min-h-0 overflow-y-auto rounded-2xl border border-slate-100 p-4 bg-slate-50/50">
          {mediaLibrary.length === 0 ? (
            <div className="flex items-center justify-center h-40 text-slate-400 text-sm font-medium">
              No images yet. Upload images first in the Media Library.
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
                      ? 'border-slate-900 ring-2 ring-slate-900 ring-offset-2'
                      : 'border-slate-200 hover:border-slate-300 hover:shadow-md hover:-translate-y-0.5 bg-white'
                  )}
                >
                  <img
                    src={image.url || "/placeholder.svg"}
                    alt={image.name}
                    className="w-full h-full object-cover"
                  />
                  {selectedUrls.includes(image.url) && (
                    <div className="absolute inset-0 bg-slate-900/20 flex items-center justify-center backdrop-blur-[1px]">
                      <div className="bg-slate-900 text-white rounded-full p-2 shadow-lg transform scale-100 transition-transform">
                        <Check className="h-4 w-4" />
                      </div>
                    </div>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="flex justify-end gap-3 pt-6 border-t border-slate-100 mt-0">
          <Button 
            variant="ghost" 
            onClick={toggleMediaPicker}
            className="rounded-full text-slate-500 hover:text-slate-900 hover:bg-slate-100/50"
          >
            Cancel
          </Button>
          <Button 
            onClick={handleConfirm} 
            disabled={selectedUrls.length === 0}
            className="rounded-full bg-slate-900 text-white hover:bg-slate-800 shadow-lg shadow-slate-900/20 px-6 transition-all hover:scale-105 active:scale-95 disabled:opacity-50 disabled:hover:scale-100"
          >
            {isMultiSelect ? 'Use Selected Images' : 'Use Selected'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
