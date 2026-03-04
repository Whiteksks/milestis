"use client"

import { MediaPickerModal } from "@/editor/components/editor/layout/Modals/media-picker-modal"
import { ImagePicker } from "@/editor/components/editor/section-settings/ui/image-picker"
import { PanelLabel } from "@/editor/components/editor/section-settings/ui/panel-label"
import { ps } from "@/editor/components/editor/section-settings/ui/panel-styles"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { useContentSelector, useUiStore } from "@/editor/lib/store"
import { useId } from "react"

export function CoverTextPanel({ dense = false }: { dense?: boolean }) {
  const { cover, updatePhotobookSection } = useContentSelector((state) => ({
    cover: state.photobookSectionContent.cover,
    updatePhotobookSection: state.updatePhotobookSection,
  }))

  return (
    <div className={ps.pbRoot}>
      {!dense && <PanelLabel>Text</PanelLabel>}
      <div className={ps.pbRoot}>
        <Input
          value={cover.title}
          onChange={(e) => updatePhotobookSection("cover", { title: e.target.value })}
          placeholder="Photobook title"
          className={ps.pbInputTitle}
        />

        <div className={ps.pbGrid2}>
          <Input
            value={cover.subtitle || ""}
            onChange={(e) => updatePhotobookSection("cover", { subtitle: e.target.value })}
            placeholder="Subtitle"
            className={ps.pbInput}
          />
          <Input
            value={cover.tagline || ""}
            onChange={(e) => updatePhotobookSection("cover", { tagline: e.target.value })}
            placeholder="Tagline / quote"
            className={ps.pbInputItalic}
          />
        </div>
      </div>
    </div>
  )
}

export function CoverMetadataPanel({ dense = false }: { dense?: boolean }) {
  const { cover, updatePhotobookSection } = useContentSelector((state) => ({
    cover: state.photobookSectionContent.cover,
    updatePhotobookSection: state.updatePhotobookSection,
  }))

  return (
    <div className={ps.pbRoot}>
      {!dense && <PanelLabel>Metadata</PanelLabel>}
      <div className={ps.pbGrid2}>
        <Input
          value={cover.date || ""}
          onChange={(e) => updatePhotobookSection("cover", { date: e.target.value })}
          placeholder="Date"
          className={ps.pbInput}
        />
        <Input
          value={cover.location || ""}
          onChange={(e) => updatePhotobookSection("cover", { location: e.target.value })}
          placeholder="Location"
          className={ps.pbInput}
        />
      </div>
    </div>
  )
}

export function CoverImagePanel({ dense = false }: { dense?: boolean }) {
  const ownerId = useId()
  const { cover, updatePhotobookSection } = useContentSelector((state) => ({
    cover: state.photobookSectionContent.cover,
    updatePhotobookSection: state.updatePhotobookSection,
  }))
  const openMediaPicker = useUiStore((s) => s.openMediaPicker)

  return (
    <div className={ps.pbRoot}>
      <MediaPickerModal
        ownerId={ownerId}
        onSelectImage={(url) =>
          updatePhotobookSection("cover", {
            images: {
              id: cover.images?.id || "cover-main",
              image: url,
              caption: cover.images?.caption || "",
              imageSettings:
                cover.images?.imageSettings?.length
                  ? cover.images.imageSettings
                  : [{ aspectRatio: "landscape", frameStyle: "soft" }],
            },
          })
        }
      />

      {!dense && (
        <>
          <Separator className="bg-border/40" />
          <PanelLabel>Cover Image</PanelLabel>
        </>
      )}

      <ImagePicker
        label=""
        value={cover.images}
        onChange={(next) => updatePhotobookSection("cover", { images: next })}
        onOpenMediaPicker={() => openMediaPicker(ownerId)}
      />
    </div>
  )
}
