"use client"

import { useContentSelector } from '@/editor/lib/store'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Trash2, Plus, Facebook, Instagram, Twitter, Linkedin, Github, Mail } from 'lucide-react'
import { Separator } from '@/components/ui/separator'

// Карта иконок для отображения
const iconMap = {
  facebook: Facebook,
  instagram: Instagram,
  twitter: Twitter,
  linkedin: Linkedin,
  github: Github,
  email: Mail,
}

export function FooterSettings() {
  const { footer, updateSectionContent } = useContentSelector((state) => ({
    footer: state.sectionContent.footer,
    updateSectionContent: state.updateSectionContent,
  }))
  
  const inputStyle = "h-9 rounded-xl border-slate-200 bg-white focus:ring-slate-900 text-xs"

  const socialLinks = footer.socialLinks || []

  const socialIcons = [
    { id: 'facebook', label: 'Facebook' },
    { id: 'instagram', label: 'Instagram' },
    { id: 'twitter', label: 'X (Twitter)' },
    { id: 'linkedin', label: 'LinkedIn' },
    { id: 'github', label: 'GitHub' },
    { id: 'email', label: 'Email' },
  ]

  return (
    <div className="p-6 max-w-lg mx-auto space-y-8">
      
      {/* Общий заголовок настроек */}
      <div>
        <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-900">
          Footer Settings
        </h3>
        <p className="text-[11px] text-slate-500 mt-1 font-medium">Manage copyright and social links.</p>
      </div>

      {/* Секция 1: Копирайт */}
      <div className="space-y-4">
        <h4 className="text-sm font-medium text-slate-900">Copyright</h4>
        <div className="space-y-2">
          <Label className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 ml-1">Footer Text</Label>
          <Input 
            className={inputStyle} 
            value={footer.copyright} 
            onChange={(e) => updateSectionContent('footer', { copyright: e.target.value })} 
            placeholder="© 2025. All rights reserved."
          />
        </div>
      </div>

      <Separator className="bg-slate-100" />

      {/* Секция 2: Социальные сети */}
      <div className="space-y-4">
        <h4 className="text-sm font-medium text-slate-900">Social Links</h4>
        <p className="text-[11px] text-slate-500 font-medium">Displayed at the bottom of the page.</p>
        
        <div className="space-y-3">
          {socialLinks.map((link, index) => {
            const IconComponent = iconMap[link.icon as keyof typeof iconMap] || Mail;
            
            return (
              <div key={index} className="flex gap-2 items-center p-2 rounded-xl border border-slate-100 bg-white shadow-sm">
                {/* Селектор Иконки */}
                <Select
                  value={link.icon}
                  onValueChange={(value) => {
                    const newLinks = [...socialLinks]
                    newLinks[index] = { ...link, icon: value }
                    updateSectionContent('footer', { socialLinks: newLinks })
                  }}
                >
                  <SelectTrigger className="w-32.5 h-9 rounded-xl border-slate-200 bg-white hover:border-slate-300 text-xs shadow-sm">
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>

                  <SelectContent>
                    {socialIcons.map((social) => {
                      const ItemIcon = iconMap[social.id as keyof typeof iconMap]
                      return (
                        <SelectItem key={social.id} value={social.id}>
                          <div className="flex items-center gap-2">
                            <ItemIcon className="w-3.5 h-3.5" />
                            {social.label}
                          </div>
                        </SelectItem>
                      )
                    })}
                  </SelectContent>
                </Select>

                
                {/* Поле URL */}
                <Input
                  className={`${inputStyle} flex-1 border-slate-200`}
                  placeholder="https://"
                  value={link.href}
                  onChange={(e) => {
                    const newLinks = [...socialLinks]
                    newLinks[index] = { ...link, href: e.target.value }
                    updateSectionContent('footer', { socialLinks: newLinks })
                  }}
                />
                
                {/* Кнопка удаления */}
                <Button
                  variant="ghost"
                  size="icon"
                  className="shrink-0 w-8 h-8 rounded-full text-slate-400 hover:bg-red-50 hover:text-red-500 transition-colors"
                  onClick={() => {
                    const newLinks = socialLinks.filter((_, i) => i !== index)
                    updateSectionContent('footer', { socialLinks: newLinks })
                  }}
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </Button>
              </div>
            )
          })}
          
          {/* Кнопка добавления */}
          <Button
            variant="outline"
            size="sm"
            className="w-full mt-2 h-10 rounded-xl border-dashed border-slate-200 text-slate-500 hover:text-slate-900 hover:border-slate-300 hover:bg-slate-50 transition-all text-xs font-medium"
            onClick={() => updateSectionContent('footer', { 
              socialLinks: [...socialLinks, { icon: 'instagram', href: '' }] 
            })}
          >
            <Plus className="w-3.5 h-3.5 mr-1.5" /> Add Link
          </Button>
        </div>
      </div>
    </div>
  )
}
