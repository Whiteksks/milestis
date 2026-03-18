"use client"

import { useState } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Copy, ExternalLink, Share2, Globe, BookOpen, Layout, Check } from "lucide-react"
import { useActiveProjectsQuery } from "@/hooks/useProjectsQuery"
import { useTranslations } from "next-intl"
import { useTranslations as useGlobalT } from "next-intl"
import type { DashboardProject } from "@/hooks/useProjectsQuery"

const BASE_DOMAIN = "milestis.app"

function getProjectDomain(project: DashboardProject): string {
  return `${project.id}.${BASE_DOMAIN}`
}

function getProjectLink(project: DashboardProject): string {
  return `https://${getProjectDomain(project)}`
}

export default function DomainsSettingsPage() {
  const t = useTranslations("account.domains")
  const g = useGlobalT()
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const { data: allProjects = [], isLoading } = useActiveProjectsQuery()

  const publishedProjects = allProjects.filter((p) => p.isPublished)

  const handleCopyLink = (project: DashboardProject) => {
    navigator.clipboard.writeText(getProjectLink(project))
    setCopiedId(project.id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  return (
    <div className="space-y-12">

      <section className="space-y-6">
        <div>
          <h2 className="font-serif text-2xl md:text-3xl">{t("title")}</h2>
          <p className="mt-1 text-muted-foreground">{t("description")}</p>
        </div>

        <div className="rounded-2xl bg-card shadow-sm">
          {isLoading ? (
            <div className="divide-y divide-border/40">
              {[1, 2].map((i) => (
                <div key={i} className="flex items-center gap-4 p-5">
                  <Skeleton className="size-16 shrink-0 rounded-lg" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-40" />
                    <Skeleton className="h-3 w-24" />
                    <Skeleton className="h-3 w-48" />
                  </div>
                </div>
              ))}
            </div>
          ) : publishedProjects.length === 0 ? (
            <div className="flex flex-col items-center gap-2 py-12 text-center">
              <Globe className="size-8 text-muted-foreground/40" />
              <p className="text-sm text-muted-foreground">{t("noPublished")}</p>
              <p className="text-xs text-muted-foreground">{t("publishPrompt")}</p>
            </div>
          ) : (
            <div className="divide-y divide-border/40">
              {publishedProjects.map((project) => (
            <div
              key={project.id}
              className="relative flex items-center gap-4 p-5"
            >
              {/* Mobile share (top-right, icon only) */}
              <div className="absolute right-2 top-2 z-10 sm:hidden">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <Share2 className="size-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48 rounded-xl">
                    <DropdownMenuItem onClick={() => handleCopyLink(project)}>
                      <Copy className="mr-2 size-4" />
                      Copy link
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => window.open(getProjectLink(project), "_blank")}
                    >
                      <ExternalLink className="mr-2 size-4" />
                      Open project
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              {/* Cover */}
              <div className="relative size-16 shrink-0 overflow-hidden rounded-lg bg-muted">
                {project.preview?.heroImageUrl ? (
                  <Image
                    src={project.preview.heroImageUrl}
                    alt={project.name}
                    fill
                    sizes="64px"
                    className="object-cover"
                  />
                ) : (
                  <div className="flex size-full items-center justify-center">
                    {project.mode === "photobook" ? (
                      <BookOpen className="size-5 text-muted-foreground/40" />
                    ) : (
                      <Layout className="size-5 text-muted-foreground/40" />
                    )}
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <h4 className="truncate font-medium mr-4">{project.name}</h4>
                </div>

                <div className="mt-1 flex items-center gap-2 text-sm text-muted-foreground">
                  {project.mode === "photobook" ? (
                    <BookOpen className="size-3.5" />
                  ) : (
                    <Layout className="size-3.5" />
                  )}
                  <span>
                    {project.mode === "photobook" ? g("project.mode.photobook") : g("project.mode.portfolio")}
                  </span>
                </div>

                <div className="mt-2 flex min-w-0 items-center gap-2 text-sm">
                  <Globe className="size-3.5 text-primary" />
                  <span className="truncate font-medium text-primary">
                    {getProjectDomain(project)}
                  </span>
                </div>
              </div>

              {/* Desktop actions */}
              <div className="hidden shrink-0 items-center gap-2 sm:flex">
                <Button
                  variant="ghost"
                  size="sm"
                  className="rounded-full"
                  onClick={() => handleCopyLink(project)}
                >
                  {copiedId === project.id ? (
                    <>
                      <Check className="mr-1.5 size-3.5 text-green-600" />
                      {t("copied")}
                    </>
                  ) : (
                    <>
                      <Copy className="mr-1.5 size-3.5" />
                      {t("copyLink")}
                    </>
                  )}
                </Button>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm" className="rounded-full">
                      <Share2 className="mr-1.5 size-3.5" />
                      Share
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48 rounded-xl">
                    <DropdownMenuItem onClick={() => handleCopyLink(project)}>
                      <Copy className="mr-2 size-4" />
                      {t("copyLink")}
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => window.open(getProjectLink(project), "_blank")}
                    >
                      <ExternalLink className="mr-2 size-4" />
                      {t("openProject")}
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>
                      <Share2 className="mr-2 size-4" />
                      {t("shareVia")}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
