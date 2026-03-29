"use client"

import { useState, useMemo } from "react"
import type { DashboardProject } from "@/hooks/useProjectsQuery"
import { Search, Plus, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Skeleton } from "@/components/ui/skeleton"
import { ProjectCard } from "@/components/layout/dashboard/project-card"
import { EmptyState } from "@/components/layout/dashboard/empty-state"
import { NewProjectModal } from "@/components/layout/dashboard/new-project-modal"
import { useActiveProjectsQuery, useTrashedProjectsQuery } from "@/hooks/useProjectsQuery"

function NoResults() {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <div className="flex size-14 items-center justify-center rounded-2xl bg-secondary">
        <Search className="size-6 text-muted-foreground" />
      </div>
      <h3 className="mt-5 font-serif text-xl">No projects match your filters</h3>
      <p className="mt-2 text-sm text-muted-foreground">Try adjusting your search or filter criteria.</p>
    </div>
  )
}

function TrashEmpty() {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <div className="flex size-14 items-center justify-center rounded-2xl bg-secondary">
        <Trash2 className="size-6 text-muted-foreground" />
      </div>
      <h3 className="mt-5 font-serif text-xl">Trash is empty</h3>
      <p className="mt-2 text-sm text-muted-foreground">Deleted projects will appear here before being permanently removed.</p>
    </div>
  )
}
export default function ProjectsPage() {
  const [view, setView] = useState<"active" | "trash">("active")
  const { data: activeProjects = [], isLoading } = useActiveProjectsQuery()
  const { data: trashedProjects = [], isLoading: trashLoading } = useTrashedProjectsQuery({ enabled: view === "trash" })
  const [modalOpen, setModalOpen] = useState(false)
  const [typeFilter, setTypeFilter] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")

  const filteredActive = useMemo(() => 
    activeProjects.filter((p) => {
      const matchesType = typeFilter === "all" || p.mode === typeFilter.replace('s', '')
      const matchesSearch = !searchQuery || p.name.toLowerCase().includes(searchQuery.toLowerCase())
      return matchesType && matchesSearch
    }), [activeProjects, typeFilter, searchQuery]
  )

  const filteredTrash = useMemo(() => 
    trashedProjects.filter((p) => !searchQuery || p.name.toLowerCase().includes(searchQuery.toLowerCase())),
    [trashedProjects, searchQuery]
  )

  return (
    <div className="mx-auto max-w-6xl space-y-6 md:px-4 md:py-8">
      
      {/* Header */}
      <div className="flex flex-wrap gap-4 items-center justify-between border-b pb-6">
        <div className="flex items-baseline gap-3">
          <h1 className="font-serif text-3xl md:text-5xl tracking-tight">Projects</h1>
          <span className="text-xs text-muted-foreground font-medium uppercase tracking-wider">
            {view === "active" ? activeProjects.length : trashedProjects.length} Total
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-2 min-w-0">
          {/* Search */}
          <div className="relative w-full sm:w-auto sm:flex-1 sm:min-w-[180px] sm:max-w-xs">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground/60" />
            <Input
              placeholder={view === "active" ? "Search projects..." : "Search trash..."}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-10 rounded-full pl-9 bg-muted/50 border-none focus-visible:ring-1"
            />
          </div>

          {/* Фильтр типа (Выпадающее меню вместо Tabs) */}
          {view === "active" && (
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="h-10 w-[140px] rounded-full bg-muted/50 border-none">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent align="end" className="rounded-xl">
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="photobooks">Memory Books</SelectItem>
                <SelectItem value="portfolios">Portfolios</SelectItem>
              </SelectContent>
            </Select>
          )}

          <div className="flex items-center gap-1 ml-1 border-l pl-2">
            {view === "active" && (
              <Button
                size="icon"
                className="size-10 rounded-full shadow-md transition-transform hover:scale-105"
                onClick={() => setModalOpen(true)}
              >
                <Plus className="size-5" />
              </Button>
            )}
            
            <Button
              variant={view === "trash" ? "secondary" : "ghost"}
              size="icon"
              className="size-10 rounded-full text-muted-foreground"
              onClick={() => { setView((v) => v === "trash" ? "active" : "trash"); setSearchQuery("") }}
            >
              <Trash2 className="size-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Контентная область */}
      <main className="min-h-[400px]">
        {isLoading || (view === "trash" && trashLoading) ? (
          <div className="grid grid-cols-2 gap-6 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="space-y-3">
                <Skeleton className="aspect-[4/3] w-full rounded-2xl" />
                <Skeleton className="h-4 w-2/3" />
              </div>
            ))}
          </div>
        ) : view === "trash" ? (
          filteredTrash.length === 0 ? <TrashEmpty /> : (
            <div className="grid grid-cols-2 gap-6 lg:grid-cols-3">
              {filteredTrash.map((p) => <ProjectCard key={p.id} project={p} trash />)}
            </div>
          )
        ) : activeProjects.length === 0 ? (
          <EmptyState />
        ) : filteredActive.length === 0 ? (
          <NoResults />
        ) : (
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-3">
            {filteredActive.map((p) => <ProjectCard key={p.id} project={p} />)}
          </div>
        )}
      </main>

      <NewProjectModal open={modalOpen} onOpenChange={setModalOpen} />
    </div>
  )
}