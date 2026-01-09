"use client"

import { useContentSelector, useUiSelector } from '@/editor/lib/store'
import { MediaPickerModal } from '@/editor/components/editor/layout/Modals/media-picker-modal'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Trash2, Plus, Wand2 } from 'lucide-react'
import { aspectRatios } from '@/editor/lib/aspect-ratios'
import type { FrameStyle, AspectRatio } from '@/editor/lib/types'
import { useId, useState } from 'react'
import { PortfolioImagePicker } from '@/editor/components/editor/section-settings/ui/portfolio-image-picker'
import { FeaturedWorkHeaderPanel } from './featured-work-panels'

export function FeaturedWorkSettings() {
  const ownerId = useId()
  const { featuredWork, updateSectionContent } = useContentSelector((state) => ({
    featuredWork: state.sectionContent.featuredWork,
    updateSectionContent: state.updateSectionContent,
  }))
  const { openMediaPicker } = useUiSelector((state) => ({
    openMediaPicker: state.openMediaPicker,
  }))
  const [activeProjectIndex, setActiveProjectIndex] = useState<number | null>(null)

  const handleImageSelect = (url: string) => {
    if (activeProjectIndex === null) return
    const newProjects = [...featuredWork.projects]
    const project = newProjects[activeProjectIndex]
    if (!project) return
    newProjects[activeProjectIndex] = { ...project, image: url }
    updateSectionContent('featuredWork', { projects: newProjects })
  }

  const applyAspectRatioToAll = (ratio: AspectRatio) => {
    const updatedProjects = featuredWork.projects.map(project => ({
      ...project,
      aspectRatio: ratio
    }))
    updateSectionContent('featuredWork', { projects: updatedProjects })
  }

  return (
    <div className="px-6 py-5 space-y-6">
      <MediaPickerModal ownerId={ownerId} onSelectImage={handleImageSelect} />

      <div className="space-y-1">
        <h3 className="text-sm font-medium leading-none">Featured Work</h3>
        <p className="text-xs text-muted-foreground">Showcase your best projects</p>
      </div>

      <div className="space-y-7">
        <FeaturedWorkHeaderPanel />

        <div className="rounded-xl bg-muted/40 p-3 space-y-2">
          <div className="flex items-center gap-2">
            <Wand2 className="w-3.5 h-3.5 text-muted-foreground" />
            <span className="text-xs font-medium text-foreground">Quick Actions</span>
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

        <div className="space-y-3">
          <div className="flex items-center justify-between gap-3">
            <Label className="text-xs font-medium text-muted-foreground">Projects</Label>
            <Button
              variant="outline"
              size="sm"
              className="h-8 text-xs"
              onClick={() => {
                const newProject = {
                  title: 'New Project',
                  description: '',
                  image: '',
                  tags: [] as string[],
                  aspectRatio: 'landscape' as AspectRatio,
                  frameStyle: 'soft' as FrameStyle,
                }
                updateSectionContent('featuredWork', {
                  projects: [...featuredWork.projects, newProject],
                })
              }}
            >
              <Plus className="w-3.5 h-3.5 mr-2" /> Add
            </Button>
          </div>

          <div className="space-y-4">
            {featuredWork.projects.map((project, index) => (
              <div key={index} className="rounded-xl bg-muted/30 p-3 space-y-4 relative">
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-2 top-2 h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-muted"
                  onClick={() => {
                    const newProjects = featuredWork.projects.filter((_, i) => i !== index)
                    updateSectionContent('featuredWork', { projects: newProjects })
                  }}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>

                <div className="space-y-2 pr-10">
                  <Input
                    className="h-8 text-xs font-medium border-0 px-0 bg-transparent focus-visible:ring-0 placeholder:text-muted-foreground/60"
                    placeholder="Project title"
                    value={project.title}
                    onChange={(e) => {
                      const newProjects = [...featuredWork.projects]
                      newProjects[index] = { ...project, title: e.target.value }
                      updateSectionContent('featuredWork', { projects: newProjects })
                    }}
                  />
                  <Textarea
                    className="min-h-17.5 text-xs resize-none"
                    placeholder="Short description..."
                    value={project.description}
                    onChange={(e) => {
                      const newProjects = [...featuredWork.projects]
                      newProjects[index] = { ...project, description: e.target.value }
                      updateSectionContent('featuredWork', { projects: newProjects })
                    }}
                  />
                </div>

                <PortfolioImagePicker
                  label="Cover Image"
                  value={{
                    image: project.image,
                    aspectRatio: (project.aspectRatio || 'landscape') as AspectRatio,
                    frameStyle: project.frameStyle,
                  }}
                  onChange={(value) => {
                    const newProjects = [...featuredWork.projects]
                    newProjects[index] = {
                      ...project,
                      image: value.image,
                      aspectRatio: value.aspectRatio,
                      frameStyle: value.frameStyle,
                    }
                    updateSectionContent('featuredWork', { projects: newProjects })
                  }}
                  onOpenMediaPicker={() => {
                    setActiveProjectIndex(index)
                    openMediaPicker(ownerId)
                  }}
                />
              </div>
            ))}

            {featuredWork.projects.length === 0 && (
              <Button
                variant="outline"
                size="sm"
                className="w-full h-9 text-xs border-dashed text-muted-foreground hover:text-foreground"
                onClick={() => {
                  const newProject = {
                    title: 'New Project',
                    description: '',
                    image: '',
                    tags: [] as string[],
                    aspectRatio: 'landscape' as AspectRatio,
                    frameStyle: 'soft' as FrameStyle,
                  }
                  updateSectionContent('featuredWork', {
                    projects: [...featuredWork.projects, newProject],
                  })
                }}
              >
                <Plus className="w-3.5 h-3.5 mr-2" /> Add your first project
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}