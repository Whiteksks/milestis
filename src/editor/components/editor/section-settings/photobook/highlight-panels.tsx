"use client"

import { MediaPickerModal } from "@/editor/components/editor/layout/Modals/media-picker-modal"
import { ImagePicker } from "@/editor/components/editor/section-settings/ui/image-picker"
import { useSectionRestrictions } from "@/editor/hooks/use-section-restrictions"
import { ps, editorialInput, editorialLabel, LIMITS, CharCounter } from "@/editor/components/editor/section-settings/ui/panel-ui"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"
import { useContentSelector, useUiStore } from "@/editor/lib/store"
import { useId } from "react"

export function HighlightTextPanel({ dense = false }: { dense?: boolean }) {
  const { highlight, updatePhotobookSection } = useContentSelector((state) => ({
    highlight: state.photobookSectionContent.highlight,
    updatePhotobookSection: state.updatePhotobookSection,
  }))

  if (dense) {
    return (
      <div className={ps.pbRoot}>
        <Input value={highlight.title || ""} onChange={(e) => updatePhotobookSection("highlight", { title: e.target.value })} placeholder="Title" className={ps.pbInput} maxLength={LIMITS.title} />
        <Textarea value={highlight.description || ""} onChange={(e) => updatePhotobookSection("highlight", { description: e.target.value })} placeholder="Description..." rows={3} className={ps.pbTextarea} maxLength={LIMITS.description} />
      </div>
    )
  }

  return (
    <div className="space-y-4 py-2">
      <div className="space-y-1">
        <div className="flex items-center justify-between">
          <label className={editorialLabel}>Title</label>
          <CharCounter value={highlight.title || ""} limit={LIMITS.title} />
        </div>
        <Input value={highlight.title || ""} onChange={(e) => updatePhotobookSection("highlight", { title: e.target.value })} placeholder="Title" className={cn(editorialInput, "text-base font-medium tracking-tight text-foreground")} maxLength={LIMITS.title} />
      </div>
      <div className="space-y-1">
        <div className="flex items-center justify-between">
          <label className={editorialLabel}>Story</label>
          <CharCounter value={highlight.description || ""} limit={LIMITS.description} />
        </div>
        <Textarea value={highlight.description || ""} onChange={(e) => updatePhotobookSection("highlight", { description: e.target.value })} placeholder="Tell the story of this moment..." rows={4} className={cn(editorialInput, "text-sm leading-relaxed min-h-[100px] w-full max-w-full resize-none block overflow-x-hidden break-words")} maxLength={LIMITS.description} />
      </div>
      <div className="space-y-1">
        <div className="flex items-center justify-between">
          <label className={editorialLabel}>Quote</label>
          <CharCounter value={highlight.quote || ""} limit={LIMITS.quote} />
        </div>
        <Input value={highlight.quote || ""} onChange={(e) => updatePhotobookSection("highlight", { quote: e.target.value })} placeholder="Optional quote" className={cn(editorialInput, "text-sm italic text-muted-foreground")} maxLength={LIMITS.quote} />
      </div>
    </div>
  )
}

export function HighlightImagePanel({ dense = false }: { dense?: boolean }) {
  const ownerId = useId()
  const { highlight, updatePhotobookSection } = useContentSelector((state) => ({
    highlight: state.photobookSectionContent.highlight,
    updatePhotobookSection: state.updatePhotobookSection,
  }))
  const openMediaPicker = useUiStore((s) => s.openMediaPicker)
  const highlightRestrictions = useSectionRestrictions('highlight')

  return (
    <div className={ps.pbRoot}>
      <MediaPickerModal
        ownerId={ownerId}
        onSelectImage={(url) =>
          updatePhotobookSection("highlight", {
            images: {
              id: highlight.images?.id || "highlight-main",
              image: url,
              caption: highlight.images?.caption || "",
              imageSettings:
                highlight.images?.imageSettings?.length
                  ? highlight.images.imageSettings
                  : [{ aspectRatio: "landscape", frameStyle: "none" }],
            },
          })
        }
      />

      {!dense && <label className={editorialLabel}>Image</label>}

      <ImagePicker
        label=""
        value={highlight.images}
        dense={dense}
        onChange={(next) => updatePhotobookSection("highlight", { images: next })}
        onOpenMediaPicker={() => openMediaPicker(ownerId)}
        showCaption={false}
        restrictions={highlightRestrictions}
      />
    </div>
  )
}
