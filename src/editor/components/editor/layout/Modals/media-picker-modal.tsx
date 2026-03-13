"use client"

import { useUiSelector } from '@/editor/lib/store'
import { useUiStore } from '@/editor/lib/store-ui'
import { useUserStore } from '@/hooks/useUserStore'
import { useProjectImages, type ProjectImageDoc } from '@/editor/hooks/use-project-images'
import { useIsMobile } from '@/hooks/use-mobile'
import { storage } from '@/lib/firebase'
import { ref as storageRef, uploadBytes } from 'firebase/storage'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from '@/components/ui/drawer'
import { Button } from '@/components/ui/button'
import { Check, Upload, Loader2 } from 'lucide-react'
import { useState, useRef } from 'react'
import { cn } from '@/lib/utils'
import Image from 'next/image'

interface MediaPickerModalProps {
  ownerId: string
  onSelectImage?: (url: string, thumbUrl?: string) => void
  onSelectImages?: (urls: string[]) => void
}

interface UploadingEntry {
  id: string
  name: string
  previewUrl: string
}

function getDisplayUrl(img: ProjectImageDoc): string {
  return img.urls?.thumb ?? img.urls?.middle ?? img.urls?.full ?? ''
}

function getSelectUrl(img: ProjectImageDoc): string {
  return img.urls?.full ?? img.urls?.middle ?? ''
}

export function MediaPickerModal({ ownerId, onSelectImage, onSelectImages }: MediaPickerModalProps) {
  const { isMediaPickerOpen, mediaPickerOwnerId, openMediaPicker, closeMediaPicker } = useUiSelector((state) => ({
    isMediaPickerOpen: state.isMediaPickerOpen,
    mediaPickerOwnerId: state.mediaPickerOwnerId,
    openMediaPicker: state.openMediaPicker,
    closeMediaPicker: state.closeMediaPicker,
  }))

  const projectId = useUiStore((s) => s.projectId)
  const uid = useUserStore((s) => s.profile?.uid)
  const firestoreImages = useProjectImages()
  const isMobile = useIsMobile()

  const [selectedUrls, setSelectedUrls] = useState<string[]>([])
  const [uploading, setUploading] = useState<UploadingEntry[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)

  const isMultiSelect = !!onSelectImages
  const isOpen = isMediaPickerOpen && mediaPickerOwnerId === ownerId

  const handleOpenChange = (open: boolean) => {
    if (open) openMediaPicker(ownerId)
    else {
      setSelectedUrls([])
      closeMediaPicker()
    }
  }

  const handleConfirm = () => {
    if (selectedUrls.length > 0) {
      if (isMultiSelect && onSelectImages) {
        onSelectImages(selectedUrls)
      } else if (!isMultiSelect && onSelectImage) {
        const selectedFullUrl = selectedUrls[0]
        const selectedImage = firestoreImages.find((img) => getSelectUrl(img) === selectedFullUrl)
        const thumbUrl = selectedImage ? getDisplayUrl(selectedImage) : undefined
        onSelectImage(selectedFullUrl, thumbUrl)
      }
    }
    setSelectedUrls([])
    closeMediaPicker()
  }

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || !uid || !projectId) return
    const filesArray = Array.from(files)
    if (fileInputRef.current) fileInputRef.current.value = ''

    await Promise.all(
      filesArray.map(async (file) => {
        const imageId = crypto.randomUUID()
        const previewUrl = URL.createObjectURL(file)
        setUploading((prev) => [...prev, { id: imageId, name: file.name, previewUrl }])
        try {
          const ext = file.name.split('.').pop()?.toLowerCase() || 'jpg'
          await uploadBytes(
            storageRef(storage, `users/${uid}/projects/${projectId}/images/${imageId}/original.${ext}`),
            file,
          )
        } catch (err) {
          console.error('Upload failed:', err)
        } finally {
          setUploading((prev) => prev.filter((u) => u.id !== imageId))
          URL.revokeObjectURL(previewUrl)
        }
      }),
    )
  }

  const allImages = firestoreImages
  const isEmpty = allImages.length === 0 && uploading.length === 0

  const imageGrid = (
    <div className="flex-1 min-h-0 overflow-y-auto overscroll-contain rounded-2xl border border-border p-4 bg-muted/30">
      {isEmpty ? (
        <div className="flex items-center justify-center h-40 text-muted-foreground text-sm font-medium">
          No images yet. Upload images first.
        </div>
      ) : (
        <div className="grid grid-cols-3 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {/* Uploading placeholders */}
          {uploading.map((u) => (
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
                <Loader2 className="h-6 w-6 text-foreground/70 animate-spin" />
              </div>
            </div>
          ))}

          {/* Firestore images */}
          {allImages.map((image) => {
            const displayUrl = getDisplayUrl(image)
            const selectUrl = getSelectUrl(image)
            return (
              <button
                key={image.id}
                type="button"
                onClick={() => {
                  setSelectedUrls((prev) => {
                    if (!isMultiSelect) return [selectUrl]
                    if (prev.includes(selectUrl)) return prev.filter((u) => u !== selectUrl)
                    return [...prev, selectUrl]
                  })
                }}
                className={cn(
                  'relative aspect-square rounded-xl overflow-hidden border cursor-pointer transition-all duration-300',
                  selectedUrls.includes(selectUrl)
                    ? 'border-ring ring-2 ring-ring ring-offset-2 ring-offset-background'
                    : 'border-border hover:border-ring/50 hover:shadow-md hover:-translate-y-0.5 bg-card',
                )}
              >
                <Image
                  src={displayUrl || '/placeholder.svg'}
                  alt={image.meta?.originalName ?? image.name ?? 'image'}
                  fill
                  unoptimized
                  sizes="(max-width: 768px) 33vw, 160px"
                  className="object-cover"
                />
                {selectedUrls.includes(selectUrl) && (
                  <div className="absolute inset-0 bg-foreground/20 flex items-center justify-center backdrop-blur-[1px]">
                    <div className="bg-foreground text-background rounded-full p-2 shadow-lg">
                      <Check className="h-4 w-4" />
                    </div>
                  </div>
                )}
              </button>
            )
          })}
        </div>
      )}
    </div>
  )

  const footer = (
    <div className="flex justify-end gap-3 pt-4 border-t border-border/50">
      <Button
        variant="ghost"
        onClick={() => { setSelectedUrls([]); closeMediaPicker() }}
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
  )

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

  if (isMobile) {
    return (
      <Drawer nested open={isOpen} onOpenChange={handleOpenChange}>
        <DrawerContent className="max-h-[85vh] flex flex-col bg-card border-border/60 focus:outline-none">
          <DrawerHeader className="px-5 py-4 flex flex-row items-center justify-between">
            <div>
              <DrawerTitle className="text-base font-semibold tracking-tight">
                Select Image
              </DrawerTitle>
              <DrawerDescription className="text-xs text-muted-foreground mt-0.5">
                Choose from uploaded images or upload a new one.
              </DrawerDescription>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="gap-1.5 rounded-xl text-xs shrink-0"
              onClick={() => fileInputRef.current?.click()}
            >
              <Upload className="h-3.5 w-3.5" />
              Upload
            </Button>
            {uploadInput}
          </DrawerHeader>
          <div className="flex-1 min-h-0 flex flex-col gap-3 px-4 pb-6 overflow-hidden">
            {imageGrid}
            {footer}
          </div>
        </DrawerContent>
      </Drawer>
    )
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[80vh] flex flex-col bg-background/95 backdrop-blur-sm border-border shadow-xl p-8 gap-0">
        <DialogHeader className="pb-6 flex flex-row items-center justify-between">
          <div>
            <DialogTitle className="text-xl font-semibold text-foreground tracking-tight">
              Select Image
            </DialogTitle>
            <DialogDescription className="text-muted-foreground">
              Choose from your uploaded images or upload a new one.
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
          {uploadInput}
        </DialogHeader>
        {imageGrid}
        <div className="pt-6">
          {footer}
        </div>
      </DialogContent>
    </Dialog>
  )
}

