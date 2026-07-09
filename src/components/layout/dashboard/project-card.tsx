"use client"

import { memo, useMemo, useState } from "react"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import { MoreHorizontal, Edit, Trash2, Eye, EyeOff, BookOpen, Layout, RotateCcw, AlertTriangle, Settings, Camera } from "lucide-react"
import { Button } from "@/components/ui/button"
import { CardContent } from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import type { DashboardProject } from "@/hooks/useProjectsQuery"
import { useSoftDeleteMutation, useRestoreMutation, useForceDeleteMutation, useUnpublishMutation } from "@/hooks/useProjectMutations"
import { TemplatePreview } from "@/components/shared/template-preview"
import { useTranslations } from "next-intl"
import { getPublishedProjectShareUrl } from "@/lib/slug"

// ─── Helpers ──────────────────────────────────────────────────────────────

function formatRelativeDate(date: Date, t: ReturnType<typeof useTranslations>): string {
  const diff = Date.now() - date.getTime()
  const minutes = Math.floor(diff / 60_000)
  if (minutes < 1) return t('time.justNow')
  if (minutes < 60) return t('time.minutesAgo', { n: minutes })
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return t('time.hoursAgo', { n: hours })
  const days = Math.floor(hours / 24)
  if (days < 7) return t('time.daysAgo', { n: days })
  const weeks = Math.floor(days / 7)
  if (weeks < 5) return t('time.weeksAgo', { n: weeks })
  return t('time.monthsAgo', { n: Math.floor(days / 30) })
}

function deriveDisplayStatus(project: DashboardProject): "draft" | "published" {
  if (project.isPublished) return "published"
  return "draft"
}

function formatPurgeDate(date: Date): string {
  return date.toLocaleDateString(undefined, { day: "numeric", month: "long", year: "numeric" })
}

const modeConfig = {
  portfolio: { icon: Layout, labelKey: "project.mode.portfolio" },
  photobook: { icon: BookOpen, labelKey: "project.mode.photobook" },
  event:     { icon: Camera,   labelKey: "project.mode.event" },
}

const statusStyles = {
  draft: "bg-muted text-muted-foreground",
  published: "bg-primary/10 text-primary",
}

// ─── Component ────────────────────────────────────────────────────────────

interface ProjectCardProps {
  project: DashboardProject
  /** If true, renders the trash variant (restore + permanent delete) */
  trash?: boolean
  /** If true, renders the archive variant (edit only, delete redirects to settings) */
  archive?: boolean
  zoom?: number
}

function ProjectCardInner({ project, trash = false, archive = false, zoom }: ProjectCardProps) {
  const params = useParams()
  const router = useRouter()
  const locale = params.locale as string

  const softDeleteMutation = useSoftDeleteMutation()
  const restoreMutation = useRestoreMutation()
  const forceDeleteMutation = useForceDeleteMutation()
  const unpublishMutation = useUnpublishMutation()
  const busy = softDeleteMutation.isPending || restoreMutation.isPending || forceDeleteMutation.isPending
    || unpublishMutation.isPending
  const t = useTranslations()
  const [confirmOpen, setConfirmOpen] = useState(false)

  const modeInfo = modeConfig[project.mode]
  const displayStatus = deriveDisplayStatus(project)
  const editUrl = `/${locale}/design/${project.id}/edit`

  // Events now use the standard slug-based URL like photobook
  const viewUrl = getPublishedProjectShareUrl({
    mode: project.mode,
    isPublished: project.isPublished,
    publishedSlug: project.publishedSlug,
    publishedAccessToken: project.publishedAccessToken,
  })

  const thumbnail = useMemo(
    () => (
      <TemplatePreview
        themeId={project.preview?.themeId}
        templateId={project.preview?.templateId}
        heroImageUrl={project.preview?.heroImageUrl}
        title={project.preview?.title}
        subtitle={project.preview?.subtitle}
        date={project.preview?.date}
        aspectRatio={project.preview?.aspectRatio}
        frameStyle={project.preview?.frameStyle}
        cropData={project.preview?.cropData}
        zoom={zoom ?? 3.55}
      />
    ),
    [
      project.preview?.themeId,
      project.preview?.templateId,
      project.preview?.heroImageUrl,
      project.preview?.title,
      project.preview?.subtitle,
      project.preview?.date,
      project.preview?.aspectRatio,
      project.preview?.frameStyle,
      project.preview?.cropData,
      zoom,
    ]
  )

  function handleSoftDelete() {
    softDeleteMutation.mutate(project.id)
  }

  function handleRestore() {
    restoreMutation.mutate(project.id)
  }

  function handleForceDelete() {
    setConfirmOpen(false)
    forceDeleteMutation.mutate(project.id)
  }

  function handleUnpublish() {
    unpublishMutation.mutate(project.id)
  }

  if (archive) {
    return (
      <Link
        href={editUrl}
        prefetch
        className="group overflow-hidden rounded-2xl shadow-sm transition-all hover:shadow-md block"
      >
        <div className="relative aspect-[16/10] overflow-hidden rounded-t-2xl bg-muted">
          <div className="absolute inset-0">{thumbnail}</div>
          <div className="absolute inset-0 hidden md:flex items-center justify-center gap-2 bg-foreground/30 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
            <Button size="sm" className="rounded-full shadow-md" onClick={(e) => { e.preventDefault(); e.stopPropagation(); router.push(editUrl) }}>
              <Edit className="mr-1.5 size-3.5" />
              {t('project.edit')}
            </Button>
          </div>
          <div
            className="absolute right-2 top-2 md:opacity-0 md:transition-opacity md:duration-200 md:group-hover:opacity-100"
            onClick={(e) => e.preventDefault()}
          >
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="secondary" size="icon" className="size-8 rounded-full shadow-md">
                  <MoreHorizontal className="size-4" />
                  <span className="sr-only">{t('project.openMenu')}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="rounded-xl">
                <DropdownMenuItem className="cursor-pointer rounded-lg" onClick={() => router.push(editUrl)}>
                  <Edit className="mr-2 size-4" /> {t('project.edit')}
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="cursor-pointer rounded-lg"
                  onClick={() => router.push(`/${locale}/account/archive`)}
                >
                  <Settings className="mr-2 size-4" /> {t('project.manageInSettings')}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <div className="absolute bottom-2 left-2 flex items-center gap-1.5">
            <span className="flex items-center gap-1 rounded-full bg-background/80 px-2.5 py-0.5 text-xs font-medium backdrop-blur-sm">
              <modeInfo.icon className="size-3" />
              {t(modeInfo.labelKey)}
            </span>
            {project.isPublished && (
              <span className="inline-block rounded-full px-2.5 py-0.5 text-xs font-medium bg-primary/10 text-primary">
                {t('project.status.published')}
              </span>
            )}
          </div>
        </div>
        <CardContent className="p-3">
          <p className="truncate text-sm font-medium">{project.name}</p>
          <p className="mt-0.5 text-xs text-muted-foreground">{t('project.edited')} {formatRelativeDate(project.updatedAt, t)}</p>
        </CardContent>
      </Link>
    )
  }

  if (trash) {
    return (
      <>
        <div className="group overflow-hidden rounded-2xl shadow-sm border border-border/50 transition-opacity md:opacity-80 md:hover:opacity-100">
          {/* Thumbnail */}
          <div className="relative aspect-[16/10] overflow-hidden rounded-t-2xl bg-muted">
            <div className="absolute inset-0">{thumbnail}</div>
            {/* Overlay — desktop only */}
            <div className="absolute inset-0 hidden md:flex items-center justify-center gap-2 bg-foreground/30 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
              <Button
                size="sm"
                variant="secondary"
                className="rounded-full shadow-md"
                disabled={busy}
                onClick={handleRestore}
              >
                <RotateCcw className="mr-1.5 size-3.5" />
                {t('project.restore')}
              </Button>
              <Button
                size="sm"
                variant="destructive"
                className="rounded-full shadow-md"
                disabled={busy}
                onClick={() => setConfirmOpen(true)}
              >
                <Trash2 className="mr-1.5 size-3.5" />
                {t('project.delete')}
              </Button>
            </div>
            {/* Mode badge */}
            <div className="absolute bottom-2 left-2">
              <span className="flex items-center gap-1 rounded-full bg-background/80 px-2.5 py-0.5 text-xs font-medium backdrop-blur-sm">
                <modeInfo.icon className="size-3" />
                {t(modeInfo.labelKey)}
              </span>
            </div>
          </div>
          <CardContent className="p-3">
            <p className="truncate text-sm font-medium">{project.name}</p>
            <p className="mt-0.5 text-xs text-muted-foreground line-clamp-1">
              {project.purgeAt
                ? t('project.deletesOn', { date: formatPurgeDate(project.purgeAt) })
                : t('project.pendingPurge')}
            </p>
            {/* Mobile action row — desktop uses hover overlay */}
           {/* Mobile action row — desktop uses hover overlay */}
<div className="mt-2 flex gap-1.5 md:hidden">
  <Button
    size="sm"
    variant="outline"
    className="flex-1 h-8 rounded-full text-xs gap-1"
    disabled={busy}
    onClick={handleRestore}
  >
    <RotateCcw className="size-3" />
    {/* Скрываем текст на мобилке, показываем на md+ */}
    <span className="hidden md:inline">{t('project.restore')}</span>
  </Button>
  <Button
    size="sm"
    variant="destructive"
    className="flex-1 h-8 rounded-full text-xs gap-1"
    disabled={busy}
    onClick={() => setConfirmOpen(true)}
  >
    <Trash2 className="size-3" />
    {/* Скрываем текст на мобилке, показываем на md+ */}
    <span className="hidden md:inline">{t('project.delete')}</span>
  </Button>
</div>
          </CardContent>
        </div>

        {/* Confirm permanent delete dialog */}
        <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
          <DialogContent className="rounded-2xl sm:max-w-md">
            <DialogHeader>
              <div className="flex items-center gap-3">
                <div className="flex size-10 items-center justify-center rounded-full bg-destructive/10">
                  <AlertTriangle className="size-5 text-destructive" />
                </div>
                <DialogTitle>{t('project.confirmDeleteTitle')}</DialogTitle>
              </div>
              <DialogDescription className="pt-1">
                {t('project.confirmDeleteDescription', { name: project.name })}
              </DialogDescription>
            </DialogHeader>
            <DialogFooter className="gap-2 sm:gap-0">
              <Button variant="outline" className="rounded-full" onClick={() => setConfirmOpen(false)} disabled={busy}>
                {t('project.cancel')}
              </Button>
              <Button variant="destructive" className="rounded-full" onClick={handleForceDelete} disabled={busy}>
                {busy ? t('project.deleting') : t('project.deleteForever')}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </>
    )
  }

  return (
    <>
    <Link
      href={editUrl}
      prefetch
      className="group overflow-hidden rounded-2xl shadow-sm transition-all hover:shadow-md block"
    >
      {/* Thumbnail area */}
      <div className="relative aspect-[16/10] overflow-hidden rounded-t-2xl bg-muted">
        <div className="absolute inset-0">{thumbnail}</div>

        {/* Hover action overlay — desktop only */}
        <div className="absolute inset-0 hidden md:flex items-center justify-center gap-2 bg-foreground/30 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
          <Button size="sm" className="rounded-full shadow-md" onClick={(e) => { e.preventDefault(); e.stopPropagation(); router.push(editUrl) }}>
            <Edit className="mr-1.5 size-3.5" />
            {t('project.edit')}
          </Button>
          {project.isPublished && viewUrl && (
            <Button variant="secondary" size="sm" className="rounded-full shadow-md" onClick={(e) => { e.preventDefault(); e.stopPropagation(); window.open(viewUrl, '_blank') }}>
              <Eye className="mr-1.5 size-3.5" />
              {t('project.view')}
            </Button>
          )}
        </div>

        {/* More menu — always visible on mobile, hover on desktop */}
        <div
          className="absolute right-2 top-2 md:opacity-0 md:transition-opacity md:duration-200 md:group-hover:opacity-100"
          onClick={(e) => e.preventDefault()}
        >
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="secondary" size="icon" className="size-8 rounded-full shadow-md">
                <MoreHorizontal className="size-4" />
                <span className="sr-only">{t('project.openMenu')}</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="rounded-xl">
              {project.isPublished && viewUrl && (
                <DropdownMenuItem className="cursor-pointer rounded-lg" onClick={() => window.open(viewUrl, '_blank')}>
                  <Eye className="mr-2 size-4" /> {t('project.view')}
                </DropdownMenuItem>
              )}
              {/* Unpublish — all modes */}
              {project.isPublished && (
                <DropdownMenuItem className="cursor-pointer rounded-lg" disabled={busy} onClick={handleUnpublish}>
                  <EyeOff className="mr-2 size-4" /> {t('project.unpublish')}
                </DropdownMenuItem>
              )}
              <DropdownMenuItem className="cursor-pointer rounded-lg" onClick={() => router.push(editUrl)}>
                <Edit className="mr-2 size-4" /> {t('project.edit')}
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="cursor-pointer rounded-lg"
                variant="destructive"
                disabled={busy}
                onClick={handleSoftDelete}
              >
                <Trash2 className="mr-2 size-4" /> {t('project.moveToTrash')}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Bottom badges */}
        <div className="absolute bottom-2 left-2 flex items-center gap-1.5">
          <span className="flex items-center gap-1 rounded-full bg-background/80 px-2.5 py-0.5 text-xs font-medium backdrop-blur-sm">
            <modeInfo.icon className="size-3" />
            {t(modeInfo.labelKey)}
          </span>
          <span className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${statusStyles[displayStatus]}`}>
            {t(`project.status.${displayStatus}`)}
          </span>
        </div>
      </div>

      <CardContent className="p-3">
        <p className="truncate text-sm font-medium">{project.name}</p>
        <p className="mt-0.5 text-xs text-muted-foreground">{t('project.edited')} {formatRelativeDate(project.updatedAt, t)}</p>
      </CardContent>
    </Link>

  </>)
}

export const ProjectCard = memo(ProjectCardInner)

