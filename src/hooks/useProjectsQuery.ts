import { useQuery, type QueryClient } from '@tanstack/react-query'
import { collection, getDocs, orderBy, query, where } from 'firebase/firestore'
import { useShallow } from 'zustand/react/shallow'
import { db } from '@/lib/firebase'
import { useUserStore } from '@/hooks/useUserStore'

// ─── Types ─────────────────────────────────────────────────────────────────

export interface DashboardProject {
  id: string
  name: string
  mode: 'portfolio' | 'photobook'
  status: 'active' | 'deleted'
  isPublished: boolean
  updatedAt: Date
  deletedAt?: Date
  purgeAt?: Date
  preview?: {
    themeId: string
    templateId: string
    heroImageUrl?: string
    title?: string
    subtitle?: string
    date?: string
    aspectRatio?: string
    frameStyle?: string
  }
}

// ─── Query keys ────────────────────────────────────────────────────────────

export const projectKeys = {
  all: (uid: string) => ['projects', uid] as const,
  active: (uid: string) => ['projects', uid, 'active'] as const,
  deleted: (uid: string) => ['projects', uid, 'deleted'] as const,
}

// ─── Helpers ───────────────────────────────────────────────────────────────

function isThumbPreviewUrl(url: string | undefined): boolean {
  if (!url) return false
  return url.includes('thumb.webp') || /%2Fthumb\.(?:webp|png|jpe?g)(?:$|[?#])/i.test(url)
}

export function mapProjectDoc(data: Record<string, any>, id: string): DashboardProject {
  const preview = data.preview
    ? {
        ...data.preview,
        heroImageUrl: isThumbPreviewUrl(data.preview.heroImageUrl)
          ? data.preview.heroImageUrl
          : undefined,
      }
    : undefined

  return {
    id,
    name: data.name,
    mode: data.mode,
    status: data.status,
    isPublished: data.isPublished ?? false,
    updatedAt: data.updatedAt?.toDate() ?? new Date(),
    deletedAt: data.deletedAt?.toDate(),
    purgeAt: data.purgeAt?.toDate(),
    preview,
  }
}

async function fetchProjectsByStatus(
  uid: string,
  status: 'active' | 'deleted',
): Promise<DashboardProject[]> {
  const q = query(
    collection(db, 'projects'),
    where('ownerId', '==', uid),
    where('status', '==', status),
    orderBy('updatedAt', 'desc'),
  )
  const snap = await getDocs(q)
  return snap.docs.map((docSnap) => mapProjectDoc(docSnap.data(), docSnap.id))
}

// ─── Internal hook ─────────────────────────────────────────────────────────

function useUidAndLoading() {
  return useUserStore(useShallow((s) => ({
    uid: s.profile?.uid ?? null,
    userLoading: s.loading,
  })))
}

// ─── Query options factories ───────────────────────────────────────────────
// Shared between hooks and prefetchQuery calls.

export function getActiveProjectsQueryOptions(uid: string) {
  return {
    queryKey: projectKeys.active(uid),
    queryFn: () => fetchProjectsByStatus(uid, 'active'),
  } as const
}

/** Prefetch active projects into the query cache. No-op if data is still fresh. */
export function prefetchActiveProjects(queryClient: QueryClient, uid: string) {
  return queryClient.prefetchQuery(getActiveProjectsQueryOptions(uid))
}

// ─── Queries ───────────────────────────────────────────────────────────────

export function useActiveProjectsQuery() {
  const { uid, userLoading } = useUidAndLoading()
  const result = useQuery({
    ...getActiveProjectsQueryOptions(uid ?? ''),
    enabled: !userLoading && !!uid,
  })
  // While Firebase auth is still resolving, show loading state
  return { ...result, isLoading: userLoading || result.isLoading }
}

export function useTrashedProjectsQuery({ enabled: extraEnabled = true }: { enabled?: boolean } = {}) {
  const { uid, userLoading } = useUidAndLoading()
  const result = useQuery({
    queryKey: projectKeys.deleted(uid ?? ''),
    queryFn: () => fetchProjectsByStatus(uid!, 'deleted'),
    enabled: !userLoading && !!uid && extraEnabled,
  })
  return { ...result, isLoading: userLoading || result.isLoading }
}

/** Reuses the active projects cache — no separate Firestore read. */
export function useRecentProjectsQuery(limitCount = 4) {
  const { data: allActive = [], isLoading } = useActiveProjectsQuery()
  return {
    projects: allActive.slice(0, limitCount),
    loading: isLoading,
  }
}
