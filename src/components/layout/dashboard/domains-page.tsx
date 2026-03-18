"use client"

import { useState } from "react"
import { Globe, Copy, ExternalLink, MoreHorizontal, BookOpen, Layout, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import Image from "next/image"
import { useTranslations } from "next-intl"

interface Project {
  id: string
  name: string
  type: "photobook" | "site"
  status: "published" | "draft"
  domain: string
  cover: string
}

const projects: Project[] = [
  { id: "1", name: "Summer Wedding 2024", type: "photobook", status: "published", domain: "summer-wedding-2024.milestis.app", cover: "/placeholder.svg?height=80&width=120" },
  { id: "2", name: "Photography Portfolio", type: "site", status: "published", domain: "jane-portfolio.milestis.app", cover: "/placeholder.svg?height=80&width=120" },
  { id: "3", name: "Birthday Memories", type: "photobook", status: "draft", domain: "вЂ”", cover: "/placeholder.svg?height=80&width=120" },
]

const typeIcons = { photobook: BookOpen, site: Layout }

export function DomainsPage() {
  const [copiedId, setCopiedId] = useState<string | null>(null)

  const handleCopy = (project: Project) => {
    navigator.clipboard.writeText(`https://${project.domain}`)
    setCopiedId(project.id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  const t = useTranslations()

  return (
    <div className="mx-auto max-w-6xl space-y-10">

      {/* Header */}
      <div>
        <h1 className="font-serif text-2xl md:text-3xl">{t('domains.title')}</h1>
        <p className="mt-1 text-muted-foreground">{t('domains.description')}</p>
      </div>

      {/* Project list */}
      <Card className="rounded-2xl shadow-sm">
        <div className="divide-y divide-border/40">
          {projects.map((project) => {
            const TypeIcon = typeIcons[project.type]
            const isPublished = project.status === "published"
            return (
              <div key={project.id} className="flex items-center gap-4 p-5">
                {/* Cover */}
                <div className="relative size-14 shrink-0 overflow-hidden rounded-xl bg-muted">
                  <Image src={project.cover || "/placeholder.svg"} alt={project.name} fill sizes="56px" className="object-cover" />
                </div>

                {/* Info */}
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="truncate font-medium">{project.name}</span>
                    <span className="flex items-center gap-1 rounded-full bg-secondary px-2.5 py-0.5 text-xs font-medium">
                      <TypeIcon className="size-3" />
                      {project.type === "photobook" ? t('templates.type.photobook') : t('templates.type.site')}
                    </span>
                    <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
                      isPublished ? "bg-emerald-500/10 text-emerald-600" : "bg-muted text-muted-foreground"
                    }`}>
                      {isPublished ? t('project.status.published') : t('project.status.draft')}
                    </span>
                  </div>
                  <p className="mt-1 truncate text-sm text-muted-foreground">
                    {isPublished ? project.domain : t('domains.notPublished')}
                  </p>
                </div>

                {/* Actions */}
                <div className="flex shrink-0 items-center gap-2">
                  {isPublished && (
                    <Button size="sm" variant="ghost" className="rounded-full" onClick={() => handleCopy(project)}>
                      {copiedId === project.id
                        ? <><Check className="mr-1.5 size-3.5 text-emerald-600" /> {t('domains.copied')}</>
                        : <><Copy className="mr-1.5 size-3.5" /> {t('domains.copyLink')}</>
                      }
                    </Button>
                  )}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button size="icon" variant="ghost" className="size-8 rounded-full">
                        <MoreHorizontal className="size-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="rounded-xl">
                      {isPublished && (
                        <>
                          <DropdownMenuItem className="rounded-lg">
                            <Copy className="mr-2 size-4" /> {t('domains.copyLink')}
                          </DropdownMenuItem>
                          <DropdownMenuItem className="rounded-lg">
                            <ExternalLink className="mr-2 size-4" /> {t('domains.openProject')}
                          </DropdownMenuItem>
                        </>
                      )}
                      <DropdownMenuItem className="rounded-lg">
                        <Globe className="mr-2 size-4" />
                        {isPublished ? t('domains.domainSettings') : t('domains.publishProject')}
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            )
          })}

          {projects.length === 0 && (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="flex size-12 items-center justify-center rounded-xl bg-secondary">
                <Globe className="size-5 text-primary" />
              </div>
              <h3 className="mt-4 font-serif text-xl">{t('emptyState.noProjects')}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{t('domains.createPrompt')}</p>
            </div>
          )}
        </div>
      </Card>

      {/* Info note */}
      <Card className="rounded-2xl shadow-sm">
        <CardContent className="flex items-start gap-3 p-5">
        <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-secondary">
          <Globe className="size-4 text-primary" />
        </div>
        <div>
          <p className="font-medium">{t('domains.aboutTitle')}</p>
          <p className="mt-0.5 text-sm text-muted-foreground">{t('domains.aboutDescription')}</p>
        </div>
        </CardContent>
      </Card>

    </div>
  )
}
