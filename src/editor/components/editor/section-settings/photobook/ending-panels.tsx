"use client"

import { MediaPickerModal } from "@/editor/components/editor/layout/Modals/media-picker-modal"
import { ImagePicker } from "@/editor/components/editor/section-settings/ui/image-picker"
import { PanelLabel } from "@/editor/components/editor/section-settings/ui/panel-label"
import { ps } from "@/editor/components/editor/section-settings/ui/panel-styles"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator"
import { useContentSelector, useUiStore } from "@/editor/lib/store"
import { useId } from "react"

export function EndingMessagePanel({ dense = false }: { dense?: boolean }) {
  const { ending, updatePhotobookSection } = useContentSelector((state) => ({
    ending: state.photobookSectionContent.ending,
    updatePhotobookSection: state.updatePhotobookSection,
  }))

  return (
    <div className={ps.pbRoot}>
      {!dense && <PanelLabel>Message</PanelLabel>}
      <Textarea
        value={ending.text || ""}
        onChange={(e) => updatePhotobookSection("ending", { text: e.target.value })}
        placeholder="Thank you for watching..."
        rows={4}
        className={ps.pbTextarea}
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
    <div className={ps.pbRoot}>
      {!dense && <PanelLabel>Signature</PanelLabel>}
      <div className={ps.pbGrid2}>
        <Input
          value={ending.signature || ""}
          onChange={(e) => updatePhotobookSection("ending", { signature: e.target.value })}
          placeholder="Signature"
          className={ps.pbInputItalic}
        />
        <Input
          value={ending.date || ""}
          onChange={(e) => updatePhotobookSection("ending", { date: e.target.value })}
          placeholder="Date"
          className={ps.pbInput}
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

      {!dense && (
        <>
          <Separator className="bg-border/40" />
          <PanelLabel>Decorative Image</PanelLabel>
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
