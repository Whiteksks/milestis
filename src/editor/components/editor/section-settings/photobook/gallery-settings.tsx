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

  const inputStyle = "h-9 rounded-xl border-slate-200 bg-white focus:ring-slate-900 text-xs"

  return (
    <ScrollArea className="h-full">
      <MediaPickerModal onSelectImages={handleSelectImages} />

      <div className="p-6 max-w-lg mx-auto space-y-8">
        {/* Header */}
        <div>
          <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-900">
            Gallery
          </h3>
          <p className="text-[11px] text-slate-500 mt-1 font-medium">Manage your photo collection.</p>
        </div>

        {/* Секция 1: Текстовый контент */}
        <div className="space-y-4">
          <h4 className="text-sm font-medium text-slate-900">Text Content</h4>
          <div className="space-y-3">
            <div className="space-y-2">
              <Label className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 ml-1">Title</Label>
              <Input
                value={gallery.title || ''}
                onChange={(e) => updatePhotobookSection('gallery', { title: e.target.value })}
                placeholder="Gallery Title"
                className={inputStyle}
              />
            </div>

            <div className="space-y-2">
              <Label className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 ml-1">Description</Label>
              <Input
                value={gallery.description || ''}
                onChange={(e) =>
                  updatePhotobookSection('gallery', { description: e.target.value })
                }
                placeholder="Short description of the section"
                className={inputStyle}
              />
            </div>
          </div>
        </div>

        <Separator className="bg-slate-100" />

        {/* Секция 2: Управление изображениями */}
        <div className="space-y-4">
          <h4 className="text-sm font-medium text-slate-900">Images</h4>
          
          <div className="space-y-3">
            
            {/* Сетка превью */}
            <div className="grid grid-cols-3 gap-2 border border-dashed border-slate-200 rounded-xl p-2 bg-slate-50/50 min-h-17.5">
              {(gallery.images || []).map((block, index) => (
                <div key={block.id} className="relative group aspect-square">
                  <Image
                    loader={passthroughLoader}
                    unoptimized
                    src={block.image}
                    alt={`Gallery Image ${index + 1}`}
                    fill
                    sizes="(max-width: 768px) 33vw, 120px"
                    className="object-cover rounded-lg shadow-sm border border-slate-100"
                  />
                  {/* Кнопка удаления */}
                  <button
                    type="button"
                    className="absolute -top-1.5 -right-1.5 rounded-full bg-white text-slate-400 p-1 opacity-0 group-hover:opacity-100 transition-all shadow-sm border border-slate-100 hover:text-red-500 hover:border-red-100"
                    onClick={() => removeImage(index)}
                    aria-label="Remove image"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
              
              {/* Кнопка добавления в сетке */}
              <button
                type="button"
                className="aspect-square w-full rounded-lg border border-dashed border-slate-200 bg-white flex flex-col items-center justify-center text-slate-400 hover:text-slate-600 hover:border-slate-300 hover:bg-slate-50 transition-all"
                onClick={() => toggleMediaPicker()}
              >
                <ImageIcon className="w-5 h-5 mb-1 opacity-50" /> 
                <span className="text-[10px] font-medium">Add</span>
              </button>
            </div>

            {/* Отдельная кнопка для лучшего UX (если сетка заполнена) */}
            <Button 
              variant="outline" 
              onClick={() => toggleMediaPicker()} 
              className="w-full h-9 rounded-xl border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-white hover:border-slate-300 text-xs font-medium"
            >
               <ImageIcon className="w-3.5 h-3.5 mr-2" /> Add More Photos
            </Button>
            
          </div>
        </div>
      </div>
    </ScrollArea>
  )
}

export default PhotobookGallerySettings