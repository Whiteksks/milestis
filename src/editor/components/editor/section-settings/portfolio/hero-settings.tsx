"use client"

import { useContentSelector } from '@/editor/lib/store'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'

export function HeroSettings() {
  const { hero, updateSectionContent } = useContentSelector((state) => ({
    hero: state.sectionContent.hero,
    updateSectionContent: state.updateSectionContent,
  }))
  
  return (
    <div className="px-6 py-5 space-y-6">
      <div className="space-y-1">
        <h3 className="text-sm font-medium leading-none">Hero</h3>
        <p className="text-xs text-muted-foreground">Main headline and introduction</p>
      </div>

      <div className="space-y-6">
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <Label className="text-xs font-medium text-muted-foreground">Title</Label>
            <Input
              className="h-9 text-xs"
              value={hero.title}
              onChange={(e) => updateSectionContent('hero', { title: e.target.value })}
              placeholder="Your main headline"
            />
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs font-medium text-muted-foreground">Subtitle</Label>
            <Input
              className="h-9 text-xs"
              value={hero.subtitle}
              onChange={(e) => updateSectionContent('hero', { subtitle: e.target.value })}
              placeholder="A catchy subtitle"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <Label className="text-xs font-medium text-muted-foreground">Description</Label>
          <Textarea
            className="min-h-[110px] text-xs resize-none"
            value={hero.description}
            onChange={(e) => updateSectionContent('hero', { description: e.target.value })}
            placeholder="Detailed introduction..."
          />
        </div>
      </div>
    </div>
  )
}
