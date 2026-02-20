"use client"

import { useState } from "react"
import { Plus, Search, BookOpen, Layout, FolderOpen } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ProjectCard } from "@/components/layout/dashboard/project-card"
import { EmptyState } from "@/components/layout/dashboard/empty-state"

const mockProjects = [
  { id: "1", title: "Summer Vacation 2024", type: "photobook" as const, status: "published" as const, thumbnail: "/placeholder.svg?height=200&width=320", updatedAt: "2 hours ago" },
  { id: "2", title: "Wedding Album", type: "photobook" as const, status: "draft" as const, thumbnail: "/placeholder.svg?height=200&width=320", updatedAt: "Yesterday" },
  { id: "3", title: "Photography Portfolio", type: "site" as const, status: "published" as const, thumbnail: "/placeholder.svg?height=200&width=320", updatedAt: "3 days ago" },
  { id: "4", title: "Family Memories", type: "photobook" as const, status: "published" as const, thumbnail: "/placeholder.svg?height=200&width=320", updatedAt: "1 week ago" },
  { id: "5", title: "Travel Blog", type: "site" as const, status: "draft" as const, thumbnail: "/placeholder.svg?height=200&width=320", updatedAt: "2 weeks ago" },
  { id: "6", title: "Baby's First Year", type: "photobook" as const, status: "published" as const, thumbnail: "/placeholder.svg?height=200&width=320", updatedAt: "1 month ago" },
]

function NoResults() {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="flex size-12 items-center justify-center rounded-xl bg-secondary">
        <Search className="size-5 text-primary" />
      </div>
      <h3 className="mt-4 font-serif text-xl">No projects match your filters</h3>
      <p className="mt-2 text-sm text-muted-foreground">Try adjusting your search or filter criteria.</p>
    </div>
  )
}

export function ProjectsPage() {
  const [activeTab, setActiveTab] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")

  const filteredProjects = mockProjects.filter((p) => {
    const matchesTab = activeTab === "all" || (activeTab === "photobooks" && p.type === "photobook") || (activeTab === "sites" && p.type === "site")
    const matchesStatus = statusFilter === "all" || p.status === statusFilter
    const matchesSearch = !searchQuery || p.title.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesTab && matchesStatus && matchesSearch
  })

  const hasActiveFilters = activeTab !== "all" || statusFilter !== "all" || searchQuery !== ""

  return (
    <div className="mx-auto max-w-6xl space-y-10">

      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="font-serif text-2xl md:text-3xl">Projects</h1>
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

      {/* Filters */}
      {mockProjects.length > 0 && (
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="rounded-full bg-muted p-1">
              <TabsTrigger value="all" className="rounded-full px-5">All</TabsTrigger>
              <TabsTrigger value="photobooks" className="rounded-full px-5">Photobooks</TabsTrigger>
              <TabsTrigger value="sites" className="rounded-full px-5">Sites</TabsTrigger>
            </TabsList>
          </Tabs>

          <div className="flex gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-44 rounded-full pl-9"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-32 rounded-full">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent className="rounded-xl">
                <SelectItem value="all" className="rounded-lg">All Status</SelectItem>
                <SelectItem value="draft" className="rounded-lg">Draft</SelectItem>
                <SelectItem value="published" className="rounded-lg">Published</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      )}

      {/* Grid */}
      {mockProjects.length === 0 ? (
        <EmptyState />
      ) : filteredProjects.length === 0 ? (
        <NoResults />
      ) : (
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-3">
          {filteredProjects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      )}

    </div>
  )
}
