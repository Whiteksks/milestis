"use client"

import { memo, useMemo, useState } from "react"
import Link from "next/link"
import { useParams } from "next/navigation"
import { ArrowLeft, BookOpen, Camera, Check, Copy, Edit, Globe, Layout } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"
import { TemplatePreview } from "@/components/shared/template-preview"
import { useArchivedProjectsQuery, type DashboardProject } from "@/hooks/useProjectsQuery"
import { getPublishedProjectShareUrl } from "@/lib/slug"
import { cn } from "@/lib/utils"
import { useTranslations } from "next-intl"

// ─── Config ───────────────────────────────────────────────────────────────────

const modeConfig = {
  portfolio: { icon: Layout, labelKey: "project.mode.portfolio" as const },
  photobook: { icon: BookOpen, labelKey: "project.mode.photobook" as const },
  event:     { icon: Camera,   labelKey: "project.mode.event"     as const },
}

// ─── Skeleton ─────────────────────────────────────────────────────────────────

function GridSkeleton() {
  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="space-y-3">
          <Skeleton className="aspect-[16/10] w-full rounded-2xl" />
          <Skeleton className="h-4 w-2/3" />
        </div>
      ))}
    </div>
  )
}

// ─── Card ─────────────────────────────────────────────────────────────────────

const PublishedProjectCard = memo(function PublishedProjectCard({
  project,
  isSelected,
  onSelect,
}: {
  project: DashboardProject
  isSelected: boolean
  onSelect: (id: string) => void
}) {
  const t = useTranslations()
  const modeInfo = modeConfig[project.mode]

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
        zoom={3.55}
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
    ]
  )

  return (
    <button
      type="button"
      onClick={() => onSelect(project.id)}
      className={cn(
        "group w-full overflow-hidden rounded-2xl text-left shadow-sm transition-all duration-200",
        isSelected
          ? "ring-2 ring-primary shadow-md"
          : "hover:shadow-md hover:ring-1 hover:ring-primary/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
      )}
    >
      <div className="relative aspect-[16/10] overflow-hidden rounded-t-2xl bg-muted">
        <div className="absolute inset-0">{thumbnail}</div>
        <div className="absolute bottom-2 left-2 flex items-center gap-1.5">
          <span className="flex items-center gap-1 rounded-full bg-background/80 px-2.5 py-0.5 text-xs font-medium backdrop-blur-sm">
            <modeInfo.icon className="size-3" />
            {t(modeInfo.labelKey)}
          </span>
        </div>
      </div>
      <div className="p-3">
        <p className="truncate text-sm font-medium">{project.name}</p>
      </div>
    </button>
  )
})

// ─── Detail Panel ─────────────────────────────────────────────────────────────

function ProjectDetailPanel({
  project,
  onBack,
}: {
  project: DashboardProject
  onBack: () => void
}) {
  const params = useParams()
  const locale = params.locale as string
  const t = useTranslations()
  const [copied, setCopied] = useState(false)

  const modeInfo = modeConfig[project.mode]
  const editUrl = `/${locale}/design/${project.id}/edit`
  const shareUrl = project.mode === 'event'
    ? null  // events don't appear in the published archive
    : getPublishedProjectShareUrl({ ...project, mode: project.mode })

  async function copyLink() {
    if (!shareUrl) return
    try {
      await navigator.clipboard.writeText(shareUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // Clipboard API not available
    }
  }

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
        zoom={1.9}
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
    ]
  )

  return (
    <div className="grid grid-cols-1 md:grid-cols-[1fr_300px] lg:grid-cols-[1fr_340px] gap-6 md:gap-10">
      {/* Left: Preview */}
      <div>
        <button
          type="button"
          onClick={onBack}
          className="mb-5 flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="size-3.5" />
          {t("archive.backToList")}
        </button>

        <div className="overflow-hidden rounded-2xl bg-muted shadow-md">
          <div className="relative aspect-[16/10]">
            <div className="absolute inset-0">{thumbnail}</div>
          </div>
        </div>

        <div className="mt-4">
          <h2 className="font-serif text-2xl md:text-3xl tracking-tight">{project.name}</h2>
          <div className="mt-2 flex flex-wrap items-center gap-2">
            <Badge variant="outline" className="gap-1.5 rounded-full font-normal">
              <modeInfo.icon className="size-3" />
              {t(modeInfo.labelKey)}
            </Badge>
            {project.isPublished && (
              <Badge className="rounded-full border-0 bg-primary/10 text-primary hover:bg-primary/20">
                {t("project.status.published")}
              </Badge>
            )}
          </div>
        </div>
      </div>

      {/* Right: Actions */}
      <div className="flex flex-col gap-4 md:pt-[52px]">
        {shareUrl && (
          <div className="rounded-2xl border border-border/60 bg-muted/40 p-4">
            <p className="mb-1.5 text-[10px] font-medium uppercase tracking-widest text-muted-foreground">
              {t("archive.shareUrl")}
            </p>
            <p className="break-all font-mono text-xs leading-relaxed text-foreground/70">
              {shareUrl}
            </p>
          </div>
        )}

        <div className="flex flex-col gap-2">
          <Button asChild className="h-10 rounded-xl">
            <Link href={editUrl}>
              <Edit className="mr-2 size-4" />
              {t("archive.edit")}
            </Link>
          </Button>

          {shareUrl && (
            <>
              <Button variant="outline" className="h-10 rounded-xl" asChild>
                <a href={shareUrl} target="_blank" rel="noopener noreferrer">
                  <Globe className="mr-2 size-4" />
                  {t("archive.viewSite")}
                </a>
              </Button>

              <Button
                variant="outline"
                className="h-10 rounded-xl"
                onClick={copyLink}
              >
                {copied ? (
                  <Check className="mr-2 size-4 text-green-500" />
                ) : (
                  <Copy className="mr-2 size-4" />
                )}
                {copied ? t("archive.linkCopied") : t("archive.copyLink")}
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function ArchivePage() {
  const t = useTranslations()
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const { data: projects = [], isLoading } = useArchivedProjectsQuery()
  const selectedProject = projects.find((p) => p.id === selectedId) ?? null

  return (
    <div className="mx-auto max-w-6xl space-y-6 md:px-4 md:py-8">
      {/* Header — hidden when detail panel is open */}
      {!selectedProject && (
        <header className="flex flex-col gap-4 border-b pb-6">
          <div className="flex items-baseline gap-3">
            <h1 className="font-serif text-3xl md:text-5xl tracking-tight">
              {t("archive.title")}
            </h1>
            <span className="rounded-full bg-muted px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
              {t("projects.totalCount", { count: projects.length })}
            </span>
          </div>
        </header>
      )}

      {selectedProject ? (
        <ProjectDetailPanel
          project={selectedProject}
          onBack={() => setSelectedId(null)}
        />
      ) : isLoading ? (
        <GridSkeleton />
      ) : projects.length === 0 ? (
        <div className="border-t border-dashed border-border/60 py-40 text-center">
          <p className="font-serif text-2xl italic text-muted-foreground/50">
            {t("archive.empty")}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-3">
          {projects.map((project) => (
            <PublishedProjectCard
              key={project.id}
              project={project}
              isSelected={selectedId === project.id}
              onSelect={setSelectedId}
            />
          ))}
        </div>
      )}
    </div>
  )
}