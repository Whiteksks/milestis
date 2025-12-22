"use client"

import { ProjectCard } from "./project-card"
import { EmptyState } from "./empty-state"

const mockProjects = [
  {
    id: "1",
    title: "Summer Vacation 2024",
    description: "Family trip to the beach",
    status: "published" as const,
    thumbnail: "/placeholder.svg?height=300&width=400",
    updatedAt: "2 days ago",
  },
  {
    id: "2",
    title: "Wedding Album",
    description: "Sarah & John's special day",
    status: "draft" as const,
    thumbnail: "/placeholder.svg?height=300&width=400",
    updatedAt: "1 week ago",
  },
  {
    id: "3",
    title: "Baby's First Year",
    description: "Milestones and memories",
    status: "published" as const,
    thumbnail: "/placeholder.svg?height=300&width=400",
    updatedAt: "3 days ago",
  },
  {
    id: "4",
    title: "Travel Adventures",
    description: "Europe backpacking trip",
    status: "draft" as const,
    thumbnail: "/placeholder.svg?height=300&width=400",
    updatedAt: "5 days ago",
  },
]

interface ProjectGridProps {
  showEmpty?: boolean
}

export function ProjectGrid({ showEmpty = false }: ProjectGridProps) {
  if (showEmpty) {
    return <EmptyState />
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {mockProjects.map((project) => (
        <ProjectCard key={project.id} project={project} />
      ))}
    </div>
  )
}
