import { useEffect, useRef, useState, type ChangeEvent } from 'react'
import { collection, onSnapshot, query, where } from 'firebase/firestore'
import { ref as storageRef, uploadBytes } from 'firebase/storage'
import { db } from '@/lib/firebase'
import { useUiStore } from '@/editor/lib/store/ui'
import { useUserStore } from '@/hooks/useUserStore'
import { storage } from '@/lib/firebase'

export interface ProjectImageDoc {
  id: string
  ownerId: string
  projectId: string
  type?: 'url' | 'uploaded'
  urls: { full?: string; middle?: string; thumb?: string; print?: string }
  meta?: { originalName?: string; width?: number; height?: number }
  name?: string
  createdAt?: { toDate: () => Date } | null
}

export interface UploadingEntry {
  id: string
  name: string
  previewUrl: string
}

export function getProjectImageDisplayUrl(img: ProjectImageDoc): string {
  return img.urls?.thumb ?? img.urls?.middle ?? img.urls?.full ?? ''
}

export function getProjectImageSelectUrl(img: ProjectImageDoc): string {
  return img.urls?.full ?? img.urls?.middle ?? ''
}

export function useProjectImages(): ProjectImageDoc[] {
  const projectId = useUiStore((s) => s.projectId)
  const uid = useUserStore((s) => s.profile?.uid)
  const [images, setImages] = useState<ProjectImageDoc[]>([])

  useEffect(() => {
    if (!projectId || !uid) {
      setImages([])
      return
    }

    const q = query(
      collection(db, 'images'),
      where('projectId', '==', projectId),
      where('ownerId', '==', uid),
    )

    let isFirst = true

    const unsub = onSnapshot(
      q,
      (snap) => {
        setImages((prev) => {
          // ── Initial load ─────────────────────────────────────────────────
          // Sort the full list once so the gallery opens already ordered.
          if (isFirst) {
            isFirst = false
            const initial = snap.docs.map((d) => ({
              id: d.id,
              ...(d.data() as Omit<ProjectImageDoc, 'id'>),
            }))
            initial.sort((a, b) => {
              const aMs = a.createdAt?.toDate?.()?.getTime() ?? 0
              const bMs = b.createdAt?.toDate?.()?.getTime() ?? 0
              return bMs - aMs
            })
            return initial
          }

          // ── Incremental update ────────────────────────────────────────────
          // New images are prepended so existing DOM nodes never change
          // position → browsers won't retrigger their CSS animations.
          const prevMap = new Map(prev.map((img) => [img.id, img]))
          const added: ProjectImageDoc[] = []

          for (const change of snap.docChanges()) {
            const doc = {
              id: change.doc.id,
              ...(change.doc.data() as Omit<ProjectImageDoc, 'id'>),
            }
            if (change.type === 'added') {
              added.push(doc)
              prevMap.set(doc.id, doc)
            } else if (change.type === 'modified') {
              prevMap.set(doc.id, doc)
            } else {
              prevMap.delete(doc.id)
            }
          }

          // Rebuild existing list preserving order (applies updates/removals)
          const existing = prev
            .filter((img) => prevMap.has(img.id))
            .map((img) => prevMap.get(img.id)!)

          if (added.length === 0) return existing

          // Sort multiple simultaneous uploads among themselves
          added.sort((a, b) => {
            const aMs = a.createdAt?.toDate?.()?.getTime() ?? Date.now()
            const bMs = b.createdAt?.toDate?.()?.getTime() ?? Date.now()
            return bMs - aMs
          })

          return [...added, ...existing]
        })
      },
      (err) => {
        console.error('[useProjectImages] Firestore listener error:', err)
      },
    )

    return unsub
  }, [projectId, uid])

  return images
}

export function useProjectMediaLibrary() {
  const projectId = useUiStore((s) => s.projectId)
  const uid = useUserStore((s) => s.profile?.uid)
  const images = useProjectImages()
  const [uploading, setUploading] = useState<UploadingEntry[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)
  const uploadingRef = useRef<UploadingEntry[]>([])

  useEffect(() => {
    uploadingRef.current = uploading
  }, [uploading])

  useEffect(() => {
    if (images.length === 0) return

    setUploading((prev) => {
      const confirmedIds = new Set(images.map((image) => image.id))
      const toRemove = prev.filter((entry) => confirmedIds.has(entry.id))
      if (toRemove.length === 0) return prev

      toRemove.forEach((entry) => URL.revokeObjectURL(entry.previewUrl))
      return prev.filter((entry) => !confirmedIds.has(entry.id))
    })
  }, [images])

  useEffect(() => {
    return () => {
      uploadingRef.current.forEach((entry) => URL.revokeObjectURL(entry.previewUrl))
    }
  }, [])

  const handleFileUpload = async (event: ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
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
        } catch (error) {
          setUploading((prev) => prev.filter((entry) => entry.id !== imageId))
          URL.revokeObjectURL(previewUrl)
          console.error('Upload failed:', error)
        }
      }),
    )
  }

  const pendingUploads = uploading.filter(
    (entry) => !images.some((image) => image.id === entry.id),
  )

  return {
    fileInputRef,
    images,
    pendingUploads,
    totalCount: images.length + pendingUploads.length,
    handleFileUpload,
  }
}

