"use client"

import { useContentSelector } from "@/editor/lib/store"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Trash2, Plus, Menu } from "lucide-react"
import { PanelLabel } from "@/editor/components/editor/section-settings/ui/panel-label"
import { ps } from "@/editor/components/editor/section-settings/ui/panel-styles"

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
    <div className={ps.root(dense)}>
      {!dense && <PanelLabel>Brand Title</PanelLabel>}
      <Input
        className={ps.input}
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
    <div className={ps.root(dense)}>
      {!dense && header.links.length > 0 && (
        <div className="flex items-center justify-between">
          <PanelLabel>Menu Links</PanelLabel>
          <Button
            variant="ghost"
            size="sm"
            className={ps.addBtn}
            onClick={() =>
              updateSectionContent("header", {
                links: [...header.links, { label: "New Link", href: "#hero" }],
              })
            }
          >
            <Plus className="w-3.5 h-3.5 mr-1" /> Add
          </Button>
        </div>
      )}

      {dense && (
        <Button
          variant="outline"
          size="sm"
          className="h-7 text-xs"
          onClick={() =>
            updateSectionContent("header", {
              links: [...header.links, { label: "New Link", href: "#hero" }],
            })
          }
        >
          <Plus className="w-3.5 h-3.5 mr-1" /> Add link
        </Button>
      )}

      <div className="space-y-2">
        {header.links.map((link, index) => (
          <div key={index} className="flex items-center gap-2">
            <Input
              className={ps.inputFlex}
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
              className={ps.deleteBtn}
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
          <button
            type="button"
            onClick={() =>
              updateSectionContent("header", {
                links: [...header.links, { label: "New Link", href: "#hero" }],
              })
            }
            className={ps.emptyZone}
          >
            <Menu className={ps.emptyIcon} />
            {!dense && (
              <span className={ps.emptyText}>
                Add menu links
              </span>
            )}
          </button>
        )}
      </div>
    </div>
  )
}
