"use client"

import { Suspense } from "react"
import { useShallow } from "zustand/react/shallow"
import { useSuspenseActiveProjectsQuery } from "@/hooks/useProjectsQuery"
import { selectAuthLoading, selectCurrentUid, useUserStore } from "@/hooks/useUserStore"
import { ProjectCard } from "./project-card"
import { EmptyState } from "./empty-state"
import { Skeleton } from "@/components/ui/skeleton"

interface ProjectGridProps {
  /** Maximum number of projects to display. Omit to show all. */
  limit?: number
  zoom?: number
}

function ProjectGridSkeleton({ limit = 4 }: { limit?: number }) {
  return (
    <div className="grid gap-4 grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {Array.from({ length: limit }).map((_, i) => (
        <div key={i} className="overflow-hidden rounded-2xl">
          <Skeleton className="aspect-[16/10] w-full rounded-t-2xl rounded-b-none" />
          <div className="p-3 space-y-2">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-3 w-1/2" />
          </div>
        </div>
      ))}
    </div>
  )
}

function ProjectGridContent({ uid, limit, zoom }: { uid: string; limit: number; zoom?: number }) {
  const { data: projects } = useSuspenseActiveProjectsQuery(uid)
  const displayed = projects.slice(0, limit)

  if (displayed.length === 0) return <EmptyState />

  return (
    <div className="grid gap-2 md:gap-4 grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {displayed.map((project) => (
        <ProjectCard key={project.id} project={project} zoom={zoom} />
      ))}
    </div>
  )
}

export function ProjectGrid({ limit = 4, zoom }: ProjectGridProps) {
  const { uid, userLoading } = useUserStore(
    useShallow((state) => ({ uid: selectCurrentUid(state), userLoading: selectAuthLoading(state) }))
  )

  if (userLoading || !uid) {
    return <ProjectGridSkeleton limit={limit} />
  }

  return (
    <Suspense fallback={<ProjectGridSkeleton limit={limit} />}>
      <ProjectGridContent uid={uid} limit={limit} zoom={zoom} />
    </Suspense>
  )
}

