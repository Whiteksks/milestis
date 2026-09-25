import { useEffect, useRef, useState, type ChangeEvent } from 'react'
import {
  useProjectMediaLibrary,
  getProjectImageSelectUrl,
} from '@/editor/hooks/use-project-images'

export function usePhotoAttach() {
  const [selectedUrls, setSelectedUrls] = useState<string[]>([])
  const { fileInputRef, images, pendingUploads, handleFileUpload, retryUpload, dismissUpload } = useProjectMediaLibrary()

  // Images uploaded from this chat are auto-selected once Firestore confirms them,
  // so the user doesn't have to upload and then separately tap to select.
  const autoSelectIds = useRef<Set<string>>(new Set())

  function uploadFromChat(event: ChangeEvent<HTMLInputElement>) {
    handleFileUpload(event).forEach((id) => autoSelectIds.current.add(id))
  }
  function retryFromChat(id: string) {
    autoSelectIds.current.delete(id)
    const nextId = retryUpload(id)
    if (nextId) autoSelectIds.current.add(nextId)
  }

  useEffect(() => {
    if (autoSelectIds.current.size === 0) return
    const ready = images.filter((img) => autoSelectIds.current.has(img.id))
    if (ready.length === 0) return
    ready.forEach((img) => autoSelectIds.current.delete(img.id))
    setSelectedUrls((prev) => {
      const additions = ready.map((img) => getProjectImageSelectUrl(img)).filter(Boolean)
      return Array.from(new Set([...prev, ...additions]))
    })
  }, [images])

  function toggleUrl(url: string) {
    setSelectedUrls((prev) =>
      prev.includes(url) ? prev.filter((u) => u !== url) : [...prev, url],
    )
  }

  function toggleAll() {
    const allSelected = images.length > 0 && images.every((img) => selectedUrls.includes(getProjectImageSelectUrl(img)))
    setSelectedUrls(allSelected ? [] : images.map((img) => getProjectImageSelectUrl(img)).filter(Boolean))
  }

  function removeUrl(url: string) {
    setSelectedUrls((prev) => prev.filter((u) => u !== url))
  }

  function clearSelection() {
    setSelectedUrls([])
  }

  return {
    selectedUrls,
    toggleUrl,
    toggleAll,
    removeUrl,
    clearSelection,
    fileInputRef,
    images,
    pendingUploads,
    handleFileUpload: uploadFromChat,
    retryUpload: retryFromChat,
    dismissUpload,
  }
}
