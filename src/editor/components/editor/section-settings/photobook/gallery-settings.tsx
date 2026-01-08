"use client"

import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { useContentSelector, useUiSelector } from '@/editor/lib/store'
import { MediaPickerModal } from '@/editor/components/editor/layout/Modals/media-picker-modal'
import { ImageIcon, X } from 'lucide-react'
import { Separator } from '@/components/ui/separator'
import Image, { type ImageLoader } from 'next/image'

const passthroughLoader: ImageLoader = ({ src }) => src

export function PhotobookGallerySettings() {
  const { gallery, updatePhotobookSection } = useContentSelector((state) => ({
    gallery: state.photobookSectionContent.gallery,
    updatePhotobookSection: state.updatePhotobookSection,
  }))
  const { toggleMediaPicker } = useUiSelector((state) => ({
    toggleMediaPicker: state.toggleMediaPicker,
  }))
  
  // Функция для удаления изображения
  const removeImage = (indexToRemove: number) => {
    const current = gallery.images || []
    const next = current.filter((_, i) => i !== indexToRemove)
    updatePhotobookSection('gallery', { images: next })
  }

  // Обработчик для множественного выбора изображений
  const handleSelectImages = (urls: string[]) => {
    const current = gallery.images || []

    const timestamp = Date.now()
    const nextNew = urls.map((url, index) => ({
      id: `gallery-${timestamp}-${index}`,
      image: url,
      caption: '',
      imageSettings: [{ aspectRatio: 'landscape' as const, frameStyle: 'soft' as const }],
    }))

    const next = [...current, ...nextNew]

    updatePhotobookSection('gallery', { images: next })
  }

  return (
    <ScrollArea className="h-full">
      <MediaPickerModal onSelectImages={handleSelectImages} />

      <div className="px-6 py-5 space-y-6">
        <div className="space-y-1">
          <h3 className="text-sm font-medium leading-none">Gallery</h3>
          <p className="text-xs text-muted-foreground">Manage your photo collection</p>
        </div>

        <div className="space-y-7">
          <div className="space-y-3">
            <Label className="text-xs font-medium text-muted-foreground">Header</Label>
            <div className="grid grid-cols-2 gap-3">
              <Input
                value={gallery.title || ''}
                onChange={(e) => updatePhotobookSection('gallery', { title: e.target.value })}
                placeholder="Title"
                className="h-9 text-xs"
              />
              <Input
                value={gallery.description || ''}
                onChange={(e) => updatePhotobookSection('gallery', { description: e.target.value })}
                placeholder="Description"
                className="h-9 text-xs"
              />
            </div>
          </div>

          <Separator className="bg-border/40" />

          <div className="space-y-3">
            <div className="flex items-center justify-between gap-3">
              <Label className="text-xs font-medium text-muted-foreground">Images</Label>
              <Button
                variant="outline"
                onClick={() => toggleMediaPicker()}
                className="h-8 text-xs"
              >
                <ImageIcon className="w-3.5 h-3.5 mr-2" /> Add
              </Button>
            </div>

            <div className="grid grid-cols-3 gap-2 rounded-xl border border-dashed border-border/60 bg-muted/20 p-2 min-h-21">
              {(gallery.images || []).map((block, index) => (
                <div key={block.id} className="relative group aspect-square overflow-hidden rounded-lg border border-border/40 bg-background">
                  <Image
                    loader={passthroughLoader}
                    unoptimized
                    src={block.image}
                    alt={`Gallery Image ${index + 1}`}
                    fill
                    sizes="(max-width: 768px) 33vw, 120px"
                    className="object-cover"
                  />
                  <button
                    type="button"
                    className="absolute right-1.5 top-1.5 rounded-md bg-background/90 text-muted-foreground p-1 opacity-0 group-hover:opacity-100 transition-colors border border-border/60 hover:bg-muted hover:text-foreground"
                    onClick={() => removeImage(index)}
                    aria-label="Remove image"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}

              <button
                type="button"
                className="aspect-square w-full rounded-lg border border-dashed border-border/60 bg-background flex flex-col items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted/40 transition-colors"
                onClick={() => toggleMediaPicker()}
              >
                <ImageIcon className="w-5 h-5 mb-1 opacity-60" />
                <span className="text-[10px] font-medium">Add</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </ScrollArea>
  )
}

export default PhotobookGallerySettings