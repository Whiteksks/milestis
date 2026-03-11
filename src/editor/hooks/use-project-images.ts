import { useEffect, useState } from 'react'
import { collection, onSnapshot, query, where } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { useUiStore } from '@/editor/lib/store-ui'
import { useUserStore } from '@/hooks/useUserStore'

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

    const unsub = onSnapshot(
      q,
      (snap) => {
        const docs = snap.docs.map((d) => ({
          id: d.id,
          ...(d.data() as Omit<ProjectImageDoc, 'id'>),
        }))
        docs.sort((a, b) => {
          const aMs = a.createdAt?.toDate?.()?.getTime() ?? 0
          const bMs = b.createdAt?.toDate?.()?.getTime() ?? 0
          return bMs - aMs
        })
        setImages(docs)
      },
      (err) => {
        console.error('[useProjectImages] Firestore listener error:', err)
      },
    )

    return unsub
  }, [projectId, uid])

  return images
}

