import { useEffect, useRef, useState, type ChangeEvent } from 'react'
import { collection, onSnapshot, query, where } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { useUiStore } from '@/editor/lib/store/ui'
import { useUserStore } from '@/hooks/useUserStore'
import { useUploadStore, enqueueImageUpload, dismissUpload, PROCESSING_TIMEOUT_MS, type UploadingEntry } from '@/editor/lib/store/uploads'
export type { UploadingEntry } from '@/editor/lib/store/uploads'

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

export function getProjectImageDisplayUrl(img: ProjectImageDoc): string {
  return img.urls?.thumb ?? img.urls?.middle ?? img.urls?.full ?? ''
}

export function getProjectImageSelectUrl(img: ProjectImageDoc): string {
  return img.urls?.full ?? img.urls?.middle ?? ''
}

// For sending to the AI for vision/captioning — a thumbnail is plenty and far cheaper/faster
// to fetch+encode than the full-resolution asset used for the actual placed image.
export function getProjectImageThumbUrl(img: ProjectImageDoc): string {
  return img.urls?.thumb ?? img.urls?.middle ?? img.urls?.full ?? ''
}

export function useProjectImages(): ProjectImageDoc[] {
  const projectId = useUiStore((s) => s.projectId)
  const uid = useUserStore((s) => s.profile?.uid)
  const [images, setImages] = useState<ProjectImageDoc[]>([])
  const [scope, setScope] = useState('')

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
        const firstSnapshot = isFirst
        isFirst = false
        setScope(`${projectId}:${uid}`)
        setImages((prev) => {
          // ── Initial load ─────────────────────────────────────────────────
          // Sort the full list once so the gallery opens already ordered.
          if (firstSnapshot) {
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

  return scope === `${projectId}:${uid}` ? images : []
}

export function useProjectMediaLibrary() {
  const projectId = useUiStore((s) => s.projectId)
  const uid = useUserStore((s) => s.profile?.uid)
  const images = useProjectImages()
  const entries = useUploadStore((s) => s.entries)
  const dismissed = useUploadStore((s) => s.dismissed)
  const [jobs, setJobs] = useState<UploadingEntry[]>([])
  const [listenerFailed, setListenerFailed] = useState(false)
  const [now, setNow] = useState(0)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (!projectId || !uid) return
    const unsubscribe = onSnapshot(
      query(collection(db, 'projects', projectId, 'imageJobs'), where('status', 'in', ['processing', 'failed'])),
      (snapshot) => {
        setListenerFailed(false)
        setJobs(snapshot.docs.map((doc) => {
          const data = doc.data()
          return {
            id: doc.id, projectId, ownerId: uid, name: data.name ?? 'image',
            progress: 100, status: data.status, errorCode: data.errorCode,
            updatedAt: data.updatedAt?.toMillis?.() ?? Date.now(),
          } as UploadingEntry
        }))
      },
      () => setListenerFailed(true),
    )
    const timer = setInterval(() => setNow(Date.now()), 5000)
    return () => { unsubscribe(); clearInterval(timer) }
  }, [projectId, uid])

  useEffect(() => {
    const ready = new Set(images.map((image) => image.id))
    if (entries.some((entry) => entry.projectId === projectId && ready.has(entry.id))) {
      useUploadStore.setState((state) => ({
        entries: state.entries.filter((entry) => entry.projectId !== projectId || !ready.has(entry.id)),
      }))
    }
  }, [images, entries, projectId])

  const pending = new Map<string, UploadingEntry>()
  for (const entry of entries) {
    if (entry.projectId === projectId && entry.ownerId === uid) pending.set(entry.id, entry)
  }
  for (const job of jobs) {
    if (job.projectId !== projectId || job.ownerId !== uid) continue
    const local = pending.get(job.id)
    pending.set(job.id, { ...local, ...job, file: local?.file })
  }
  const readyIds = new Set(images.map((image) => image.id))
  const pendingUploads = [...pending.values()]
    .filter((entry) => !readyIds.has(entry.id) && !dismissed[entry.id])
    .map((entry) => {
      if (entry.status !== 'processing') return entry
      if (listenerFailed) return { ...entry, status: 'failed' as const, errorCode: 'connectionFailed' }
      if (now - entry.updatedAt > PROCESSING_TIMEOUT_MS) {
        return { ...entry, status: 'failed' as const, errorCode: 'processingTimeout' }
      }
      return entry
    })

  const handleFileUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files ?? [])
    event.target.value = ''
    if (!uid || !projectId) return []
    return files.map((file) => enqueueImageUpload(file, uid, projectId))
  }
  const retryUpload = (id: string) => {
    const entry = pendingUploads.find((item) => item.id === id)
    if (!entry?.file || !uid || !projectId) return
    dismissUpload(id)
    return enqueueImageUpload(entry.file, uid, projectId)
  }

  return {
    fileInputRef, images, pendingUploads,
    totalCount: images.length + pendingUploads.length,
    handleFileUpload, retryUpload, dismissUpload,
  }
}

