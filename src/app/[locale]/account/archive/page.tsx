"use client"

import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import { Archive, Trash2, AlertTriangle, Globe, BookOpen, Layout, Loader2, ArrowUpRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { useArchivedProjectsQuery, type DashboardProject } from "@/hooks/useProjectsQuery"
import { useForceDeleteMutation } from "@/hooks/useProjectMutations"
import { projectKeys } from "@/hooks/useProjectsQuery"
import { useQueryClient } from "@tanstack/react-query"
import { useUserStore } from "@/hooks/useUserStore"
import { getPublishedProjectShareUrl } from "@/lib/slug"

const modeConfig = {
  portfolio: { icon: Layout, label: "Portfolio" },
  photobook: { icon: BookOpen, label: "Memory Book" },
}

function getShareUrl(project: DashboardProject): string | null {
  return getPublishedProjectShareUrl(project)
}

// ─── Row ──────────────────────────────────────────────────────────────────────
function ArchiveRow({
  project,
  onDelete,
}: {
  project: DashboardProject
  onDelete: (project: DashboardProject) => void
}) {
  const params = useParams()
  const router = useRouter()
  const locale = params.locale as string
  const shareUrl = getShareUrl(project)
  
  const ModeIcon = modeConfig[project.mode].icon

  return (
    <div className="flex items-center justify-between gap-4 border-b border-border/40 py-4 last:border-0 px-2 hover:bg-muted/30 rounded-xl transition-colors group">
      {/* Левая часть: Иконка и Основная информация */}
      <div className="flex items-center gap-3 min-w-0">
        <div className="flex size-9 shrink-0 items-center justify-center rounded-lg border border-border/60 bg-muted/50 text-muted-foreground group-hover:bg-background transition-colors">
          <ModeIcon className="size-4.5" />
        </div>
        <div className="flex flex-col min-w-0">
          <span className="truncate text-sm font-medium text-foreground tracking-tight">
            {project.name}
          </span>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-[11px] text-muted-foreground font-medium">
              {modeConfig[project.mode].label}
            </span>
            <span className="text-border/80 text-[10px]">•</span>
            {project.isPublished ? (
              <span className="inline-flex items-center gap-1 text-[11px] text-emerald-600 dark:text-emerald-500 font-medium">
                <span className="size-1.5 rounded-full bg-emerald-500" />
                Published
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 text-[11px] text-muted-foreground/60 font-medium">
                <span className="size-1.5 rounded-full bg-muted-foreground/30" />
                Offline
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Правая часть: Утилитарные действия */}
      <div className="flex items-center gap-1">
        {shareUrl && (
          <Button
            variant="ghost"
            size="icon"
            className="size-8 text-muted-foreground hover:text-foreground hover:bg-muted transition-colors rounded-lg"
            onClick={() => window.open(shareUrl, "_blank")}
            title="Live site"
          >
            <Globe className="size-4" />
          </Button>
        )}
        <Button
          variant="ghost"
          size="icon"
          className="size-8 text-muted-foreground hover:text-foreground hover:bg-muted transition-colors rounded-lg"
          onClick={() => router.push(`/${locale}/design/${project.id}/edit`)}
          title="Manage"
        >
          <ArrowUpRight className="size-4" />
        </Button>
        
        <div className="w-[1px] h-4 bg-border/60 mx-1" />

        <Button
          variant="ghost"
          size="icon"
          className="size-8 text-muted-foreground/50 hover:text-destructive hover:bg-destructive/10 transition-colors rounded-lg"
          onClick={() => onDelete(project)}
          title="Delete permanently"
        >
          <Trash2 className="size-4" />
        </Button>
      </div>
    </div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function ArchiveSettingsPage() {
  const { data: projects = [], isLoading } = useArchivedProjectsQuery()
  const forceDelete = useForceDeleteMutation()
  const queryClient = useQueryClient()
  const uid = useUserStore((s) => s.profile?.uid ?? null)

  const [target, setTarget] = useState<DashboardProject | null>(null)

  function handleDelete(project: DashboardProject) {
    setTarget(project)
  }

  function confirmDelete() {
    if (!target) return
    forceDelete.mutate(target.id, {
      onSuccess: () => {
        if (uid) void queryClient.invalidateQueries({ queryKey: projectKeys.archived(uid) })
        setTarget(null)
      },
      onError: () => setTarget(null),
    })
  }

  const [isOpen, setIsOpen] = useState(false)

useEffect(() => {
  setIsOpen(!!target)
}, [target])

const handleClose = () => {
  setIsOpen(false)
  setTimeout(() => setTarget(null), 200) // Очищаем target после анимации
}

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div className="space-y-1">
        <h2 className="font-serif text-2xl md:text-3xl tracking-tight text-foreground">Archive</h2>
        <p className="text-sm text-muted-foreground max-w-2xl">
          Exported projects live here. You can edit and re-export them at any time.
        </p>
      </div>

      {/* Warning note (Перенесена наверх, стала чище) */}
      <div className="flex items-start gap-3 rounded-xl border-1 border-amber-500/20 bg-amber-50/90 p-3.5 dark:bg-amber-950/10">
        <AlertTriangle className="mt-0.5 size-4 shrink-0 text-amber-600 dark:text-amber-500" />
        <p className="text-xs text-amber-800 dark:text-amber-300/90 leading-relaxed">
          Deleting permanently removes all files and unpublishes the site. 
          <strong> Credits spent on export are not refunded.</strong>
        </p>
      </div>

      {/* List Container */}
      <div className="rounded-2xl border border-border/50 bg-card p-2 shadow-xs">
        {isLoading ? (
          <div className="space-y-1">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center gap-4 py-4 px-3">
                <Skeleton className="size-9 rounded-lg" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-44" />
                  <Skeleton className="h-3 w-24" />
                </div>
              </div>
            ))}
          </div>
        ) : projects.length === 0 ? (
          <div className="flex flex-col items-center gap-2 py-16 text-center">
            <div className="flex size-12 items-center justify-center rounded-full bg-muted/40 text-muted-foreground/40">
              <Archive className="size-5" />
            </div>
            <p className="text-sm font-medium text-muted-foreground mt-1">No archived projects yet.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-0.5">
            {projects.map((project) => (
              <ArchiveRow key={project.id} project={project} onDelete={handleDelete} />
            ))}
          </div>
        )}
      </div>

      {/* Confirm delete dialog */}
    <Dialog open={isOpen} onOpenChange={(open) => { if (!open) handleClose() }}>
        <DialogContent className="max-w-md rounded-2xl border-border/60 bg-card p-6 shadow-xl">
          <DialogHeader className="space-y-4">
            
            {/* Иконка и Заголовок */}
            <div className="flex flex-col items-start gap-4 flex-row items-center">
              <div className="flex size-10 shrink-0 items-center justify-center rounded-xl border border-destructive/20 bg-destructive/5 shadow-sm">
                <AlertTriangle className="size-4 text-destructive" />
              </div>
              <div className="space-y-0.5 pt-1">
                <DialogTitle className="font-serif text-xl tracking-tight text-foreground">
                  Delete archived project?
                </DialogTitle>
              </div>
            </div>

            {/* Описание и предупреждения */}
            <DialogDescription className="space-y-4 pt-2 text-sm leading-relaxed text-muted-foreground/90">
              <p>
                Project <strong className="font-semibold text-foreground">&ldquo;{target?.name}&rdquo;</strong> will be permanently deleted. All exported files and storage data will be removed.
              </p>

              {target?.isPublished && (
                <div className="border-l-2 border-destructive/60 pl-3 py-0.5 text-xs text-destructive/90 font-medium leading-normal">
                  This project is currently published. The live site will go offline immediately.
                </div>
              )}

              <p className="text-xs text-muted-foreground/60 block pt-1">
                Reminder: Credits spent on export will not be refunded.
              </p>
            </DialogDescription>
          </DialogHeader>

          {/* Кнопки управления */}
          <DialogFooter className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end sm:gap-3 mt-6">
            <Button
              variant="outline"
              className="rounded-full px-5 h-10 text-sm font-medium border-border/80 hover:bg-secondary/50 transition-colors"
              onClick={handleClose} 
              disabled={forceDelete.isPending}
            >
              Cancel
            </Button>
            <Button
              variant="outline"
              className="rounded-full px-5 h-10 text-sm font-medium border-destructive/30 text-destructive hover:bg-destructive hover:text-destructive-foreground transition-all duration-200"
              onClick={confirmDelete}
              disabled={forceDelete.isPending}
            >
              {forceDelete.isPending ? (
                <>
                  <Loader2 className="mr-2 size-4 animate-spin" />
                  Deleting…
                </>
              ) : (
                "Delete permanently"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}