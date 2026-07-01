"use client"

import { useState } from "react"
import { useTranslations } from "next-intl"
import { Archive, AlertTriangle, BookOpen, ChevronDown, Layout, Loader2, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { useArchivedProjectsQuery, projectKeys, type DashboardProject } from "@/hooks/useProjectsQuery"
import { useForceDeleteMutation } from "@/hooks/useProjectMutations"
import { useQueryClient } from "@tanstack/react-query"
import { useUserStore } from "@/hooks/useUserStore"
import { cn } from "@/lib/utils"

const modeIcons = {
  portfolio: Layout,
  photobook: BookOpen,
}

// ─── Accordion Item ───────────────────────────────────────────────────────────

function ArchiveItem({
  project,
  isOpen,
  onToggle,
  onDelete,
}: {
  project: DashboardProject
  isOpen: boolean
  onToggle: () => void
  onDelete: (project: DashboardProject) => void
}) {
  const t = useTranslations()
  const ModeIcon = modeIcons[project.mode]
  const modeLabel = project.mode === "portfolio"
    ? t("account.archive.modePortfolio")
    : t("account.archive.modePhotobook")

  return (
    <div
      className={cn(
        "overflow-hidden rounded-xl border border-border/50 transition-all duration-200",
        isOpen && "border-border/80 shadow-sm"
      )}
    >
      {/* Header row */}
      <button
        type="button"
        onClick={onToggle}
        className="flex w-full items-center justify-between gap-3 px-4 py-3.5 text-left transition-colors hover:bg-muted/30"
      >
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex size-8 shrink-0 items-center justify-center rounded-lg border border-border/60 bg-muted/50 text-muted-foreground">
            <ModeIcon className="size-3.5" />
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-medium tracking-tight">{project.name}</p>
            <div className="mt-0.5 flex items-center gap-2">
              <span className="text-[11px] text-muted-foreground">{modeLabel}</span>
              <span className="text-[10px] text-border/80">•</span>
              {project.isPublished ? (
                <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-600 dark:text-emerald-500">
                  <span className="size-1.5 rounded-full bg-emerald-500" />
                  {t("account.archive.statusPublished")}
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 text-[11px] text-muted-foreground/50">
                  <span className="size-1.5 rounded-full bg-muted-foreground/30" />
                  {t("account.archive.statusOffline")}
                </span>
              )}
            </div>
          </div>
        </div>
        <ChevronDown
          className={cn(
            "size-4 shrink-0 text-muted-foreground/50 transition-transform duration-200",
            isOpen && "rotate-180"
          )}
        />
      </button>

      {/* Expanded: Data & Privacy */}
      {isOpen && (
        <div className="border-t border-border/40 bg-muted/10 px-4 py-4">
          <p className="mb-3 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/50">
            {t("account.archive.dataPrivacyLabel")}
          </p>
          <div className="rounded-xl border border-destructive/20 bg-destructive/[0.03] p-4 space-y-3">
            <p className="text-sm leading-relaxed text-muted-foreground">
              {t("account.archive.deleteDescription")}
              {project.isPublished && t("account.archive.deleteDescriptionSuffix")}.
              {" "}{t("account.archive.deleteUndone")}
            </p>
            <Button
              variant="outline"
              size="sm"
              className="h-8 rounded-lg border-destructive/40 text-destructive text-xs transition-all duration-200 hover:bg-destructive hover:text-destructive-foreground"
              onClick={() => onDelete(project)}
            >
              <Trash2 className="mr-1.5 size-3.5" />
              {t("account.archive.deleteButton")}
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function ArchiveSettingsPage() {
  const t = useTranslations()
  const { data: projects = [], isLoading } = useArchivedProjectsQuery()
  const forceDelete = useForceDeleteMutation()
  const queryClient = useQueryClient()
  const uid = useUserStore((s) => s.profile?.uid ?? null)

  const [openId, setOpenId] = useState<string | null>(null)
  const [target, setTarget] = useState<DashboardProject | null>(null)
  const [confirmText, setConfirmText] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  function handleToggle(id: string) {
    setOpenId((prev) => (prev === id ? null : id))
  }

  function handleDelete(project: DashboardProject) {
    setTarget(project)
    setConfirmText("")
    setIsDialogOpen(true)
  }

  function confirmDelete() {
    if (!target || confirmText !== target.name) return
    forceDelete.mutate(target.id, {
      onSuccess: () => {
        if (uid) void queryClient.invalidateQueries({ queryKey: projectKeys.archived(uid) })
        setIsDialogOpen(false)
        setTimeout(() => { setTarget(null); setConfirmText("") }, 200)
      },
      onError: () => {
        setIsDialogOpen(false)
        setTimeout(() => setTarget(null), 200)
      },
    })
  }

  function handleDialogClose() {
    setIsDialogOpen(false)
    setTimeout(() => { setTarget(null); setConfirmText("") }, 200)
  }

  const canConfirm = confirmText === target?.name

  return (
    <div className="max-w-2xl space-y-6">
      {/* Header */}
      <div className="space-y-1">
        <h2 className="font-serif text-2xl md:text-3xl tracking-tight">{t("account.archive.title")}</h2>
        <p className="max-w-prose text-sm text-muted-foreground">
          {t("account.archive.subtitle")}
        </p>
      </div>

      {/* Warning */}
      <div className="flex items-start gap-3 rounded-xl border border-amber-500/20 bg-amber-50/90 p-3.5 dark:bg-amber-950/10">
        <AlertTriangle className="mt-0.5 size-4 shrink-0 text-amber-600 dark:text-amber-500" />
        <p className="text-xs leading-relaxed text-amber-800 dark:text-amber-300/90">
          {t("account.archive.warning")}{" "}
          <strong>{t("account.archive.warningCredits")}</strong>
        </p>
      </div>

      {/* Accordion list */}
      {isLoading ? (
        <div className="space-y-2">
          {[1, 2, 3].map((i) => (
            <div key={i} className="rounded-xl border border-border/40 px-4 py-3.5">
              <div className="flex items-center gap-3">
                <Skeleton className="size-8 rounded-lg" />
                <div className="flex-1 space-y-1.5">
                  <Skeleton className="h-3.5 w-40" />
                  <Skeleton className="h-3 w-24" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : projects.length === 0 ? (
        <div className="flex flex-col items-center gap-2 rounded-2xl border border-dashed border-border/50 py-16 text-center">
          <div className="flex size-12 items-center justify-center rounded-full bg-muted/40 text-muted-foreground/40">
            <Archive className="size-5" />
          </div>
          <p className="mt-1 text-sm text-muted-foreground">{t("account.archive.emptyState")}</p>
        </div>
      ) : (
        <div className="space-y-2">
          {projects.map((project) => (
            <ArchiveItem
              key={project.id}
              project={project}
              isOpen={openId === project.id}
              onToggle={() => handleToggle(project.id)}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      {/* Confirm delete dialog */}
      <Dialog open={isDialogOpen} onOpenChange={(open) => { if (!open) handleDialogClose() }}>
        <DialogContent className="max-w-md rounded-2xl p-6">
          <DialogHeader className="space-y-3">
            <div className="flex size-10 items-center justify-center rounded-xl border border-destructive/20 bg-destructive/5">
              <Trash2 className="size-4 text-destructive" />
            </div>
            <DialogTitle className="font-serif text-xl tracking-tight">
              {t("account.archive.dialog.title")}
            </DialogTitle>
            <DialogDescription asChild>
              <div className="space-y-3 text-sm leading-relaxed text-muted-foreground">
                <p>
                  {t("account.archive.dialog.bodyPre")}{" "}
                  <strong className="font-semibold text-foreground">&ldquo;{target?.name}&rdquo;</strong>{" "}
                  {t("account.archive.dialog.bodyPost")}
                </p>
                {target?.isPublished && (
                  <div className="border-l-2 border-destructive/50 py-0.5 pl-3 text-xs font-medium text-destructive/80">
                    {t("account.archive.dialog.publishedWarning")}
                  </div>
                )}
                <p className="text-xs text-muted-foreground/60">
                  {t("account.archive.dialog.creditsNote")}
                </p>
              </div>
            </DialogDescription>
          </DialogHeader>

          {/* Text confirmation input */}
          <div className="mt-4 space-y-2">
            <p className="text-xs text-muted-foreground">
              {t("account.archive.dialog.typeToConfirmPre")}{" "}
              <strong className="font-mono text-foreground">{target?.name}</strong>{" "}
              {t("account.archive.dialog.typeToConfirmPost")}
            </p>
            <Input
              value={confirmText}
              onChange={(e) => setConfirmText(e.target.value)}
              placeholder={target?.name ?? ""}
              className="h-9 rounded-lg font-mono text-sm"
              autoComplete="off"
              spellCheck={false}
            />
          </div>

          <DialogFooter className="mt-5 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
            <Button
              variant="outline"
              className="h-9 rounded-lg px-4 text-sm"
              onClick={handleDialogClose}
              disabled={forceDelete.isPending}
            >
              {t("account.archive.dialog.cancel")}
            </Button>
            <Button
              variant="destructive"
              className="h-9 rounded-lg px-4 text-sm disabled:opacity-40"
              onClick={confirmDelete}
              disabled={!canConfirm || forceDelete.isPending}
            >
              {forceDelete.isPending ? (
                <>
                  <Loader2 className="mr-2 size-3.5 animate-spin" />
                  {t("account.archive.dialog.deleting")}
                </>
              ) : (
                t("account.archive.dialog.deleteButton")
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}