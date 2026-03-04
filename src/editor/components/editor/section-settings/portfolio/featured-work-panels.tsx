"use client"

import { useContentSelector, useUiStore } from "@/editor/lib/store"
import { useSectionRestrictions } from "@/editor/hooks/use-section-restrictions"
import { Input } from "@/components/ui/input"
import { PanelLabel } from "@/editor/components/editor/section-settings/ui/panel-label"
import { ps } from "@/editor/components/editor/section-settings/ui/panel-styles"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, Plus, Trash2, Wand2 } from "lucide-react"
import type { AspectRatio, FrameStyle } from "@/editor/lib/types"
import { MediaPickerModal } from "@/editor/components/editor/layout/Modals/media-picker-modal"
import { useCallback, useId, useMemo, useState } from "react"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import { aspectRatios } from "@/editor/lib/aspect-ratios"
import { PortfolioImagePicker } from "@/editor/components/editor/section-settings/ui/portfolio-image-picker"

export function FeaturedWorkHeaderPanel({ dense = false }: { dense?: boolean }) {
  const { featuredWork, updateSectionContent } = useContentSelector((state) => ({
    featuredWork: state.sectionContent.featuredWork,
    updateSectionContent: state.updateSectionContent,
  }))

  return (
    <div className={ps.root(dense)}>
      {!dense && <PanelLabel>Section Header</PanelLabel>}
      <div className={ps.grid2(dense)}>
        <Input
          className={ps.input}
          value={featuredWork.title}
          onChange={(e) => updateSectionContent("featuredWork", { title: e.target.value })}
          placeholder="My best work"
        />
        <Input
          className={ps.input}
          value={featuredWork.subtitle || ""}
          onChange={(e) => updateSectionContent("featuredWork", { subtitle: e.target.value })}
          placeholder="Subtitle"
        />
      </div>
    </div>
  )
}

export function FeaturedWorkProjectsPanel({dense = false}: {dense?: boolean}) {
  const ownerId = useId()

  const { featuredWork, updateSectionContent } = useContentSelector((state) => ({
    featuredWork: state.sectionContent.featuredWork,
    updateSectionContent: state.updateSectionContent,
  }))

  const openMediaPicker = useUiStore((s) => s.openMediaPicker)
  const featuredWorkRestrictions = useSectionRestrictions('featuredWork')

  const projects = featuredWork.projects ?? []

  const [activeProjectIndex, setActiveProjectIndex] = useState<number>(() =>
    projects.length ? 0 : -1
  )

  const normalizedIndex = useMemo(() => {
    if (!projects.length) return -1
    return Math.min(Math.max(activeProjectIndex, 0), projects.length - 1)
  }, [activeProjectIndex, projects.length])

  const activeProject =
    normalizedIndex >= 0 ? projects[normalizedIndex] : null

  const updateActiveProject = useCallback(
    (patch: Partial<(typeof projects)[0]>) => {
      if (normalizedIndex < 0) return
      updateSectionContent("featuredWork", {
        projects: projects.map((p, i) => (i === normalizedIndex ? { ...p, ...patch } : p)),
      })
    },
    [normalizedIndex, projects, updateSectionContent],
  )

  const handleImageSelect = (url: string) => {
    updateActiveProject({ image: url })
  }

  const applyAspectRatioToAll = (ratio: AspectRatio) => {
    updateSectionContent("featuredWork", {
      projects: projects.map((p) => ({ ...p, aspectRatio: ratio })),
    })
  }

  const addProject = () => {
    const next = [
      ...projects,
      {
        id: crypto.randomUUID(),
        title: "New Project",
        description: "",
        image: "",
        tags: [],
        aspectRatio: "landscape" as AspectRatio,
        frameStyle: "soft" as FrameStyle,
      },
    ]
    updateSectionContent("featuredWork", { projects: next })
    setActiveProjectIndex(next.length - 1)
  }

  const deleteProject = (idx: number) => {
    const next = projects.filter((_, i) => i !== idx)
    updateSectionContent("featuredWork", { projects: next })
    setActiveProjectIndex(next.length ? Math.min(idx, next.length - 1) : -1)
  }

  return (
    <div className={ps.root(dense)}>
      <MediaPickerModal ownerId={ownerId} onSelectImage={handleImageSelect} />

      {/* Quick actions */}
      {!dense && (
        <div className="rounded-xl bg-muted/40 p-3 space-y-2">
          <div className="flex items-center gap-2">
            <Wand2 className="w-3.5 h-3.5 text-muted-foreground" />
            <span className="text-xs font-medium text-foreground">
              Quick Actions
            </span>
          </div>

          <Select onValueChange={applyAspectRatioToAll}>
            <SelectTrigger className="h-8 text-xs bg-background">
              <SelectValue placeholder="Set aspect ratio for all" />
            </SelectTrigger>
            <SelectContent>
              {Object.values(aspectRatios).map((ratio) => (
                <SelectItem key={ratio.id} value={ratio.id}>
                  {ratio.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      {/* Projects */}
      <div className="space-y-3">
        <div className="flex items-center justify-between gap-3">
          {!dense && <PanelLabel>Projects</PanelLabel>}
          <Button
            variant="ghost"
            size="sm"
            className={`${ps.addBtn} ${dense ? "ml-auto" : ""}`}
            onClick={addProject}
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
                  {normalizedIndex + 1} / {projects.length}
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
              <div className="rounded-xl bg-muted/30 p-3 space-y-4 relative">
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-2 top-2 h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-muted"
                  onClick={() => deleteProject(normalizedIndex)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>

                <div className="space-y-2 pr-10">
                  <Input
                    className="h-8 text-xs font-medium border-0 px-0 bg-transparent focus-visible:ring-0 placeholder:text-muted-foreground/60"
                    value={activeProject.title}
                    placeholder="Project title"
                    onChange={(e) => updateActiveProject({ title: e.target.value })}
                  />

                  <Textarea
                    className="min-h-17.5 text-xs resize-none"
                    value={activeProject.description}
                    placeholder="Short description..."
                    onChange={(e) => updateActiveProject({ description: e.target.value })}
                  />
                </div>

                <PortfolioImagePicker
                  label="Cover Image"
                  value={{
                    image: activeProject.image,
                    aspectRatio:
                      (activeProject.aspectRatio || "square") as AspectRatio,
                    frameStyle: activeProject.frameStyle,
                    cropData: activeProject.cropData,
                  }}
                  onChange={updateActiveProject}
                  onOpenMediaPicker={() => openMediaPicker(ownerId)}
                  restrictions={featuredWorkRestrictions}
                />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}