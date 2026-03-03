"use client"

import { useId } from "react"
import { useContentSelector, useUiStore } from "@/editor/lib/store"
import { useSectionRestrictions } from "@/editor/hooks/use-section-restrictions"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { PortfolioImagePicker } from "@/editor/components/editor/section-settings/ui/portfolio-image-picker"
import { MediaPickerModal } from "@/editor/components/editor/layout/Modals/media-picker-modal"
export function HeroTitlePanel({ dense = false }: { dense?: boolean }) {
  const { hero, updateSectionContent } = useContentSelector((state) => ({
    hero: state.sectionContent.hero,
    updateSectionContent: state.updateSectionContent,
  }))

  return (
    <div className="space-y-3">
      {!dense && <Label className="text-xs font-medium text-muted-foreground">Title</Label>}
      <div className="grid grid-cols-2 gap-3">
        <Input
          className="h-9 text-xs"
          value={hero.title}
          onChange={(e) => updateSectionContent("hero", { title: e.target.value })}
          placeholder="Your main headline"
        />
        <Input
          className="h-9 text-xs"
          value={hero.subtitle}
          onChange={(e) => updateSectionContent("hero", { subtitle: e.target.value })}
          placeholder="A catchy subtitle"
        />
      </div>
    </div>
  )
}

export function HeroDescriptionPanel({ dense = false }: { dense?: boolean }) {
  const { hero, updateSectionContent } = useContentSelector((state) => ({
    hero: state.sectionContent.hero,
    updateSectionContent: state.updateSectionContent,
  }))

  return (
    <div className="space-y-1.5">
      {!dense && <Label className="text-xs font-medium text-muted-foreground">Description</Label>}
      <Textarea
        className="min-h-27.5 text-xs resize-none"
        value={hero.description}
        onChange={(e) => updateSectionContent("hero", { description: e.target.value })}
        placeholder="Detailed introduction..."
      />
    </div>
  )
}

export function HeroImagePanel({ dense = false }: { dense?: boolean }) {
  const ownerId = useId()
  const { hero, updateSectionContent } = useContentSelector((state) => ({
    hero: state.sectionContent.hero,
    updateSectionContent: state.updateSectionContent,
  }))
  const openMediaPicker = useUiStore((s) => s.openMediaPicker)
  const heroRestrictions = useSectionRestrictions('hero')

  return (
    <div className="space-y-3">
      <MediaPickerModal
        ownerId={ownerId}
        onSelectImage={(url) => updateSectionContent("hero", { image: url })}
      />
      {!dense && <Label className="text-xs font-medium text-muted-foreground">Hero Image</Label>}
      <PortfolioImagePicker
        label=""
        value={{
          image: hero.image || "",
          aspectRatio: hero.aspectRatio,
          frameStyle: hero.frameStyle,
          cropData: hero.cropData,
        }}
        onChange={(value) =>
          updateSectionContent("hero", {
            image: value.image,
            aspectRatio: value.aspectRatio,
            frameStyle: value.frameStyle,
            cropData: value.cropData,
          })
        }
        onOpenMediaPicker={() => openMediaPicker(ownerId)}
        restrictions={heroRestrictions}
      />
    </div>
  )
}
