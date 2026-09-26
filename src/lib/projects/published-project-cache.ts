import type { QueryClient } from '@tanstack/react-query'
import { projectKeys, type DashboardProject } from '@/hooks/useProjectsQuery'

/** Move a confirmed publication out of drafts before returning to the dashboard. */
export async function cachePublishedProject(
  queryClient: QueryClient,
  uid: string,
  projectId: string,
  publishedSlug: string,
) {
  await queryClient.cancelQueries({ queryKey: projectKeys.all(uid) })
  const activeKey = projectKeys.active(uid)
  const archivedKey = projectKeys.archived(uid)
  const project = queryClient.getQueryData<DashboardProject[]>(activeKey)?.find((item) => item.id === projectId)
    ?? queryClient.getQueryData<DashboardProject[]>(archivedKey)?.find((item) => item.id === projectId)

  queryClient.setQueryData<DashboardProject[]>(activeKey, (items) => items?.filter((item) => item.id !== projectId))
  if (project) {
    const archived: DashboardProject = { ...project, status: 'archived', isPublished: true, publishedSlug, updatedAt: new Date() }
    queryClient.setQueryData<DashboardProject[]>(archivedKey, (items) => [archived, ...(items ?? []).filter((item) => item.id !== projectId)])
  }
  // Refresh complete lists too, including an archive that has not been opened yet.
  await queryClient.invalidateQueries({ queryKey: projectKeys.all(uid), refetchType: 'all' })
}
