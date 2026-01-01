"use client"

import { useContentSelector } from '@/editor/lib/store'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Trash2, Plus } from 'lucide-react'
import { Separator } from '@/components/ui/separator'

export function HeaderSettings() {
  const { header, updateSectionContent } = useContentSelector((state) => ({
    header: state.sectionContent.header,
    updateSectionContent: state.updateSectionContent,
  }))

  const anchorSections = [
    { id: 'hero', label: 'Hero Section' },
    { id: 'bio', label: 'Bio / About' },
    { id: 'work', label: 'Featured Work' },
    { id: 'video', label: 'Video' },
    { id: 'contact', label: 'Contact' },
  ]

  // Стили для ввода, используемые везде
  const inputStyle = "h-9 rounded-xl border-slate-200 bg-white focus:ring-slate-900 text-xs"

  return (
    <div className="p-6 max-w-lg mx-auto space-y-8">
      
      {/* Общий заголовок настроек */}
      <div>
        <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-900">
          Navigation Settings
        </h3>
        <p className="text-[11px] text-slate-500 mt-1 font-medium">
          Manage your site header and menu links.
        </p>
      </div>

      {/* Секция 1: Заголовок Хедера */}
      <div className="space-y-4">
        <h4 className="text-sm font-medium text-slate-900">Logo / Title</h4>
        <div className="space-y-2">
          <Label className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 ml-1">Header Text</Label>
          <Input 
            className={inputStyle} 
            value={header.title} 
            onChange={(e) => updateSectionContent('header', { title: e.target.value })} 
            placeholder="e.g. Your Name"
          />
        </div>
      </div>

      <Separator className="bg-slate-100" />

      {/* Секция 2: Навигационные ссылки */}
      <div className="space-y-4">
        <h4 className="text-sm font-medium text-slate-900">Menu Links</h4>
        <p className="text-[11px] text-slate-500 font-medium">Items displayed in the navigation bar.</p>
        
        <div className="space-y-3">
          {header.links.map((link, index) => (
            <div key={index} className="flex gap-2 items-center p-1.5 rounded-xl border border-slate-100 bg-slate-50/50 hover:border-slate-200 transition-colors group">
              <Input
                className={`${inputStyle} flex-1 border-transparent bg-transparent focus:bg-white`}
                placeholder="Link Label"
                value={link.label}
                onChange={(e) => {
                  const newLinks = [...header.links]
                  newLinks[index] = { ...link, label: e.target.value }
                  updateSectionContent('header', { links: newLinks })
                }}
              />
              <Select
                value={link.href.replace('#', '')}
                onValueChange={(value) => {
                  const newLinks = [...header.links]
                  newLinks[index] = { ...link, href: `#${value}` }
                  updateSectionContent('header', { links: newLinks })
                }}
              >
                <SelectTrigger className="w-30 h-8 rounded-lg border-transparent bg-transparent hover:bg-white hover:shadow-sm text-xs focus:ring-0">
                  <SelectValue placeholder="Section" />
                </SelectTrigger>
                <SelectContent>
                  {anchorSections.map((section) => (
                    <SelectItem key={section.id} value={section.id}>
                      {section.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              {/* Кнопка удаления */}
              <Button
                variant="ghost"
                size="icon"
                className="shrink-0 w-7 h-7 rounded-full text-slate-400 hover:bg-white hover:text-red-500 hover:shadow-sm transition-all opacity-0 group-hover:opacity-100"
                onClick={() => {
                  const newLinks = header.links.filter((_, i) => i !== index)
                  updateSectionContent('header', { links: newLinks })
                }}
              >
                <Trash2 className="w-3.5 h-3.5" />
              </Button>
            </div>
          ))}
          
          {/* Кнопка добавления */}
          <Button
            variant="outline"
            size="sm"
            className="w-full mt-2 h-9 rounded-xl border-dashed border-slate-200 text-slate-500 hover:text-slate-900 hover:border-slate-300 hover:bg-slate-50 transition-all text-xs font-medium"
            onClick={() =>
              updateSectionContent('header', {
                links: [...header.links, { label: 'New Link', href: '#hero' }],
              })
            }
          >
            <Plus className="w-3.5 h-3.5 mr-1.5" /> Add Link
          </Button>
        </div>
      </div>
    </div>
  )
}
