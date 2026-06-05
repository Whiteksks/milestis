"use client"

import { useTranslations } from "next-intl"
import { createPhotobookRepeatingImage } from "@/editor/image"
import { useContentSelector, useUiStore } from "@/editor/lib/store"
import { MediaPickerModal } from "@/editor/components/editor/layout/Modals/media-picker-modal"
import { PanelLabel, ps, LIMITS } from "@/editor/components/editor/section-settings/ui/panel-ui"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import Image, { type ImageLoader } from "next/image"
import { ImageIcon, X } from "lucide-react"
import { useId } from "react"

const passthroughLoader: ImageLoader = ({ src }) => src

export function GalleryHeaderPanel({ dense = false }: { dense?: boolean }) {
  const t = useTranslations("editor.photobookSettings.gallery")
  const { gallery, updatePhotobookSection } = useContentSelector((state) => ({
    gallery: state.photobookSectionContent.gallery,
    updatePhotobookSection: state.updatePhotobookSection,
  }))

  return (
    <div className={ps.pbRoot}>
      {!dense && <PanelLabel>{t("header")}</PanelLabel>}
      <Input
        value={gallery.label || ""}
        onChange={(e) => updatePhotobookSection("gallery", { label: e.target.value })}
        placeholder={t("placeholder.sectionLabel")}
        className={ps.pbInput}
        maxLength={LIMITS.label}
      />
      <div className={ps.pbGrid2}>
        <Input
          value={gallery.title || ""}
          onChange={(e) => updatePhotobookSection("gallery", { title: e.target.value })}
          placeholder={t("placeholder.title")}
          className={ps.pbInput}
          maxLength={LIMITS.title}
        />
        <Input
          value={gallery.description || ""}
          onChange={(e) => updatePhotobookSection("gallery", { description: e.target.value })}
          placeholder={t("placeholder.description")}
          className={ps.pbInput}
          maxLength={LIMITS.description}
        />
      </div>
    </div>
  )
}

export function GalleryImagesPanel({ dense = false }: { dense?: boolean }) {
  const t = useTranslations("editor.photobookSettings.gallery")
  const ownerId = useId()
  const {
    gallery,
    photobookGalleryImages,
    updatePhotobookSection,
    appendPhotobookRepeatingImage,
    removePhotobookRepeatingImage,
  } = useContentSelector((state) => ({
    gallery: state.photobookSectionContent.gallery,
    photobookGalleryImages: state.photobookImageContent.gallery,
    updatePhotobookSection: state.updatePhotobookSection,
    appendPhotobookRepeatingImage: state.appendPhotobookRepeatingImage,
    removePhotobookRepeatingImage: state.removePhotobookRepeatingImage,
  }))
  const openMediaPicker = useUiStore((s) => s.openMediaPicker)

  const removeImage = (indexToRemove: number) => {
    const current = gallery.photos || []
    const imageId = current[indexToRemove]?.id
    const next = current.filter((_, i) => i !== indexToRemove)
    updatePhotobookSection("gallery", { photos: next })
    if (imageId) {
      removePhotobookRepeatingImage('gallery', imageId)
    }
  }

  const handleSelectImages = async (urls: string[]) => {
    const current = gallery.photos || []
    const remaining = LIMITS.galleryImages - current.length
    if (remaining <= 0) return

    const timestamp = Date.now()
    const selectedUrls = urls.slice(0, remaining)
    const nextNew = selectedUrls.map((_, index) => ({
      id: `gallery-${timestamp}-${index}`,
      caption: "",
    }))

    updatePhotobookSection("gallery", { photos: [...current, ...nextNew] })
    const managedImages = await Promise.all(
      nextNew.map((item, index) =>
        createPhotobookRepeatingImage({
          id: item.id,
          sectionId: 'gallery',
          src: selectedUrls[index],
          caption: item.caption,
        }),
      ),
    )
    managedImages.forEach((image) => appendPhotobookRepeatingImage('gallery', image))
  }

  return (
    <div className={ps.pbRoot}>
      <MediaPickerModal ownerId={ownerId} onSelectImages={handleSelectImages} />

      {!dense && (
        <>
          <Separator className="bg-border/40" />
          <div className="flex items-center justify-between gap-3">
            <PanelLabel>{t("photos")} <span className="text-muted-foreground/40 font-normal">({(gallery.photos || []).length}/{LIMITS.galleryImages})</span></PanelLabel>
            <Button variant="outline" onClick={() => openMediaPicker(ownerId)} className="h-8 text-xs" disabled={(gallery.photos || []).length >= LIMITS.galleryImages}>
              <ImageIcon className="w-3.5 h-3.5 mr-2" /> {t("add")}
            </Button>
          </div>
        </>
      )}

      {dense && (
        <Button variant="outline" onClick={() => openMediaPicker(ownerId)} className="h-8 text-xs">
          <ImageIcon className="w-3.5 h-3.5 mr-2" /> {t("addPhotos")}
        </Button>
      )}

      <div className="grid grid-cols-3 gap-2 rounded-xl border border-dashed border-border/60 bg-muted/20 p-2 min-h-21">
        {(gallery.photos || []).map((block, index) => (
          (() => {
            const managedImage = photobookGalleryImages.find((image) => image.id === block.id)

            return (
              <div
                key={block.id}
                className="relative group aspect-square overflow-hidden rounded-lg border border-border/40 bg-background"
              >
                {managedImage?.value.asset.src ? (
                  <Image
                    loader={passthroughLoader}
                    unoptimized
                    src={managedImage.value.asset.src}
                    alt={t("galleryImageAlt", { index: index + 1 })}
                    fill
                    sizes="(max-width: 768px) 33vw, 120px"
                    className="object-cover"
                  />
                ) : null}
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-1.5 top-1.5 h-6 w-6 rounded-md bg-background/90 text-muted-foreground border border-border/60 hover:bg-muted hover:text-foreground md:opacity-0 md:group-hover:opacity-100"
                  onClick={() => removeImage(index)}
                  aria-label={t("removeImage")}
                >
                  <X className="w-3 h-3" />
                </Button>
              </div>
            )
          })()
        ))}

        <Button
          variant="ghost"
          className="aspect-square w-full h-auto rounded-lg border border-dashed border-border/60 bg-background flex flex-col items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted/40"
          onClick={() => openMediaPicker(ownerId)}
        >
          <ImageIcon className="w-5 h-5 mb-1 opacity-60" />
          <span className="text-[10px] font-medium">{t("add")}</span>
        </Button>
      </div>
    </div>
  )
}
