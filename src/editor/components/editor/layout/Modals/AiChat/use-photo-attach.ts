import { useState } from 'react'
import {
  useProjectMediaLibrary,
  getProjectImageSelectUrl,
} from '@/editor/hooks/use-project-images'

export function usePhotoAttach() {
  const [selectedUrls, setSelectedUrls] = useState<string[]>([])
  const [isPickerOpen, setIsPickerOpen] = useState(false)

  const { fileInputRef, images, pendingUploads, handleFileUpload } = useProjectMediaLibrary()

  function handlePhotoButton() {
    if (images.length === 0 && pendingUploads.length === 0) {
      fileInputRef.current?.click()
    } else if (isPickerOpen) {
      // Closing: deselect all and hide picker
      setSelectedUrls([])
      setIsPickerOpen(false)
    } else {
      // Opening: select all photos immediately
      setSelectedUrls(images.map((i) => getProjectImageSelectUrl(i)).filter(Boolean))
      setIsPickerOpen(true)
    }
  }

  function toggleUrl(url: string) {
    setSelectedUrls((prev) =>
      prev.includes(url) ? prev.filter((u) => u !== url) : [...prev, url],
    )
  }

  function removeUrl(url: string) {
    setSelectedUrls((prev) => prev.filter((u) => u !== url))
  }

  function clearSelection() {
    setSelectedUrls([])
  }

  return {
    selectedUrls,
    isPickerOpen,
    setIsPickerOpen,
    handlePhotoButton,
    toggleUrl,
    removeUrl,
    clearSelection,
    fileInputRef,
    images,
    pendingUploads,
    handleFileUpload,
  }
}
