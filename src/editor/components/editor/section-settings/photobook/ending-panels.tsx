"use client"

import { MediaPickerModal } from "@/editor/components/editor/layout/Modals/media-picker-modal"
import { ImagePicker } from "@/editor/components/editor/section-settings/ui/image-picker"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator"
import { useContentSelector, useUiSelector } from "@/editor/lib/store"
import { useId } from "react"

export function EndingMessagePanel({ dense = false }: { dense?: boolean }) {
  const { ending, updatePhotobookSection } = useContentSelector((state) => ({
    ending: state.photobookSectionContent.ending,
    updatePhotobookSection: state.updatePhotobookSection,
  }))

  return (
    <div className="space-y-3">
      {!dense && <Label className="text-xs font-medium text-muted-foreground">Message</Label>}
      <Textarea
        value={ending.text || ""}
        onChange={(e) => updatePhotobookSection("ending", { text: e.target.value })}
        placeholder="Thank you for watching..."
        rows={4}
        className="text-xs resize-none"
      />
    </div>
  )
}

export function EndingSignaturePanel({ dense = false }: { dense?: boolean }) {
  const { ending, updatePhotobookSection } = useContentSelector((state) => ({
    ending: state.photobookSectionContent.ending,
    updatePhotobookSection: state.updatePhotobookSection,
  }))

  return (
    <div className="space-y-3">
      {!dense && <Label className="text-xs font-medium text-muted-foreground">Signature</Label>}
      <div className="grid grid-cols-2 gap-3">
        <Input
          value={ending.signature || ""}
          onChange={(e) => updatePhotobookSection("ending", { signature: e.target.value })}
          placeholder="Signature"
          className="h-9 text-xs italic"
        />
        <Input
          value={ending.date || ""}
          onChange={(e) => updatePhotobookSection("ending", { date: e.target.value })}
          placeholder="Date"
          className="h-9 text-xs"
        />
      </div>
    </div>
  )
}

export function EndingImagePanel({ dense = false }: { dense?: boolean }) {
  const ownerId = useId()
  const { ending, updatePhotobookSection } = useContentSelector((state) => ({
    ending: state.photobookSectionContent.ending,
    updatePhotobookSection: state.updatePhotobookSection,
  }))
  const { openMediaPicker } = useUiSelector((state) => ({
    openMediaPicker: state.openMediaPicker,
  }))

  return (
    <div className="space-y-3">
      <MediaPickerModal
        ownerId={ownerId}
        onSelectImage={(url) =>
          updatePhotobookSection("ending", {
            images: {
              id: ending.images?.id || "ending-detail",
              image: url,
              caption: ending.images?.caption || "",
              imageSettings:
                ending.images?.imageSettings?.length
                  ? ending.images.imageSettings
                  : [{ aspectRatio: "square", frameStyle: "soft" }],
            },
          })
        }
      />

      {!dense && (
        <>
          <Separator className="bg-border/40" />
          <Label className="text-xs font-medium text-muted-foreground">Decorative Image</Label>
        </>
      )}

      <ImagePicker
        label=""
        value={ending.images}
        onChange={(next) => updatePhotobookSection("ending", { images: next })}
        onOpenMediaPicker={() => openMediaPicker(ownerId)}
        showCaption={false}
      />
    </div>
  )
}
