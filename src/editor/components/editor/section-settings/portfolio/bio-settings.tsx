"use client"

import { useContentStore, useUiStore } from '@/editor/lib/store'
import { MediaPickerModal } from '@/editor/components/editor/layout/Modals/media-picker-modal'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Trash2, Plus } from 'lucide-react'
import type { AspectRatio } from '@/editor/lib/types'
import { Separator } from '@/components/ui/separator'
import { PortfolioImagePicker } from '@/editor/components/editor/section-settings/ui/portfolio-image-picker'

export function BioSettings() {
  const { sectionContent, updateSectionContent } = useContentStore()
  const { toggleMediaPicker } = useUiStore()

  const inputStyle = "h-9 rounded-xl border-slate-200 bg-white focus:ring-slate-900 text-xs"

  const handleImageSelect = (url: string) => {
    updateSectionContent('bio', { image: url })
  }

  return (
    <div className="p-6 max-w-lg mx-auto space-y-8">
      {/* Image picker modal for choosing from previously uploaded photos */}
      <MediaPickerModal onSelectImage={handleImageSelect} />

      {/* Общий заголовок настроек */}
      <div>
        <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-900">
          Bio Section
        </h3>
        <p className="text-[11px] text-slate-500 mt-1 font-medium">About me information and profile.</p>
      </div>

      {/* Секция 1: Заголовок */}
      <div className="space-y-4">
        <h4 className="text-sm font-medium text-slate-900">Section Title</h4>
        <div className="space-y-2">
          <Label className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 ml-1">Title</Label>
          <Input 
            className={inputStyle} 
            value={sectionContent.bio.title} 
            onChange={(e) => updateSectionContent('bio', { title: e.target.value })} 
            placeholder="About Me"
          />
        </div>
        <div className="space-y-2">
          <Label className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 ml-1">Subtitle</Label>
          <Input 
            className={inputStyle} 
            value={sectionContent.bio.subtitle || ''} 
            onChange={(e) => updateSectionContent('bio', { subtitle: e.target.value })} 
            placeholder="Short subtitle"
          />
        </div>
      </div>

      <Separator className="bg-slate-100" />

      {/* Секция 2: Изображение Профиля */}
      <div className="space-y-4">
        <h4 className="text-sm font-medium text-slate-900">Profile Photo</h4>
        <PortfolioImagePicker
          value={{
            image: sectionContent.bio.image || '',
            aspectRatio: (sectionContent.bio.imageAspectRatio || 'portrait') as AspectRatio,
            frameStyle: sectionContent.bio.imageFrameStyle,
          }}
          onChange={(value) =>
            updateSectionContent('bio', {
              image: value.image,
              imageAspectRatio: value.aspectRatio,
              imageFrameStyle: value.frameStyle,
            })
          }
          onOpenMediaPicker={toggleMediaPicker}
        />
      </div>

      <Separator className="bg-slate-100" />

      {/* Секция 3: Биография */}
      <div className="space-y-3">
        <div>
          <Label className="text-sm font-medium text-slate-900">Biography</Label>
          <p className="text-[11px] text-slate-500 mt-0.5 font-medium">Tell your story</p>
        </div>
        <Textarea 
          className="rounded-xl border-slate-200 bg-white focus:ring-slate-900 text-xs min-h-30 p-3 resize-none" 
          rows={5} 
          value={sectionContent.bio.description} 
          onChange={(e) => updateSectionContent('bio', { description: e.target.value })} 
        />
      </div>

      <Separator className="bg-slate-100" />

      {/* Секция 4: Достижения */}
      <div className="space-y-4">
        <h4 className="text-sm font-medium text-slate-900">Achievements / Awards</h4>
        <p className="text-[11px] text-slate-500 font-medium">Key milestones, exhibitions, awards.</p>
        <div className="space-y-3">
          {(sectionContent.bio.achievements || []).map((achievement, index) => (
            <div key={index} className="flex gap-2 items-center p-1.5 rounded-xl border border-slate-100 bg-slate-50/50 hover:border-slate-200 transition-colors group">
              <Input
                className={`${inputStyle} flex-1 border-transparent bg-transparent focus:bg-white`}
                placeholder="New Achievement"
                value={achievement}
                onChange={(e) => {
                  const newAchievements = [...(sectionContent.bio.achievements || [])]
                  newAchievements[index] = e.target.value
                  updateSectionContent('bio', { achievements: newAchievements })
                }}
              />
              <Button
                variant="ghost"
                size="icon"
                className="shrink-0 w-7 h-7 rounded-full text-slate-400 hover:bg-white hover:text-red-500 hover:shadow-sm transition-all opacity-0 group-hover:opacity-100"
                onClick={() => {
                  const newAchievements = (sectionContent.bio.achievements || []).filter((_, i) => i !== index)
                  updateSectionContent('bio', { achievements: newAchievements })
                }}
              >
                <Trash2 className="w-3.5 h-3.5" />
              </Button>
            </div>
          ))}
          <Button
            variant="outline"
            size="sm"
            className="w-full mt-2 h-9 rounded-xl border-dashed border-slate-200 text-slate-500 hover:text-slate-900 hover:border-slate-300 hover:bg-slate-50 transition-all text-xs font-medium"
            onClick={() => updateSectionContent('bio', { 
              achievements: [...(sectionContent.bio.achievements || []), ''] 
            })}
          >
            <Plus className="w-3.5 h-3.5 mr-1.5" /> Add Achievement
          </Button>
        </div>
      </div>
    </div>
  )
}
