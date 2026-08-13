"use client"

import { useState, useMemo } from "react"
import Image from "next/image"
import { useTranslations, useTranslations as useGlobalT } from "next-intl"
import {
  Archive,
  AlertCircle,
  BookOpen,
  Camera,
  ChevronDown,
  Check,
  Layout,
  Loader2,
  Trash2,
  Globe,
  GlobeOff,
  Share2,
  Copy,
  ExternalLink,
} from "lucide-react"
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  useArchivedProjectsQuery,
  projectKeys,
  getProjectShareUrl,
  type DashboardProject,
} from "@/hooks/useProjectsQuery"
import { useForceDeleteMutation } from "@/hooks/useProjectMutations"
import { useQueryClient } from "@tanstack/react-query"
import { useUserStore } from "@/hooks/useUserStore"
import { cn } from "@/lib/utils"

const modeIcons = {
  portfolio: Layout,
  photobook: BookOpen,
  event:     Camera,
}

export default function ArchiveSettingsPage() {
  const t = useTranslations()
  const g = useGlobalT()
  const { data: projects = [], isLoading } = useArchivedProjectsQuery()
  const forceDelete = useForceDeleteMutation()
  const queryClient = useQueryClient()
  const uid = useUserStore((s) => s.profile?.uid ?? null)

  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [target, setTarget] = useState<DashboardProject | null>(null)
  const [confirmText, setConfirmText] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [copiedId, setCopiedId] = useState<string | null>(null)

  // Выбираем первый проект из списка по умолчанию
  const activeProject = useMemo(() => {
    if (!projects.length) return null
    return projects.find((p) => p.id === selectedId) ?? projects[0]
  }, [projects, selectedId])

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
        setSelectedId(null)
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

  const handleCopyLink = (project: DashboardProject) => {
    const url = getProjectShareUrl(project)
    if (!url) return
    navigator.clipboard.writeText(url)
    setCopiedId(project.id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  const canConfirm = confirmText === target?.name
  const ActiveModeIcon = activeProject ? modeIcons[activeProject.mode] ?? Layout : Layout
  const activeModeLabel = activeProject
    ? activeProject.mode === "portfolio"
      ? t("account.archive.modePortfolio")
      : t("account.archive.modePhotobook")
    : ""

  return (
    <div className="mx-auto max-w-5xl space-y-10 pb-12">
      {/* Header Section */}
      <section className="space-y-4">
        <div className="flex items-center gap-4">
          <h2 className="font-serif text-2xl font-medium tracking-tight text-foreground sm:text-3xl">
            {t("account.archive.title")}
          </h2>
          <span className="h-px flex-1 bg-border/80" />
        </div>
        <p className="font-sans text-sm text-muted-foreground">
          {t("account.archive.subtitle")}
        </p>

        {/* Warning Notice Banner */}
        <div className="flex items-start gap-3 rounded-xs border border-amber-500/30 bg-amber-500/5 p-4 font-sans text-sm text-amber-900/90 dark:text-amber-200/90">
          <AlertCircle className="mt-0.5 size-4 shrink-0 text-amber-600 dark:text-amber-400" />
          <p className="leading-relaxed">
            {t("account.archive.warning")}{" "}
            <strong className="font-semibold text-foreground">{t("account.archive.warningCredits")}</strong>
          </p>
        </div>

        {/* Main Interactive Selector Section */}
        {isLoading ? (
          <div className="space-y-3">
            <Skeleton className="h-16 w-full rounded-xs" />
            <Skeleton className="h-36 w-full rounded-xs" />
          </div>
        ) : projects.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-3 rounded-xs border border-dashed border-border bg-card/50 py-16 text-center">
            <div className="flex size-10 items-center justify-center rounded-xs border border-border bg-background text-muted-foreground">
              <Archive className="size-4" />
            </div>
            <p className="font-sans text-sm text-muted-foreground">{t("account.archive.emptyState")}</p>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Project Dropdown Trigger */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  type="button"
                  className="group flex w-full items-center justify-between gap-4 rounded-xs border border-border bg-card p-4 text-left transition-colors hover:bg-secondary/40 focus:outline-none focus-visible:ring-1 focus-visible:ring-foreground"
                >
                  {activeProject && (
                    <div className="flex min-w-0 items-center gap-3.5">
                      {/* Photo Preview Thumbnail */}
                      <div className="relative flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-xs border border-border bg-muted">
                        {activeProject.preview?.heroImageUrl ? (
                          <Image
                            src={activeProject.preview.heroImageUrl}
                            alt={activeProject.name}
                            fill
                            sizes="40px"
                            className="object-cover"
                          />
                        ) : (
                          <ActiveModeIcon className="size-5 text-foreground/80" />
                        )}
                      </div>

                      <div className="min-w-0 space-y-0.5">
                        <p className="truncate font-serif text-lg font-medium tracking-tight text-foreground">
                          {activeProject.name}
                        </p>
                        <div className="flex items-center gap-2 font-sans text-xs text-muted-foreground">
                          <span>{activeModeLabel}</span>
                          <span className="text-border">•</span>
                          {activeProject.isPublished ? (
                            <span className="inline-flex items-center gap-1.5 font-medium text-emerald-600 dark:text-emerald-400">
                              <Globe className="size-3.5" />
                              {t("account.archive.statusPublished")}
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1.5 text-muted-foreground">
                              <GlobeOff className="size-3.5" />
                              {t("account.archive.statusOffline")}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                  <div className="flex size-8 shrink-0 items-center justify-center rounded-xs border border-border text-muted-foreground transition-transform duration-200 group-data-[state=open]:rotate-180">
                    <ChevronDown className="size-4" />
                  </div>
                </button>
              </DropdownMenuTrigger>

              {/* Dropdown Menu Content */}
              <DropdownMenuContent
                align="end"
                className="w-[var(--radix-dropdown-menu-trigger-width)] rounded-xs border border-border bg-card p-1 shadow-md"
              >
                <div className="max-h-64 space-y-0.5 overflow-y-auto">
                  {projects.map((project) => {
                    const Icon = modeIcons[project.mode] ?? Layout
                    const isSelected = activeProject?.id === project.id
                    return (
                      <DropdownMenuItem
                        key={project.id}
                        onClick={() => setSelectedId(project.id)}
                        className={cn(
                          "flex cursor-pointer items-center justify-between rounded-xs px-3 py-2.5 font-sans text-sm transition-colors focus:bg-secondary/80 focus:text-foreground",
                          isSelected ? "bg-secondary font-medium text-foreground" : "text-muted-foreground"
                        )}
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          {/* Item Thumbnail */}
                          <div className="relative flex size-7 shrink-0 items-center justify-center overflow-hidden rounded-xs border border-border bg-muted">
                            {project.preview?.heroImageUrl ? (
                              <Image
                                src={project.preview.heroImageUrl}
                                alt={project.name}
                                fill
                                sizes="28px"
                                className="object-cover"
                              />
                            ) : (
                              <Icon className="size-3.5 text-foreground/80" />
                            )}
                          </div>
                          <span className="truncate">{project.name}</span>
                        </div>
                        {isSelected && <Check className="size-4 shrink-0 text-foreground" />}
                      </DropdownMenuItem>
                    )
                  })}
                </div>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Active Project Management Card */}
            {activeProject && (
              <div className="space-y-4 rounded-xs border border-border bg-card p-5 md:p-6">
                {/* Large Preview & Details Bar */}
                <div className="flex items-center gap-4 pb-2 border-b border-border/40">
                  <div className="relative size-14 shrink-0 overflow-hidden rounded-xs border border-border bg-muted">
                    {activeProject.preview?.heroImageUrl ? (
                      <Image
                        src={activeProject.preview.heroImageUrl}
                        alt={activeProject.name}
                        fill
                        sizes="56px"
                        className="object-cover"
                      />
                    ) : (
                      <div className="flex size-full items-center justify-center">
                        <ActiveModeIcon className="size-5 text-muted-foreground/50" />
                      </div>
                    )}
                  </div>
                  <div className="min-w-0 flex-1 space-y-1">
                    <h4 className="truncate font-serif text-base font-medium text-foreground">
                      {activeProject.name}
                    </h4>
                    {getProjectShareUrl(activeProject) && (
                      <p className="truncate font-sans text-xs text-muted-foreground">
                        {getProjectShareUrl(activeProject)}
                      </p>
                    )}
                  </div>
                </div>

                <div className="space-y-1.5">
                  <p className="font-sans text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                    {t("account.archive.dataPrivacyLabel")}
                  </p>
                  <p className="font-sans text-sm leading-relaxed text-muted-foreground">
                    {t("account.archive.deleteDescription")}
                    {activeProject.isPublished && t("account.archive.deleteDescriptionSuffix")}.
                    {" "}{t("account.archive.deleteUndone")}
                  </p>
                </div>

                <div className="flex items-center justify-between gap-3 border-t border-border/80 pt-4">
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-9 rounded-xs border-destructive/40 text-destructive font-sans text-xs font-medium hover:bg-destructive hover:text-destructive-foreground transition-colors"
                    onClick={() => handleDelete(activeProject)}
                  >
                    <Trash2 className="mr-1.5 size-3.5" />
                    {t("account.archive.deleteButton")}
                  </Button>

                  {/* Single Share Button (Фича из первого файла) */}
                  {getProjectShareUrl(activeProject) && (
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-9 rounded-xs font-sans text-xs text-muted-foreground hover:text-foreground"
                        >
                          <Share2 className="mr-1.5 size-3.5" />
                          {t("account.domains.shareVia") ?? "Поделиться"}
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-48 rounded-xs border border-border bg-card p-1 shadow-md">
                        <DropdownMenuItem
                          onClick={() => handleCopyLink(activeProject)}
                          className="cursor-pointer rounded-xs px-3 py-2 font-sans text-xs focus:bg-secondary/80"
                        >
                          {copiedId === activeProject.id ? (
                            <Check className="mr-2 size-3.5 text-emerald-600 dark:text-emerald-400" />
                          ) : (
                            <Copy className="mr-2 size-3.5" />
                          )}
                          {copiedId === activeProject.id
                            ? (t("account.domains.copied") ?? "Скопировано")
                            : (t("account.domains.copyLink") ?? "Скопировать ссылку")}
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => window.open(getProjectShareUrl(activeProject)!, "_blank")}
                          className="cursor-pointer rounded-xs px-3 py-2 font-sans text-xs focus:bg-secondary/80"
                        >
                          <ExternalLink className="mr-2 size-3.5" />
                          {t("account.domains.openProject") ?? "Открыть проект"}
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </section>

      {/* Confirm Delete Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={(open) => { if (!open) handleDialogClose() }}>
        <DialogContent className="max-w-xl rounded-xs border-border bg-card p-6 md:p-7 shadow-lg">
          <DialogHeader className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="flex size-9 shrink-0 items-center justify-center rounded-xs border border-destructive/30 bg-destructive/10 text-destructive">
                <Trash2 className="size-4.5" />
              </div>
              <DialogTitle className="font-serif text-xl font-medium tracking-tight text-foreground sm:text-2xl">
                {t("account.archive.dialog.title")}
              </DialogTitle>
            </div>

            <DialogDescription asChild>
              <div className="space-y-3.5 font-sans text-sm leading-relaxed text-muted-foreground">
                <p className="text-foreground/90">
                  {t("account.archive.dialog.bodyPre")}{" "}
                  <strong className="font-semibold text-foreground underline decoration-destructive/40 decoration-1 underline-offset-2">
                    &ldquo;{target?.name}&rdquo;
                  </strong>{" "}
                  {t("account.archive.dialog.bodyPost")}
                </p>

                {target?.isPublished && (
                  <div className="rounded-xs border border-destructive/30 bg-destructive/5 p-3 text-xs font-medium text-destructive">
                    {t("account.archive.dialog.publishedWarning")}
                  </div>
                )}

                <p className="text-xs text-muted-foreground/80">
                  {t("account.archive.dialog.creditsNote")}
                </p>
              </div>
            </DialogDescription>
          </DialogHeader>

          {/* Styled Input Box */}
          <div className="my-2 rounded-xs border border-border/80 bg-secondary/30 p-4 space-y-3">
            <p className="font-sans text-xs leading-normal text-muted-foreground">
              {t("account.archive.dialog.typeToConfirmPre")}{" "}
              <span className="font-semibold text-foreground">&ldquo;{target?.name}&rdquo;</span>{" "}
              {t("account.archive.dialog.typeToConfirmPost")}
            </p>
            <Input
              value={confirmText}
              onChange={(e) => setConfirmText(e.target.value)}
              placeholder={target?.name ?? ""}
              className="h-9 max-w-xs rounded-xs border-border bg-background font-sans text-sm focus-visible:ring-1 focus-visible:ring-foreground"
              autoComplete="off"
              spellCheck={false}
            />
          </div>

          <DialogFooter className="mt-2 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
            <Button
              variant="outline"
              size="sm"
              className="h-9 rounded-xs border-border px-4 font-sans text-xs hover:bg-secondary/60"
              onClick={handleDialogClose}
              disabled={forceDelete.isPending}
            >
              {t("account.archive.dialog.cancel")}
            </Button>
            <Button
              variant="destructive"
              size="sm"
              className="h-9 rounded-xs px-5 font-sans text-xs font-medium transition-colors disabled:opacity-40"
              onClick={confirmDelete}
              disabled={!canConfirm || forceDelete.isPending}
            >
              {forceDelete.isPending ? (
                <>
                  <Loader2 className="mr-1.5 size-3.5 animate-spin" />
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