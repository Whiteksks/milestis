"use client"

import { useContentStore, useUiStore } from '@/editor/lib/store'
import { MediaPickerModal } from '@/editor/components/editor/ui/media-picker-modal'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Trash2, Plus, Wand2 } from 'lucide-react'
import { aspectRatios } from '@/editor/lib/aspect-ratios'
import type { FrameStyle, AspectRatio } from '@/editor/lib/types'
import { useState } from 'react'
import { Separator } from '@/components/ui/separator'
import { PortfolioImagePicker } from '@/editor/components/editor/section-settings/ui/portfolio-image-picker'

export function FeaturedWorkSettings() {
  const { sectionContent, updateSectionContent } = useContentStore()
  const { toggleMediaPicker } = useUiStore()
  const [activeProjectIndex, setActiveProjectIndex] = useState<number | null>(null)
  
  const inputStyle = "h-9 rounded-xl border-slate-200 bg-white focus:ring-slate-900 text-xs"
  const textareaStyle = "rounded-xl border-slate-200 bg-white focus:ring-slate-900 text-xs resize-none"

  const handleImageSelect = (url: string) => {
    if (activeProjectIndex === null) return
    const newProjects = [...sectionContent.featuredWork.projects]
    const project = newProjects[activeProjectIndex]
    if (!project) return
    newProjects[activeProjectIndex] = { ...project, image: url }
    updateSectionContent('featuredWork', { projects: newProjects })
  }

  const applyAspectRatioToAll = (ratio: AspectRatio) => {
    const updatedProjects = sectionContent.featuredWork.projects.map(project => ({
      ...project,
      aspectRatio: ratio
    }))
    updateSectionContent('featuredWork', { projects: updatedProjects })
  }

  return (
    <div className="p-6 max-w-lg mx-auto space-y-8">
      {/* Image picker modal for choosing from previously uploaded photos */}
      <MediaPickerModal onSelectImage={handleImageSelect} />

      {/* Общий заголовок настроек */}
      <div>
        <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-900">
          Featured Work
        </h3>
        <p className="text-[11px] text-slate-500 mt-1 font-medium">Showcase your best projects.</p>
      </div>

      {/* Секция 1: Заголовок Секции */}
      <div className="space-y-4">
        <h4 className="text-sm font-medium text-slate-900">Section Title</h4>
        <div className="space-y-2">
          <Label className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 ml-1">Title</Label>
          <Input 
            className={inputStyle} 
            value={sectionContent.featuredWork.title} 
            onChange={(e) => updateSectionContent('featuredWork', { title: e.target.value })} 
            placeholder="My Best Work"
          />
        </div>        <div className="space-y-2">
          <Label className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 ml-1">Subtitle</Label>
          <Input 
            className={inputStyle} 
            value={sectionContent.featuredWork.subtitle || ''} 
            onChange={(e) => updateSectionContent('featuredWork', { subtitle: e.target.value })} 
            placeholder="Portfolio"
          />
        </div>      </div>

      <Separator className="bg-slate-100" />
      
      {/* Секция 2: Массовое обновление */}
      <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-3">
        <div className="flex items-center gap-2">
          <Wand2 className="w-3.5 h-3.5 text-slate-500" />
          <Label className="text-xs font-semibold text-slate-900">Quick Actions</Label>
        </div>
        <p className="text-[11px] text-slate-500 font-medium">Change aspect ratio for all images at once.</p>
        
        <div className="flex gap-2">
          <Select onValueChange={applyAspectRatioToAll} defaultValue={sectionContent.featuredWork.projects[0]?.aspectRatio || 'landscape'}>
            <SelectTrigger className="flex-1 h-9 rounded-xl border-slate-200 bg-white hover:border-slate-300 text-xs shadow-sm">
              <SelectValue placeholder="Select Ratio" />
            </SelectTrigger>
            <SelectContent>
              {Object.values(aspectRatios).map((ratio) => (
                <SelectItem key={ratio.id} value={ratio.id}>
                  {ratio.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button variant="outline" size="sm" className="h-9 rounded-xl border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-white hover:border-slate-300 text-xs font-medium">
            Apply All
          </Button>
        </div>
      </div>

      <Separator className="bg-slate-100" />

      {/* Секция 3: Проекты */}
      <div className="space-y-4">
        <h4 className="text-sm font-medium text-slate-900">Manage Projects</h4>
        <div className="space-y-4">
          {sectionContent.featuredWork.projects.map((project, index) => (
            <div key={index} className="p-5 border border-slate-100 rounded-2xl space-y-4 bg-white shadow-sm shadow-slate-900/5 transition-all hover:shadow-md hover:border-slate-200">
              <div className="flex items-start justify-between">
                <span className="text-xs font-semibold text-slate-900 uppercase tracking-wider">Project {index + 1}</span>
                <Button
                  variant="ghost"
                  size="icon"
                  className="w-6 h-6 shrink-0 rounded-full text-slate-400 hover:bg-red-50 hover:text-red-500 transition-colors"
                  onClick={() => {
                    const newProjects = sectionContent.featuredWork.projects.filter((_, i) => i !== index)
                    updateSectionContent('featuredWork', { projects: newProjects })
                  }}
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </Button>
              </div>
              
              <div className="space-y-2">
                <Label className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 ml-1">Title</Label>
                <Input
                  className={inputStyle}
                  placeholder="Project Name"
                  value={project.title}
                  onChange={(e) => {
                    const newProjects = [...sectionContent.featuredWork.projects]
                    newProjects[index] = { ...project, title: e.target.value }
                    updateSectionContent('featuredWork', { projects: newProjects })
                  }}
                />
              </div>

              <div className="space-y-2">
                <Label className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 ml-1">Description</Label>
                <Textarea
                  className={textareaStyle}
                  placeholder="Brief description..."
                  rows={2}
                  value={project.description}
                  onChange={(e) => {
                    const newProjects = [...sectionContent.featuredWork.projects]
                    newProjects[index] = { ...project, description: e.target.value }
                    updateSectionContent('featuredWork', { projects: newProjects })
                  }}
                />
              </div>

              <div className="pt-2">
                <PortfolioImagePicker
                  label="Project Image"
                  value={{
                    image: project.image,
                    aspectRatio: (project.aspectRatio || 'landscape') as AspectRatio,
                    frameStyle: project.frameStyle,
                  }}
                  onChange={(value) => {
                    const newProjects = [...sectionContent.featuredWork.projects]
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
                    toggleMediaPicker()
                  }}
                />
              </div>
            </div>
          ))}
          
          {/* Кнопка добавления проекта */}
          <Button
            variant="outline"
            size="sm"
            className="w-full mt-2 h-10 rounded-xl border-dashed border-slate-200 text-slate-500 hover:text-slate-900 hover:border-slate-300 hover:bg-slate-50 transition-all text-xs font-medium"
            onClick={() => {
              const newProject = {
                title: 'New Project',
                description: 'Project description...',
                image: '', // Пустой, чтобы пользователь добавил свой
                tags: [] as string[],
                aspectRatio: 'landscape' as AspectRatio,
                frameStyle: 'soft' as FrameStyle
              }
              updateSectionContent('featuredWork', { 
                projects: [...sectionContent.featuredWork.projects, newProject] 
              })
            }}
          >
            <Plus className="w-3.5 h-3.5 mr-1.5" /> Add Project
          </Button>
        </div>
      </div>
    </div>
  )
}