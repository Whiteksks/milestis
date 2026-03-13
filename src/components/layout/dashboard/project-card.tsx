"use client"

import { useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { MoreHorizontal, Edit, Trash2, Eye, BookOpen, Layout, RotateCcw, AlertTriangle } from "lucide-react"
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
import type { DashboardProject } from "@/hooks/useProjects"
import { softDeleteProject } from "@/lib/delete-project"
import { restoreProject } from "@/lib/restore-project"
import { forceDeleteProject } from "@/lib/force-delete-project-api"
import { TemplatePreview } from "@/components/layout/dashboard/template-preview"
import { toastProject } from "@/lib/toast"

// ─── Helpers ──────────────────────────────────────────────────────────────

function formatRelativeDate(date: Date): string {
  const diff = Date.now() - date.getTime()
  const minutes = Math.floor(diff / 60_000)
  if (minutes < 1) return "Just now"
  if (minutes < 60) return `${minutes}m ago`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.floor(hours / 24)
  if (days < 7) return `${days}d ago`
  const weeks = Math.floor(days / 7)
  if (weeks < 5) return `${weeks}w ago`
  return `${Math.floor(days / 30)}mo ago`
}

function deriveDisplayStatus(project: DashboardProject): "draft" | "published" {
  if (project.isPublished) return "published"
  return "draft"
}

function formatPurgeDate(date: Date): string {
  return date.toLocaleDateString(undefined, { day: "numeric", month: "long", year: "numeric" })
}

const modeConfig = {
  portfolio: { icon: Layout, label: "Portfolio" },
  photobook: { icon: BookOpen, label: "Photobook" },
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
}

export function ProjectCard({ project, trash = false }: ProjectCardProps) {
  const params = useParams()
  const router = useRouter()
  const locale = params.locale as string

  const [busy, setBusy] = useState(false)
  const [confirmOpen, setConfirmOpen] = useState(false)

  const modeInfo = modeConfig[project.mode]
  const displayStatus = deriveDisplayStatus(project)
  const editUrl = `/${locale}/design/${project.id}/edit`

  const thumbnail = (
    <TemplatePreview
      themeId={project.preview?.themeId}
      templateId={project.preview?.templateId}
      heroImageUrl={project.preview?.heroImageUrl}
      title={project.preview?.title}
      subtitle={project.preview?.subtitle}
      date={project.preview?.date}
      aspectRatio={project.preview?.aspectRatio}
      frameStyle={project.preview?.frameStyle}
    />
  )

  async function handleSoftDelete() {
    setBusy(true)
    try {
      await toastProject.delete(softDeleteProject(project.id))
    } finally {
      setBusy(false)
    }
  }

  async function handleRestore() {
    setBusy(true)
    try {
      await toastProject.restore(restoreProject(project.id))
    } finally {
      setBusy(false)
    }
  }

  async function handleForceDelete() {
    setBusy(true)
    try {
      await toastProject.forceDelete(forceDeleteProject(project.id))
    } finally {
      setBusy(false)
      setConfirmOpen(false)
    }
  }

  if (trash) {
    return (
      <>
        <div className="group overflow-hidden rounded-2xl shadow-sm border border-border/50 opacity-80 hover:opacity-100 transition-opacity">
          {/* Thumbnail */}
          <div className="relative aspect-[16/10] overflow-hidden rounded-t-2xl bg-muted">
            <div className="absolute inset-0">{thumbnail}</div>
            {/* Overlay */}
            <div className="absolute inset-0 flex items-center justify-center gap-2 bg-foreground/30 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
              <Button
                size="sm"
                variant="secondary"
                className="rounded-full shadow-md"
                disabled={busy}
                onClick={handleRestore}
              >
                <RotateCcw className="mr-1.5 size-3.5" />
                Restore
              </Button>
              <Button
                size="sm"
                variant="destructive"
                className="rounded-full shadow-md"
                disabled={busy}
                onClick={() => setConfirmOpen(true)}
              >
                <Trash2 className="mr-1.5 size-3.5" />
                Delete
              </Button>
            </div>
            {/* Mode badge */}
            <div className="absolute bottom-2 left-2">
              <span className="flex items-center gap-1 rounded-full bg-background/80 px-2.5 py-0.5 text-xs font-medium backdrop-blur-sm">
                <modeInfo.icon className="size-3" />
                {modeInfo.label}
              </span>
            </div>
          </div>
          <CardContent className="p-3">
            <p className="truncate text-sm font-medium">{project.name}</p>
            <p className="mt-0.5 text-xs text-muted-foreground line-clamp-1">
              {project.purgeAt
                ? `Deletes permanently on ${formatPurgeDate(project.purgeAt)}`
                : "Pending purge"}
            </p>
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
                <DialogTitle>Permanently delete project?</DialogTitle>
              </div>
              <DialogDescription className="pt-1">
                <strong>{project.name}</strong> and all its uploaded images will be deleted forever.
                This action cannot be undone.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter className="gap-2 sm:gap-0">
              <Button variant="outline" className="rounded-full" onClick={() => setConfirmOpen(false)} disabled={busy}>
                Cancel
              </Button>
              <Button variant="destructive" className="rounded-full" onClick={handleForceDelete} disabled={busy}>
                {busy ? "Deleting…" : "Delete forever"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </>
    )
  }

  return (
    <div className="group overflow-hidden rounded-2xl shadow-sm transition-all hover:shadow-md">
      {/* Thumbnail area */}
      <div className="relative aspect-[16/10] overflow-hidden rounded-t-2xl bg-muted">
        <div className="absolute inset-0">{thumbnail}</div>

        {/* Hover action overlay */}
        <div className="absolute inset-0 flex items-center justify-center gap-2 bg-foreground/30 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
          <Button size="sm" className="rounded-full shadow-md" onClick={() => router.push(editUrl)}>
            <Edit className="mr-1.5 size-3.5" />
            Edit
          </Button>
          {project.isPublished && (
            <Button variant="secondary" size="sm" className="rounded-full shadow-md">
              <Eye className="mr-1.5 size-3.5" />
              View
            </Button>
          )}
        </div>

        {/* More menu */}
        <div className="absolute right-2 top-2 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="secondary" size="icon" className="size-8 rounded-full shadow-md">
                <MoreHorizontal className="size-4" />
                <span className="sr-only">Open menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="rounded-xl">
              {project.isPublished && (
                <DropdownMenuItem className="cursor-pointer rounded-lg">
                  <Eye className="mr-2 size-4" /> View
                </DropdownMenuItem>
              )}
              <DropdownMenuItem className="cursor-pointer rounded-lg" onClick={() => router.push(editUrl)}>
                <Edit className="mr-2 size-4" /> Edit
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="cursor-pointer rounded-lg"
                variant="destructive"
                disabled={busy}
                onClick={handleSoftDelete}
              >
                <Trash2 className="mr-2 size-4" /> Move to Trash
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Bottom badges */}
        <div className="absolute bottom-2 left-2 flex items-center gap-1.5">
          <span className="flex items-center gap-1 rounded-full bg-background/80 px-2.5 py-0.5 text-xs font-medium backdrop-blur-sm">
            <modeInfo.icon className="size-3" />
            {modeInfo.label}
          </span>
          <span className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${statusStyles[displayStatus]}`}>
            {displayStatus}
          </span>
        </div>
      </div>

      <CardContent className="p-3">
        <p className="truncate text-sm font-medium">{project.name}</p>
        <p className="mt-0.5 text-xs text-muted-foreground">Edited {formatRelativeDate(project.updatedAt)}</p>
      </CardContent>
    </div>
  )
}

