"use client"

import { useState, Suspense, useDeferredValue } from "react"
import { Search, Plus, Trash2, Archive, X } from "lucide-react"
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
  activeWidth,
  icon: Icon,
  currentView,
  onToggle,
  badge,
}: {
  id: View
  label: string
  activeWidth: string
  icon: React.ElementType
  currentView: View
  onToggle: () => void
  badge?: number
}) {
  const isActive = currentView === id
  return (
    <Button
      variant={isActive ? "secondary" : "ghost"}
      size="sm"
      className={`rounded-full text-muted-foreground relative h-8 overflow-hidden transition-all duration-200 ${
        isActive ? `${activeWidth} px-2.5` : "w-8 px-0"
      }`}
      onClick={onToggle}
    >
      <span className="shrink-0">
        {isActive ? <X className="size-3.5" /> : <Icon className="size-4" />}
      </span>

      {/* Рендерим текст только если кнопка активна */}
      {isActive && (
        <span className="text-xs font-medium whitespace-nowrap ml-1.5 transition-all duration-200">
          {label}
        </span>
      )}
      {badge !== undefined && badge > 0 && !isActive && (
        <span className="absolute -top-1 -right-1 flex size-4 items-center justify-center rounded-full bg-primary text-[9px] font-bold text-primary-foreground border-2 border-background">
          {badge > 9 ? "9+" : badge}
        </span>
      )}
    </Button>
  )
}

function NoResults() {
  const t = useTranslations()
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <div className="flex size-14 items-center justify-center rounded-2xl bg-secondary">
        <Search className="size-6 text-muted-foreground" />
      </div>
      <h3 className="mt-5 font-serif text-xl">{t('projects.noResultsTitle')}</h3>
      <p className="mt-2 text-sm text-muted-foreground">{t('projects.noResultsDescription')}</p>
    </div>
  )
}

function TrashEmpty() {
  const t = useTranslations()
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <div className="flex size-14 items-center justify-center rounded-2xl bg-secondary">
        <Trash2 className="size-6 text-muted-foreground" />
      </div>
      <h3 className="mt-5 font-serif text-xl">{t('projects.trashEmptyTitle')}</h3>
      <p className="mt-2 text-sm text-muted-foreground">{t('projects.trashEmptyDescription')}</p>
    </div>
  )
}

function ArchiveEmpty() {
  const t = useTranslations()
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <div className="flex size-14 items-center justify-center rounded-2xl bg-secondary">
        <Archive className="size-6 text-muted-foreground" />
      </div>
      <h3 className="mt-5 font-serif text-xl">{t('projects.archiveEmptyTitle')}</h3>
      <p className="mt-2 text-sm text-muted-foreground">{t('projects.archiveEmptyDescription')}</p>
    </div>
  )
}

function ProjectsGridSkeleton() {
  return (
    <div className="grid grid-cols-2 gap-6 lg:grid-cols-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="space-y-3">
          <Skeleton className="aspect-[4/3] w-full rounded-2xl" />
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
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-3">
      {filtered.map((p) => <ProjectCard key={p.id} project={p} />)}
    </div>
  )
}

function TrashContent({ uid, searchQuery }: { uid: string; searchQuery: string }) {
  const { data: projects } = useSuspenseDeletedProjectsQuery(uid)
  const filtered = projects.filter((p) => !searchQuery || p.name.toLowerCase().includes(searchQuery.toLowerCase()))
  if (filtered.length === 0) return <TrashEmpty />
  return (
    <div className="grid grid-cols-2 gap-6 lg:grid-cols-3">
      {filtered.map((p) => <ProjectCard key={p.id} project={p} trash />)}
    </div>
  )
}

function ArchiveContent({ uid, searchQuery }: { uid: string; searchQuery: string }) {
  const { data: projects } = useSuspenseArchivedProjectsQuery(uid)
  const filtered = projects.filter((p) => !searchQuery || p.name.toLowerCase().includes(searchQuery.toLowerCase()))
  if (filtered.length === 0) return <ArchiveEmpty />
  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-3">
      {filtered.map((p) => <ProjectCard key={p.id} project={p} archive />)}
    </div>
  )
}

export default function ProjectsPage() {
  const t = useTranslations()
  const [view, setView] = useState<View>("active")
  // Used only for counts/badges — shares the same cache entries as Suspense inner components
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

  return (
    <div className="mx-auto max-w-6xl space-y-6 md:px-4 md:py-8">
      
      {/* Header */}
        <div className="flex flex-col gap-4 border-b pb-6">
          {/* Row 1: Title and Count */}
          <div className="flex items-baseline gap-3">
            <h1 className="font-serif text-3xl md:text-5xl tracking-tight">
              {view === "active" ? t('projects.title') : view === "archive" ? t('archive.title') : t('projects.tabs.trash')}
            </h1>
            <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest bg-muted px-2 py-0.5 rounded-full">
              {t('projects.totalCount', { count: view === "active" ? activeProjects.length : view === "trash" ? trashedProjects.length : archivedProjects.length })}
            </span>
          </div>

          {/* Row 2: Search and Controls */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            
            {/* Search - Full width on mobile, limited on desktop */}
            <div className="relative w-full md:max-w-xs">
              <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground/60" />
              <Input
                placeholder={t('projects.searchPlaceholder')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-11 md:h-10 w-full rounded-full pl-9 bg-muted/50 border-none focus-visible:ring-1"
              />
            </div>

            {/* Controls Row: Filter (Left) and Actions (Right) */}
            <div className={`flex items-center ${view === "active" ? "justify-between" : "justify-end"} md:justify-end gap-2 w-full md:w-auto`}>
              
              {/* Type Filter */}
                {view === "active" ? (
                <Select value={typeFilter} onValueChange={setTypeFilter}>
                  <SelectTrigger className="h-10 w-[140px] rounded-full bg-muted/50 border-none">
                    <SelectValue placeholder={t('projects.typePlaceholder')} />
                  </SelectTrigger>
                  <SelectContent align="start" className="rounded-xl">
                    <SelectItem value="all">{t('projects.filters.all')}</SelectItem>
                    <SelectItem value="photobooks">{t('projects.filters.photobooks')}</SelectItem>
                    <SelectItem value="portfolios">{t('projects.filters.portfolios')}</SelectItem>
                  </SelectContent>
                </Select>
              ) : null}

              {/* Action Buttons */}
              <div className="flex items-center gap-1">
                {view === "active" && (
                  <Button
                    size="icon"
                    className="size-10 rounded-full shadow-md"
                    onClick={() => setModalOpen(true)}
                  >
                    <Plus className="size-5" />
                  </Button>
                )}
                
                <div className="flex items-center gap-1 bg-muted/40 p-1 rounded-full ml-1">
                  <ViewToggleButton
                    id="archive"
                    label={t('archive.title')}
                    activeWidth="w-[82px]"
                    icon={Archive}
                    currentView={view}
                    onToggle={() => { setView((v) => v === "archive" ? "active" : "archive"); setSearchQuery("") }}
                  />
                  <ViewToggleButton
                    id="trash"
                    label={t('projects.tabs.trash')}
                    activeWidth="w-[68px]"
                    icon={Trash2}
                    currentView={view}
                    onToggle={() => { setView((v) => v === "trash" ? "active" : "trash"); setSearchQuery("") }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

      {/* Контентная область */}
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