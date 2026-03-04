"use client"

import { useContentSelector, useUiStore } from "@/editor/lib/store"
import { useSectionRestrictions } from "@/editor/hooks/use-section-restrictions"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Trash2, Plus, Trophy } from "lucide-react"
import { PortfolioImagePicker } from "@/editor/components/editor/section-settings/ui/portfolio-image-picker"
import { MediaPickerModal } from "@/editor/components/editor/layout/Modals/media-picker-modal"
import { PanelLabel } from "@/editor/components/editor/section-settings/ui/panel-label"
import { ps } from "@/editor/components/editor/section-settings/ui/panel-styles"
import { useId } from "react"

export function BioTitlePanel({ dense = false }: { dense?: boolean }) {
  const { bio, updateSectionContent } = useContentSelector((state) => ({
    bio: state.sectionContent.bio,
    updateSectionContent: state.updateSectionContent,
  }))

  return (
    <div className={ps.root(dense)}>
      {!dense && <PanelLabel>Header</PanelLabel>}
      <div className={ps.grid2(dense)}>
        <Input
          className={ps.input}
          value={bio.title}
          onChange={(e) => updateSectionContent("bio", { title: e.target.value })}
          placeholder="Section title"
        />
        <Input
          className={ps.input}
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
  const bioRestrictions = useSectionRestrictions('bio')

  const handleImageSelect = (url: string) => {
    updateSectionContent("bio", { image: url })
  }

  return (
    <div className={ps.root(dense)}>
      <MediaPickerModal ownerId={ownerId} onSelectImage={handleImageSelect} />
      {!dense && <PanelLabel>Profile Photo</PanelLabel>}
      <PortfolioImagePicker
        value={{
          image: bio.image || "",
          aspectRatio: bio.aspectRatio,
          frameStyle: bio.frameStyle,
          cropData: bio.cropData,
        }}
        onChange={(value) =>
          updateSectionContent("bio", {
            image: value.image,
            aspectRatio: value.aspectRatio,
            frameStyle: value.frameStyle,
            cropData: value.cropData,
          })
        }
        onOpenMediaPicker={() => openMediaPicker(ownerId)}
        restrictions={bioRestrictions}
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
    <div className={ps.root(dense)}>
      {!dense && <PanelLabel>Biography</PanelLabel>}
      <Textarea
        className={ps.textarea(dense, "min-h-24", "min-h-32")}
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

  const achievements = bio.achievements || []

  const addAchievement = () =>
    updateSectionContent("bio", { achievements: [...achievements, ""] })

  const removeAchievement = (index: number) =>
    updateSectionContent("bio", {
      achievements: achievements.filter((_, i) => i !== index),
    })

  const updateAchievement = (index: number, value: string) => {
    const next = [...achievements]
    next[index] = value
    updateSectionContent("bio", { achievements: next })
  }

  return (
    <div className={ps.root(dense)}>
      {/* Header — only shows label and Add button when there are items */}
      {achievements.length > 0 && (
        <div className="flex items-center justify-between">
          {!dense && <PanelLabel>Achievements</PanelLabel>}
          <Button
            variant="ghost"
            size="sm"
            className={`${ps.addBtn} ml-auto`}
            onClick={addAchievement}
          >
            <Plus className="w-3.5 h-3.5 mr-1" />
            Add
          </Button>
        </div>
      )}

      {/* Empty state */}
      {achievements.length === 0 && (
        <button
          type="button"
          onClick={addAchievement}
          className={ps.emptyZone}
        >
          <Trophy className={ps.emptyIcon} />
          {!dense && (
            <span className={ps.emptyText}>
              Add achievements
            </span>
          )}
        </button>
      )}

      {/* List */}
      {achievements.length > 0 && (
        <div className="space-y-1.5">
          {achievements.map((achievement, index) => (
            <div
              key={index}
              className="flex items-center gap-1.5 group rounded-md px-1.5 py-1 hover:bg-muted/50 transition-colors -mx-1.5"
            >
              <span className="text-[10px] tabular-nums text-muted-foreground/40 w-4 shrink-0 text-right select-none">
                {index + 1}
              </span>
              <Input
                className="h-7 text-xs border-0 bg-transparent shadow-none focus-visible:ring-0 focus-visible:bg-background px-1.5 flex-1"
                placeholder="Achievement"
                value={achievement}
                onChange={(e) => updateAchievement(index, e.target.value)}
              />
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 shrink-0 text-muted-foreground md:text-muted-foreground/0 md:group-hover:text-muted-foreground hover:text-destructive hover:bg-transparent transition-colors"
                onClick={() => removeAchievement(index)}
              >
                <Trash2 className="w-3.5 h-3.5" />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
