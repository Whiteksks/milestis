"use client"

import { useMemo } from "react"
import Link from "next/link"
import { useParams } from "next/navigation"
import { Download, FileText, Archive, Globe, BookOpen, Layout, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"
import { useProjectExportsQuery, type ProjectExportRecord } from "@/hooks/useProjectsQuery"

// ─── Helpers ──────────────────────────────────────────────────────────────────

const BASE_DOMAIN = "milestis.site"

function formatDate(date: Date): string {
  return date.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })
}

function ExportFileIcon({ mimeType }: { mimeType: string }) {
  if (mimeType === "application/pdf")
    return <FileText className="size-4 text-rose-500 shrink-0" />
  return <Archive className="size-4 text-amber-500 shrink-0" />
}

function ExportFileLabel({ mimeType }: { mimeType: string }) {
  if (mimeType === "application/pdf") return "PDF"
  return "ZIP"
}

function ProjectModeIcon({ mode }: { mode: "portfolio" | "photobook" }) {
  if (mode === "portfolio")
    return <Layout className="size-3 text-muted-foreground" />
  return <BookOpen className="size-3 text-muted-foreground" />
}

// ─── Row ──────────────────────────────────────────────────────────────────────

function ExportRow({ record, locale }: { record: ProjectExportRecord; locale: string }) {
  const shareUrl =
    record.publishedSlug
      ? record.mode === "portfolio"
        ? `https://${record.publishedSlug}.${BASE_DOMAIN}`
        : `https://${BASE_DOMAIN}/${record.publishedSlug}`
      : null

  return (
    <div className="flex items-center gap-4 rounded-2xl border border-border/50 bg-card px-4 py-3.5 transition-colors hover:bg-muted/40">
      {/* File type icon */}
      <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-muted">
        <ExportFileIcon mimeType={record.mimeType} />
      </div>

      {/* Main info */}
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <span className="truncate text-sm font-medium">{record.projectName}</span>
          <div className="flex items-center gap-1 shrink-0">
            <ProjectModeIcon mode={record.mode} />
            <Badge variant="secondary" className="text-[10px] px-1.5 py-0.5 h-auto">
              <ExportFileLabel mimeType={record.mimeType} />
            </Badge>
            <Badge variant="outline" className="text-[10px] px-1.5 py-0.5 h-auto">
              v{record.versionNumber}
            </Badge>
          </div>
        </div>
        <p className="mt-0.5 text-xs text-muted-foreground">{formatDate(record.createdAt)}</p>
      </div>

      {/* Status + actions */}
      <div className="flex shrink-0 items-center gap-2">
        {shareUrl && (
          <Button
            variant="ghost"
            size="sm"
            className="h-8 gap-1.5 rounded-full px-3 text-xs text-emerald-600 dark:text-emerald-400 hover:text-emerald-600"
            asChild
          >
            <a href={shareUrl} target="_blank" rel="noopener noreferrer">
              <Globe className="size-3" />
              <span className="hidden sm:inline">Published</span>
            </a>
          </Button>
        )}
        <Button
          variant="secondary"
          size="sm"
          className="h-8 gap-1.5 rounded-full px-3 text-xs"
          asChild
        >
          <a href={record.fileDownloadUrl} target="_blank" rel="noopener noreferrer" download>
            <Download className="size-3" />
            <span className="hidden sm:inline">Download</span>
          </a>
        </Button>
      </div>
    </div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

function ExportsSkeleton() {
  return (
    <div className="space-y-3">
      {Array.from({ length: 5 }).map((_, i) => (
        <Skeleton key={i} className="h-[64px] w-full rounded-2xl" />
      ))}
    </div>
  )
}

function ExportsEmpty() {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <div className="flex size-14 items-center justify-center rounded-2xl bg-secondary">
        <Download className="size-6 text-muted-foreground" />
      </div>
      <h3 className="mt-5 font-serif text-xl">No exports yet</h3>
      <p className="mt-2 text-sm text-muted-foreground">
        Open a project in the editor and click{" "}
        <strong className="font-medium text-foreground">Export</strong> to create your first PDF or ZIP.
      </p>
    </div>
  )
}

// Grouped by project for readability
type GroupedExports = { projectId: string; projectName: string; records: ProjectExportRecord[] }[]

export default function ExportsPage() {
  const params = useParams()
  const locale = params.locale as string
  const { data: exports = [], isLoading } = useProjectExportsQuery()

  const grouped: GroupedExports = useMemo(() => {
    const map = new Map<string, GroupedExports[number]>()
    for (const record of exports) {
      const existing = map.get(record.projectId)
      if (existing) {
        existing.records.push(record)
      } else {
        map.set(record.projectId, {
          projectId: record.projectId,
          projectName: record.projectName,
          records: [record],
        })
      }
    }
    return Array.from(map.values())
  }, [exports])

  return (
    <div className="mx-auto max-w-4xl space-y-6 md:px-4 md:py-8">
      {/* Header */}
      <div className="flex items-baseline gap-3 border-b pb-6">
        <h1 className="font-serif text-3xl md:text-5xl tracking-tight">Exports</h1>
        {!isLoading && (
          <span className="text-xs text-muted-foreground font-medium uppercase tracking-wider">
            {exports.length} Total
          </span>
        )}
      </div>

      {/* Content */}
      {isLoading ? (
        <ExportsSkeleton />
      ) : exports.length === 0 ? (
        <ExportsEmpty />
      ) : (
        <div className="space-y-8">
          {grouped.map((group) => (
            <section key={group.projectId} className="space-y-3">
              <div className="flex items-center justify-between">
                <h2 className="font-medium text-sm text-muted-foreground">{group.projectName}</h2>
                <Link
                  href={`/${locale}/design/${group.projectId}/edit`}
                  className="flex items-center gap-1 text-xs text-primary hover:underline underline-offset-4"
                >
                  Open in editor
                  <ExternalLink className="size-3" />
                </Link>
              </div>
              <div className="space-y-2">
                {group.records.map((record) => (
                  <ExportRow key={record.exportId} record={record} locale={locale} />
                ))}
              </div>
            </section>
          ))}
        </div>
      )}
    </div>
  )
}
