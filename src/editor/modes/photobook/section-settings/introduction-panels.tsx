"use client"

import { useTranslations } from "next-intl"
import { MediaPickerModal } from "@/editor/components/editor/layout/Modals/media-picker-modal"
import { ImagePicker, createPhotobookSectionImage, replacePhotobookManagedImageAsset, type ImageValue } from "@/editor/image"
import { PanelLabel, ps, LIMITS } from "@/editor/components/editor/section-settings/ui/panel-ui"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator"
import { useContentSelector, useUiStore } from "@/editor/lib/store"
import { useId } from "react"

export function IntroductionTextPanel({ dense = false }: { dense?: boolean }) {
  const t = useTranslations("editor.photobookSettings.introduction")
  const { introduction, updatePhotobookSection } = useContentSelector((state) => ({
    introduction: state.photobookSectionContent.introduction,
    updatePhotobookSection: state.updatePhotobookSection,
  }))

  return (
    <div className={ps.pbRoot}>
      {!dense && <PanelLabel>{t("text")}</PanelLabel>}

      <Input
        value={introduction.label || ""}
        onChange={(e) => updatePhotobookSection("introduction", { label: e.target.value })}
        placeholder={t("placeholder.sectionLabel")}
        className={ps.pbInput}
        maxLength={LIMITS.label}
      />

      <div className={ps.pbGrid2}>
        <Input
          value={introduction.title}
          onChange={(e) => updatePhotobookSection("introduction", { title: e.target.value })}
          placeholder={t("placeholder.pageTitle")}
          className={ps.pbInput}
          maxLength={LIMITS.title}
        />
        <Input
          value={introduction.quote || ""}
          onChange={(e) => updatePhotobookSection("introduction", { quote: e.target.value })}
          placeholder={t("placeholder.quote")}
          className={ps.pbInput}
          maxLength={LIMITS.quote}
        />
      </div>

      <Textarea
        value={introduction.dedication || ""}
        onChange={(e) => updatePhotobookSection("introduction", { dedication: e.target.value })}
        placeholder={t("placeholder.dedication")}
        rows={4}
        className={ps.pbTextarea}
        maxLength={LIMITS.dedication}
      />
    </div>
  )
}

export function IntroductionImagePanel({ dense = false }: { dense?: boolean }) {
  const t = useTranslations("editor.photobookSettings.introduction")
  const ownerId = useId()
  const { introImage, setPhotobookSingleImage } = useContentSelector((state) => ({
    introImage: state.photobookImageContent.introduction,
    setPhotobookSingleImage: state.setPhotobookSingleImage,
  }))
  const openMediaPicker = useUiStore((s) => s.openMediaPicker)

  const emptyValue: ImageValue = { asset: { src: '', width: 0, height: 0 } }
  const pickerValue = introImage?.value ?? emptyValue

  return (
    <div className={ps.pbRoot}>
      <MediaPickerModal
        ownerId={ownerId}
        onSelectImage={(url, thumbUrl) => {
          if (introImage) {
            setPhotobookSingleImage('introduction', replacePhotobookManagedImageAsset(introImage, { src: url, blurDataUrl: thumbUrl }))
          } else {
            setPhotobookSingleImage('introduction', createPhotobookSectionImage({ id: 'intro-main', sectionId: 'introduction', src: url, blurDataUrl: thumbUrl }))
          }
        }}
      />

      {!dense && (
        <>
          <Separator className="bg-border/40" />
          <PanelLabel>{t("mainImage")}</PanelLabel>
        </>
      )}

      <ImagePicker
        slotId="photobook.introduction.primary"
        value={pickerValue}
        onChange={(next) => {
          if (!next.asset.src) {
            setPhotobookSingleImage('introduction', undefined)
            return
          }
          if (introImage) {
            setPhotobookSingleImage('introduction', { ...introImage, value: next })
          }
        }}
        onOpenMediaPicker={() => openMediaPicker(ownerId)}
        dense={dense}
        showCaption={false}
      />
    </div>
  )
}
