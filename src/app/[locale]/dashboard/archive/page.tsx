"use client"

import Link from "next/link"
import { useParams } from "next/navigation"
import { Download, ArrowUpRight, Globe } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"
import { useProjectExportsQuery, useArchivedProjectsQuery, type DashboardProject, type ProjectExportRecord } from "@/hooks/useProjectsQuery"
import { cn } from "@/lib/utils"
import { getProjectConfig } from "@/lib/projects/project-type-config"
import { getPublishedProjectShareUrl } from "@/lib/slug"
import { useTranslations } from "next-intl"

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatDate(date: Date): string {
  return date.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  })
}

// ─── Row ──────────────────────────────────────────────────────────────────────

function ExportRow({ 
  record, 
  project 
}: { 
  record: ProjectExportRecord; 
  project?: DashboardProject 
}) {
  const t = useTranslations()
  const config = getProjectConfig(record.mode)
  
  // Единая логика формирования ссылки через live-функцию
  const shareUrl = project ? getPublishedProjectShareUrl(project) : null

  return (
    <div className="group flex items-center gap-6 border-b border-border/40 py-5 transition-colors hover:bg-accent/20 px-2 -mx-2 rounded-lg">
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
            {t('archive.createdOn', { date: formatDate(record.createdAt) })}
          </p>
        </div>
      </div>

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
              <span className="hidden sm:inline text-xs font-medium uppercase tracking-wider">{t('archive.download')}</span>
            </a>
          </Button>
        ) : shareUrl ? ( // Используем shareUrl вместо record.publishedSlug
          <Button
            variant="ghost"
            size="sm"
            className="h-9 w-9 sm:w-auto sm:px-4 rounded-full border border-transparent hover:border-border/60 hover:bg-background"
            asChild
          >
			      <a href={shareUrl} target="_blank" rel="noopener noreferrer">
              <Globe className="size-3.5 sm:mr-2" />
              <span className="hidden sm:inline text-xs font-medium uppercase tracking-wider">{t('archive.viewSite')}</span>
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
  const t = useTranslations()

  const archivedMap = new Map<string, typeof archivedProjects[number]>()
  for (const p of archivedProjects) archivedMap.set(p.id, p)

  const groupedMap = new Map<string, { projectName: string; records: ProjectExportRecord[] }>()
  for (const record of exports) {
    const existing = groupedMap.get(record.projectId)
    if (existing) existing.records.push(record)
    else groupedMap.set(record.projectId, { projectName: record.projectName, records: [record] })
  }
  const grouped = Array.from(groupedMap.entries())

  return (
    <div className="mx-auto max-w-5xl md:px-4 md:py-8">
      <header className="relative mb-6 border-b border-border/30 pb-6">
        <div className="flex flex-col gap-4">
          <h1 className="font-serif text-4xl md:text-5xl font-light tracking-tighter italic">
            {t('archive.title')}
          </h1>
          <div className="flex items-center gap-3">
            <div className="h-px w-12 bg-primary/30" />
            <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground font-medium">
              {t('archive.exportsSummary', { count: exports.length })}
            </p>
          </div>
        </div>
      </header>

      {isLoading ? (
        <ExportsSkeleton />
      ) : exports.length === 0 ? (
          <div className="py-40 text-center border-t border-dashed border-border/60">
            <p className="font-serif text-2xl italic text-muted-foreground/50">{t('archive.empty')}</p>
          </div>
      ) : (
        <div className="space-y-2">
          {grouped.map(([projectId, group]) => {
            const project = archivedMap.get(projectId)
            const shareUrl = project ? getPublishedProjectShareUrl(project) : null

            return (
              <section 
                key={projectId} 
                className="grid grid-cols-1 md:grid-cols-[200px_1fr] md:gap-12"
              >
                <aside className={cn(
                  "flex items-center justify-between border-b border-border/10",
                  "md:flex-col md:items-start md:justify-start md:gap-4 md:border-none md:pb-0",
                  "md:pt-5"
                )}>
                  <h2 className="font-serif text-lg md:text-xl italic tracking-tight leading-none">
                    {group.projectName}
                  </h2>
                    <div className="flex items-center gap-2">
                    {shareUrl && (
                      <a
                        href={shareUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-[9px] uppercase tracking-[0.2em] text-primary/70 hover:text-primary transition-colors"
                      >
                        <Globe className="size-2.5" /> {t('archive.live')}
                      </a>
                    )}
                    <Link
                      href={`/${locale}/design/${projectId}/edit`}
                      className="inline-flex items-center gap-1.5 text-[9px] uppercase tracking-[0.2em] text-muted-foreground/60 hover:text-primary transition-colors"
                    >
                      {t('archive.edit')} <ArrowUpRight className="size-2.5" />
                    </Link>
                  </div>
                </aside>

                <div className="flex flex-col md:mt-0">
                  {group.records.map((record) => (
                    <ExportRow 
                      key={record.exportId} 
                      record={record} 
                      project={project} // Передаем объект проекта в строку
                    />
                  ))}
                </div>
              </section>
            )
          })}
        </div>
      )}
    </div>
  )
}