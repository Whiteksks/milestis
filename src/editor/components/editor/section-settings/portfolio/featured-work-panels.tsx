"use client"

import { useContentSelector } from "@/editor/lib/store"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import type { AspectRatio, FrameStyle } from "@/editor/lib/types"

export function FeaturedWorkHeaderPanel({ dense = false }: { dense?: boolean }) {
  const { featuredWork, updateSectionContent } = useContentSelector((state) => ({
    featuredWork: state.sectionContent.featuredWork,
    updateSectionContent: state.updateSectionContent,
  }))

  return (
    <div className="space-y-3">
      {!dense && <Label className="text-xs font-medium text-muted-foreground">Section Header</Label>}
      <div className="grid grid-cols-2 gap-3">
        <Input
          className="h-9 text-xs"
          value={featuredWork.title}
          onChange={(e) => updateSectionContent("featuredWork", { title: e.target.value })}
          placeholder="My best work"
        />
        <Input
          className="h-9 text-xs"
          value={featuredWork.subtitle || ""}
          onChange={(e) => updateSectionContent("featuredWork", { subtitle: e.target.value })}
          placeholder="Subtitle"
        />
      </div>
    </div>
  )
}

export function FeaturedWorkAddProjectPanel({ dense = false }: { dense?: boolean }) {
  const { featuredWork, updateSectionContent } = useContentSelector((state) => ({
    featuredWork: state.sectionContent.featuredWork,
    updateSectionContent: state.updateSectionContent,
  }))

  return (
    <div className="space-y-3">
      {!dense && <Label className="text-xs font-medium text-muted-foreground">Projects</Label>}
      <Button
        variant="outline"
        size="sm"
        className="h-8 text-xs"
        onClick={() => {
          const newProject = {
            title: "New Project",
            description: "",
            image: "",
            tags: [] as string[],
            aspectRatio: "landscape" as AspectRatio,
            frameStyle: "soft" as FrameStyle,
          }
          updateSectionContent("featuredWork", {
            projects: [...featuredWork.projects, newProject],
          })
        }}
      >
        <Plus className="w-3.5 h-3.5 mr-2" /> Add project
      </Button>
      <p className="text-[11px] text-muted-foreground">
        Adds a blank project. Edit details in the full panel.
      </p>
    </div>
  )
}
