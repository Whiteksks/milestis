"use client"

import { useState } from "react"
import { useRouter, useParams } from "next/navigation"
import { Archive, Trash2, AlertTriangle, Globe, BookOpen, Layout, Loader2 } from "lucide-react"
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

const BASE_DOMAIN = "milestis.site"

const modeConfig = {
  portfolio: { icon: Layout, label: "Portfolio" },
  photobook: { icon: BookOpen, label: "Memory Book" },
}

function getShareUrl(project: DashboardProject): string | null {
  if (!project.isPublished || !project.publishedSlug) return null
  if (project.mode === "portfolio") return `https://${project.publishedSlug}.${BASE_DOMAIN}`
  return `https://${BASE_DOMAIN}/${project.publishedSlug}`
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

  return (
    <div className="flex items-center justify-between gap-4 border-b border-border/50 py-3 last:border-0 px-1">
      {/* Левая часть: Основная информация */}
      <div className="flex flex-col min-w-0">
        <span className="truncate text-sm font-medium text-foreground">
          {project.name}
        </span>
        <div className="flex items-center gap-2 mt-0.5">
          <span className="text-[11px] text-muted-foreground font-medium uppercase tracking-tight">
            {modeConfig[project.mode].label}
          </span>
          <span className="text-border">•</span>
          {project.isPublished ? (
            <span className="text-[11px] text-emerald-600 dark:text-emerald-500 font-medium">
              Published
            </span>
          ) : (
            <span className="text-[11px] text-muted-foreground/60 font-medium">
              Offline
            </span>
          )}
        </div>
      </div>

      {/* Правая часть: Утилитарные действия */}
      <div className="flex items-center gap-2">
        {shareUrl && (
          <Button
            variant="ghost"
            size="sm"
            className="h-8 px-3 text-xs font-normal text-muted-foreground hover:text-foreground"
            onClick={() => window.open(shareUrl, "_blank")}
          >
            <Globe className="mr-1.5 size-3" />
            Live site
          </Button>
        )}
        <Button
          variant="secondary"
          size="sm"
          className="h-8 px-4 text-xs font-medium bg-secondary/50 hover:bg-secondary transition-colors"
          onClick={() => router.push(`/${locale}/design/${project.id}/edit`)}
        >
          Manage
        </Button>
        <div className="w-[1px] h-4 bg-border/60 mx-1" /> {/* Разделитель */}
        <Button
          variant="ghost"
          size="icon"
          className="size-8 text-muted-foreground/60 hover:text-destructive transition-colors"
          onClick={() => onDelete(project)}
        >
          <Trash2 className="size-3.5" />
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

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h2 className="font-serif text-2xl md:text-3xl">Archive</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Exported projects live here. You can edit and re-export them at any time.
          Deleting permanently removes all files and unpublishes the site.
        </p>
      </div>

      {/* List */}
      <div className="rounded-2xl bg-card shadow-sm border border-border/30">
        {isLoading ? (
          <div className="divide-y divide-border/30 p-2">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center gap-4 py-4 px-3">
                <Skeleton className="size-10 rounded-xl" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-40" />
                  <Skeleton className="h-3 w-20" />
                </div>
              </div>
            ))}
          </div>
        ) : projects.length === 0 ? (
          <div className="flex flex-col items-center gap-2 py-14 text-center">
            <Archive className="size-8 text-muted-foreground/40" />
            <p className="text-sm text-muted-foreground">No archived projects yet.</p>
          </div>
        ) : (
          <div className="px-4">
            {projects.map((project) => (
              <ArchiveRow key={project.id} project={project} onDelete={handleDelete} />
            ))}
          </div>
        )}
      </div>

      {/* Warning note */}
      <div className="flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4 dark:border-amber-900/40 dark:bg-amber-950/20">
        <AlertTriangle className="mt-0.5 size-4 shrink-0 text-amber-600 dark:text-amber-400" />
        <p className="text-xs text-amber-700 dark:text-amber-300 leading-relaxed">
          Deleting an archived project permanently removes all exported files, unpublishes the site,
          and frees up storage. <strong>Credits spent on export are not refunded.</strong>
        </p>
      </div>

      {/* Confirm delete dialog */}
      <Dialog open={!!target} onOpenChange={(open) => { if (!open) setTarget(null) }}>
        <DialogContent className="rounded-2xl sm:max-w-md">
          <DialogHeader>
            <div className="flex items-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-full bg-destructive/10">
                <AlertTriangle className="size-5 text-destructive" />
              </div>
              <DialogTitle>Delete archived project?</DialogTitle>
            </div>
            <DialogDescription className="pt-1">
              <strong>&ldquo;{target?.name}&rdquo;</strong> will be permanently deleted. All exported
              files and Storage data will be removed.
              {target?.isPublished && (
                <span className="block mt-2 font-medium text-destructive">
                  This project is currently published. The live site will go offline immediately.
                </span>
              )}
              <span className="block mt-2 text-muted-foreground">
                Credits spent on export will not be refunded.
              </span>
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              className="rounded-full"
              onClick={() => setTarget(null)}
              disabled={forceDelete.isPending}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              className="rounded-full"
              onClick={confirmDelete}
              disabled={forceDelete.isPending}
            >
              {forceDelete.isPending ? (
                <><Loader2 className="mr-2 size-4 animate-spin" /> Deleting…</>
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
