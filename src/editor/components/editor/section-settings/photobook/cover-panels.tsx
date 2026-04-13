"use client"

import { MediaPickerModal } from "@/editor/components/editor/layout/Modals/media-picker-modal"
import { ImagePicker } from "@/editor/components/editor/section-settings/ui/image-picker"
import { useSectionRestrictions } from "@/editor/hooks/use-section-restrictions"
import { ps, editorialInput, editorialLabel, PanelLabel, LIMITS, CharCounter } from "@/editor/components/editor/section-settings/ui/panel-ui"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import { useContentSelector, useUiStore } from "@/editor/lib/store"
import { useId } from "react"
import { Separator } from "@/components/ui/separator"


export function CoverTextPanel({ dense = false }: { dense?: boolean }) {
  const { cover, updatePhotobookSection } = useContentSelector((state) => ({
    cover: state.photobookSectionContent.cover,
    updatePhotobookSection: state.updatePhotobookSection,
  }))

  if (dense) {
    return (
      <div className={ps.pbRoot}>
        <div className={ps.pbGrid2}>
          <Input value={cover.title} onChange={(e) => updatePhotobookSection("cover", { title: e.target.value })} placeholder="Photobook title" className={ps.pbInput} maxLength={LIMITS.title} />
          <Input value={cover.subtitle || ""} onChange={(e) => updatePhotobookSection("cover", { subtitle: e.target.value })} placeholder="Subtitle" className={ps.pbInput} maxLength={LIMITS.subtitle} />
        </div>
      </div>
    )
  }

  return (
    <div className="py-2">    
      <div className="grid grid-cols-2 divide-x divide-border/30 border-b border-border/30 pb-4 mb-4">
        <div className="space-y-1 pr-2">
          <div className="flex items-center justify-between">
            <label className={editorialLabel}>Title</label>
            <CharCounter value={cover.title} limit={LIMITS.title} />
          </div>
          <Input
            value={cover.title}
            onChange={(e) => updatePhotobookSection("cover", { title: e.target.value })}
            placeholder="Photobook title"
            className={cn(editorialInput, "text-base font-medium tracking-tight text-foreground")}
            maxLength={LIMITS.title}
          />
        </div>
        <div className="space-y-1 pl-2">
          <div className="flex items-center justify-between">
            <label className={editorialLabel}>Subtitle</label>
            <CharCounter value={cover.subtitle || ""} limit={LIMITS.subtitle} />
          </div>
          <Input
            value={cover.subtitle || ""}
            onChange={(e) => updatePhotobookSection("cover", { subtitle: e.target.value })}
            placeholder="Subtitle"
            className={cn(editorialInput, "text-base text-muted-foreground")}
            maxLength={LIMITS.subtitle}
          />
        </div>
      </div>
      <div className="space-y-1">
        <div className="flex items-center justify-between">
          <label className={editorialLabel}>Tagline / Quote</label>
          <CharCounter value={cover.tagline || ""} limit={LIMITS.tagline} />
        </div>
        <Input
          value={cover.tagline || ""}
          onChange={(e) => updatePhotobookSection("cover", { tagline: e.target.value })}
          placeholder="A quote or tagline"
          className={cn(editorialInput, "text-sm italic text-muted-foreground")}
          maxLength={LIMITS.tagline}
        />
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
    <div className="grid grid-cols-2 gap-4">
      <div className="space-y-1">
        {!dense && <label className={editorialLabel}>Date</label>}
        <Input value={cover.date || ""} onChange={(e) => updatePhotobookSection("cover", { date: e.target.value })} placeholder="Date" className={dense ? ps.pbInput : cn(editorialInput, "text-sm")} maxLength={LIMITS.date} />
      </div>
      <div className="space-y-1">
        {!dense && <label className={editorialLabel}>Location</label>}
        <Input value={cover.location || ""} onChange={(e) => updatePhotobookSection("cover", { location: e.target.value })} placeholder="Location" className={dense ? ps.pbInput : cn(editorialInput, "text-sm")} maxLength={LIMITS.location} />
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
  const coverRestrictions = useSectionRestrictions('cover')

  return (
    <div className={ps.pbRoot}>
      <MediaPickerModal
        ownerId={ownerId}
        onSelectImage={(url, thumbUrl) =>
          updatePhotobookSection("cover", {
            images: {
              id: cover.images?.id || "cover-main",
              image: url,
              thumbUrl,
              caption: cover.images?.caption || "",
              imageSettings:
                cover.images?.imageSettings?.length
                  ? cover.images.imageSettings
                  : [{ aspectRatio: "square", frameStyle: "soft" }],
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
        restrictions={coverRestrictions}
        showCaption={false}
      />
    </div>
  )
}
