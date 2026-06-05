"use client"

import { useTranslations } from "next-intl"
import { MediaPickerModal } from "@/editor/components/editor/layout/Modals/media-picker-modal"
import { ImagePicker, createPhotobookSectionImage, replacePhotobookManagedImageAsset, type ImageValue } from "@/editor/image"
import { ps, editorialInput, editorialLabel, LIMITS } from "@/editor/components/editor/section-settings/ui/panel-ui"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"
import { useContentSelector, useUiStore } from "@/editor/lib/store"
import { useId } from "react"

export function EndingMessagePanel({ dense = false }: { dense?: boolean }) {
  const t = useTranslations("editor.photobookSettings.ending")
  const { ending, updatePhotobookSection } = useContentSelector((state) => ({
    ending: state.photobookSectionContent.ending,
    updatePhotobookSection: state.updatePhotobookSection,
  }))

  return (
    <div className="space-y-4 py-2">
      <div className="space-y-1">
        {!dense && <label className={editorialLabel}>{t("title")}</label>}
        <Input
          value={ending.title || ""}
          onChange={(e) => updatePhotobookSection("ending", { title: e.target.value })}
          placeholder={t("placeholder.title")}
          className={dense ? ps.pbInput : cn(editorialInput, "text-base font-medium tracking-tight text-foreground")}
          maxLength={LIMITS.title}
        />
      </div>
      <div className="space-y-1">
        {!dense && <label className={editorialLabel}>{t("message")}</label>}
        <Textarea
          value={ending.text || ""}
          onChange={(e) => updatePhotobookSection("ending", { text: e.target.value })}
          placeholder={t("placeholder.message")}
          rows={4}
          className={dense ? ps.pbTextarea : cn(editorialInput, "text-sm leading-relaxed min-h-[100px] w-full max-w-full resize-none block overflow-x-hidden break-words")}
          maxLength={LIMITS.description}
        />
      </div>
    </div>
  )
}

export function EndingSignaturePanel({ dense = false }: { dense?: boolean }) {
  const t = useTranslations("editor.photobookSettings.ending")
  const { ending, updatePhotobookSection } = useContentSelector((state) => ({
    ending: state.photobookSectionContent.ending,
    updatePhotobookSection: state.updatePhotobookSection,
  }))

  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="space-y-1">
        {!dense && <label className={editorialLabel}>{t("signature")}</label>}
        <Input value={ending.signature || ""} onChange={(e) => updatePhotobookSection("ending", { signature: e.target.value })} placeholder={t("placeholder.signature")} className={dense ? ps.pbInputItalic : cn(editorialInput, "text-sm italic")} maxLength={LIMITS.signature} />
      </div>
      <div className="space-y-1">
        {!dense && <label className={editorialLabel}>{t("date")}</label>}
        <Input value={ending.date || ""} onChange={(e) => updatePhotobookSection("ending", { date: e.target.value })} placeholder={t("placeholder.date")} className={dense ? ps.pbInput : cn(editorialInput, "text-sm")} maxLength={LIMITS.date} />
      </div>
    </div>
  )
}

export function EndingImagePanel({ dense = false }: { dense?: boolean }) {
  const t = useTranslations("editor.photobookSettings.ending")
  const ownerId = useId()
  const { endingImage, setPhotobookSingleImage } = useContentSelector((state) => ({
    endingImage: state.photobookImageContent.ending,
    setPhotobookSingleImage: state.setPhotobookSingleImage,
  }))
  const openMediaPicker = useUiStore((s) => s.openMediaPicker)

  const emptyValue: ImageValue = { asset: { src: '', width: 0, height: 0 } }
  const pickerValue = endingImage?.value ?? emptyValue

  return (
    <div className={ps.pbRoot}>
      <MediaPickerModal
        ownerId={ownerId}
        onSelectImage={(url, thumbUrl) => {
          if (endingImage) {
            setPhotobookSingleImage('ending', replacePhotobookManagedImageAsset(endingImage, { src: url, blurDataUrl: thumbUrl }))
          } else {
            setPhotobookSingleImage('ending', createPhotobookSectionImage({ id: 'ending-main', sectionId: 'ending', src: url, blurDataUrl: thumbUrl }))
          }
        }}
      />

      {!dense && <label className={editorialLabel}>{t("decorativeImage")}</label>}

      <ImagePicker
        slotId="photobook.ending.primary"
        value={pickerValue}
        onChange={(next) => {
          if (!next.asset.src) {
            setPhotobookSingleImage('ending', undefined)
            return
          }
          if (endingImage) {
            setPhotobookSingleImage('ending', { ...endingImage, value: next })
          }
        }}
        onOpenMediaPicker={() => openMediaPicker(ownerId)}
        dense={dense}
        showCaption={false}
      />
    </div>
  )
}
