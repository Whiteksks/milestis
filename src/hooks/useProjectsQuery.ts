import { useQuery, type QueryClient } from '@tanstack/react-query'
import { type DocumentData, collection, collectionGroup, getDocs, orderBy, query, where } from 'firebase/firestore'
import { useShallow } from 'zustand/react/shallow'
import { db } from '@/lib/firebase'
import { useUserStore } from '@/hooks/useUserStore'

// ─── Types ─────────────────────────────────────────────────────────────────

export interface DashboardProject {
  id: string
  name: string
  mode: 'portfolio' | 'photobook'
  status: 'active' | 'archived' | 'deleted'
  isPublished: boolean
  isExported?: boolean
  publishedSlug?: string | null
  /** Plaintext access token stored on the project doc (photobooks only). */
  publishedAccessToken?: string | null
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
  archived: (uid: string) => ['projects', uid, 'archived'] as const,
  deleted: (uid: string) => ['projects', uid, 'deleted'] as const,
  exports: (uid: string) => ['exports', uid] as const,
}

// ─── Helpers ───────────────────────────────────────────────────────────────

function isThumbPreviewUrl(url: string | undefined): boolean {
  if (!url) return false
  return url.includes('thumb.webp') || /%2Fthumb\.(?:webp|png|jpe?g)(?:$|[?#])/i.test(url)
}

export function mapProjectDoc(data: DocumentData, id: string): DashboardProject {
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
    isExported: data.isExported ?? false,
    publishedSlug: data.publishedSlug ?? null,
    publishedAccessToken: data.publishedAccessToken ?? null,
    updatedAt: data.updatedAt?.toDate() ?? new Date(),
    deletedAt: data.deletedAt?.toDate(),
    purgeAt: data.purgeAt?.toDate(),
    preview,
  }
}

async function fetchProjectsByStatus(
  uid: string,
  status: 'active' | 'archived' | 'deleted',
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

const STALE_TIME = 5 * 60 * 1000 // 5 minutes

export function getActiveProjectsQueryOptions(uid: string) {
  return {
    queryKey: projectKeys.active(uid),
    queryFn: () => fetchProjectsByStatus(uid, 'active'),
    staleTime: STALE_TIME,
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
    staleTime: STALE_TIME,
  })
  return { ...result, isLoading: userLoading || result.isLoading }
}

export function useArchivedProjectsQuery({ enabled: extraEnabled = true }: { enabled?: boolean } = {}) {
  const { uid, userLoading } = useUidAndLoading()
  const result = useQuery({
    queryKey: projectKeys.archived(uid ?? ''),
    queryFn: () => fetchProjectsByStatus(uid!, 'archived'),
    enabled: !userLoading && !!uid && extraEnabled,
    staleTime: STALE_TIME,
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

// ─── Published projects ────────────────────────────────────────────────────

const BASE_DOMAIN = 'milestis.site'

/**
 * Returns the canonical share URL for a published project.
 * - Portfolio: https://{slug}.milestis.site
 * - Photobook: https://milestis.site/{slug}?token={accessToken}
 *   (token is absent if the project was published before the token-persistence change)
 */
export function getProjectShareUrl(project: DashboardProject): string | null {
  if (!project.isPublished || !project.publishedSlug) return null
  if (project.mode === 'portfolio') {
    return `https://${project.publishedSlug}.${BASE_DOMAIN}`
  }
  const base = `https://${BASE_DOMAIN}/${project.publishedSlug}`
  return project.publishedAccessToken
    ? `${base}?token=${project.publishedAccessToken}`
    : base
}

/**
 * Returns only published projects (active or archived) with their share URLs.
 * Combines active and archived caches — no extra Firestore read.
 */
export function usePublishedProjectsQuery() {
  const { data: allActive = [], isLoading: activeLoading } = useActiveProjectsQuery()
  const { data: allArchived = [], isLoading: archivedLoading } = useArchivedProjectsQuery()
  const publishedProjects = [...allActive, ...allArchived].filter((p) => p.isPublished)
  return { data: publishedProjects, isLoading: activeLoading || archivedLoading }
}

// ─── Exports ─────────────────────────────────────────────────────

export interface ProjectExportRecord {
  exportId: string
  projectId: string
  projectName: string
  ownerId: string
  versionNumber: number
  mode: 'portfolio' | 'photobook'
  creditCost: number
  fileDownloadUrl: string
  mimeType: string
  publishedSlug?: string
  createdAt: Date
}

async function fetchUserExports(uid: string): Promise<ProjectExportRecord[]> {
  const q = query(
    collectionGroup(db, 'exports'),
    where('ownerId', '==', uid),
    orderBy('createdAt', 'desc'),
  )
  const snap = await getDocs(q)
  return snap.docs.map((d) => {
    const data = d.data()
    return {
      exportId: data.exportId ?? d.id,
      projectId: data.projectId ?? '',
      projectName: data.projectName ?? '',
      ownerId: data.ownerId ?? uid,
      versionNumber: data.versionNumber ?? 1,
      mode: data.mode ?? 'photobook',
      creditCost: data.creditCost ?? 0,
      fileDownloadUrl: data.fileDownloadUrl ?? '',
      mimeType: data.mimeType ?? 'application/octet-stream',
      publishedSlug: data.publishedSlug,
      createdAt: data.createdAt?.toDate() ?? new Date(),
    } satisfies ProjectExportRecord
  })
}

export function useProjectExportsQuery() {
  const { uid, userLoading } = useUidAndLoading()
  const result = useQuery({
    queryKey: projectKeys.exports(uid ?? ''),
    queryFn: () => fetchUserExports(uid!),
    enabled: !userLoading && !!uid,
    staleTime: STALE_TIME,
  })
  return { ...result, isLoading: userLoading || result.isLoading }
}
