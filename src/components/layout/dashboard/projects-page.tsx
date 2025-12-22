"use client"

import { useState } from "react"
import { Plus, Search, BookOpen, Layout, MoreHorizontal, Edit, Eye, Trash2, FolderOpen } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface Project {
  id: string
  title: string
  type: "photobook" | "site"
  status: "draft" | "published"
  thumbnail: string
  updatedAt: string
}

const mockProjects: Project[] = [
  {
    id: "1",
    title: "Summer Vacation 2024",
    type: "photobook",
    status: "published",
    thumbnail: "/placeholder.svg?height=200&width=320",
    updatedAt: "2 hours ago",
  },
  {
    id: "2",
    title: "Wedding Album",
    type: "photobook",
    status: "draft",
    thumbnail: "/placeholder.svg?height=200&width=320",
    updatedAt: "Yesterday",
  },
  {
    id: "3",
    title: "Photography Portfolio",
    type: "site",
    status: "published",
    thumbnail: "/placeholder.svg?height=200&width=320",
    updatedAt: "3 days ago",
  },
  {
    id: "4",
    title: "Family Memories",
    type: "photobook",
    status: "published",
    thumbnail: "/placeholder.svg?height=200&width=320",
    updatedAt: "1 week ago",
  },
  {
    id: "5",
    title: "Travel Blog",
    type: "site",
    status: "draft",
    thumbnail: "/placeholder.svg?height=200&width=320",
    updatedAt: "2 weeks ago",
  },
  {
    id: "6",
    title: "Baby's First Year",
    type: "photobook",
    status: "published",
    thumbnail: "/placeholder.svg?height=200&width=320",
    updatedAt: "1 month ago",
  },
]

const typeStyles = {
  photobook: "bg-primary/10 text-primary",
  site: "bg-secondary text-secondary-foreground",
}

const statusStyles = {
  draft: "bg-muted text-muted-foreground",
  published: "bg-emerald-100 text-emerald-700",
}

function ProjectCard({ project }: { project: Project }) {
  const TypeIcon = project.type === "photobook" ? BookOpen : Layout

  return (
    <Card className="group overflow-hidden rounded-2xl border-border/40 bg-card/90 backdrop-blur-sm shadow-sm transition-all duration-300 hover:border-primary/20 hover:shadow-lg hover:shadow-primary/5 hover:scale-[1.02]">
      <div className="relative aspect-16/10 overflow-hidden">
        <img
          src={project.thumbnail || "/placeholder.svg"}
          alt={project.title}
          className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-linear-to-t from-black/20 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

        {/* Hover actions */}
        <div className="absolute inset-0 flex items-center justify-center gap-2 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
          <Button size="sm" className="rounded-full shadow-lg">
            <Edit className="mr-1.5 size-3.5" />
            Edit
          </Button>
          <Button variant="secondary" size="sm" className="rounded-full shadow-lg">
            <Eye className="mr-1.5 size-3.5" />
            View
          </Button>
        </div>

        {/* More menu */}
        <div className="absolute right-2 top-2 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="secondary" size="icon" className="size-8 rounded-full shadow-md">
                <MoreHorizontal className="size-4" />
                <span className="sr-only">Open menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="rounded-xl">
              <DropdownMenuItem className="cursor-pointer rounded-lg">
                <Eye className="mr-2 size-4" />
                View
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer rounded-lg">
                <Edit className="mr-2 size-4" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="cursor-pointer rounded-lg" variant="destructive">
                <Trash2 className="mr-2 size-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Badges */}
        <div className="absolute bottom-2 left-2 flex gap-1.5">
          <Badge className={`${typeStyles[project.type]} rounded-full text-xs px-2.5 py-0.5`}>
            <TypeIcon className="mr-1 size-3" />
            {project.type === "photobook" ? "Photobook" : "Site"}
          </Badge>
          <Badge className={`${statusStyles[project.status]} rounded-full text-xs px-2.5 py-0.5`}>
            {project.status === "published" ? "Published" : "Draft"}
          </Badge>
        </div>
      </div>
      <CardContent className="p-4">
        <h3 className="truncate font-medium text-foreground">{project.title}</h3>
        <p className="mt-1 text-xs text-muted-foreground">Edited {project.updatedAt}</p>
      </CardContent>
    </Card>
  )
}

function EmptyState({ hasFilters }: { hasFilters: boolean }) {
  if (hasFilters) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="mb-4 flex size-16 items-center justify-center rounded-2xl bg-muted/50">
          <Search className="size-7 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-medium text-foreground">No projects match your filters</h3>
        <p className="mt-1 max-w-sm text-sm text-muted-foreground">
          Try adjusting your search or filter criteria to find what you're looking for.
        </p>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="mb-4 flex size-20 items-center justify-center rounded-3xl bg-primary/10">
        <FolderOpen className="size-9 text-primary" />
      </div>
      <h3 className="text-xl font-semibold text-foreground">You haven't created any projects yet</h3>
      <p className="mt-2 max-w-md text-muted-foreground">
        Start by creating your first photobook or portfolio site. It only takes a few minutes!
      </p>
      <Button size="lg" className="mt-6 rounded-full px-6">
        <Plus className="mr-2 size-4" />
        Create your first photobook
      </Button>
    </div>
  )
}

export function ProjectsPage() {
  const [activeTab, setActiveTab] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")

  // Filter projects
  const filteredProjects = mockProjects.filter((project) => {
    const matchesTab =
      activeTab === "all" ||
      (activeTab === "photobooks" && project.type === "photobook") ||
      (activeTab === "sites" && project.type === "site")

    const matchesStatus = statusFilter === "all" || project.status === statusFilter

    const matchesSearch = searchQuery === "" || project.title.toLowerCase().includes(searchQuery.toLowerCase())

    return matchesTab && matchesStatus && matchesSearch
  })

  const hasActiveFilters = activeTab !== "all" || statusFilter !== "all" || searchQuery !== ""
  const hasProjects = mockProjects.length > 0

  return (
    <div className="mx-auto max-w-6xl space-y-8">
      {/* Page header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Projects</h1>
          <p className="mt-1 text-muted-foreground">All your photo books and portfolio sites in one place</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="rounded-full bg-transparent">
            <Layout className="mr-2 size-4" />
            Create Site
          </Button>
          <Button className="rounded-full">
            <BookOpen className="mr-2 size-4" />
            Create Photobook
          </Button>
        </div>
      </div>

      {/* Filters and controls */}
      {hasProjects && (
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="rounded-full bg-muted/50 p-1">
              <TabsTrigger
                value="all"
                className="rounded-full px-4 data-[state=active]:bg-background data-[state=active]:shadow-sm"
              >
                All
              </TabsTrigger>
              <TabsTrigger
                value="photobooks"
                className="rounded-full px-4 data-[state=active]:bg-background data-[state=active]:shadow-sm"
              >
                Photobooks
              </TabsTrigger>
              <TabsTrigger
                value="sites"
                className="rounded-full px-4 data-[state=active]:bg-background data-[state=active]:shadow-sm"
              >
                Sites
              </TabsTrigger>
            </TabsList>
          </Tabs>

          <div className="flex gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search projects..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-48 rounded-full pl-9 bg-muted/30 border-border/40"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-32 rounded-full bg-muted/30 border-border/40">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent className="rounded-xl">
                <SelectItem value="all" className="rounded-lg">
                  All Status
                </SelectItem>
                <SelectItem value="draft" className="rounded-lg">
                  Draft
                </SelectItem>
                <SelectItem value="published" className="rounded-lg">
                  Published
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      )}

      {/* Projects grid or empty state */}
      {!hasProjects ? (
        <EmptyState hasFilters={false} />
      ) : filteredProjects.length === 0 ? (
        <EmptyState hasFilters={hasActiveFilters} />
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filteredProjects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      )}
    </div>
  )
}
