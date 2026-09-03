'use client'

import { useUiSelector } from '@/editor/lib/store'
import {
  getProjectImageDisplayUrl,
  getProjectImageSelectUrl,
  useProjectMediaLibrary,
} from '@/editor/hooks/use-project-images'
import { deleteDoc, doc } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Upload, X, Check, Images } from 'lucide-react'
import { useState } from 'react'
import { cn } from '@/lib/utils'
import { useIsMobile } from '@/hooks/use-mobile'
import { MobileDrawer } from '../mobile/mobile-drawer'
import Image from 'next/image'
import { useTranslations } from 'next-intl'

interface MediaLibraryModalProps {
  mode?: 'select' | 'manage'
  onSelectImage?: (url: string) => void
}

export function MediaLibraryModal({ mode = 'manage', onSelectImage }: MediaLibraryModalProps) {
  const t = useTranslations('editor.controls.media')
  const { isMediaLibraryOpen, setMediaLibraryOpen } = useUiSelector((state) => ({
    isMediaLibraryOpen: state.isMediaLibraryOpen,
    setMediaLibraryOpen: state.setMediaLibraryOpen,
  }))

  const [selectedImageUrl, setSelectedImageUrl] = useState<string | null>(null)
  const { fileInputRef, images, pendingUploads, totalCount, handleFileUpload } = useProjectMediaLibrary()
  const isMobile = useIsMobile()

  const handleDelete = async (imageId: string) => {
    await deleteDoc(doc(db, 'images', imageId))
  }

  const handleSelectImage = (url: string) => {
    if (mode === 'select') setSelectedImageUrl(url)
  }

  const closeMediaLibrary = () => {
    setSelectedImageUrl(null)
    setMediaLibraryOpen(false)
  }

  const handleConfirmSelection = () => {
    if (selectedImageUrl && onSelectImage) {
      onSelectImage(selectedImageUrl)
      closeMediaLibrary()
    }
  }

  const uploadInput = (
    <input
      ref={fileInputRef}
      type="file"
      multiple
      accept="image/*,image/svg+xml"
      className="hidden"
      onChange={handleFileUpload}
    />
  )

  const galleryContent = (
    <div className="flex-1 min-h-0 flex flex-col">
      {/* Toolbar row */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Images className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-medium text-foreground">{t('library')}</span>
          {totalCount > 0 && (
            <span className="text-[11px] font-medium text-muted-foreground bg-muted px-2 py-0.5 rounded-full tabular-nums">
              {totalCount}
            </span>
          )}
        </div>
        <Button
          variant="outline"
          size="sm"
          className="gap-1.5 rounded-xl h-8 text-xs"
          onClick={() => fileInputRef.current?.click()}
        >
          <Upload className="h-3.5 w-3.5" />
          {t('upload')}
        </Button>
        {uploadInput}
      </div>

      {/* Grid area */}
      <div className="flex-1 min-h-0 overflow-y-auto border border-border rounded-2xl p-4 bg-muted/30">
        {totalCount === 0 ? (
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="flex flex-col items-center justify-center w-full h-48 gap-3 rounded-xl border-2 border-dashed border-border/60 bg-transparent text-muted-foreground hover:text-foreground hover:border-border hover:bg-muted/30 transition-all cursor-pointer"
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-muted border border-border">
              <Upload className="h-5 w-5" />
            </div>
            <div className="text-center">
              <p className="text-sm font-medium">{t('uploadFirstImage')}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{t('supportedFormats')}</p>
            </div>
          </button>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {/* Upload tile always first */}
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="aspect-square rounded-xl border-2 border-dashed border-border/50 bg-transparent flex flex-col items-center justify-center gap-1.5 text-muted-foreground hover:text-foreground hover:border-border hover:bg-muted/30 transition-all cursor-pointer"
            >
              <Upload className="h-5 w-5" />
              <span className="text-[11px] font-medium">{t('upload')}</span>
            </button>

            {/* Uploading placeholders — hide any whose imageId is already in Firestore
                 to prevent duplicate keys and the flash they cause */}
            {pendingUploads.map((u) => (
              <div
                key={u.id}
                className="relative aspect-square rounded-xl overflow-hidden border border-border bg-muted/40"
              >
                <Image
                  src={u.previewUrl}
                  alt={u.name}
                  fill
                  unoptimized
                  sizes="160px"
                  className="object-cover opacity-50"
                />
                <div className="absolute inset-0 flex items-center justify-center bg-background/40 backdrop-blur-[2px]">
                  <span className="text-sm font-semibold text-foreground/80 tabular-nums">{u.progress}%</span>
                </div>
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-background/50">
                  <div className="h-full bg-primary transition-[width]" style={{ width: `${u.progress}%` }} />
                </div>
              </div>
            ))}

            {/* Firestore images */}
            {images.map((image) => {
              const displayUrl = getProjectImageDisplayUrl(image)
              const selectUrl = getProjectImageSelectUrl(image)
              return (
                <div
                  key={image.id}
                  className={cn(
                    'relative group rounded-xl overflow-hidden border cursor-pointer aspect-square transition-all duration-300',
                    selectedImageUrl === selectUrl
                      ? 'border-ring ring-2 ring-ring ring-offset-2 ring-offset-background'
                      : 'border-border hover:border-ring/50 hover:shadow-md hover:-translate-y-0.5 bg-card',
                  )}
                  onClick={() => handleSelectImage(selectUrl)}
                >
                  <Image
                    src={displayUrl || '/placeholder.svg'}
                    alt={image.meta?.originalName ?? image.name ?? 'image'}
                    fill
                    unoptimized
                    sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                    className="object-cover transition-opacity duration-300"
                  />

                  {selectedImageUrl === selectUrl && mode === 'select' && (
                    <div className="absolute inset-0 bg-foreground/20 flex items-center justify-center backdrop-blur-[1px]">
                      <div className="bg-foreground text-background rounded-full p-2 shadow-lg">
                        <Check className="h-4 w-4" />
                      </div>
                    </div>
                  )}

                  {mode === 'manage' && (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleDelete(image.id)
                      }}
                      className="absolute top-2 right-2 h-7 w-7 rounded-full bg-background/90 hover:bg-red-50 dark:hover:bg-red-950/20 text-muted-foreground hover:text-red-500 shadow-sm opacity-0 group-hover:opacity-100 transition-all scale-90 group-hover:scale-100"
                      aria-label={t('deleteImage')}
                    >
                      <X className="h-3.5 w-3.5" />
                    </Button>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )

  const actionsBar = (
    <div className="flex justify-end gap-3 pt-5 border-t border-border/50">
      <Button
        variant="ghost"
        onClick={closeMediaLibrary}
        className="rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted/50"
      >
        {mode === 'select' ? t('cancel') : t('close')}
      </Button>

      {mode === 'select' && selectedImageUrl && (
        <Button
          onClick={handleConfirmSelection}
          className="rounded-xl bg-foreground text-background hover:bg-foreground/90 shadow-md px-6 transition-all"
        >
          {t('selectImage')}
        </Button>
      )}
    </div>
  )

  if (isMobile) {
    return (
      <MobileDrawer open={isMediaLibraryOpen} onOpenChange={(v) => { if (!v) closeMediaLibrary() }} title={t('mediaLibrary')} showHeader>
        <div className="flex flex-col gap-4 pb-6">
          {galleryContent}
          <div className="flex justify-end gap-3 pt-4 border-t border-border/50">
            <Button
              variant="ghost"
              size="sm"
              onClick={closeMediaLibrary}
              className="rounded-xl text-muted-foreground hover:text-foreground"
            >
              {mode === 'select' ? t('cancel') : t('close')}
            </Button>
            {mode === 'select' && selectedImageUrl && (
              <Button
                size="sm"
                onClick={handleConfirmSelection}
                className="rounded-xl bg-foreground text-background"
              >
                {t('selectImage')}
              </Button>
            )}
          </div>
        </div>
      </MobileDrawer>
    )
  }

  return (
    <Dialog open={isMediaLibraryOpen} onOpenChange={setMediaLibraryOpen}>
      <DialogContent className="sm:max-w-2xl max-h-[85vh] flex flex-col min-h-0 bg-background/95 backdrop-blur-xl border-border shadow-xl p-8 gap-0">
        <DialogHeader className="pb-5">
          <DialogTitle className="text-xl font-semibold text-foreground tracking-tight">
            {t('mediaLibrary')}
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            {mode === 'select' ? t('selectProjectImage') : t('manageProjectImages')}
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col flex-1 min-h-0">
          {galleryContent}
          {actionsBar}
        </div>
      </DialogContent>
    </Dialog>
  )
}

