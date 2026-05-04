"use client"

import { useContentSelector, useUiStore } from "@/editor/lib/store"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import { ps } from "@/editor/components/editor/section-settings/ui/panel-ui"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, Plus, Shuffle, Trash2, Wand2 } from "lucide-react"
import type { AspectRatio } from "@/editor/lib/types"
import { MediaPickerModal } from "@/editor/components/editor/layout/Modals/media-picker-modal"
import { useCallback, useId, useMemo, useState } from "react"
import { ImagePicker, createPortfolioRepeatingImage, type ImageValue } from "@/editor/image"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import { aspectRatios, RATIO_LABELS } from "@/editor/lib/aspect-ratios"

import { LIMITS, editorialInput, editorialLabel } from "@/editor/components/editor/section-settings/ui/panel-ui"

export function FeaturedWorkHeaderPanel({ dense = false }: { dense?: boolean }) {
  const { featuredWork, updateSectionContent } = useContentSelector((state) => ({
    featuredWork: state.sectionContent.featuredWork,
    updateSectionContent: state.updateSectionContent,
  }))

  if (dense) {
    return (
      <div className={ps.root(true)}>
        <div className={ps.grid2(true)}>
          <Input className={ps.input} value={featuredWork.title} onChange={(e) => updateSectionContent("featuredWork", { title: e.target.value })} placeholder="My best work" maxLength={LIMITS.title} />
          <Input className={ps.input} value={featuredWork.subtitle || ""} onChange={(e) => updateSectionContent("featuredWork", { subtitle: e.target.value })} placeholder="Subtitle" maxLength={LIMITS.subtitle} />
        </div>
      </div>
    )
  }

  return (
    <div className="py-2">
      <div className="grid grid-cols-2 divide-x divide-border/30 border-b border-border/30 pb-6">
        <div className="space-y-1 pr-2">
          <label className={editorialLabel}>Title</label>
          <Input
            className={cn(editorialInput, "text-base font-medium tracking-tight text-foreground")}
            value={featuredWork.title}
            onChange={(e) => updateSectionContent("featuredWork", { title: e.target.value })}
            placeholder="My best work"
            maxLength={LIMITS.title}
          />
        </div>
        <div className="space-y-1 pl-2">
          <label className={editorialLabel}>Subtitle</label>
          <Input
            className={cn(editorialInput, "text-base text-muted-foreground")}
            value={featuredWork.subtitle || ""}
            onChange={(e) => updateSectionContent("featuredWork", { subtitle: e.target.value })}
            placeholder="A curated selection"
            maxLength={LIMITS.subtitle}
          />
        </div>
      </div>
    </div>
  )
}

export function FeaturedWorkProjectsPanel({dense = false}: {dense?: boolean}) {
  const ownerId = useId()
  const quickPlacementOwnerId = useId()

  const {
    featuredWork,
    portfolioImageContent,
    updateSectionContent,
    appendPortfolioRepeatingImage,
    replacePortfolioRepeatingImage,
    removePortfolioRepeatingImage,
  } = useContentSelector((state) => ({
    featuredWork: state.sectionContent.featuredWork,
    portfolioImageContent: state.portfolioImageContent,
    updateSectionContent: state.updateSectionContent,
    appendPortfolioRepeatingImage: state.appendPortfolioRepeatingImage,
    replacePortfolioRepeatingImage: state.replacePortfolioRepeatingImage,
    removePortfolioRepeatingImage: state.removePortfolioRepeatingImage,
  }))

  const openMediaPicker = useUiStore((s) => s.openMediaPicker)

  const projects = useMemo(() => featuredWork.projects ?? [], [featuredWork.projects])

  const [activeProjectIndex, setActiveProjectIndex] = useState<number>(() =>
    projects.length ? 0 : -1
  )

  const normalizedIndex = useMemo(() => {
    if (!projects.length) return -1
    return Math.min(Math.max(activeProjectIndex, 0), projects.length - 1)
  }, [activeProjectIndex, projects.length])

  const activeProject =
    normalizedIndex >= 0 ? projects[normalizedIndex] : null
  const activeManagedImage = activeProject
    ? portfolioImageContent.featuredWork.find((entry) => entry.id === activeProject.id)
    : undefined
  const emptyValue: ImageValue = useMemo(() => ({ asset: { src: "", width: 0, height: 0 } }), [])
  const pickerValue = activeManagedImage?.value ?? emptyValue

  const updateActiveProject = useCallback(
    (patch: Partial<(typeof projects)[0]>) => {
      if (normalizedIndex < 0) return
      updateSectionContent("featuredWork", {
        projects: projects.map((p, i) => (i === normalizedIndex ? { ...p, ...patch } : p)),
      })
    },
    [normalizedIndex, projects, updateSectionContent],
  )

  const handleImageSelect = useCallback(async (url: string, thumbUrl?: string) => {
    if (!activeProject) return
    const image = await createPortfolioRepeatingImage({
      id: activeProject.id,
      sectionId: 'featured-work',
      src: url,
      blurDataUrl: thumbUrl,
      alt: activeProject.title,
      description: activeProject.description,
    })
    if (activeManagedImage) {
      replacePortfolioRepeatingImage('featured-work', activeProject.id, image)
      return
    }
    appendPortfolioRepeatingImage('featured-work', image)
  }, [activeManagedImage, activeProject, appendPortfolioRepeatingImage, replacePortfolioRepeatingImage])

  const handleQuickPlacement = useCallback(
    async (urls: string[]) => {
      if (!urls.length || !projects.length) return
      for (let i = 0; i < projects.length; i += 1) {
        const project = projects[i]
        const url = urls[i % urls.length]
        const image = await createPortfolioRepeatingImage({
          id: project.id,
          sectionId: 'featured-work',
          src: url,
          alt: project.title,
          description: project.description,
        })
        const existing = portfolioImageContent.featuredWork.find((entry) => entry.id === project.id)
        if (existing) {
          replacePortfolioRepeatingImage('featured-work', project.id, image)
        } else {
          appendPortfolioRepeatingImage('featured-work', image)
        }
      }
    },
    [appendPortfolioRepeatingImage, portfolioImageContent.featuredWork, projects, replacePortfolioRepeatingImage],
  )

  const applyAspectRatioToAll = (ratio: AspectRatio) => {
    portfolioImageContent.featuredWork.forEach((image) => {
      replacePortfolioRepeatingImage('featured-work', image.id, {
        ...image,
        value: {
          ...image.value,
          presentation: {
            ...image.value.presentation,
            ratio,
          },
        },
      })
    })
  }

  const addProject = () => {
    if (projects.length >= LIMITS.featuredWorkProjects) return
    const next = [
      ...projects,
      {
        id: crypto.randomUUID(),
        title: "New Project",
        description: "",
        tags: [],
      },
    ]
    updateSectionContent("featuredWork", { projects: next })
    setActiveProjectIndex(next.length - 1)
  }

  const deleteProject = (idx: number) => {
    const project = projects[idx]
    const next = projects.filter((_, i) => i !== idx)
    updateSectionContent("featuredWork", { projects: next })
    if (project) {
      removePortfolioRepeatingImage('featured-work', project.id)
    }
    setActiveProjectIndex(next.length ? Math.min(idx, next.length - 1) : -1)
  }

  return (
    <div className={ps.root(dense)}>
      <MediaPickerModal ownerId={ownerId} onSelectImage={handleImageSelect} />
      <MediaPickerModal ownerId={quickPlacementOwnerId} onSelectImages={handleQuickPlacement} />

      {/* Quick actions */}
      {!dense && (
        <div className="flex items-center gap-4 border-b border-border/30 pb-4">
          <label className={editorialLabel}>Quick</label>
          <div className="flex-1" />
          <Select onValueChange={applyAspectRatioToAll}>
            <SelectTrigger className="h-auto border-0 border-b border-border/40 rounded-none text-[10px] tracking-[0.1em] uppercase px-0 py-0.5 bg-transparent shadow-none focus:ring-0 gap-1.5 text-muted-foreground/50 w-auto min-w-[80px]">
              <SelectValue placeholder="Ratio: all" />
            </SelectTrigger>
            <SelectContent>
              {Object.values(aspectRatios).map((ratio) => (
                <SelectItem key={ratio.id} value={ratio.id} className="text-xs">
                  <span className="font-mono mr-1.5 text-muted-foreground">{RATIO_LABELS[ratio.id]}</span>
                  {ratio.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <button
            type="button"
            onClick={() => openMediaPicker(quickPlacementOwnerId)}
            disabled={projects.length === 0}
            className="text-[10px] tracking-[0.1em] uppercase text-muted-foreground/50 hover:text-foreground disabled:opacity-30 disabled:cursor-not-allowed transition-colors flex items-center gap-1.5"
          >
            <Shuffle className="w-3 h-3" />
            Place All
          </button>
        </div>
      )}

      {/* Projects */}
      <div className="space-y-3">
        <div className="flex items-center justify-between gap-3">
          {!dense && <label className={editorialLabel}>Projects</label>}
          <Button
            variant="ghost"
            size="sm"
            className={`${ps.addBtn} ${dense ? "ml-auto" : ""}`}
            onClick={addProject}
            disabled={projects.length >= LIMITS.featuredWorkProjects}
            title={projects.length >= LIMITS.featuredWorkProjects ? `Maximum ${LIMITS.featuredWorkProjects} projects` : undefined}
          >
            <Plus className="w-3.5 h-3.5 mr-1" /> {dense ? "Add project" : "Add"}
          </Button>
        </div>

        {projects.length === 0 ? (
          <button
            type="button"
            onClick={addProject}
            className={ps.emptyZone}
          >
            <Wand2 className={ps.emptyIcon} />
            {!dense && (
              <span className={ps.emptyText}>
                Add your first project
              </span>
            )}
          </button>
        ) : (
          <div className="space-y-4">
            {/* Switcher */}
            <div className="flex items-center justify-between gap-2">
              {!dense && (
                <span className="text-[11px] text-muted-foreground/60 tabular-nums">
                  {normalizedIndex + 1} / {projects.length} <span className="text-muted-foreground/30">({LIMITS.featuredWorkProjects} max)</span>
                </span>
              )}

              <div className="flex items-center gap-1">
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 rounded-xl"
                  onClick={() => setActiveProjectIndex(Math.max(0, normalizedIndex - 1))}
                  disabled={normalizedIndex <= 0}
                >
                  <ChevronLeft className="w-4 h-4" />
                </Button>

                <Select
                  value={String(normalizedIndex)}
                  onValueChange={(v) =>
                    setActiveProjectIndex(parseInt(v, 10))
                  }
                >
                  <SelectTrigger className="h-8 text-xs bg-background rounded-xl w-44">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {projects.map((p, idx) => (
                      <SelectItem key={p.id} value={String(idx)}>
                        {p.title?.trim() ? p.title : `Project ${idx + 1}`}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 rounded-xl"
                  onClick={() => setActiveProjectIndex(Math.min(projects.length - 1, normalizedIndex + 1))}
                  disabled={normalizedIndex >= projects.length - 1}
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Editor */}
            {activeProject && (
              <div className="space-y-4">
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <label className={editorialLabel}>Title</label>
                    <button
                      type="button"
                      onClick={() => deleteProject(normalizedIndex)}
                      className="text-[10px] tracking-[0.1em] uppercase text-muted-foreground/30 hover:text-destructive/60 transition-colors flex items-center gap-1"
                    >
                      <Trash2 className="w-3 h-3" />
                      Delete
                    </button>
                  </div>
                  <Input
                    className={cn(editorialInput, "text-sm font-medium text-foreground")}
                    value={activeProject.title}
                    placeholder="Project title"
                    onChange={(e) => updateActiveProject({ title: e.target.value })}
                    maxLength={LIMITS.projectTitle}
                  />
                </div>

                <div className="space-y-1">
                  <label className={editorialLabel}>Description</label>
                  <Textarea
                    className={cn(editorialInput, "text-sm leading-relaxed min-h-[72px] w-full max-w-full resize-none block overflow-x-hidden break-words")}
                    value={activeProject.description}
                    placeholder="Short description..."
                    onChange={(e) => updateActiveProject({ description: e.target.value })}
                    maxLength={LIMITS.projectDesc}
                  />
                </div>

                <ImagePicker
                  label="Cover Image"
                  dense={dense}
                  slotId="portfolio.featured-work.item"
                  value={pickerValue}
                  onChange={(next) => {
                    if (!activeProject) return
                    if (!next.asset.src) {
                      removePortfolioRepeatingImage('featured-work', activeProject.id)
                      return
                    }
                    if (activeManagedImage) {
                      replacePortfolioRepeatingImage('featured-work', activeProject.id, {
                        ...activeManagedImage,
                        value: next,
                      })
                    }
                  }}
                  onOpenMediaPicker={() => openMediaPicker(ownerId)}
                  showCaption={false}
                />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}