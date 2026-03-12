import { useEffect, useState } from 'react'
import { collection, query, where, onSnapshot } from 'firebase/firestore'
import { useShallow } from 'zustand/react/shallow'
import { db } from '@/lib/firebase'
import { useUserStore } from '@/hooks/useUserStore'

export interface DashboardProject {
  id: string
  name: string
  mode: 'portfolio' | 'photobook'
  status: 'active' | 'archived' | 'deleted'
  isPublished: boolean
  updatedAt: Date
  deletedAt?: Date
  purgeAt?: Date
}

export function useProjects() {
  const { uid, userLoading } = useUserStore(
    useShallow((s) => ({ uid: s.profile?.uid ?? null, userLoading: s.loading }))
  )

  const [projects, setProjects] = useState<DashboardProject[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (userLoading) return

    if (!uid) {
      setProjects([])
      setLoading(false)
      return
    }

    const q = query(
      collection(db, 'projects'),
      where('ownerId', '==', uid),
    )

    const unsub = onSnapshot(
      q,
      (snap) => {
        const docs = snap.docs.map((d) => {
          const data = d.data()
          return {
            id: d.id,
            name: data.name,
            mode: data.mode,
            status: data.status,
            isPublished: data.isPublished ?? false,
            updatedAt: data.updatedAt?.toDate() ?? new Date(),
            deletedAt: data.deletedAt?.toDate(),
            purgeAt: data.purgeAt?.toDate(),
          }
        })
        // Sort by updatedAt descending on the client — avoids composite index
        docs.sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime())
        setProjects(docs)
        setLoading(false)
      },
      (err) => {
        console.error('[useProjects] Firestore query failed:', err)
        setLoading(false)
      }
    )

    return unsub
  }, [uid, userLoading])

  const activeProjects = projects.filter((p) => p.status !== 'deleted')
  const trashedProjects = projects.filter((p) => p.status === 'deleted')

  return { projects, activeProjects, trashedProjects, loading }
}
