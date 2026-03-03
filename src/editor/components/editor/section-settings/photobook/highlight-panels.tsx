"use client"

import { MediaPickerModal } from "@/editor/components/editor/layout/Modals/media-picker-modal"
import { ImagePicker } from "@/editor/components/editor/section-settings/ui/image-picker"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator"
import { useContentSelector, useUiStore } from "@/editor/lib/store"
import { useId } from "react"

export function HighlightTextPanel({ dense = false }: { dense?: boolean }) {
  const { highlight, updatePhotobookSection } = useContentSelector((state) => ({
    highlight: state.photobookSectionContent.highlight,
    updatePhotobookSection: state.updatePhotobookSection,
  }))

  return (
    <div className="space-y-3">
      {!dense && <Label className="text-xs font-medium text-muted-foreground">Text</Label>}

      <Input
        value={highlight.title || ""}
        onChange={(e) => updatePhotobookSection("highlight", { title: e.target.value })}
        placeholder="Title"
        className="h-9 text-xs"
      />

      <Textarea
        value={highlight.description || ""}
        onChange={(e) => updatePhotobookSection("highlight", { description: e.target.value })}
        placeholder="Tell the story of this moment..."
        rows={5}
        className="text-xs resize-none"
      />

      <Input
        value={highlight.quote || ""}
        onChange={(e) => updatePhotobookSection("highlight", { quote: e.target.value })}
        placeholder="Quote (optional)"
        className="h-9 text-xs italic"
      />
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

  return (
    <div className="space-y-3">
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

      {!dense && (
        <>
          <Separator className="bg-border/40" />
          <Label className="text-xs font-medium text-muted-foreground">Image</Label>
        </>
      )}

      <ImagePicker
        label=""
        value={highlight.images}
        onChange={(next) => updatePhotobookSection("highlight", { images: next })}
        onOpenMediaPicker={() => openMediaPicker(ownerId)}
        showCaption={false}
      />
    </div>
  )
}
