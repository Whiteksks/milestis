"use client"

import { useState, useLayoutEffect, useEffect, useRef, useMemo } from "react"
import { useWindowVirtualizer } from "@tanstack/react-virtual"
import type { DashboardProject } from "@/hooks/useProjectsQuery"
import { Search, BookOpen, Layout, Trash2, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useCreateProject } from "@/hooks/useCreateProject"
import { Input } from "@/components/ui/input"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Skeleton } from "@/components/ui/skeleton"
import { ProjectCard } from "@/components/layout/dashboard/project-card"
import { EmptyState } from "@/components/layout/dashboard/empty-state"
import { useActiveProjectsQuery, useTrashedProjectsQuery } from "@/hooks/useProjectsQuery"
import { useTranslations } from "next-intl"

// ─── Virtual grid ─────────────────────────────────────────────────────────────

function VirtualProjectGrid({
  projects,
  trash = false,
}: {
  projects: DashboardProject[]
  trash?: boolean
}) {
  const parentRef = useRef<HTMLDivElement>(null)
  const [scrollMargin, setScrollMargin] = useState(0)
  const [cols, setCols] = useState(2)

  useLayoutEffect(() => {
    setScrollMargin(parentRef.current?.offsetTop ?? 0)
  }, [])

  useEffect(() => {
    const el = parentRef.current
    if (!el) return
    const obs = new ResizeObserver(([entry]) => {
      setCols(entry.contentRect.width >= 1024 ? 3 : 2)
    })
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  const rows = useMemo(() => {
    const result: DashboardProject[][] = []
    for (let i = 0; i < projects.length; i += cols) {
      result.push(projects.slice(i, i + cols))
    }
    return result
  }, [projects, cols])

  const virtualizer = useWindowVirtualizer({
    count: rows.length,
    estimateSize: () => 300,
    overscan: 3,
    scrollMargin,
  })

  return (
    <div ref={parentRef}>
      <div className="relative w-full" style={{ height: `${virtualizer.getTotalSize()}px` }}>
        {virtualizer.getVirtualItems().map((virtualRow) => (
          <div
            key={virtualRow.key}
            data-index={virtualRow.index}
            ref={virtualizer.measureElement}
            className="absolute top-0 left-0 w-full"
            style={{ transform: `translateY(${virtualRow.start - virtualizer.options.scrollMargin}px)` }}
          >
            <div className="grid grid-cols-2 gap-4 lg:grid-cols-3 pb-4">
              {rows[virtualRow.index].map((project) => (
                <ProjectCard
                  key={project.id}
                  project={project}
                  trash={trash}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

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
  const t = useTranslations()
  const [view, setView] = useState<"active" | "trash">("active")
  const { data: activeProjects = [], isLoading } = useActiveProjectsQuery()
  const { data: trashedProjects = [], isLoading: trashLoading } = useTrashedProjectsQuery({ enabled: view === 'trash' })
  const { handleCreate, loadingMode } = useCreateProject()
  const [activeTab, setActiveTab] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")

  const filteredActive = useMemo(
    () =>
      activeProjects.filter((p) => {
        const matchesTab =
          activeTab === "all" ||
          (activeTab === "photobooks" && p.mode === "photobook") ||
          (activeTab === "portfolios" && p.mode === "portfolio")
        const matchesStatus =
          statusFilter === "all" ||
          (statusFilter === "draft" && !p.isPublished) ||
          (statusFilter === "published" && p.isPublished)
        const matchesSearch = !searchQuery || p.name.toLowerCase().includes(searchQuery.toLowerCase())
        return matchesTab && matchesStatus && matchesSearch
      }),
    [activeProjects, activeTab, statusFilter, searchQuery]
  )

  const filteredTrash = useMemo(
    () => trashedProjects.filter((p) => !searchQuery || p.name.toLowerCase().includes(searchQuery.toLowerCase())),
    [trashedProjects, searchQuery]
  )

  const showActiveFilters = view === "active" && (isLoading || activeProjects.length > 0)

  return (
    <div className="mx-auto max-w-6xl space-y-10">

      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="font-serif text-2xl md:text-3xl">{t('projects.title')}</h1>
          <p className="mt-1 text-muted-foreground">{t('projects.description')}</p>
        </div>
        <div className="flex gap-2">
          {view === "active" && (
            <>
              <Button
                variant="outline"
                className="rounded-full bg-transparent gap-2"
                disabled={!!loadingMode}
                onClick={() => handleCreate("portfolio")}
              >
                {loadingMode === "portfolio" ? <Loader2 className="size-4 animate-spin" /> : <Layout className="size-4" />}
                {t('projects.createPortfolio')}
              </Button>
              <Button
                className="rounded-full gap-2"
                disabled={!!loadingMode}
                onClick={() => handleCreate("photobook")}
              >
                {loadingMode === "photobook" ? <Loader2 className="size-4 animate-spin" /> : <BookOpen className="size-4" />}
                {t('projects.createPhotobook')}
              </Button>
            </>
          )}
        </div>
      </div>

      {/* View switcher: Active / Trash */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <Tabs value={view} onValueChange={(v) => setView(v as "active" | "trash")}>
          <TabsList className="rounded-full bg-muted p-1">
              <TabsTrigger value="active" className="rounded-full px-5">{t('projects.tabs.active')}</TabsTrigger>
              <TabsTrigger value="trash" className="rounded-full px-5 gap-2">
                <Trash2 className="size-3.5" />
                {t('projects.tabs.trash')}
              </TabsTrigger>
            </TabsList>
        </Tabs>

        {/* Active-only type/status filters */}
        {showActiveFilters && (
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="rounded-full bg-muted p-1">
                <TabsTrigger value="all" className="rounded-full px-4">{t('projects.filters.all')}</TabsTrigger>
                <TabsTrigger value="photobooks" className="rounded-full px-4">{t('projects.filters.photobooks')}</TabsTrigger>
                <TabsTrigger value="portfolios" className="rounded-full px-4">{t('projects.filters.portfolios')}</TabsTrigger>
              </TabsList>
            </Tabs>

            <div className="flex gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder={t('projects.searchPlaceholder')}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-44 rounded-full pl-9"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-32 rounded-full">
                  <SelectValue placeholder={t('projects.statusPlaceholder')} />
                </SelectTrigger>
                <SelectContent className="rounded-xl">
                  <SelectItem value="all" className="rounded-lg">{t('projects.status.all')}</SelectItem>
                  <SelectItem value="draft" className="rounded-lg">{t('projects.status.draft')}</SelectItem>
                  <SelectItem value="published" className="rounded-lg">{t('projects.status.published')}</SelectItem>
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
                  placeholder={t('projects.searchTrashPlaceholder')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-44 rounded-full pl-9"
            />
          </div>
        )}
      </div>

      {/* Trash notice */}
      {view === "trash" && trashedProjects.length > 0 && (
        <p className="text-sm text-muted-foreground">{t('projects.trashNotice')}</p>
      )}

      {/* Grid */}
      {isLoading || (view === "trash" && trashLoading) ? (
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
          <VirtualProjectGrid
            projects={filteredTrash}
            trash
          />
        )
      ) : activeProjects.length === 0 ? (
        <EmptyState />
      ) : filteredActive.length === 0 ? (
        <NoResults />
      ) : (
          <VirtualProjectGrid projects={filteredActive} />
      )}

    </div>
  )
}
