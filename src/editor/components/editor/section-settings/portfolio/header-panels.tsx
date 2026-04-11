"use client"

import { useContentSelector } from "@/editor/lib/store"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Trash2, Plus } from "lucide-react"
import { cn } from "@/lib/utils"
import { ps, LIMITS, editorialInput, editorialLabel } from "@/editor/components/editor/section-settings/ui/panel-ui"

const anchorSections = [
  { id: "hero", label: "Hero Section" },
  { id: "bio", label: "Bio / About" },
  { id: "work", label: "Featured Work" },
  { id: "video", label: "Video" },
  { id: "contact", label: "Contact" },
]

export function HeaderBrandPanel({ dense = false }: { dense?: boolean }) {
  const { header, updateSectionContent } = useContentSelector((state) => ({
    header: state.sectionContent.header,
    updateSectionContent: state.updateSectionContent,
  }))

  if (dense) {
    return (
      <div className={ps.root(true)}>
        <Input className={ps.input} value={header.title} onChange={(e) => updateSectionContent("header", { title: e.target.value })} placeholder="Your brand or name" maxLength={LIMITS.title} />
      </div>
    )
  }

  return (
    <div className="py-4 border-b border-border/30 space-y-3">
      <label className={editorialLabel}>Brand Title</label>
      <Input
        className={cn(editorialInput, "text-base font-medium text-foreground")}
        value={header.title}
        onChange={(e) => updateSectionContent("header", { title: e.target.value })}
        placeholder="Your brand or name"
        maxLength={LIMITS.title}
      />
    </div>
  )
}
export function HeaderLinksPanel() {
  const { header, updateSectionContent } = useContentSelector((state) => ({
    header: state.sectionContent.header,
    updateSectionContent: state.updateSectionContent,
  }))

  const addLink = () => {
    if (header.links.length >= LIMITS.links) return
    updateSectionContent("header", {
      links: [...header.links, { label: "New Link", href: "#hero" }],
    })
  }

  return (
    <div className="py-4 space-y-0">
      <div className="flex items-center justify-between border-b border-border/30 pb-2">
        <label className={editorialLabel}>Navigation Links</label>
        {header.links.length < LIMITS.links && (
          <button 
            onClick={addLink}
            className="text-[10px] uppercase tracking-widest text-foreground hover:opacity-60 transition-opacity flex items-center gap-1"
          >
            <Plus className="w-3 h-3" /> Add Item
          </button>
        )}
      </div>

      <div className="space-y-0 divide-y divide-border/20">
        {header.links.map((link, index) => (
          <div key={index} className="group flex items-center gap-6 py-4 transition-all">
            {/* Номер строки в стиле Editorial */}
            <span className="text-[10px] text-muted-foreground/30 font-mono w-4">
              0{index + 1}
            </span>

            {/* Поле Label */}
            <div className="flex-1">
              <Input
                className={cn(editorialInput, "text-sm font-medium")}
                placeholder="Link Label"
                value={link.label}
                onChange={(e) => {
                  const newLinks = [...header.links]
                  newLinks[index] = { ...link, label: e.target.value }
                  updateSectionContent("header", { links: newLinks })
                }}
              />
            </div>

            {/* Выбор секции (упрощенный) */}
            <Select
              value={link.href.replace("#", "")}
              onValueChange={(value) => {
                const newLinks = [...header.links]
                newLinks[index] = { ...link, href: `#${value}` }
                updateSectionContent("header", { links: newLinks })
              }}
            >
              <SelectTrigger className="w-32 h-auto border-0 bg-transparent p-0 text-[11px] uppercase tracking-wider text-muted-foreground focus:ring-0 shadow-none justify-end gap-2">
                <SelectValue />
              </SelectTrigger>
              <SelectContent align="end" className="rounded-xl border-border/40 shadow-xl">
                {anchorSections.map((section) => (
                  <SelectItem key={section.id} value={section.id} className="text-xs">
                    {section.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Кнопка удаления (появляется при наведении) */}
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-full transition-all hover:bg-destructive/5 hover:text-destructive"
              onClick={() => {
                const newLinks = header.links.filter((_, i) => i !== index)
                updateSectionContent("header", { links: newLinks })
              }}
            >
              <Trash2 className="w-3.5 h-3.5" />
            </Button>
          </div>
        ))}

        {header.links.length === 0 && (
          <button
            onClick={addLink}
            className="w-full py-12 border-2 border-dashed border-border/20 rounded-2xl flex flex-col items-center justify-center gap-3 text-muted-foreground hover:text-foreground hover:border-border/40 transition-all group"
          >
            <div className="p-3 bg-muted/50 rounded-full group-hover:scale-110 transition-transform">
              <Plus className="w-5 h-5" />
            </div>
            <span className="text-[10px] uppercase tracking-[0.2em]">Add first link</span>
          </button>
        )}
      </div>

      {header.links.length >= LIMITS.links && (
        <p className="text-[9px] text-muted-foreground/40 text-center italic">
          Navigation limit reached for optimal design balance.
        </p>
      )}
    </div>
  )
}