"use client"

import { useContentSelector, useUiStore } from "@/editor/lib/store"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, Image as ImageIcon, Plus, Trash2, Wand2 } from "lucide-react"
import type { AspectRatio, FrameStyle } from "@/editor/lib/types"
import { MediaPickerModal } from "@/editor/components/editor/layout/Modals/media-picker-modal"
import { useId, useMemo, useState } from "react"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import { aspectRatios } from "@/editor/lib/aspect-ratios"
import { useEffect} from "react"
import { PortfolioImagePicker } from "@/editor/components/editor/section-settings/ui/portfolio-image-picker"

export function FeaturedWorkHeaderPanel({ dense = false }: { dense?: boolean }) {
  const { featuredWork, updateSectionContent } = useContentSelector((state) => ({
    featuredWork: state.sectionContent.featuredWork,
    updateSectionContent: state.updateSectionContent,
  }))

  return (
    <div className="space-y-3">
      {!dense && <Label className="text-xs font-medium text-muted-foreground">Section Header</Label>}
      <div className="grid grid-cols-2 gap-3">
        <Input
          className="h-9 text-xs"
          value={featuredWork.title}
          onChange={(e) => updateSectionContent("featuredWork", { title: e.target.value })}
          placeholder="My best work"
        />
        <Input
          className="h-9 text-xs"
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

  const projects = featuredWork.projects ?? []

  const [activeProjectIndex, setActiveProjectIndex] = useState<number>(() =>
    projects.length ? 0 : -1
  )

  useEffect(() => {
    if (!projects.length) {
      if (activeProjectIndex !== -1) setActiveProjectIndex(-1)
      return
    }
    if (activeProjectIndex < 0) {
      setActiveProjectIndex(0)
      return
    }
    if (activeProjectIndex >= projects.length) {
      setActiveProjectIndex(projects.length - 1)
    }
  }, [activeProjectIndex, projects.length])

  const normalizedIndex = useMemo(() => {
    if (!projects.length) return -1
    return Math.min(Math.max(activeProjectIndex, 0), projects.length - 1)
  }, [activeProjectIndex, projects.length])

  const activeProject =
    normalizedIndex >= 0 ? projects[normalizedIndex] : null

  const handleImageSelect = (url: string) => {
    if (normalizedIndex < 0) return
    const next = [...projects]
    const project = next[normalizedIndex]
    if (!project) return
    next[normalizedIndex] = { ...project, image: url }
    updateSectionContent("featuredWork", { projects: next })
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
    <div className="space-y-3">
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
        {!dense && (
          <div className="flex items-center justify-between gap-3">
            <Label className="text-xs font-medium text-muted-foreground">
              Projects
            </Label>
            <Button
              variant="outline"
              size="sm"
              className="h-8 text-xs"
              onClick={addProject}
            >
              <Plus className="w-3.5 h-3.5 mr-2" /> Add
            </Button>
          </div>
        )}

        {projects.length === 0 ? (
          <Button
            variant="outline"
            size="sm"
            className="w-full h-9 text-xs border-dashed text-muted-foreground hover:text-foreground"
            onClick={addProject}
          >
            <Plus className="w-3.5 h-3.5 mr-2" /> Add your first project
          </Button>
        ) : (
          <div className="space-y-4">
            {/* Switcher */}
            <div className="flex items-center justify-between gap-2">
              {!dense && (
                <Label className="text-xs font-medium text-muted-foreground">
                  Project {normalizedIndex + 1} / {projects.length}
                </Label>
              )}

              <div className="flex items-center gap-1">
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 rounded-xl"
                  onClick={() =>
                    setActiveProjectIndex((v) => Math.max(0, v - 1))
                  }
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
                      <SelectItem key={idx} value={String(idx)}>
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
                  onClick={() =>
                    setActiveProjectIndex((v) =>
                      Math.min(projects.length - 1, v + 1)
                    )
                  }
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
                    onChange={(e) => {
                      const next = [...projects]
                      next[normalizedIndex] = {
                        ...activeProject,
                        title: e.target.value,
                      }
                      updateSectionContent("featuredWork", {
                        projects: next,
                      })
                    }}
                  />

                  <Textarea
                    className="min-h-17.5 text-xs resize-none"
                    value={activeProject.description}
                    placeholder="Short description..."
                    onChange={(e) => {
                      const next = [...projects]
                      next[normalizedIndex] = {
                        ...activeProject,
                        description: e.target.value,
                      }
                      updateSectionContent("featuredWork", {
                        projects: next,
                      })
                    }}
                  />
                </div>

                <PortfolioImagePicker
                  label="Cover Image"
                  value={{
                    image: activeProject.image,
                    aspectRatio:
                      (activeProject.aspectRatio || "landscape") as AspectRatio,
                    frameStyle: activeProject.frameStyle,
                    cropData: activeProject.cropData,
                  }}
                  onChange={(value) => {
                    const next = [...projects]
                    next[normalizedIndex] = {
                      ...activeProject,
                      image: value.image,
                      aspectRatio: value.aspectRatio,
                      frameStyle: value.frameStyle,
                      cropData: value.cropData,
                    }
                    updateSectionContent("featuredWork", {
                      projects: next,
                    })
                  }}
                  onOpenMediaPicker={() => {
                    setActiveProjectIndex(normalizedIndex)
                    openMediaPicker(ownerId)
                  }}
                />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}