import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useUserStore } from '@/hooks/useUserStore'
import { projectKeys, type DashboardProject } from '@/hooks/useProjectsQuery'
import { softDeleteProject, computePurgeAt } from '@/lib/delete-project'
import { restoreProject } from '@/lib/restore-project'
import { forceDeleteProject } from '@/lib/force-delete-project-api'
import { toastProject } from '@/lib/toast'

function useUid() {
  return useUserStore((s) => s.profile?.uid ?? null)
}

// ─── Soft delete ───────────────────────────────────────────────────────────

export function useSoftDeleteMutation() {
  const queryClient = useQueryClient()
  const uid = useUid()

  return useMutation({
    mutationFn: async (projectId: string) => {
      const promise = softDeleteProject(projectId)
      toastProject.delete(promise)
      await promise
    },
    onMutate: async (projectId) => {
      if (!uid) return
      await queryClient.cancelQueries({ queryKey: projectKeys.active(uid) })

      const prevActive = queryClient.getQueryData<DashboardProject[]>(projectKeys.active(uid))
      const prevDeleted = queryClient.getQueryData<DashboardProject[]>(projectKeys.deleted(uid))

      const project = prevActive?.find((p) => p.id === projectId)
      if (project) {
        const now = new Date()
        const deleted: DashboardProject = {
          ...project,
          status: 'deleted',
          deletedAt: now,
          purgeAt: computePurgeAt(now),
        }
        queryClient.setQueryData<DashboardProject[]>(
          projectKeys.active(uid),
          (prev) => prev?.filter((p) => p.id !== projectId) ?? [],
        )
        queryClient.setQueryData<DashboardProject[]>(
          projectKeys.deleted(uid),
          (prev) => (prev ? [deleted, ...prev] : [deleted]),
        )
      }

      return { prevActive, prevDeleted }
    },
    onError: (_err, _id, context) => {
      if (!uid || !context) return
      if (context.prevActive !== undefined)
        queryClient.setQueryData(projectKeys.active(uid), context.prevActive)
      if (context.prevDeleted !== undefined)
        queryClient.setQueryData(projectKeys.deleted(uid), context.prevDeleted)
    },
    onSettled: () => {
      if (uid) void queryClient.invalidateQueries({ queryKey: projectKeys.all(uid) })
    },
  })
}

// ─── Restore ───────────────────────────────────────────────────────────────

export function useRestoreMutation() {
  const queryClient = useQueryClient()
  const uid = useUid()

  return useMutation({
    mutationFn: async (projectId: string) => {
      const promise = restoreProject(projectId)
      toastProject.restore(promise)
      await promise
    },
    onMutate: async (projectId) => {
      if (!uid) return
      await queryClient.cancelQueries({ queryKey: projectKeys.deleted(uid) })

      const prevActive = queryClient.getQueryData<DashboardProject[]>(projectKeys.active(uid))
      const prevDeleted = queryClient.getQueryData<DashboardProject[]>(projectKeys.deleted(uid))

      const project = prevDeleted?.find((p) => p.id === projectId)
      if (project) {
        const restored: DashboardProject = {
          ...project,
          status: 'active',
          deletedAt: undefined,
          purgeAt: undefined,
        }
        queryClient.setQueryData<DashboardProject[]>(
          projectKeys.deleted(uid),
          (prev) => prev?.filter((p) => p.id !== projectId) ?? [],
        )
        queryClient.setQueryData<DashboardProject[]>(
          projectKeys.active(uid),
          (prev) => (prev ? [restored, ...prev] : [restored]),
        )
      }

      return { prevActive, prevDeleted }
    },
    onError: (_err, _id, context) => {
      if (!uid || !context) return
      if (context.prevActive !== undefined)
        queryClient.setQueryData(projectKeys.active(uid), context.prevActive)
      if (context.prevDeleted !== undefined)
        queryClient.setQueryData(projectKeys.deleted(uid), context.prevDeleted)
    },
    onSettled: () => {
      if (uid) void queryClient.invalidateQueries({ queryKey: projectKeys.all(uid) })
    },
  })
}

// ─── Force delete ──────────────────────────────────────────────────────────

export function useForceDeleteMutation() {
  const queryClient = useQueryClient()
  const uid = useUid()

  return useMutation({
    mutationFn: async (projectId: string) => {
      const promise = forceDeleteProject(projectId)
      toastProject.forceDelete(promise)
      await promise
    },
    onMutate: async (projectId) => {
      if (!uid) return
      await queryClient.cancelQueries({ queryKey: projectKeys.deleted(uid) })

      const prevDeleted = queryClient.getQueryData<DashboardProject[]>(projectKeys.deleted(uid))
      queryClient.setQueryData<DashboardProject[]>(
        projectKeys.deleted(uid),
        (prev) => prev?.filter((p) => p.id !== projectId) ?? [],
      )

      return { prevDeleted }
    },
    onError: (_err, _id, context) => {
      if (!uid || !context) return
      if (context.prevDeleted !== undefined)
        queryClient.setQueryData(projectKeys.deleted(uid), context.prevDeleted)
    },
    onSettled: () => {
      if (uid) void queryClient.invalidateQueries({ queryKey: projectKeys.all(uid) })
    },
  })
}
