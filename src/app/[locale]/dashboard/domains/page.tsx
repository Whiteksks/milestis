"use client"

import { useState } from "react"
import { Globe, Copy, ExternalLink, BookOpen, Layout, Check, Lock, MoreHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useTranslations } from "next-intl"
import { usePublishedProjectsQuery, getProjectShareUrl } from "@/hooks/useProjectsQuery"
import type { DashboardProject } from "@/hooks/useProjectsQuery"
import Image from "next/image"
import { cn } from "@/lib/utils"

function ProjectItem({ 
  project, 
  index,
  onCopy, 
  isCopied 
}: { 
  project: DashboardProject, 
  index: number,
  onCopy: (p: DashboardProject) => void, 
  isCopied: boolean 
}) {
  const t = useTranslations()
  const shareUrl = getProjectShareUrl(project)
  const hasToken = project.mode === 'photobook' ? !!project.publishedAccessToken : true
  const heroImage = project.preview?.heroImageUrl
  const displayIndex = (index + 1).toString().padStart(2, '0')

  return (
    <div className="group relative flex items-center gap-4 py-4 transition-colors hover:bg-muted/5 md:gap-6">
      <div className="flex items-center gap-3 shrink-0">
        <span className="font-mono text-[9px] tracking-widest text-muted-foreground/40">
          {displayIndex}
        </span>
        <div className="relative size-11 shrink-0 overflow-hidden rounded-full bg-muted ring-1 ring-border/40">
          {heroImage ? (
            <Image src={heroImage} alt={project.name} fill sizes="44px" className="object-cover" />
          ) : (
            <div className="flex size-full items-center justify-center text-muted-foreground/20">
              {project.mode === 'photobook' ? <BookOpen className="size-4" /> : <Layout className="size-4" />}
            </div>
          )}
        </div>
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <h3 className="truncate font-serif text-base tracking-tight text-foreground md:text-lg">
            {project.name}
          </h3>
          <span className="text-[8px] font-bold uppercase tracking-widest text-muted-foreground/30">
            {project.mode}
          </span>
        </div>
        
        <div className="flex items-center gap-2">
          {hasToken && shareUrl ? (
            <a 
              href={shareUrl} 
              target="_blank" 
              className="group/link flex items-center gap-1 font-mono text-[12px] text-muted-foreground hover:text-primary"
            >
              <span className="truncate max-w-[150px] md:max-w-xs">{shareUrl.replace(/^https?:\/\//, '')}</span>
              <ExternalLink className="size-3 opacity-40 group-hover/link:opacity-100" />
            </a>
          ) : (
            <span className="flex items-center gap-1 font-mono text-[10px] uppercase tracking-tighter text-orange-500/60">
              <Lock className="size-3" /> {t('account.domains.tokenUnavailable')}
            </span>
          )}
        </div>
      </div>

      <div className="flex items-center gap-1">
        {hasToken && shareUrl && (
          <Button
            variant="ghost"
            size="sm"
            className={cn(
              "hidden h-7 rounded-md px-2 text-[10px] font-medium md:flex transition-opacity",
              isCopied ? "text-emerald-600" : "text-muted-foreground opacity-0 group-hover:opacity-100"
            )}
            onClick={() => onCopy(project)}
          >
            {isCopied ? <Check className="mr-1 size-3" /> : <Copy className="mr-1 size-3" />}
            {isCopied ? t('domains.copied') : t('domains.copyLink')}
          </Button>
        )}

        {/* Иконка More теперь всегда видна для удобства на мобильных */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button size="icon" variant="ghost" className="size-8 text-muted-foreground/60 hover:text-foreground md:opacity-0 md:group-hover:opacity-100">
              <MoreHorizontal className="size-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48 rounded-lg border-border/50">
            {shareUrl ? (
              <>
                <DropdownMenuItem onClick={() => window.open(shareUrl, '_blank')}>
                  <ExternalLink className="mr-2 size-4 opacity-50" /> {t('domains.openProject')}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onCopy(project)} className="font-medium text-primary">
                  <Copy className="mr-2 size-4 opacity-50" /> {t('domains.copyLink')}
                </DropdownMenuItem>
              </>
            ) : (
              <DropdownMenuItem disabled>{t('account.domains.tokenUnavailable')}</DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  )
}

export default function DomainsPage() {
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const t = useTranslations()
  const { data: publishedProjects = [], isLoading } = usePublishedProjectsQuery()

  const handleCopy = (project: DashboardProject) => {
    const url = getProjectShareUrl(project)
    if (!url) return
    navigator.clipboard.writeText(url)
    setCopiedId(project.id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6 md:px-4 md:py-8">
      <header className="flex flex-col gap-6 border-b border-border/40 pb-8 sm:flex-row sm:items-end sm:justify-between">
        <div className="flex items-baseline gap-3">
          <h1 className="font-serif text-3xl md:text-5xl tracking-tighter text-foreground">
            {t('domains.title')}
          </h1>
          <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-primary/50">
            / {publishedProjects.length}
          </span>
        </div>
        <p className="max-w-[240px] text-[12px] leading-snug text-muted-foreground/80 italic">
          {t('domains.description')}
        </p>
      </header>

      <div className="min-h-[300px]">
        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center gap-4 py-2">
                <Skeleton className="size-11 rounded-full" />
                <div className="flex-1 space-y-2"><Skeleton className="h-4 w-1/4" /><Skeleton className="h-3 w-1/3" /></div>
              </div>
            ))}
          </div>
        ) : publishedProjects.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <Globe className="mb-4 size-5 text-muted-foreground/10" />
            <h3 className="font-serif text-xl text-foreground/60">{t('emptyState.noProjects')}</h3>
          </div>
        ) : (
          <div className="flex flex-col divide-y divide-border/40">
            {publishedProjects.map((project, index) => (
              <ProjectItem 
                key={project.id} 
                index={index}
                project={project} 
                onCopy={handleCopy} 
                isCopied={copiedId === project.id} 
              />
            ))}
          </div>
        )}
      </div>

      <footer className="grid gap-6 border-t border-border/40 pt-10 md:grid-cols-2">
        <div className="space-y-2">
          <p className="text-[13px] font-medium text-foreground">
            Global Infrastructure
          </p>
          <p className="text-[12px] leading-relaxed text-muted-foreground/70">
            Every project on <strong>milestis.site</strong> is deployed to a global edge network, ensuring lightning-fast load times and bank-grade SSL security for your audience.
          </p>
        </div>
        <div className="flex flex-col items-start gap-2 md:items-end">
          <span className="text-[11px] font-mono uppercase tracking-widest text-primary/60">Status: Active</span>
          <p className="text-[12px] text-muted-foreground/70 md:text-right">
            Your sites are optimized and ready for high-traffic distribution.
          </p>
        </div>
      </footer>
    </div>
  )
}