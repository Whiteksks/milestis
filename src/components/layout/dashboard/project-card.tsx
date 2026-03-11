"use client"

import { useParams, useRouter } from "next/navigation"
import { MoreHorizontal, Edit, Trash2, Eye, BookOpen, Layout } from "lucide-react"
import { Button } from "@/components/ui/button"
import { CardContent } from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import type { DashboardProject } from "@/hooks/useProjects"

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

function deriveDisplayStatus(project: DashboardProject): "draft" | "published" | "archived" {
  if (project.status === "archived") return "archived"
  if (project.isPublished) return "published"
  return "draft"
}

const modeConfig = {
  portfolio: { icon: Layout, label: "Portfolio" },
  photobook: { icon: BookOpen, label: "Photobook" },
}

const statusStyles = {
  draft: "bg-muted text-muted-foreground",
  published: "bg-primary/10 text-primary",
  archived: "bg-secondary text-secondary-foreground",
}

// ─── Component ────────────────────────────────────────────────────────────

interface ProjectCardProps {
  project: DashboardProject
}

export function ProjectCard({ project }: ProjectCardProps) {
  const params = useParams()
  const router = useRouter()
  const locale = params.locale as string

  const modeInfo = modeConfig[project.mode]
  const displayStatus = deriveDisplayStatus(project)
  const editUrl = `/${locale}/design/${project.id}/edit`

  return (
    <div className="group overflow-hidden rounded-2xl shadow-sm transition-all hover:shadow-md">
      {/* Thumbnail area */}
      <div className="relative aspect-[16/10] overflow-hidden rounded-t-2xl bg-muted">
        {/* Placeholder until thumbnails are implemented */}
        <div className="absolute inset-0 flex items-center justify-center">
          <modeInfo.icon className="size-10 text-muted-foreground/30" />
        </div>

        {/* Hover action overlay */}
        <div className="absolute inset-0 flex items-center justify-center gap-2 bg-foreground/30 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
          <Button size="sm" className="rounded-full shadow-md" onClick={() => router.push(editUrl)}>
            <Edit className="mr-1.5 size-3.5" />
            Edit
          </Button>
          <Button variant="secondary" size="sm" className="rounded-full shadow-md">
            <Eye className="mr-1.5 size-3.5" />
            View
          </Button>
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
              <DropdownMenuItem className="cursor-pointer rounded-lg">
                <Eye className="mr-2 size-4" /> View
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer rounded-lg" onClick={() => router.push(editUrl)}>
                <Edit className="mr-2 size-4" /> Edit
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="cursor-pointer rounded-lg" variant="destructive">
                <Trash2 className="mr-2 size-4" /> Delete
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

