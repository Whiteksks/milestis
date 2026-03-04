"use client"

import { useId } from "react"
import { useContentSelector, useUiStore } from "@/editor/lib/store"
import { useSectionRestrictions } from "@/editor/hooks/use-section-restrictions"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { PortfolioImagePicker } from "@/editor/components/editor/section-settings/ui/portfolio-image-picker"
import { MediaPickerModal } from "@/editor/components/editor/layout/Modals/media-picker-modal"
import { PanelLabel } from "@/editor/components/editor/section-settings/ui/panel-label"
import { ps } from "@/editor/components/editor/section-settings/ui/panel-styles"

export function HeroTitlePanel({ dense = false }: { dense?: boolean }) {
  const { hero, updateSectionContent } = useContentSelector((state) => ({
    hero: state.sectionContent.hero,
    updateSectionContent: state.updateSectionContent,
  }))

  return (
    <div className={ps.root(dense)}>
      {!dense && <PanelLabel>Title</PanelLabel>}
      <div className={ps.grid2(dense)}>
        <Input
          className={ps.input}
          value={hero.title}
          onChange={(e) => updateSectionContent("hero", { title: e.target.value })}
          placeholder="Your main headline"
        />
        <Input
          className={ps.input}
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
    <div className={ps.root(dense)}>
      {!dense && <PanelLabel>Description</PanelLabel>}
      <Textarea
        className={ps.textarea(dense, "min-h-20", "min-h-28")}
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
    <div className={ps.root(dense)}>
      <MediaPickerModal
        ownerId={ownerId}
        onSelectImage={(url) => updateSectionContent("hero", { image: url })}
      />
      {!dense && <PanelLabel>Hero Image</PanelLabel>}
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
