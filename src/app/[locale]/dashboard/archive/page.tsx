"use client"

import { useMemo, useState } from "react"
import Link from "next/link"
import { useParams } from "next/navigation"
import { Download, ArrowUpRight, Globe } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"
import { useProjectExportsQuery, useArchivedProjectsQuery, type ProjectExportRecord } from "@/hooks/useProjectsQuery"
import { PublishExportedModal } from "@/editor/components/modals/publish-exported-modal"
import { cn } from "@/lib/utils"
import { getProjectConfig } from "@/lib/projects/project-type-config"

// ─── Helpers ──────────────────────────────────────────────────────────────────

const BASE_DOMAIN = "milestis.site"

function formatDate(date: Date): string {
  return date.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  })
}

// ─── Row ──────────────────────────────────────────────────────────────────────

function ExportRow({ record }: { record: ProjectExportRecord }) {
  const config = getProjectConfig(record.mode)

  return (
    <div className="group flex items-center gap-6 border-b border-border/40 py-5 transition-colors hover:bg-accent/20 px-2 -mx-2 rounded-lg">
      {/* File Info */}
      <div className="flex-1 min-w-0 flex items-baseline gap-4">
        <span className="text-xs font-medium tabular-nums text-muted-foreground/60 uppercase tracking-widest">
          v{record.versionNumber}
        </span>
        
        <div className="flex flex-col gap-0.5">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium tracking-tight truncate">
              {config.archiveRecordTitle}
            </span>
            <Badge variant="outline" className="text-[9px] font-normal tracking-wider uppercase px-1.5 h-4 border-muted-foreground/20">
              {config.archiveBadge}
            </Badge>
          </div>
          <p className="text-[11px] text-muted-foreground/60 font-light italic">
            Created on {formatDate(record.createdAt)}
          </p>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-1 sm:gap-4 shrink-0">
        {config.canDownloadFile ? (
          <Button
            variant="ghost"
            size="sm"
            className="h-9 w-9 sm:w-auto sm:px-4 rounded-full border border-transparent hover:border-border/60 hover:bg-background"
            asChild
          >
            <a href={record.fileDownloadUrl} target="_blank" rel="noopener noreferrer" download>
              <Download className="size-3.5 sm:mr-2" />
              <span className="hidden sm:inline text-xs font-medium uppercase tracking-wider">Download</span>
            </a>
          </Button>
        ) : record.publishedSlug ? (
          <Button
            variant="ghost"
            size="sm"
            className="h-9 w-9 sm:w-auto sm:px-4 rounded-full border border-transparent hover:border-border/60 hover:bg-background"
            asChild
          >
            <a href={config.getShareUrl(record.publishedSlug)} target="_blank" rel="noopener noreferrer">
              <Globe className="size-3.5 sm:mr-2" />
              <span className="hidden sm:inline text-xs font-medium uppercase tracking-wider">View site</span>
            </a>
          </Button>
        ) : null}
      </div>
    </div>
  )
}

// ─── Sections ─────────────────────────────────────────────────────────────────

function ExportsSkeleton() {
  return (
    <div className="space-y-8 mt-12">
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="space-y-4">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-[200px] w-full rounded-2xl" />
        </div>
      ))}
    </div>
  )
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function ExportsPage() {
  const params = useParams()
  const locale = params.locale as string
  const { data: exports = [], isLoading } = useProjectExportsQuery()
  const { data: archivedProjects = [] } = useArchivedProjectsQuery()
  const [publishTarget, setPublishTarget] = useState<{ projectId: string; mode: 'photobook' } | null>(null)

  // Map projectId → project info from archived query
  const archivedMap = useMemo(() => {
    const m = new Map<string, typeof archivedProjects[number]>()
    for (const p of archivedProjects) m.set(p.id, p)
    return m
  }, [archivedProjects])

  const grouped = useMemo(() => {
    const map = new Map<string, { projectName: string; records: ProjectExportRecord[] }>()
    for (const record of exports) {
      const existing = map.get(record.projectId)
      if (existing) existing.records.push(record)
      else map.set(record.projectId, { projectName: record.projectName, records: [record] })
    }
    return Array.from(map.entries())
  }, [exports])

  return (
    <div className="mx-auto max-w-5xl  md:px-4 md:py-8">
      {/* Editorial Header */}
      <header className="relative mb-6 border-b border-border/30 pb-6">
        <div className="flex flex-col gap-4">
          <h1 className="font-serif text-4xl md:text-5xl font-light tracking-tighter italic">
            Archive
          </h1>
          <div className="flex items-center gap-3">
            <div className="h-px w-12 bg-primary/30" />
            <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground font-medium">
              Exported projects · {exports.length} Total
            </p>
          </div>
        </div>
      </header>

      {isLoading ? (
        <ExportsSkeleton />
      ) : exports.length === 0 ? (
        <div className="py-40 text-center border-t border-dashed border-border/60">
           <p className="font-serif text-2xl italic text-muted-foreground/50">Your archive is empty</p>
        </div>
      ) : (
        <div className="space-y-2">
          {grouped.map(([projectId, group]) => (
            <section 
              key={projectId} 
              // gap-3 на мобилке вместо gap-8, чтобы прижать заголовок к списку
              className="grid grid-cols-1 md:grid-cols-[200px_1fr] md:gap-12"
            >
              {/* Project Title & Link */}
              <aside className={cn(
                "flex items-center justify-between border-b border-border/10", // Мобильный стиль
                "md:flex-col md:items-start md:justify-start md:gap-4 md:border-none md:pb-0", // Десктопный сброс
                "md:pt-5" // ВАЖНО: выравнивает заголовок по верхней линии контента в правой колонке
              )}>
                <h2 className="font-serif text-lg md:text-xl italic tracking-tight leading-none">
                  {group.projectName}
                </h2>
                <div className="flex items-center gap-2">
                  {(() => {
                    const p = archivedMap.get(projectId)
                    if (!p) return null
                    if (p.isPublished) {
                      const shareUrl = p.mode === 'portfolio'
                        ? `https://${p.publishedSlug}.${BASE_DOMAIN}`
                        : `https://${BASE_DOMAIN}/${p.publishedSlug}`
                      return (
                        <a
                          href={shareUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-[9px] uppercase tracking-[0.2em] text-primary/70 hover:text-primary transition-colors"
                        >
                          <Globe className="size-2.5" /> Live
                        </a>
                      )
                    }
                    // Photobook-only: two-step flow — exported but not yet published.
                    // Portfolio is always published atomically via exportProject.
                    if (p.mode !== 'portfolio') {
                      return (
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-6 px-2 text-[9px] uppercase tracking-[0.15em] font-medium text-muted-foreground hover:text-foreground"
                          onClick={() => setPublishTarget({ projectId, mode: 'photobook' })}
                        >
                          <Globe className="size-2.5 mr-1" /> Publish
                        </Button>
                      )
                    }
                    return null
                  })()}
                  <Link
                    href={`/${locale}/design/${projectId}/edit`}
                    className="inline-flex items-center gap-1.5 text-[9px] uppercase tracking-[0.2em] text-muted-foreground/60 hover:text-primary transition-colors"
                  >
                    Edit <ArrowUpRight className="size-2.5" />
                  </Link>
                </div>
              </aside>

              {/* Rows List */}
              {/* -mt-1 на мобилке еще сильнее прижимает список к линии заголовка */}
              <div className="flex flex-col md:mt-0">
                {group.records.map((record) => (
                  <ExportRow key={record.exportId} record={record} />
                ))}
              </div>
            </section>
          ))}
        </div>
      )}

      {/* Publish modal */}
      {publishTarget && (
        <PublishExportedModal
          open={!!publishTarget}
          onOpenChange={(open) => { if (!open) setPublishTarget(null) }}
          projectId={publishTarget.projectId}
          mode={publishTarget.mode}
        />
      )}
    </div>
  )
}