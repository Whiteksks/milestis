"use client"

import { useContentStore } from '@/editor/lib/store'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'

export function HeroSettings() {
  const { sectionContent, updateSectionContent } = useContentStore()
  
  // Общий стиль для Input/Textarea
  const inputStyle = "rounded-xl border-slate-200 bg-white focus:ring-slate-900 text-xs"

  return (
    <div className="p-6 max-w-lg mx-auto space-y-8">
      
      {/* Общий заголовок настроек */}
      <div>
        <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-900">
          Hero Section
        </h3>
        <p className="text-[11px] text-slate-500 mt-1 font-medium">Main headline and introduction.</p>
      </div>
      
      {/* Секция: Контент Hero */}
      <div className="space-y-5">
        
        {/* Title */}
        <div className="space-y-2">
          <Label className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 ml-1">Main Title</Label>
          <Input 
            className={`${inputStyle} h-11 font-medium text-sm`} 
            value={sectionContent.hero.title} 
            onChange={(e) => updateSectionContent('hero', { title: e.target.value })} 
            placeholder="Your main headline..."
          />
        </div>
        
        {/* Subtitle */}
        <div className="space-y-2">
          <Label className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 ml-1">Subtitle</Label>
          <Input 
            className={`${inputStyle} h-10`} 
            value={sectionContent.hero.subtitle} 
            onChange={(e) => updateSectionContent('hero', { subtitle: e.target.value })} 
            placeholder="A catchy subtitle"
          />
        </div>
        
        {/* Description */}
        <div className="space-y-2">
          <Label className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 ml-1">Description / Intro</Label>
          <Textarea 
            className={`${inputStyle} resize-none min-h-[100px] p-3`} 
            rows={4} 
            value={sectionContent.hero.description} 
            onChange={(e) => updateSectionContent('hero', { description: e.target.value })} 
            placeholder="Detailed introduction or bio..."
          />
        </div>
        
      </div>
      
    </div>
  )
}
