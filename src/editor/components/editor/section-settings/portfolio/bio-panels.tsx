"use client"

import { useContentSelector, useUiStore } from "@/editor/lib/store"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Trash2, Plus } from "lucide-react"
import type { AspectRatio } from "@/editor/lib/types"
import { PortfolioImagePicker } from "@/editor/components/editor/section-settings/ui/portfolio-image-picker"
import { MediaPickerModal } from "@/editor/components/editor/layout/Modals/media-picker-modal"
import { useId } from "react"

export function BioTitlePanel({ dense = false }: { dense?: boolean }) {
  const { bio, updateSectionContent } = useContentSelector((state) => ({
    bio: state.sectionContent.bio,
    updateSectionContent: state.updateSectionContent,
  }))

  return (
    <div className={dense ? "space-y-3" : "space-y-3"}>
      {!dense && <Label className="text-xs font-medium text-muted-foreground">Header</Label>}
      <div className="grid grid-cols-2 gap-3">
        <Input
          className={dense ? "h-9 text-xs" : "h-9 text-xs"}
          value={bio.title}
          onChange={(e) => updateSectionContent("bio", { title: e.target.value })}
          placeholder="Section title"
        />
        <Input
          className={dense ? "h-9 text-xs" : "h-9 text-xs"}
          value={bio.subtitle || ""}
          onChange={(e) => updateSectionContent("bio", { subtitle: e.target.value })}
          placeholder="Subtitle"
        />
      </div>
    </div>
  )
}

export function BioPhotoPanel({ dense = false }: { dense?: boolean }) {
  const ownerId = useId()
  const { bio, updateSectionContent } = useContentSelector((state) => ({
    bio: state.sectionContent.bio,
    updateSectionContent: state.updateSectionContent,
  }))

  const openMediaPicker = useUiStore((s) => s.openMediaPicker)

  const handleImageSelect = (url: string) => {
    updateSectionContent("bio", { image: url })
  }

  return (
    <div className={dense ? "space-y-3" : "space-y-3"}>
      <MediaPickerModal ownerId={ownerId} onSelectImage={handleImageSelect} />
      {!dense && <Label className="text-xs font-medium text-muted-foreground">Profile Photo</Label>}
      <PortfolioImagePicker
        value={{
          image: bio.image || "",
          aspectRatio: (bio.imageAspectRatio || "portrait") as AspectRatio,
          frameStyle: bio.imageFrameStyle,
        }}
        onChange={(value) =>
          updateSectionContent("bio", {
            image: value.image,
            imageAspectRatio: value.aspectRatio,
            imageFrameStyle: value.frameStyle,
          })
        }
        onOpenMediaPicker={() => openMediaPicker(ownerId)}
      />
    </div>
  )
}

export function BioBiographyPanel({ dense = false }: { dense?: boolean }) {
  const { bio, updateSectionContent } = useContentSelector((state) => ({
    bio: state.sectionContent.bio,
    updateSectionContent: state.updateSectionContent,
  }))

  return (
    <div className={dense ? "space-y-1.5" : "space-y-1.5"}>
      {!dense && <Label className="text-xs font-medium text-muted-foreground">Biography</Label>}
      <Textarea
        className="min-h-32.5 text-xs resize-none"
        value={bio.description}
        onChange={(e) => updateSectionContent("bio", { description: e.target.value })}
        placeholder="Tell your story"
      />
    </div>
  )
}

export function BioAchievementsPanel({ dense = false }: { dense?: boolean }) {
  const { bio, updateSectionContent } = useContentSelector((state) => ({
    bio: state.sectionContent.bio,
    updateSectionContent: state.updateSectionContent,
  }))

  return (
    <div className={dense ? "space-y-3" : "space-y-3"}>
      <div className="flex items-center justify-between gap-3">
        {!dense && <Label className="text-xs font-medium text-muted-foreground">Achievements</Label>}
        <Button
          variant="outline"
          size="sm"
          className="h-8 text-xs"
          onClick={() =>
            updateSectionContent("bio", {
              achievements: [...(bio.achievements || []), ""],
            })
          }
        >
          <Plus className="w-3.5 h-3.5 mr-2" /> Add
        </Button>
      </div>

      <div className="space-y-2">
        {(bio.achievements || []).map((achievement, index) => (
          <div key={index} className="flex items-center gap-2">
            <Input
              className="h-8 text-xs"
              placeholder="Achievement"
              value={achievement}
              onChange={(e) => {
                const newAchievements = [...(bio.achievements || [])]
                newAchievements[index] = e.target.value
                updateSectionContent("bio", { achievements: newAchievements })
              }}
            />
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-muted shrink-0"
              onClick={() => {
                const newAchievements = (bio.achievements || []).filter((_, i) => i !== index)
                updateSectionContent("bio", { achievements: newAchievements })
              }}
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        ))}
      </div>

      {(bio.achievements || []).length === 0 && (
        <Button
          variant="outline"
          size="sm"
          className="w-full h-9 text-xs border-dashed text-muted-foreground hover:text-foreground"
          onClick={() =>
            updateSectionContent("bio", {
              achievements: [...(bio.achievements || []), ""],
            })
          }
        >
          <Plus className="w-3.5 h-3.5 mr-2" /> Add your first achievement
        </Button>
      )}
    </div>
  )
}
