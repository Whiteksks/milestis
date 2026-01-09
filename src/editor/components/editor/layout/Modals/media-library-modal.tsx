'use client'

import { useContentSelector, useUiSelector } from '@/editor/lib/store'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Upload, Sparkles, X, Check } from 'lucide-react'
import { useState, useRef } from 'react'
import { cn } from '@/lib/utils'
import { useIsMobile } from '@/hooks/use-mobile'
import { MobileBottomSheet } from '../mobile/mobile-bottom-sheet'
import Image, { type ImageLoader } from 'next/image'

const passthroughLoader: ImageLoader = ({ src }) => src

interface MediaLibraryModalProps {
  mode?: 'select' | 'manage'
  onSelectImage?: (url: string) => void
}

export function MediaLibraryModal({ mode = 'manage', onSelectImage }: MediaLibraryModalProps) {
  const { isMediaLibraryOpen, toggleMediaLibrary } = useUiSelector((state) => ({
    isMediaLibraryOpen: state.isMediaLibraryOpen,
    toggleMediaLibrary: state.toggleMediaLibrary,
  }))
  const { mediaLibrary, addMediaImage, removeMediaImage } = useContentSelector((state) => ({
    mediaLibrary: state.mediaLibrary,
    addMediaImage: state.addMediaImage,
    removeMediaImage: state.removeMediaImage,
  }))

  const [urlInput, setUrlInput] = useState('')
  const [selectedImageUrl, setSelectedImageUrl] = useState<string | null>(null)

  const fileInputRef = useRef<HTMLInputElement>(null)
  const isMobile = useIsMobile()

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

  const handleAddUrl = () => {
    if (!urlInput.trim()) return

    addMediaImage({
      id: `img-${Date.now()}-${Math.random()}`,
      url: urlInput,
      name: 'External Image',
      uploadedAt: new Date(),
    })
    setUrlInput('')
  }

  const handleSelectImage = (url: string) => {
    if (mode === 'select') setSelectedImageUrl(url)
  }

  const handleConfirmSelection = () => {
    if (selectedImageUrl && onSelectImage) {
      onSelectImage(selectedImageUrl)
      setSelectedImageUrl(null)
      toggleMediaLibrary()
    }
  }

  // --- Контент (без обвязки Dialog / BottomSheet) ---
  const uploadRow = (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Upload button */}
      <div>
        <Label className="text-xs font-medium text-foreground mb-2 block">Upload Image</Label>

        <Button
          variant="outline"
          className="w-full h-24 border border-dashed border-border rounded-2xl bg-muted/30 hover:bg-muted hover:border-border transition-all text-muted-foreground hover:text-foreground"
          onClick={() => fileInputRef.current?.click()}
        >
          <div className="flex flex-col items-center gap-2">
            <Upload className="h-5 w-5" />
            <span className="text-xs font-medium">Click to upload</span>
          </div>
        </Button>

        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*,image/svg+xml"
          className="hidden"
          onChange={handleFileUpload}
        />
      </div>

      {/* Add URL */}
      <div>
        <Label className="text-xs font-medium text-foreground mb-2 block">Add from URL</Label>

        <Input
          placeholder="https://example.com/image.jpg"
          value={urlInput}
          onChange={(e) => setUrlInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleAddUrl()}
          className="rounded-xl border-border focus-visible:ring-ring h-10"
        />

        <Button
          onClick={handleAddUrl}
          className="w-full mt-3 flex items-center justify-center gap-2 bg-foreground hover:bg-foreground/90 text-background rounded-xl h-10 shadow-md transition-all"
        >
          <Sparkles className="h-4 w-4" />
          <span className="text-xs font-medium">Add Image</span>
        </Button>
      </div>
    </div>
  )

  const galleryArea = (
    <div className="flex-1 min-h-0 flex flex-col mt-2">
      <Label className="text-xs font-medium text-foreground mb-3 block">
        Your Library <span className="text-muted-foreground ml-1">({mediaLibrary.length})</span>
      </Label>

      <div
        className="flex-1 min-h-0 overflow-y-auto border border-border rounded-2xl p-4 bg-muted/30"
        // Управление моментом начала скролла:
        // на мобилке скролл начнётся раньше — ограничиваем высоту
        style={{ maxHeight: isMobile ? '45vh' : undefined }}
      >
        {mediaLibrary.length === 0 ? (
          <div className="flex items-center justify-center h-40 text-muted-foreground">
            <div className="text-center">
              <div className="h-12 w-12 bg-background rounded-full flex items-center justify-center mx-auto mb-3 shadow-sm border border-border">
                <Upload className="h-5 w-5 text-muted-foreground/50" />
              </div>
              <p className="text-sm font-medium text-foreground">No images yet</p>
              <p className="text-xs text-muted-foreground mt-1">Upload or add via URL</p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {mediaLibrary.map((image) => (
              <div
                key={image.id}
                className={cn(
                  'relative group rounded-xl overflow-hidden border cursor-pointer aspect-square transition-all duration-300',
                  selectedImageUrl === image.url
                    ? 'border-ring ring-2 ring-ring ring-offset-2 ring-offset-background'
                    : 'border-border hover:border-ring/50 hover:shadow-md hover:-translate-y-0.5 bg-card'
                )}
                onClick={() => handleSelectImage(image.url)}
              >
                <Image
                  loader={passthroughLoader}
                  unoptimized
                  src={image.url}
                  alt={image.name}
                  fill
                  sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                  className="object-cover"
                />

                {selectedImageUrl === image.url && mode === 'select' && (
                  <div className="absolute inset-0 bg-foreground/20 flex items-center justify-center backdrop-blur-[1px]">
                    <div className="bg-foreground text-background rounded-full p-2 shadow-lg transform scale-100 transition-transform">
                      <Check className="h-4 w-4" />
                    </div>
                  </div>
                )}

                {/* Minimal delete button */}
                {mode === 'manage' && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      removeMediaImage(image.id)
                    }}
                    className="
                      absolute top-2 right-2 
                      bg-background/90 hover:bg-red-50 dark:hover:bg-red-950/20
                      text-muted-foreground hover:text-red-500
                      rounded-full 
                      p-1.5 
                      shadow-sm
                      opacity-0 group-hover:opacity-100 transition-all transform scale-90 group-hover:scale-100
                    "
                    aria-label="Delete image"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )

  const actionsBar = (
    <div className="hidden md:flex justify-end gap-3 pt-6 border-t border-border/50 bg-transparent">
      <Button 
        variant="ghost" 
        onClick={toggleMediaLibrary}
        className="rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted/50"
      >
        {mode === 'select' ? 'Cancel' : 'Close'}
      </Button>

      {mode === 'select' && selectedImageUrl && (
        <Button 
            onClick={handleConfirmSelection} 
            className="rounded-xl bg-foreground text-background hover:bg-foreground/90 shadow-md px-6 transition-all"
        >
          Select Image
        </Button>
      )}
    </div>
  )

  // --- MOBILE: MobileBottomSheet (использует тот же контент) ---
  if (isMobile) {
    return (
      <MobileBottomSheet
        isOpen={isMediaLibraryOpen}
        onClose={toggleMediaLibrary}
        title="Media Library"
        contentPadding={false}
      >
        <div className="flex flex-col h-full min-h-0">
          {/* Верхняя панель (заголовок внутри bottom sheet) */}
          <div className="px-4 pb-2 border-b">
            <div className="text-lg font-semibold">Media Library</div>
            <div className="text-sm text-muted-foreground">
              {mode === 'select' ? 'Выберите изображение для галереи' : 'Загрузите или управляйте изображениями'}
            </div>
          </div>

          {/* Контент: загрузка + галерея */}
          <div className="pt-4 overflow-auto flex-1 min-h-0">
            <div className="flex flex-col gap-4">
              {uploadRow}
              {galleryArea}
            </div>
          </div>

          {/* Закреплённые кнопки внизу */}
          <div>
            {actionsBar}
          </div>
        </div>
      </MobileBottomSheet>
    )
  }

  // --- DESKTOP: Dialog ---
  return (
    <Dialog open={isMediaLibraryOpen} onOpenChange={toggleMediaLibrary}>
      <DialogContent className="sm:max-w-2xl max-h-[85vh] flex flex-col min-h-0 bg-background/95 backdrop-blur-xl border-border shadow-xl p-8 gap-0">
        <DialogHeader className="pb-6">
          <DialogTitle className="text-xl font-semibold text-foreground tracking-tight">
            Media Library
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            {mode === 'select'
              ? 'Select an image for your gallery'
              : 'Upload and manage your images'}
          </DialogDescription>
        </DialogHeader>

        {/* MAIN CONTENT */}
        <div className="flex flex-col gap-6 flex-1 min-h-0 px-0">
          {uploadRow}
          {galleryArea}
        </div>

        {/* Bottom buttons */}
        <div className="px-0">{actionsBar}</div>
      </DialogContent>
    </Dialog>
  )
}
