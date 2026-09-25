"use client"

import { memo, useMemo, useState } from "react"
import Link from "next/link"
import { useParams } from "next/navigation"
import {
  ArrowLeft,
  BookOpen,
  Camera,
  Check,
  Copy,
  Edit,
  Globe,
  Layout,
  Archive,
  ExternalLink,
} from "lucide-react"
import { FaWhatsapp, FaTelegram, FaFacebook } from "react-icons/fa"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { TemplatePreview } from "@/components/shared/template-preview"
import { EventThumbnail } from "@/components/layout/dashboard/project-card"
import { useArchivedProjectsQuery, type DashboardProject } from "@/hooks/useProjectsQuery"
import { getPublishedProjectShareUrl } from "@/lib/slug"
import { cn } from "@/lib/utils"
import { useTranslations } from "next-intl"

// ─── Config ───────────────────────────────────────────────────────────────────

const modeConfig = {
  menu: { icon: BookOpen, labelKey: "project.mode.menu" as const },
  portfolio: { icon: Layout, labelKey: "project.mode.portfolio" as const },
  photobook: { icon: BookOpen, labelKey: "project.mode.photobook" as const },
  event:     { icon: Camera,   labelKey: "project.mode.event"     as const },
}

// ─── Skeleton ─────────────────────────────────────────────────────────────────

function GridSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 md:gap-6">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="space-y-3 rounded-xs border border-border/80 p-3 bg-background">
          <Skeleton className="aspect-[16/10] w-full rounded-xs" />
          <div className="space-y-2 pt-1">
            <Skeleton className="h-4 w-2/3 rounded-xs" />
            <Skeleton className="h-3 w-1/3 rounded-xs" />
          </div>
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
        zoom={3.55}
      />
    ),
    [
      project.mode,
      project.preview?.themeId,
      project.preview?.templateId,
      project.preview?.heroImageUrl,
      project.preview?.title,
      project.preview?.subtitle,
      project.preview?.date,
      project.preview?.aspectRatio,
      project.preview?.frameStyle,
      project.preview?.cropData,
      project.eventConfig?.approvedCount,
    ]
  )

  return (
    <button
      type="button"
      onClick={() => onSelect(project.id)}
      className={cn(
        "group relative flex flex-col w-full text-left transition-all duration-200 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-foreground rounded-xs border bg-background p-2.5",
        isSelected
          ? "border-foreground bg-secondary/40 ring-1 ring-foreground/20"
          : "border-border hover:border-foreground/40 hover:bg-secondary/20"
      )}
    >
      {/* Thumbnail Container */}
      <div className="relative aspect-[16/10] w-full overflow-hidden rounded-xs bg-secondary/30 border border-border/60">
        <div className="absolute inset-0 transition-transform duration-300 ease-out group-hover:scale-[1.02]">
          {thumbnail}
        </div>
        
        {/* Mode Tag — Friendly sans font */}
        <div className="absolute bottom-2 left-2 z-10">
          <span className="inline-flex items-center gap-1.5 rounded-xs border border-border/70 bg-background/95 px-2 py-0.5 font-sans text-xs font-medium text-foreground backdrop-blur-xs shadow-2xs">
            <modeInfo.icon className="size-3.5 text-muted-foreground" />
            {t(modeInfo.labelKey)}
          </span>
        </div>
      </div>

      {/* Title & Status */}
      <div className="mt-2.5 flex items-center justify-between gap-2 px-0.5 pb-0.5">
        <p className="truncate font-serif text-base font-medium tracking-tight text-foreground">
          {project.name}
        </p>
        {project.isPublished && (
          <span className="inline-flex items-center gap-1.5 rounded-xs bg-secondary px-2 py-0.5 font-sans text-[11px] font-medium text-foreground border border-border/60">
            <span className="size-1.5 rounded-full bg-emerald-500" />
            {t("project.status.published")}
          </span>
        )}
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
        zoom={1.9}
      />
    ),
    [
      project.mode,
      project.preview?.themeId,
      project.preview?.templateId,
      project.preview?.heroImageUrl,
      project.preview?.title,
      project.preview?.subtitle,
      project.preview?.date,
      project.preview?.aspectRatio,
      project.preview?.frameStyle,
      project.preview?.cropData,
      project.eventConfig?.approvedCount,
    ]
  )

  return (
    <div className="space-y-6">
      {/* Top back button */}
      <div>
        <button
          type="button"
          onClick={onBack}
          className="inline-flex h-8 items-center gap-1.5 rounded-xs border border-border bg-background px-3 font-sans text-xs text-muted-foreground transition-colors hover:bg-secondary/60 hover:text-foreground"
        >
          <ArrowLeft className="size-3.5" />
          <span>{t("archive.backToList")}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 gap-6 md:gap-8 lg:grid-cols-[1fr_320px]">
        {/* Left: Preview Section */}
        <div className="space-y-4">
          <div className="relative overflow-hidden rounded-xs border border-border bg-background p-2">
            <div className="relative aspect-[16/10] overflow-hidden rounded-xs bg-secondary/30">
              <div className="absolute inset-0">{thumbnail}</div>
            </div>

            {/* Status Tag */}
            {project.isPublished && (
              <div className="absolute top-4 right-4 rounded-xs border border-border/80 bg-background/90 backdrop-blur-md px-2.5 py-1 font-sans text-xs font-medium text-foreground shadow-2xs">
                {t("project.status.published")}
              </div>
            )}
          </div>

          <div className="space-y-2 pt-1">
            <h2 className="font-serif text-2xl font-medium tracking-tight text-foreground md:text-3xl">
              {project.name}
            </h2>
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-xs border border-border/80 bg-secondary/60 px-2.5 py-1 font-sans text-xs font-medium text-secondary-foreground">
                <modeInfo.icon className="size-3.5 text-muted-foreground" />
                {t(modeInfo.labelKey)}
              </span>
            </div>
          </div>
        </div>

        {/* Right: Actions Panel (Light & Clean layout) */}
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-4 rounded-xs border border-border bg-secondary/20 p-4">
            {shareUrl && (
              <div className="space-y-1.5">
                <span className="font-sans text-xs font-medium text-muted-foreground">
                  {t("archive.shareUrl")}
                </span>
                <div className="rounded-xs border border-border bg-background p-2.5 font-sans text-xs leading-relaxed break-all text-foreground/80 shadow-2xs">
                  {shareUrl}
                </div>
              </div>
            )}

            <div className="flex flex-col gap-2 pt-1">
              {/* Primary High-Contrast Button */}
              <Button
                asChild
                className="h-9 w-full rounded-xs bg-foreground text-xs font-medium text-background transition-colors hover:bg-foreground/90 shadow-2xs"
              >
                <Link href={editUrl}>
                  <Edit className="mr-2 size-3.5" />
                  {t("archive.edit")}
                </Link>
              </Button>

              {shareUrl && (
                <>
                  {/* Secondary Contrasting Action Buttons */}
                  <Button
                    variant="outline"
                    className="h-9 w-full rounded-xs border-border bg-background text-xs font-normal text-foreground hover:bg-secondary/60"
                    asChild
                  >
                    <a href={shareUrl} target="_blank" rel="noopener noreferrer">
                      <Globe className="mr-2 size-3.5 text-muted-foreground" />
                      {t("archive.viewSite")}
                      <ExternalLink className="ml-auto size-3 opacity-50" />
                    </a>
                  </Button>

                  <Button
                    variant="outline"
                    className="h-9 w-full rounded-xs border-border bg-background text-xs font-normal text-foreground hover:bg-secondary/60"
                    onClick={copyLink}
                  >
                    {copied ? (
                      <Check className="mr-2 size-3.5 text-emerald-600 dark:text-emerald-400" />
                    ) : (
                      <Copy className="mr-2 size-3.5 text-muted-foreground" />
                    )}
                    {copied ? t("archive.linkCopied") : t("archive.copyLink")}
                  </Button>

                  {/* Direct share links */}
                  <div className="flex items-center justify-center gap-2 pt-1">
                    <a
                      href={`https://wa.me/?text=${encodeURIComponent(shareUrl)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={t("archive.shareWhatsapp")}
                      className="flex size-9 items-center justify-center rounded-xs bg-[#25D366]/10 text-[#25D366] transition-colors hover:bg-[#25D366]/20"
                    >
                      <FaWhatsapp className="size-4" />
                    </a>
                    <a
                      href={`https://t.me/share/url?url=${encodeURIComponent(shareUrl)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={t("archive.shareTelegram")}
                      className="flex size-9 items-center justify-center rounded-xs bg-[#26A5E4]/10 text-[#26A5E4] transition-colors hover:bg-[#26A5E4]/20"
                    >
                      <FaTelegram className="size-4" />
                    </a>
                    <a
                      href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={t("archive.shareFacebook")}
                      className="flex size-9 items-center justify-center rounded-xs bg-[#1877F2]/10 text-[#1877F2] transition-colors hover:bg-[#1877F2]/20"
                    >
                      <FaFacebook className="size-4" />
                    </a>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function ArchiveEmpty() {
  const t = useTranslations()
  return (
    <div className="flex flex-col items-center justify-center border border-dashed border-border/80 py-16 text-center md:py-24">
      <div className="flex size-12 items-center justify-center rounded-xs border border-border bg-secondary/30 text-secondary-foreground">
        <Archive className="size-5" />
      </div>
      <h3 className="mt-4 font-serif text-xl font-medium">{t('archive.empty')}</h3>
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
    <div className="mx-auto max-w-6xl space-y-6 px-4 py-6 md:py-8">
      {/* Header — Matches Dashboard Projects Header */}
      {!selectedProject && (
        <div className="flex flex-col gap-4 border-b border-border/80 pb-5 md:pb-6">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-baseline gap-2.5 sm:gap-3">
              <h1 className="font-serif text-2xl font-medium tracking-tight sm:text-3xl md:text-5xl">
                {t("archive.title")}
              </h1>
              <span className="rounded-xs bg-secondary/80 px-2 py-0.5 font-mono text-[10px] font-semibold uppercase tracking-widest text-secondary-foreground border border-secondary sm:text-[11px]">
                {t("projects.totalCount", { count: projects.length })}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <main className="min-h-[400px]">
        {selectedProject ? (
          <ProjectDetailPanel
            project={selectedProject}
            onBack={() => setSelectedId(null)}
          />
        ) : isLoading ? (
          <GridSkeleton />
        ) : projects.length === 0 ? (
          <ArchiveEmpty />
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 md:gap-6">
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
      </main>
    </div>
  )
}