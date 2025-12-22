"use client"

import { useContentStore } from '@/editor/lib/store'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Separator } from '@/components/ui/separator'

export function ContactSettings() {
  const { sectionContent, updateSectionContent } = useContentStore()

  const inputStyle = "h-9 rounded-xl border-slate-200 bg-white focus:ring-slate-900 text-xs"
  const textareaStyle = "rounded-xl border-slate-200 bg-white focus:ring-slate-900 text-xs resize-none"

  return (
    <div className="p-6 max-w-lg mx-auto space-y-8">
      {/* Общий заголовок настроек */}
      <div>
        <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-900">
          Contact Section
        </h3>
        <p className="text-[11px] text-slate-500 mt-1 font-medium">Manage your contact information.</p>
      </div>

      {/* Секция 1: Текстовый блок */}
      <div className="space-y-4">
        <h4 className="text-sm font-medium text-slate-900">Section Content</h4>
        <div className="space-y-2">
          <Label className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 ml-1">Title</Label>
          <Input
            className={inputStyle}
            value={sectionContent.contact.title}
            onChange={(e) => updateSectionContent('contact', { title: e.target.value })}
            placeholder="Get in Touch"
          />
        </div>
        <div className="space-y-2">
          <Label className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 ml-1">Subtitle</Label>
          <Input
            className={inputStyle}
            value={sectionContent.contact.subtitle || ''}
            onChange={(e) => updateSectionContent('contact', { subtitle: e.target.value })}
            placeholder="Contact"
          />
        </div>
        <div className="space-y-2">
          <Label className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 ml-1">Description</Label>
          <Textarea
            rows={3}
            className={textareaStyle}
            value={sectionContent.contact.description}
            onChange={(e) => updateSectionContent('contact', { description: e.target.value })}
            placeholder="Brief description of how to best reach you..."
          />
        </div>
      </div>

      <Separator className="bg-slate-100" />

      {/* Секция 2: Контактные данные */}
      <div className="space-y-4">
        <h4 className="text-sm font-medium text-slate-900">Contact Details</h4>
        <div className="space-y-2">
          <Label className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 ml-1">Email</Label>
          <Input
            className={inputStyle}
            type="email"
            value={sectionContent.contact.email}
            onChange={(e) => updateSectionContent('contact', { email: e.target.value })}
            placeholder="you@example.com"
          />
        </div>
        <div className="space-y-2">
          <Label className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 ml-1">Phone (Optional)</Label>
          <Input
            className={inputStyle}
            type="tel"
            value={sectionContent.contact.phone || ''}
            onChange={(e) => updateSectionContent('contact', { phone: e.target.value })}
            placeholder="+1 (555) 000-0000"
          />
        </div>
      </div>
    </div>
  )
}

