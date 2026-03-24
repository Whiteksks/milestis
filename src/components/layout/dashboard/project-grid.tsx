"use client"

import { useRecentProjectsQuery } from "@/hooks/useProjectsQuery"
import { ProjectCard } from "./project-card"
import { EmptyState } from "./empty-state"
import { Skeleton } from "@/components/ui/skeleton"

interface ProjectGridProps {
  /** Maximum number of projects to display. Omit to show all. */
  limit?: number
  zoom?: number
}

export function ProjectGrid({ limit, zoom }: ProjectGridProps) {
  const { projects, loading } = useRecentProjectsQuery(limit ?? 4)

  if (loading) {
    return (
      <div className="grid gap-4 grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {Array.from({ length: limit ?? 4 }).map((_, i) => (
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

  const displayed = projects

  if (displayed.length === 0) {
    return <EmptyState />
  }


  return (
    <div className="grid gap-4 grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {displayed.map((project) => (
        <ProjectCard key={project.id} project={project} zoom={zoom}/>
      ))}
    </div>
  )
}

