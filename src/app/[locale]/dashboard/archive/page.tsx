"use client"

import { useMemo } from "react"
import Link from "next/link"
import { useParams } from "next/navigation"
import { Download, Globe, ArrowUpRight, FileText, Archive } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"
import { useProjectExportsQuery, type ProjectExportRecord } from "@/hooks/useProjectsQuery"
import { cn } from "@/lib/utils"

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
  const shareUrl =
    record.publishedSlug
      ? record.mode === "portfolio"
        ? `https://${record.publishedSlug}.${BASE_DOMAIN}`
        : `https://${BASE_DOMAIN}/${record.publishedSlug}`
      : null

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
              {record.mimeType === "application/pdf" ? "Document Archive" : "Digital Package"}
            </span>
            <Badge variant="outline" className="text-[9px] font-normal tracking-wider uppercase px-1.5 h-4 border-muted-foreground/20">
              {record.mimeType === "application/pdf" ? "PDF" : "ZIP"}
            </Badge>
          </div>
          <p className="text-[11px] text-muted-foreground/60 font-light italic">
            Created on {formatDate(record.createdAt)}
          </p>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-1 sm:gap-4 shrink-0">
        {shareUrl && (
          <a 
            href={shareUrl} 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-[11px] uppercase tracking-widest text-primary/80 hover:text-primary transition-colors px-2 py-1"
          >
            <Globe className="size-3" />
            <span className="hidden sm:inline font-medium">Live Site</span>
          </a>
        )}
        
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
                <Link
                  href={`/${locale}/design/${projectId}/edit`}
                  className="inline-flex items-center gap-1.5 text-[9px] uppercase tracking-[0.2em] text-muted-foreground/60 hover:text-primary transition-colors"
                >
                  Edit Project <ArrowUpRight className="size-2.5" />
                </Link>
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
    </div>
  )
}