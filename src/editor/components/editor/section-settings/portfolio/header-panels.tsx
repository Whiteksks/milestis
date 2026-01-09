"use client"

import { useContentSelector } from "@/editor/lib/store"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Trash2, Plus } from "lucide-react"

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

  return (
    <div className="space-y-1.5">
      {!dense && <Label className="text-xs font-medium text-muted-foreground">Brand Title</Label>}
      <Input
        className="h-9 text-xs"
        value={header.title}
        onChange={(e) => updateSectionContent("header", { title: e.target.value })}
        placeholder="Your brand or name"
      />
    </div>
  )
}

export function HeaderLinksPanel({ dense = false }: { dense?: boolean }) {
  const { header, updateSectionContent } = useContentSelector((state) => ({
    header: state.sectionContent.header,
    updateSectionContent: state.updateSectionContent,
  }))

  return (
    <div className="space-y-3">
      {!dense && (
        <div className="flex items-center justify-between gap-3">
          <Label className="text-xs font-medium text-muted-foreground">Menu Links</Label>
          <Button
            variant="outline"
            size="sm"
            className="h-8 text-xs"
            onClick={() =>
              updateSectionContent("header", {
                links: [...header.links, { label: "New Link", href: "#hero" }],
              })
            }
          >
            <Plus className="w-3.5 h-3.5 mr-2" /> Add
          </Button>
        </div>
      )}

      {dense && (
        <Button
          variant="outline"
          size="sm"
          className="h-8 text-xs"
          onClick={() =>
            updateSectionContent("header", {
              links: [...header.links, { label: "New Link", href: "#hero" }],
            })
          }
        >
          <Plus className="w-3.5 h-3.5 mr-2" /> Add link
        </Button>
      )}

      <div className="space-y-2">
        {header.links.map((link, index) => (
          <div key={index} className="flex items-center gap-2">
            <Input
              className="flex-1 h-8 text-xs"
              placeholder="Label"
              value={link.label}
              onChange={(e) => {
                const newLinks = [...header.links]
                newLinks[index] = { ...link, label: e.target.value }
                updateSectionContent("header", { links: newLinks })
              }}
            />
            <Select
              value={link.href.replace("#", "")}
              onValueChange={(value) => {
                const newLinks = [...header.links]
                newLinks[index] = { ...link, href: `#${value}` }
                updateSectionContent("header", { links: newLinks })
              }}
            >
              <SelectTrigger className="w-30 h-8 text-xs">
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

            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-muted shrink-0"
              onClick={() => {
                const newLinks = header.links.filter((_, i) => i !== index)
                updateSectionContent("header", { links: newLinks })
              }}
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        ))}

        {header.links.length === 0 && (
          <Button
            variant="outline"
            size="sm"
            className="w-full h-9 text-xs border-dashed text-muted-foreground hover:text-foreground"
            onClick={() =>
              updateSectionContent("header", {
                links: [...header.links, { label: "New Link", href: "#hero" }],
              })
            }
          >
            <Plus className="w-3.5 h-3.5 mr-2" /> Add your first link
          </Button>
        )}
      </div>
    </div>
  )
}
