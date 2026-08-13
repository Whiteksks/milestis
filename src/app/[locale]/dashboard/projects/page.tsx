"use client"

import { useState, Suspense, useDeferredValue } from "react"
import { Search, Plus, Trash2, Archive, Folder } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Skeleton } from "@/components/ui/skeleton"
import { useShallow } from "zustand/react/shallow"
import { ProjectCard } from "@/components/layout/dashboard/project-card"
import { EmptyState } from "@/components/layout/dashboard/empty-state"
import { NewProjectModal } from "@/components/layout/dashboard/new-project-modal"
import {
  useActiveProjectsQuery,
  useArchivedProjectsQuery,
  useTrashedProjectsQuery,
  useSuspenseActiveProjectsQuery,
  useSuspenseDeletedProjectsQuery,
  useSuspenseArchivedProjectsQuery,
} from "@/hooks/useProjectsQuery"
import { selectAuthLoading, selectCurrentUid, useUserStore } from "@/hooks/useUserStore"
import { QueryErrorBoundary } from "@/components/shared/query-error-boundary"
import { useTranslations } from "next-intl"

type View = "active" | "trash" | "archive"

function ViewToggleButton({
  id,
  label,
  icon: Icon,
  currentView,
  onToggle,
  badge,
}: {
  id: View
  label: string
  icon: React.ElementType
  currentView: View
  onToggle: () => void
  badge?: number
}) {
  const isActive = currentView === id
  return (
    <button
      onClick={onToggle}
      className={`relative flex h-8 items-center gap-1.5 rounded-xs px-2.5 font-sans text-xs font-normal transition-all duration-200 sm:px-3 ${
        isActive
          ? "bg-secondary/70 text-secondary-foreground font-medium shadow-2xs"
          : "text-muted-foreground hover:bg-muted/40 hover:text-foreground"
      }`}
    >
      <Icon className="size-3.5 opacity-80" />
      <span>{label}</span>
      {badge !== undefined && badge > 0 && (
        <span
          className={`ml-0.5 flex h-4 min-w-4 items-center justify-center rounded-xs px-1 font-mono text-[10px] font-medium ${
            isActive
              ? "bg-foreground text-background"
              : "bg-secondary text-secondary-foreground"
          }`}
        >
          {badge > 99 ? "99+" : badge}
        </span>
      )}
    </button>
  )
}

function NoResults() {
  const t = useTranslations()
  return (
    <div className="flex flex-col items-center justify-center border border-dashed border-border/80 py-16 text-center md:py-24">
      <div className="flex size-12 items-center justify-center rounded-xs border border-border bg-secondary/30 text-secondary-foreground">
        <Search className="size-5" />
      </div>
      <h3 className="mt-4 font-serif text-xl font-medium">{t('projects.noResultsTitle')}</h3>
      <p className="mt-2 text-sm text-muted-foreground">{t('projects.noResultsDescription')}</p>
    </div>
  )
}

function TrashEmpty() {
  const t = useTranslations()
  return (
    <div className="flex flex-col items-center justify-center border border-dashed border-border/80 py-16 text-center md:py-24">
      <div className="flex size-12 items-center justify-center rounded-xs border border-border bg-secondary/30 text-secondary-foreground">
        <Trash2 className="size-5" />
      </div>
      <h3 className="mt-4 font-serif text-xl font-medium">{t('projects.trashEmptyTitle')}</h3>
      <p className="mt-2 text-sm text-muted-foreground">{t('projects.trashEmptyDescription')}</p>
    </div>
  )
}

function ArchiveEmpty() {
  const t = useTranslations()
  return (
    <div className="flex flex-col items-center justify-center border border-dashed border-border/80 py-16 text-center md:py-24">
      <div className="flex size-12 items-center justify-center rounded-xs border border-border bg-secondary/30 text-secondary-foreground">
        <Archive className="size-5" />
      </div>
      <h3 className="mt-4 font-serif text-xl font-medium">{t('projects.archiveEmptyTitle')}</h3>
      <p className="mt-2 text-sm text-muted-foreground">{t('projects.archiveEmptyDescription')}</p>
    </div>
  )
}

function ProjectsGridSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 md:gap-6">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="space-y-3 rounded-2xl border border-border/40 p-4">
          <Skeleton className="aspect-[4/3] w-full rounded-xl" />
          <Skeleton className="h-4 w-2/3" />
        </div>
      ))}
    </div>
  )
}

function ActiveContent({ uid, typeFilter, searchQuery }: { uid: string; typeFilter: string; searchQuery: string }) {
  const { data: projects } = useSuspenseActiveProjectsQuery(uid)
  const filtered = projects.filter((p) => {
    const matchesType = typeFilter === "all" || p.mode === typeFilter.replace('s', '')
    const matchesSearch = !searchQuery || p.name.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesType && matchesSearch
  })
  if (projects.length === 0) return <EmptyState />
  if (filtered.length === 0) return <NoResults />
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 md:gap-6">
      {filtered.map((p) => <ProjectCard key={p.id} project={p} />)}
    </div>
  )
}

function TrashContent({ uid, searchQuery }: { uid: string; searchQuery: string }) {
  const { data: projects } = useSuspenseDeletedProjectsQuery(uid)
  const filtered = projects.filter((p) => !searchQuery || p.name.toLowerCase().includes(searchQuery.toLowerCase()))
  if (filtered.length === 0) return <TrashEmpty />
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 md:gap-6">
      {filtered.map((p) => <ProjectCard key={p.id} project={p} trash />)}
    </div>
  )
}

function ArchiveContent({ uid, searchQuery }: { uid: string; searchQuery: string }) {
  const { data: projects } = useSuspenseArchivedProjectsQuery(uid)
  const filtered = projects.filter((p) => !searchQuery || p.name.toLowerCase().includes(searchQuery.toLowerCase()))
  if (filtered.length === 0) return <ArchiveEmpty />
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 md:gap-6">
      {filtered.map((p) => <ProjectCard key={p.id} project={p} archive />)}
    </div>
  )
}

export default function ProjectsPage() {
  const t = useTranslations()
  const [view, setView] = useState<View>("active")
  
  const { data: activeProjects = [] } = useActiveProjectsQuery()
  const { data: trashedProjects = [] } = useTrashedProjectsQuery({ enabled: view === "trash" })
  const { data: archivedProjects = [] } = useArchivedProjectsQuery({ enabled: view === "archive" })
  
  const [modalOpen, setModalOpen] = useState(false)
  const [typeFilter, setTypeFilter] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")
  const deferredSearch = useDeferredValue(searchQuery)

  const { uid, userLoading } = useUserStore(
    useShallow((state) => ({ uid: selectCurrentUid(state), userLoading: selectAuthLoading(state) }))
  )

  const currentCount = view === "active" ? activeProjects.length : view === "trash" ? trashedProjects.length : archivedProjects.length

  return (
    <div className="mx-auto max-w-6xl space-y-6 px-4 py-6 md:py-8">
      {/* Header */}
      <div className="flex flex-col gap-4 border-b border-border/80 pb-5 md:gap-6 md:pb-6">
        
        {/* Row 1: Title + Count (Left) and Dark Create Button (Right) */}
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-baseline gap-2.5 sm:gap-3">
            <h1 className="font-serif text-2xl font-medium tracking-tight sm:text-3xl md:text-5xl">
              {view === "active" ? t('projects.title') : view === "archive" ? t('archive.title') : t('projects.tabs.trash')}
            </h1>
            <span className="rounded-xs bg-secondary/80 px-2 py-0.5 font-mono text-[10px] font-semibold uppercase tracking-widest text-secondary-foreground border border-secondary sm:text-[11px]">
              {t('projects.totalCount', { count: currentCount })}
            </span>
          </div>

          {/* Dark Create Project Button — Mobile Icon / Desktop Full Text */}
          {view === "active" && (
            <Button
              onClick={() => setModalOpen(true)}
              className="h-9 rounded-xs bg-foreground px-3 text-xs font-medium text-background transition-colors hover:bg-foreground/90 sm:h-10 sm:px-4"
            >
              <Plus className="size-4 sm:mr-2" />
              <span className="hidden sm:inline">
                {t('projects.newProject', { defaultValue: 'Создать проект' })}
              </span>
            </Button>
          )}
        </div>

        {/* Row 2: Search + Select (Left) and View Switcher (Right) */}
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          
          {/* Search & Select Group — Row layout on mobile for compact fit */}
          <div className="flex items-center gap-2 flex-1">
            {/* Search Input */}
            <div className="relative flex-1 sm:max-w-xs">
              <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground/60" />
              <Input
                placeholder={t('projects.searchPlaceholder')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-9 sm:h-10 w-full rounded-xs border-border bg-background pl-9 font-sans text-xs placeholder:text-muted-foreground/50 focus-visible:ring-1 focus-visible:ring-foreground"
              />
            </div>

            {/* Type Filter Select */}
            {view === "active" ? (
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="h-9 sm:h-10 w-[120px] sm:w-[140px] shrink-0 rounded-xs border-border bg-background font-sans text-xs text-muted-foreground">
                  <SelectValue placeholder={t('projects.typePlaceholder')} />
                </SelectTrigger>
                <SelectContent align="end" className="rounded-xs border-border">
                  <SelectItem value="all" className="font-sans text-xs">{t('projects.filters.all')}</SelectItem>
                  <SelectItem value="photobooks" className="font-sans text-xs">{t('projects.filters.photobooks')}</SelectItem>
                  <SelectItem value="portfolios" className="font-sans text-xs">{t('projects.filters.portfolios')}</SelectItem>
                </SelectContent>
              </Select>
            ) : null}
          </div>

          {/* View Toggles (Right) — Clean horizontal bar on mobile */}
          <div className="inline-flex items-center gap-1 rounded-xs border border-border bg-background p-1 self-start sm:self-auto">
            <ViewToggleButton
              id="active"
              label={t('projects.title')}
              icon={Folder}
              currentView={view}
              onToggle={() => { setView("active"); setSearchQuery("") }}
            />
            <ViewToggleButton
              id="archive"
              label={t('archive.title')}
              icon={Archive}
              currentView={view}
              onToggle={() => { setView("archive"); setSearchQuery("") }}
            />
            <ViewToggleButton
              id="trash"
              label={t('projects.tabs.trash')}
              icon={Trash2}
              currentView={view}
              onToggle={() => { setView("trash"); setSearchQuery("") }}
            />
          </div>

        </div>
      </div>

      {/* Main Content Area */}
      <main className="min-h-[400px]">
        {userLoading || !uid ? (
          <ProjectsGridSkeleton />
        ) : (
          <QueryErrorBoundary>
            <Suspense fallback={<ProjectsGridSkeleton />}>
              {view === "active" && <ActiveContent uid={uid} typeFilter={typeFilter} searchQuery={deferredSearch} />}
              {view === "trash" && <TrashContent uid={uid} searchQuery={deferredSearch} />}
              {view === "archive" && <ArchiveContent uid={uid} searchQuery={deferredSearch} />}
            </Suspense>
          </QueryErrorBoundary>
        )}
      </main>

      <NewProjectModal open={modalOpen} onOpenChange={setModalOpen} />
    </div>
  )
}