"use client"

import { MediaPickerModal } from "@/editor/components/editor/layout/Modals/media-picker-modal"
import { ImagePicker } from "@/editor/components/editor/section-settings/ui/image-picker"
import { ps, editorialInput, editorialLabel } from "@/editor/components/editor/section-settings/ui/panel-ui"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"
import { useContentSelector, useUiStore } from "@/editor/lib/store"
import { useId } from "react"

export function EndingMessagePanel({ dense = false }: { dense?: boolean }) {
  const { ending, updatePhotobookSection } = useContentSelector((state) => ({
    ending: state.photobookSectionContent.ending,
    updatePhotobookSection: state.updatePhotobookSection,
  }))

  return (
    <div className="space-y-1 py-2">
      {!dense && <label className={editorialLabel}>Message</label>}
      <Textarea
        value={ending.text || ""}
        onChange={(e) => updatePhotobookSection("ending", { text: e.target.value })}
        placeholder="Thank you for watching..."
        rows={4}
        className={dense ? ps.pbTextarea : cn(editorialInput, "text-sm leading-relaxed min-h-[100px] w-full max-w-full resize-none block overflow-x-hidden break-words")}
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
    <div className="grid grid-cols-2 gap-4">
      <div className="space-y-1">
        {!dense && <label className={editorialLabel}>Signature</label>}
        <Input value={ending.signature || ""} onChange={(e) => updatePhotobookSection("ending", { signature: e.target.value })} placeholder="Signature" className={dense ? ps.pbInputItalic : cn(editorialInput, "text-sm italic")} />
      </div>
      <div className="space-y-1">
        {!dense && <label className={editorialLabel}>Date</label>}
        <Input value={ending.date || ""} onChange={(e) => updatePhotobookSection("ending", { date: e.target.value })} placeholder="Date" className={dense ? ps.pbInput : cn(editorialInput, "text-sm")} />
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
  const openMediaPicker = useUiStore((s) => s.openMediaPicker)

  return (
    <div className={ps.pbRoot}>
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

      {!dense && <label className={editorialLabel}>Decorative Image</label>}

      <ImagePicker
        label=""
        value={ending.images}
        dense={dense}
        onChange={(next) => updatePhotobookSection("ending", { images: next })}
        onOpenMediaPicker={() => openMediaPicker(ownerId)}
        showCaption={false}
      />
    </div>
  )
}
