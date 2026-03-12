"use client"

import { useState } from "react"
import { Plus, Search, BookOpen, Layout, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Skeleton } from "@/components/ui/skeleton"
import { ProjectCard } from "@/components/layout/dashboard/project-card"
import { EmptyState } from "@/components/layout/dashboard/empty-state"
import { useProjects } from "@/hooks/useProjects"

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

function TrashEmpty() {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="flex size-12 items-center justify-center rounded-xl bg-secondary">
        <Trash2 className="size-5 text-muted-foreground" />
      </div>
      <h3 className="mt-4 font-serif text-xl">Trash is empty</h3>
      <p className="mt-2 text-sm text-muted-foreground">Deleted projects will appear here before being permanently removed.</p>
    </div>
  )
}

export function ProjectsPage() {
  const { activeProjects, trashedProjects, loading } = useProjects()
  const [view, setView] = useState<"active" | "trash">("active")
  const [activeTab, setActiveTab] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")

  const filteredActive = activeProjects.filter((p) => {
    const matchesTab =
      activeTab === "all" ||
      (activeTab === "photobooks" && p.mode === "photobook") ||
      (activeTab === "portfolios" && p.mode === "portfolio")
    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "draft" && !p.isPublished && p.status !== "archived") ||
      (statusFilter === "published" && p.isPublished) ||
      (statusFilter === "archived" && p.status === "archived")
    const matchesSearch = !searchQuery || p.name.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesTab && matchesStatus && matchesSearch
  })

  const filteredTrash = trashedProjects.filter((p) =>
    !searchQuery || p.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const showActiveFilters = view === "active" && (loading || activeProjects.length > 0)

  return (
    <div className="mx-auto max-w-6xl space-y-10">

      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="font-serif text-2xl md:text-3xl">Projects</h1>
          <p className="mt-1 text-muted-foreground">All your photo books and portfolio sites in one place</p>
        </div>
        <div className="flex gap-2">
          {view === "active" && (
            <>
              <Button variant="outline" className="rounded-full bg-transparent">
                <Layout className="mr-2 size-4" />
                Create Portfolio
              </Button>
              <Button className="rounded-full">
                <BookOpen className="mr-2 size-4" />
                Create Photobook
              </Button>
            </>
          )}
        </div>
      </div>

      {/* View switcher: Active / Trash */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <Tabs value={view} onValueChange={(v) => setView(v as "active" | "trash")}>
          <TabsList className="rounded-full bg-muted p-1">
            <TabsTrigger value="active" className="rounded-full px-5">Active</TabsTrigger>
            <TabsTrigger value="trash" className="rounded-full px-5 gap-2">
              <Trash2 className="size-3.5" />
              Trash
              {trashedProjects.length > 0 && (
                <span className="ml-1 flex size-4 items-center justify-center rounded-full bg-destructive/15 text-[10px] font-bold text-destructive">
                  {trashedProjects.length}
                </span>
              )}
            </TabsTrigger>
          </TabsList>
        </Tabs>

        {/* Active-only type/status filters */}
        {showActiveFilters && (
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="rounded-full bg-muted p-1">
                <TabsTrigger value="all" className="rounded-full px-4">All</TabsTrigger>
                <TabsTrigger value="photobooks" className="rounded-full px-4">Photobooks</TabsTrigger>
                <TabsTrigger value="portfolios" className="rounded-full px-4">Portfolios</TabsTrigger>
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
                  <SelectItem value="archived" className="rounded-lg">Archived</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        )}

        {/* Trash search */}
        {view === "trash" && trashedProjects.length > 0 && (
          <div className="relative">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search trash..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-44 rounded-full pl-9"
            />
          </div>
        )}
      </div>

      {/* Trash notice */}
      {view === "trash" && trashedProjects.length > 0 && (
        <p className="text-sm text-muted-foreground">
          Projects in trash are permanently deleted on the 1st of the scheduled month. You can restore them at any time before that.
        </p>
      )}

      {/* Grid */}
      {loading ? (
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="overflow-hidden rounded-2xl">
              <Skeleton className="aspect-[16/10] w-full rounded-t-2xl rounded-b-none" />
              <div className="p-3 space-y-2">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-1/2" />
              </div>
            </div>
          ))}
        </div>
      ) : view === "trash" ? (
        filteredTrash.length === 0 ? (
          <TrashEmpty />
        ) : (
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-3">
            {filteredTrash.map((project) => (
              <ProjectCard key={project.id} project={project} trash />
            ))}
          </div>
        )
      ) : activeProjects.length === 0 ? (
        <EmptyState />
      ) : filteredActive.length === 0 ? (
        <NoResults />
      ) : (
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-3">
          {filteredActive.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      )}

    </div>
  )
}
