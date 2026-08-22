"use client"

import { memo, useMemo, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { useParams, useRouter } from "next/navigation"
import { 
  MoreHorizontal, 
  Edit, 
  Trash2, 
  Eye, 
  EyeOff, 
  BookOpen, 
  Layout, 
  RotateCcw, 
  AlertTriangle, 
  Settings, 
  Camera 
} from "lucide-react"
import { Button } from "@/components/ui/button"
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

// ─── Event thumbnail ──────────────────────────────────────────────────────

export function EventThumbnail({ heroImageUrl, approvedCount }: { heroImageUrl?: string; approvedCount: number }) {
  const extra = approvedCount - 1
  return (
    <div className="relative size-full bg-muted">
      {heroImageUrl ? (
        <Image src={heroImageUrl} alt="" fill className="object-cover" unoptimized />
      ) : (
        <div className="absolute inset-0 flex items-center justify-center">
          <Camera className="size-8 stroke-[1.25] text-muted-foreground/40" />
        </div>
      )}
      {extra > 0 && (
        <span className="absolute bottom-2 right-2 rounded-md border border-border/60 bg-background/90 backdrop-blur-md px-2 py-0.5 text-[11px] font-medium text-foreground shadow-sm">
          +{extra}
        </span>
      )}
    </div>
  )
}

// ─── Main Component ────────────────────────────────────────────────────────

interface ProjectCardProps {
  project: DashboardProject
  trash?: boolean
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
  const busy = softDeleteMutation.isPending || restoreMutation.isPending || forceDeleteMutation.isPending || unpublishMutation.isPending
  
  const t = useTranslations()
  const [confirmOpen, setConfirmOpen] = useState(false)

  const modeInfo = modeConfig[project.mode]
  const ModeIcon = modeInfo.icon
  const displayStatus = deriveDisplayStatus(project)
  const editUrl = `/${locale}/design/${project.id}/edit`

  const viewUrl = getPublishedProjectShareUrl({
    mode: project.mode,
    isPublished: project.isPublished,
    publishedSlug: project.publishedSlug,
    publishedAccessToken: project.publishedAccessToken,
  })

  const thumbnail = useMemo(
    () => project.mode === 'event' ? (
      <EventThumbnail
        heroImageUrl={project.preview?.heroImageUrl}
        approvedCount={project.eventConfig?.approvedCount ?? 0}
      />
    ) : (
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
      project.mode,
      project.preview?.heroImageUrl,
      project.preview?.themeId,
      project.preview?.templateId,
      project.preview?.title,
      project.preview?.subtitle,
      project.preview?.date,
      project.preview?.aspectRatio,
      project.preview?.frameStyle,
      project.preview?.cropData,
      project.eventConfig?.approvedCount,
      zoom,
    ]
  )

  // ── ARCHIVE VARIANT ──────────────────────────────────────────────────────
  if (archive) {
    return (
      <div className="group relative flex flex-col overflow-hidden rounded-lg border border-border bg-card transition-all duration-200 hover:border-foreground/30 hover:shadow-sm">
        <Link href={editUrl} prefetch className="relative aspect-[16/10] w-full overflow-hidden bg-muted">
          {thumbnail}
        </Link>
        <div className="flex items-center justify-between border-t border-border/60 p-3">
          <div className="min-w-0 flex-1 pr-2">
            <Link href={editUrl} prefetch className="truncate text-sm font-medium hover:underline block text-foreground">
              {project.name}
            </Link>
            <p className="mt-0.5 text-xs text-muted-foreground">
              {t('project.edited')} {formatRelativeDate(project.updatedAt, t)}
            </p>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="size-8 shrink-0 rounded-md hover:bg-accent">
                <MoreHorizontal className="size-4" />
                <span className="sr-only">{t('project.openMenu')}</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="rounded-lg border-border">
              <DropdownMenuItem className="rounded-md cursor-pointer" onClick={() => router.push(editUrl)}>
                <Edit className="mr-2 size-4" /> {t('project.edit')}
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="rounded-md cursor-pointer"
                onClick={() => router.push(`/${locale}/account/archive`)}
              >
                <Settings className="mr-2 size-4" /> {t('project.manageInSettings')}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    )
  }

  // ── TRASH VARIANT ────────────────────────────────────────────────────────
  if (trash) {
    return (
      <>
        <div className="flex flex-col overflow-hidden rounded-lg border border-border bg-card">
          <div className="relative aspect-[16/10] w-full overflow-hidden bg-muted opacity-60">
            {thumbnail}
          </div>
          <div className="flex flex-col border-t border-border/60 p-3">
            <p className="truncate text-sm font-medium text-foreground">{project.name}</p>
            <p className="mt-0.5 text-xs text-destructive">
              {project.purgeAt
                ? t('project.deletesOn', { date: formatPurgeDate(project.purgeAt) })
                : t('project.pendingPurge')}
            </p>
            <div className="mt-3 flex gap-2">
              <Button
                size="sm"
                variant="outline"
                className="flex-1 rounded-md border-border text-xs"
                disabled={busy}
                onClick={() => restoreMutation.mutate(project.id)}
              >
                <RotateCcw className="mr-1.5 size-3.5" />
                {t('project.restore')}
              </Button>
              <Button
                size="sm"
                variant="destructive"
                className="flex-1 rounded-md text-xs"
                disabled={busy}
                onClick={() => setConfirmOpen(true)}
              >
                <Trash2 className="mr-1.5 size-3.5" />
                {t('project.delete')}
              </Button>
            </div>
          </div>
        </div>

        <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
          <DialogContent className="rounded-xl border-border sm:max-w-md">
            <DialogHeader>
              <div className="flex items-center gap-3">
                <div className="flex size-9 items-center justify-center rounded-full bg-destructive/10 text-destructive">
                  <AlertTriangle className="size-4.5" />
                </div>
                <DialogTitle className="text-base font-medium">{t('project.confirmDeleteTitle')}</DialogTitle>
              </div>
              <DialogDescription className="pt-2 text-xs text-muted-foreground">
                {t('project.confirmDeleteDescription', { name: project.name })}
              </DialogDescription>
            </DialogHeader>
            <DialogFooter className="gap-2 sm:gap-0">
              <Button
                variant="outline"
                className="rounded-md border-border text-xs"
                onClick={() => setConfirmOpen(false)}
                disabled={busy}
              >
                {t('project.cancel')}
              </Button>
              <Button
                variant="destructive"
                className="rounded-md text-xs"
                onClick={() => {
                  setConfirmOpen(false)
                  forceDeleteMutation.mutate(project.id)
                }}
                disabled={busy}
              >
                {busy ? t('project.deleting') : t('project.deleteForever')}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </>
    )
  }

  // ── STANDARD VARIANT ─────────────────────────────────────────────────────
  return (
    <div className="group relative flex flex-col overflow-hidden rounded-lg border border-border bg-card transition-all duration-200 hover:border-foreground/30 hover:shadow-sm">
      {/* Visual Thumbnail Area */}
      <Link href={editUrl} prefetch className="relative aspect-[16/10] w-full overflow-hidden bg-muted block">
        {thumbnail}
        
        {/* Editorial Soft Overlay on Hover */}
        <div className="absolute inset-0 hidden items-end justify-between bg-black/25 p-3 opacity-0 backdrop-blur-[2px] transition-all duration-200 group-hover:opacity-100 md:flex">
          <Button
            size="sm"
            className="rounded-md bg-background/90 text-foreground hover:bg-background text-xs shadow-sm backdrop-blur-md"
            onClick={(e) => {
              e.preventDefault()
              router.push(editUrl)
            }}
          >
            <Edit className="mr-1.5 size-3.5" />
            {t('project.edit')}
          </Button>

          {project.isPublished && viewUrl && (
            <Button
              size="sm"
              variant="secondary"
              className="rounded-md bg-background/90 text-foreground hover:bg-background text-xs shadow-sm backdrop-blur-md"
              onClick={(e) => {
                e.preventDefault()
                window.open(viewUrl, '_blank')
              }}
            >
              <Eye className="mr-1.5 size-3.5" />
              {t('project.view')}
            </Button>
          )}
        </div>
      </Link>

      {/* Metadata & Actions Box */}
      <div className="flex flex-col border-t border-border/60 p-3">
        <div className="flex items-start justify-between gap-2">
          <Link href={editUrl} prefetch className="truncate text-sm font-medium text-foreground hover:underline">
            {project.name}
          </Link>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="-mr-1.5 -mt-1 size-7 shrink-0 rounded-md hover:bg-accent">
                <MoreHorizontal className="size-4 text-muted-foreground" />
                <span className="sr-only">{t('project.openMenu')}</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="rounded-lg border-border">
              {project.isPublished && viewUrl && (
                <DropdownMenuItem className="rounded-md cursor-pointer" onClick={() => window.open(viewUrl, '_blank')}>
                  <Eye className="mr-2 size-4" /> {t('project.view')}
                </DropdownMenuItem>
              )}
              {project.isPublished && (
                <DropdownMenuItem className="rounded-md cursor-pointer" disabled={busy} onClick={() => unpublishMutation.mutate(project.id)}>
                  <EyeOff className="mr-2 size-4" /> {t('project.unpublish')}
                </DropdownMenuItem>
              )}
              <DropdownMenuItem className="rounded-md cursor-pointer" onClick={() => router.push(editUrl)}>
                <Edit className="mr-2 size-4" /> {t('project.edit')}
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="rounded-md cursor-pointer text-destructive focus:text-destructive"
                disabled={busy}
                onClick={() => softDeleteMutation.mutate(project.id)}
              >
                <Trash2 className="mr-2 size-4" /> {t('project.moveToTrash')}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Clean Single-Line Metadata Chain */}
        <div className="mt-1 flex items-center gap-1.5 text-xs text-muted-foreground truncate">
          <div className="flex items-center gap-1 shrink-0">
            <ModeIcon className="size-3.5 stroke-[1.5]" />
            <span className="capitalize">{t(modeInfo.labelKey)}</span>
          </div>

          <div className={`items-center gap-1.5 shrink-0 ${displayStatus === "draft" ? "hidden sm:flex" : "flex"}`}>
            <span className="text-muted-foreground/40">•</span>
            <span className={`size-1.5 rounded-full ${displayStatus === "published" ? "bg-emerald-500" : "bg-muted-foreground/40"}`} />
            <span className={displayStatus === "published" ? "text-foreground font-medium" : "text-muted-foreground"}>
              {t(`project.status.${displayStatus}`)}
            </span>
          </div>

          <span className="text-muted-foreground/40">•</span>

          <span className="truncate">{formatRelativeDate(project.updatedAt, t)}</span>
        </div>
      </div>
    </div>
  )
}

export const ProjectCard = memo(ProjectCardInner)