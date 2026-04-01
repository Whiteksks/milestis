"use client"

import { MediaPickerModal } from "@/editor/components/editor/layout/Modals/media-picker-modal"
import { ImagePicker } from "@/editor/components/editor/section-settings/ui/image-picker"
import { PanelLabel, ps } from "@/editor/components/editor/section-settings/ui/panel-ui"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator"
import { useContentSelector, useUiSelector } from "@/editor/lib/store"
import { useId } from "react"

export function IntroductionTextPanel({ dense = false }: { dense?: boolean }) {
  const { introduction, updatePhotobookSection } = useContentSelector((state) => ({
    introduction: state.photobookSectionContent.introduction,
    updatePhotobookSection: state.updatePhotobookSection,
  }))

  return (
    <div className={ps.pbRoot}>
      {!dense && <PanelLabel>Text</PanelLabel>}

      <div className={ps.pbGrid2}>
        <Input
          value={introduction.title}
          onChange={(e) => updatePhotobookSection("introduction", { title: e.target.value })}
          placeholder="Page title"
          className={ps.pbInput}
        />
        <Input
          value={introduction.quote || ""}
          onChange={(e) => updatePhotobookSection("introduction", { quote: e.target.value })}
          placeholder="Quote"
          className={ps.pbInput}
        />
      </div>

      <Textarea
        value={introduction.dedication || ""}
        onChange={(e) => updatePhotobookSection("introduction", { dedication: e.target.value })}
        placeholder="Dedication..."
        rows={4}
        className={ps.pbTextarea}
      />
    </div>
  )
}

export function IntroductionImagePanel({ dense = false }: { dense?: boolean }) {
  const ownerId = useId()
  const { introduction, updatePhotobookSection } = useContentSelector((state) => ({
    introduction: state.photobookSectionContent.introduction,
    updatePhotobookSection: state.updatePhotobookSection,
  }))
  const { openMediaPicker } = useUiSelector((state) => ({
    openMediaPicker: state.openMediaPicker,
  }))

  return (
    <div className={ps.pbRoot}>
      <MediaPickerModal
        ownerId={ownerId}
        onSelectImage={(url) =>
          updatePhotobookSection("introduction", {
            images: {
              id: introduction.images?.id || "intro-main",
              image: url,
              caption: introduction.images?.caption || "",
              imageSettings:
                introduction.images?.imageSettings?.length
                  ? introduction.images.imageSettings
                  : [{ aspectRatio: "portrait", frameStyle: "soft" }],
            },
          })
        }
      />

      {!dense && (
        <>
          <Separator className="bg-border/40" />
          <PanelLabel>Main Image</PanelLabel>
        </>
      )}

      <ImagePicker
        label=""
        value={introduction.images}
        onChange={(next) => updatePhotobookSection("introduction", { images: next })}
        onOpenMediaPicker={() => openMediaPicker(ownerId)}
      />
    </div>
  )
}
